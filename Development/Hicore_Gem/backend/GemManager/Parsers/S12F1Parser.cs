using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Parsers
{
    public class S12F1Parser : IGemCommandParser
    {
        public string CommandName => "S12F1";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["MID"] = string.Empty,
                ["MAPID"] = string.Empty,
                ["ROWS"] = (ushort)0,
                ["COLS"] = (ushort)0,
                ["MAPDATA"] = Array.Empty<byte>()
            };

            var root = message.Body as ListItem;
            if (root == null)
                return result;

            if (root.Count > 0 && root[0] is AsciiItem mid)
                result["MID"] = mid.GetValue();

            if (root.Count > 1 && root[1] is AsciiItem mapid)
                result["MAPID"] = mapid.GetValue();

            if (root.Count > 2 && root[2] is U2Item rows)
                result["ROWS"] = rows.GetValue();

            if (root.Count > 3 && root[3] is U2Item cols)
                result["COLS"] = cols.GetValue();

            if (root.Count > 4 && root[4] is BinaryItem data)
                result["MAPDATA"] = (byte[])data.GetContents();

            return result;
        }
    }

}
