using HSMSLib;
using HSMSLib.SecsItems;
using System.Collections.Generic;

namespace GemManager
{
    public class S10F1Parser : IGemCommandParser
    {
        public string CommandName => "S10F1";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>();

            var root = message.Body as ListItem;
            if (root == null || root.Count < 1)
                return result;

            var msgItem = root[0] as AsciiItem;
            if (msgItem == null)
                return result;

            result["MESSAGE"] = msgItem.GetValue();

            return result;
        }
    }

}
