using System;
using System.Net.Sockets;
using System.Threading;

namespace HSMSLib
{
    public class ActiveHsmsEntity : HsmsEntity
    {
        private readonly string _host;
        private readonly int _port;

        public ActiveHsmsEntity(string host, int port)
        {
            _host = host;
            _port = port;
        }

        protected override void InitializeCommunications() { }

        protected override TcpClient StartCommunications()
        {
            return new TcpClient(_host, _port);
        }

        protected override void ResetCommunications()
        {
            var ev = new AutoResetEvent(false);
            TimerManager.T5.ResetEvent = ev;
            TimerManager.T5.Start();
            ev.WaitOne();
        }

        protected override void CleanupCommunications() { }
    }

}
