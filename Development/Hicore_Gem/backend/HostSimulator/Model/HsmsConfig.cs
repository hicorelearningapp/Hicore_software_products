using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HostSimulator.Model
{
    public class HsmsConfig
    {
        public string IpAddress { get; set; }
        public int Port { get; set; }

        public int T3Timeout { get; set; }
        public int T5Timeout { get; set; }
        public int T6Timeout { get; set; }
        public int T7Timeout { get; set; }
    }
}
