using HSMSLib;
using HSMSLib.SecsItems;
using System.Collections.Generic;

namespace GemManager
{
    public class S7F17Parser : IGemCommandParser
    {
        public string CommandName => "S7F17";

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

            return result;
        }
    }



}
