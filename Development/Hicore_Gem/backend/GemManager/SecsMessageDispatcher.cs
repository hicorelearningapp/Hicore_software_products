using GemManager.Interface;
using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace GemManager
{
    public interface ISecsMessageDispatcher
    {
        /// <summary>
        /// Handles any incoming SECS-II message from HSMS.
        /// Responsible for:
        ///  - Parsing raw SECS message
        ///  - Creating GemCommandRequest
        ///  - Calling the correct handler (via GemCommandDispatcher)
        ///  - Building SxF(y+1) reply
        ///  - Sending reply via HSMS
        /// </summary>
        Task<SecsMessage> HandleAsync(SecsMessage message);
    }

    public static class SecsValueBuilder
    {
        public static SecsItem Build(object value)
        {
            if (value == null)
                return new AsciiItem(string.Empty);

            switch (value)
            {
                case string s:
                    return new AsciiItem(s);

                case int i:
                    return new U4Item((uint)i);

                case uint ui:
                    return new U4Item(ui);

                case short si:
                    return new U2Item((ushort)si);

                case ushort usi:
                    return new U2Item(usi);

                case byte b:
                    return new U1Item(b);

                case IEnumerable<object> list:
                    var listItem = new ListItem();
                    foreach (var v in list)
                        listItem.AddItem(Build(v));
                    return listItem;

                default:
                    return new AsciiItem(value.ToString());
            }
        }
    }

    public static class ReplyBuilder
    {
        public static SecsMessage Build(SecsMessage primary, GemCommandResult result)
        {
            // Build SxF(y+1)
            SecsMessage reply = primary.MakeReply();

            // -------------------------
            // Error case -> ASCII Item
            // -------------------------
            if (!result.Success)
            {
                reply.Body = new AsciiItem(result.ErrorMessage ?? "ERROR");
                return reply;
            }

            // -------------------------
            // Success -> LIST of SecsItems
            // -------------------------
            var list = new ListItem();

            foreach (var kv in result.Data)
            {
                SecsItem item = SecsValueBuilder.Build(kv.Value);
                list.AddItem(item);
            }

            reply.Body = list;
            return reply;
        }
    }

     public class SecsMessageDispatcher : ISecsMessageDispatcher
    {
        private readonly IGemFacade _runtime;
        private readonly ILogger _logger;

        // These are NOT new design – they are REQUIRED 
        // because your existing code already uses them.
        private readonly GemCommandDispatcher _commandDispatcher;
        private readonly GemCommandParserFactory _commandParseDispatcher;

        public SecsMessageDispatcher(
            IGemFacade runtime,
            ILogger logger,
            GemCommandDispatcher commandDispatcher,
            GemCommandParserFactory parseGemCommandParser)
        {
            _runtime = runtime;
            _logger = logger;
            _commandDispatcher = commandDispatcher;  // required
            _commandParseDispatcher = parseGemCommandParser;
          //   runtime.SecsMessageReceived += OnSecsMessageReceived;
        }

        private async void OnSecsMessageReceived(SecsMessage msg)
        {
            await HandleAsync(msg);
        }        

        private void SendS9F7(SecsMessage secsMsg)
        {
            if (secsMsg == null)
                return;

            // S9Fx body = original message header bytes
            var mhead = new BinaryItem(secsMsg.Header.GetBytes());

            _runtime.SendMessage(9,7,true,mhead);
        }

        public  async Task<SecsMessage> HandleAsync(SecsMessage msg)
        {
            SecsMessage reply = null;

            try
            {

                if (msg.Header.IsControlMessage)
                {
                    _logger.Debug($"[CTRL] {msg}");
                    return reply;
                }

                _logger.Info($"[SECS RX] {msg}");


                string cmdName = $"S{msg.Stream}F{msg.Function}";

                // -------------------------------------------------
                // Parse parameters (if parser exists)
                // -------------------------------------------------
                var param= new Dictionary<string, object>();

                var parser = _commandParseDispatcher.Get(cmdName);
                if (parser != null)
                {
                    try
                    {
                        param = parser.Parse(msg)
                                     ?? new Dictionary<string, object>();
                    }
                    catch (Exception ex)
                    {
                        SendS9F7(msg);
                        _logger.Error($"[PARSE ERROR] {cmdName}", ex);
                        return reply;
                        // Continue with empty parameters (fab-safe)
                    }
                }

                var request = new GemCommandRequest(
                    commandName: cmdName,
                    stream: msg.Stream,
                    function: msg.Function,
                    transactionId: msg.TID,
                    hostId: "HOST",
                    parameters: param,
                    rawMessage: msg
                );

                GemCommandResult result =
                    await _commandDispatcher.ProcessAsync(request);

                if (!msg.HasReply)
                {
                    _logger.Debug($"[NO REPLY REQUIRED] W=0 for {msg}");
                    return reply;
                }

                
                reply = BuildReply(msg, result);
                msg.SentAt = DateTimeOffset.UtcNow;

              ///  _runtime.SendMessage();

              //   _runtime.SecsEndpoint.SendSecsMessage(reply);

                _logger.Info($"[SECS TX] {reply}");
            }
            catch (Exception ex)
            {
                _logger.Error($"[DISPATCH ERROR] {msg}", ex);
            }

            return reply;
        }

        private SecsMessage BuildReply(SecsMessage primary, GemCommandResult result)
        {
            var reply = primary.MakeReply();

            if (!result.Success)
            {
                reply.Body = new AsciiItem(result.ErrorMessage ?? "ERROR");
                return reply;
            }

            var list = new ListItem();

            foreach (var kv in result.Data)
            {
                SecsItem item = SecsValueBuilder.Build(kv.Value);
                list.AddItem(item);
            }

            reply.Body = list;
            return reply;
        }
    }
}