using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Parsers
{
    public class S3F1Parser : IGemCommandParser
    {
        public string CommandName => "S3F1";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["ALCD"] = (byte)0,
                ["ALID"] = (uint)0,
                ["ALTX"] = string.Empty
            };

            var root = message.Body as ListItem;
            if (root == null)
                return result;

            if (root.Count > 0 && root[0] is U1Item alcd)
                result["ALCD"] = alcd.GetValue();

            if (root.Count > 1 && root[1] is U4Item alid)
                result["ALID"] = alid.GetValue();

            if (root.Count > 2 && root[2] is AsciiItem altx)
                result["ALTX"] = altx.GetValue();

            return result;
        }
    }

}
