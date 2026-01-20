using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Parsers
{
    public class S3F5Parser : IGemCommandParser
    {
        public string CommandName => "S3F5";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["ALED"] = (byte)0
            };

            var root = message.Body as ListItem;
            if (root == null || root.Count < 1)
                return result;

            var aledItem = root[0] as U1Item;
            if (aledItem == null)
                return result;

            result["ALED"] = aledItem.GetValue();
            return result;
        }
    }
}
