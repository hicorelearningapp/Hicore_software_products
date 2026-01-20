using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Parsers
{
    public class S6F15Parser : IGemCommandParser
    {
        public string CommandName => "S6F15";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["CEID"] = (uint)0,
                ["ACKCODE"] = (byte)0
            };

            var root = message.Body as ListItem;
            if (root == null)
                return result;

            if (root.Count > 0 && root[0] is U4Item ceid)
                result["CEID"] = ceid.GetValue();

            if (root.Count > 1 && root[1] is U1Item ack)
                result["ACKCODE"] = ack.GetValue();

            return result;
        }
    }
}
