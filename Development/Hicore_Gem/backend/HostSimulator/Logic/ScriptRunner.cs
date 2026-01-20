using HSMSLib;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HostSimulator.Logic
{
    public interface IScriptRunner
    {
        Task RunAsync(string smlFilePath);
    }

    public class ScriptCommand
    {
        public int Stream { get; set; }
        public int Function { get; set; }
        public bool WaitForReply { get; set; }
        public string BodyText { get; set; }
    }

    public class ScriptRunner : IScriptRunner
    {
        //private readonly IHsmsClient _hsms;
        //private readonly ISecsTextParser _secsParser;
        //private readonly ILogger _logger;

        //public ScriptRunner(
        //    IHsmsClient hsms,
        //    ISecsTextParser secsParser,
        //    ILogger logger)
        //{
        //    _hsms = hsms;
        //    _secsParser = secsParser;
        //    _logger = logger;
        //}

        public async Task RunAsync(string smlFilePath)
        {
            if (!File.Exists(smlFilePath))
                return;

            var blocks = File.ReadAllText(smlFilePath)
                .Split(new[] { "--------------------------------------------------" },
                       StringSplitOptions.RemoveEmptyEntries);

            foreach (var block in blocks)
            {
                var command = ParseBlock(block);
                if (command == null)
                    continue;

           //     await ExecuteAsync(command);

                // Small delay between commands (safe default)
                await Task.Delay(200);
            }

           //  _logger.Info("SML SCRIPT COMPLETED");
        }

        //private async Task ExecuteAsync(ScriptCommand cmd)
        //{
        //    //var body = _secsParser.Parse(cmd.BodyText);

        //    //var msg = new SecsMessage
        //    //{
        //    //    Stream = cmd.Stream,
        //    //    Function = cmd.Function,
        //    //    WBit = cmd.WaitForReply,
        //    //    Body = body
        //    //};

        //    //_logger.Info($"SEND S{cmd.Stream}F{cmd.Function}");

        //    //if (cmd.WaitForReply)
        //    //{
        //    //    var reply = await _hsms.SendAndWaitAsync(msg);
        //    //    _logger.Info($"RECV S{reply.Stream}F{reply.Function}");
        //    //}
        //    //else
        //    //{
        //    //    _hsms.Send(msg);
        //    //}
        //}

        private ScriptCommand ParseBlock(string block)
        {
            var lines = block
                .Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(l => l.Trim())
                .ToList();

            if (lines.Count == 0 || !lines[0].StartsWith("S"))
                return null;

            // Header: S2F23 W
            var headerParts = lines[0].Split(' ', (char)StringSplitOptions.RemoveEmptyEntries);
            var sf = headerParts[0];        // S2F23
            var wait = headerParts.Length > 1;

            var sIndex = sf.IndexOf('S') + 1;
            var fIndex = sf.IndexOf('F');

            if (fIndex < 0)
                return null;

            var stream = int.Parse(sf.Substring(sIndex, fIndex - sIndex));
            var function = int.Parse(sf.Substring(fIndex + 1));

            var bodyText = string.Join(Environment.NewLine, lines.Skip(1));

            return new ScriptCommand
            {
                Stream = stream,
                Function = function,
                WaitForReply = wait,
                BodyText = bodyText
            };
        }
    }

}
