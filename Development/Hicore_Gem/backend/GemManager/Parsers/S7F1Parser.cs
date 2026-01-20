using HSMSLib;
using HSMSLib.SecsItems;
using System.Collections.Generic;

namespace GemManager
{
    public class S7F1Parser : IGemCommandParser
    {
        public string CommandName => "S7F1";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>();

            var root = message.Body as ListItem;
            if (root == null)
                return result;

            // PPID
            if (root.Count > 0 && root[0] is AsciiItem ppidItem)
            {
                result["PPID"] = ppidItem.GetValue();
            }

            // Process Program Body (Binary / ASCII / any)
            if (root.Count > 1)
            {
                result["PP_BODY"] = root[1].GetContents();
            }

            return result;
        }
    }
}
