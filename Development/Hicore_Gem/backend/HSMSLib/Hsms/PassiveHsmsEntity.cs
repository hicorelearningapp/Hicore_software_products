using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib
{
    public class PassiveHsmsEntity : HsmsEntity
    {
        private readonly TcpListener _listener;

        public PassiveHsmsEntity(string host, int port)
        {
            _listener = new TcpListener(IPAddress.Parse(host), port);
        }

        protected override void InitializeCommunications()
        {
            _listener.Start();
        }

        protected override TcpClient StartCommunications()
        {
            return _listener.AcceptTcpClient();
        }

        protected override void ResetCommunications() { }

        protected override void CleanupCommunications()
        {
            _listener.Stop();
        }
    }

}
