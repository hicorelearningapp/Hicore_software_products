using HSMSLib;
using HSMSLib.SecsItems;
using System.Collections.Generic;

namespace GemManager.Parsers
{
    public class S5F3Parser : IGemCommandParser
    {
        public string CommandName => "S5F3";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["ALCD"] = (byte)0,
                ["ALID_LIST"] = new List<ushort>()
            };

            var root = message.Body as ListItem;
            if (root == null || root.Count < 1)
                return result;

            // Alarm Control Code (ALCD)
            if (root[0] is BinaryItem alcdItem)
            {
                var bytes = alcdItem.GetValue();
              //   if (bytes != null && bytes.Length > 0)
                    result["ALCD"] = bytes;
            }

            // Alarm ID List (optional)
            if (root.Count > 1)
            {
                var alidList = root[1] as ListItem;
                if (alidList != null)
                {
                    for (int i = 0; i < alidList.Count; i++)
                    {
                        if (alidList[i] is U2Item alid)
                        {
                            ((List<ushort>)result["ALID_LIST"])
                                .Add(alid.GetValue());
                        }
                    }
                }
            }

            return result;
        }
    }
}
