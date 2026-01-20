using HSMSLib;
using HSMSLib.SecsItems;
using System.Collections.Generic;

namespace GemManager.Parsers
{
    public class S6F3Parser : IGemCommandParser
    {
        public string CommandName => "S6F3";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["TRID"] = (uint)0
            };

            var root = message.Body as ListItem;
            if (root == null || root.Count < 1)
                return result;

            var tridItem = root[0] as U4Item;
            if (tridItem != null)
                result["TRID"] = tridItem.GetValue();

            return result;
        }
    }

}
