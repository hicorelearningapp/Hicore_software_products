using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Parsers
{
    public class S6F1Parser : IGemCommandParser
    {
        public string CommandName => "S6F1";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["TRID"] = (uint)0,
                ["DSPER"] = (uint)0,
                ["TOTSMP"] = (uint)0,
                ["VIDS"] = new List<uint>()
            };

            var root = message.Body as ListItem;
            if (root == null || root.Count < 4)
                return result;

            // TRID
            var tridItem = root[0] as U4Item;
            if (tridItem != null)
                result["TRID"] = tridItem.GetValue();

            // DSPER (sampling period)
            var dsperItem = root[1] as U4Item;
            if (dsperItem != null)
                result["DSPER"] = dsperItem.GetValue();

            // TOTSMP (total samples)
            var totsmpItem = root[2] as U4Item;
            if (totsmpItem != null)
                result["TOTSMP"] = totsmpItem.GetValue();

            // VID list
            var vidListItem = root[3] as ListItem;
            if (vidListItem == null)
                return result;

            var vids = (List<uint>)result["VIDS"];

            for (int i = 0; i < vidListItem.Count; i++)
            {
                var vidItem = vidListItem[i] as U4Item;
                if (vidItem == null)
                    continue;

                vids.Add(vidItem.GetValue());
            }

            return result;
        }
    }

}
