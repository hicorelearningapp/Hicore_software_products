using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;

namespace GemManager
{
    public class S7F5Parser : IGemCommandParser
    {
        public string CommandName => "S7F5";

        public Dictionary<string, object> Parse(SecsMessage msg)
        {
            var result = new Dictionary<string, object>();

            var root = msg.Body as ListItem;
            if (root == null || root.Count < 2)
                throw new Exception("S7F5 body must be <L [2]>");

            // ---- PPID ----
            var ppidItem = root[0] as AsciiItem;
            if (ppidItem == null)
                throw new Exception("S7F5 PPID must be ASCII");

            result["PPID"] = ppidItem.GetValue();

            return result;

       }
    }
}
