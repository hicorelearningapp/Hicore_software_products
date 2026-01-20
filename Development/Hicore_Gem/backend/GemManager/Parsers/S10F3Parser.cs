using HSMSLib;
using HSMSLib.SecsItems;
using System.Collections.Generic;

namespace GemManager
{
    public class S10F3Parser : IGemCommandParser
    {
        public string CommandName => "S10F3";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>();

            var root = message.Body as ListItem;
            if (root == null)
                return result;

            int index = 0;

            // Optional display / terminal ID
            if (root.Count > index && root[index] is U2Item terminalIdItem)
            {
                result["TERMINAL_ID"] = terminalIdItem.GetValue();
                index++;
            }

            // Terminal message
            if (root.Count > index && root[index] is AsciiItem msgItem)
            {
                result["MESSAGE"] = msgItem.GetValue();
            }

            return result;
        }
    }

}
