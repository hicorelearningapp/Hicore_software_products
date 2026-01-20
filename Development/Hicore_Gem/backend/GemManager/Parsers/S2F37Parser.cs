using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Parsers
{
    public class S2F37Parser : IGemCommandParser
    {
        public string CommandName => "S2F37";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["CEED"] = (byte)0,
                ["CEIDS"] = new List<uint>()
            };

            var root = message.Body as ListItem;
            if (root == null)
                return result;   // safe default

            if (root.ItemCount < 2)
                return result;

            result["CEED"] = SecsValueParser.ParseU1(root[0]);
            result["CEIDS"] = SecsValueParser.ParseU4List(root[1]);

            return result;
        }
    }

}
