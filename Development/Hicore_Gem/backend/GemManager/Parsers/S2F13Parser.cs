using HSMSLib;
using HSMSLib.SecsItems;
using System.Collections.Generic;

namespace GemManager
{
    public class S2F13Parser : IGemCommandParser
    {
        public string CommandName => "S2F13";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["ECIDS"] = new List<ushort>()
            };

            // Body must be a LIST (empty list is valid)
            var root = message.Body as ListItem;
            if (root == null)
                return result;

            for (int i = 0; i < root.Count; i++)
            {
                // ECID may be U2 or U4
                if (root[i] is U2Item u2)
                {
                    ((List<ushort>)result["ECID_LIST"])
                        .Add(u2.GetValue());
                }
                else if (root[i] is U4Item u4)
                {
                    ((List<ushort>)result["ECID_LIST"])
                        .Add((ushort)u4.GetValue());
                }
            }

            return result;
        }
    }


}
