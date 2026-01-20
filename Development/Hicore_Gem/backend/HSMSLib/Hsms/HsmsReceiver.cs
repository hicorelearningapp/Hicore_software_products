using HSMSLib.HsmsParser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace HSMSLib
{
    public class HsmsConnection
    {
        private ClientHandler _handler;

        public ClientHandler Handler => _handler;

        public void Attach(TcpClient client)
        {
            _handler = new ClientHandler(client);
        }

        public void Shutdown()
        {
            try { _handler?.Shutdown(); } catch { }
            _handler = null;
        }
    }

    internal sealed class HsmsReceiver : IDisposable
    {
        private readonly Func<ClientHandler> _handlerAccessor;
        private readonly Action<HsmsMessage> _onMessage;
        private readonly Action _onConnectionBroken;
        private readonly CancellationToken _token;

        private Thread _thread;

        public HsmsReceiver(
            Func<ClientHandler> handlerAccessor,
            Action<HsmsMessage> onMessage,
            Action onConnectionBroken,
            CancellationToken token)
        {
            _handlerAccessor = handlerAccessor;
            _onMessage = onMessage;
            _onConnectionBroken = onConnectionBroken;
            _token = token;
        }

        public void Start()
        {
            if (_thread != null && _thread.IsAlive)
                return;

            _thread = new Thread(ReceiverLoop)
            {
                IsBackground = true,
                Name = "HsmsMessageReceiver"
            };
            _thread.Start();
        }

        private void ReceiverLoop()
        {
            try
            {
                while (!_token.IsCancellationRequested)
                {
                    var handler = _handlerAccessor();
                    if (handler == null)
                        break;

                    byte[] raw = handler.GetMessage();

                    var messages = StringParser.Parse(raw);
                    if (messages == null || messages.Length == 0)
                        continue;

                    foreach (var msg in messages)
                    {
                        _onMessage(msg);
                    }
                }
            }
            catch(ParsingFailedException)
            {

            }
            catch
            {
                // connection broken or shutdown
            }
            finally
            {
                // IMPORTANT: signal HSMS entity
                _onConnectionBroken();
            }
        }

        public void Dispose()
        {
            try
            {
                if (_thread != null && _thread.IsAlive)
                    _thread.Join(1000);
            }
            catch { }
        }
    }

}
