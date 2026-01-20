using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Parsers
{
    public class S2F33Parser : IGemCommandParser
    {
        public string CommandName => "S2F33";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                // List of (RPTID, List<VID>)
                ["REPORTS"] = new List<Tuple<uint, List<uint>>>()
            };

            var root = message.Body as ListItem;
            if (root == null)
                return result;

            for (int i = 0; i < root.Count; i++)
            {
                // Each report definition: <L <U4 RPTID> <L <U4 VID>...> >
                var rptItem = root[i] as ListItem;
                if (rptItem == null || rptItem.Count < 2)
                    continue;

                var rptIdItem = rptItem[0] as U4Item;
                if (rptIdItem == null)
                    continue;

                uint rptid = rptIdItem.GetValue();

                var vidListItem = rptItem[1] as ListItem;
                if (vidListItem == null)
                    continue;

                var vids = new List<uint>();

                for (int j = 0; j < vidListItem.Count; j++)
                {
                    var vidItem = vidListItem[j] as U4Item;
                    if (vidItem == null)
                        continue;

                    vids.Add(vidItem.GetValue());
                }

                ((List<Tuple<uint, List<uint>>>)result["REPORTS"])
                    .Add(Tuple.Create(rptid, vids));
            }

            return result;
        }
    }
}
