using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Parsers
{
    public class S4F1Parser : IGemCommandParser
    {
        public string CommandName => "S4F1";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["MST"] = (byte)0,
                ["MID"] = string.Empty,
                ["SRC"] = string.Empty,
                ["DEST"] = string.Empty
            };

            var root = message.Body as ListItem;
            if (root == null)
                return result;

            if (root.Count > 0 && root[0] is U1Item mst)
                result["MST"] = mst.GetValue();

            if (root.Count > 1 && root[1] is AsciiItem mid)
                result["MID"] = mid.GetValue();

            if (root.Count > 2 && root[2] is AsciiItem src)
                result["SRC"] = src.GetValue();

            if (root.Count > 3 && root[3] is AsciiItem dest)
                result["DEST"] = dest.GetValue();

            return result;
        }
    }
}
