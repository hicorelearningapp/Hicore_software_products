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
    /// <summary>
    /// 
    /// </summary>
    public class S2F29Parser : IGemCommandParser
    {
        public string CommandName => "S2F29";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["EC_VERIFY_LIST"] = new List<Tuple<ushort, object>>()
            };

            var root = message.Body as ListItem;
            if (root == null)
                return result;

            for (int i = 0; i < root.Count; i++)
            {
                var pair = root[i] as ListItem;
                if (pair == null || pair.Count < 2)
                    continue;

                var ecidItem = pair[0] as U2Item;
                if (ecidItem == null)
                    continue;

                ushort ecid = ecidItem.GetValue();
                object value = pair[1].GetContents();

                ((List<Tuple<ushort, object>>)result["EC_VERIFY_LIST"])
                    .Add(Tuple.Create(ecid, value));
            }

            return result;
        }
    }
}
