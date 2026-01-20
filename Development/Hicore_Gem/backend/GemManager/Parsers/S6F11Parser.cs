using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Parsers
{
    public class S6F11Parser : IGemCommandParser
    {
        public string CommandName => "S6F11";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["CEID"] = (uint)0,
                // List of (RPTID, List<object> values)
                ["REPORTS"] = new List<Tuple<uint, List<object>>>()
            };

            var root = message.Body as ListItem;
            if (root == null || root.Count < 2)
                return result;

            // CEID
            var ceidItem = root[0] as U4Item;
            if (ceidItem != null)
                result["CEID"] = ceidItem.GetValue();

            // Report list
            var rptList = root[1] as ListItem;
            if (rptList == null)
                return result;

            for (int i = 0; i < rptList.Count; i++)
            {
                var rpt = rptList[i] as ListItem;
                if (rpt == null || rpt.Count < 2)
                    continue;

                var rptIdItem = rpt[0] as U4Item;
                var valListItem = rpt[1] as ListItem;
                if (rptIdItem == null || valListItem == null)
                    continue;

                uint rptid = rptIdItem.GetValue();
                var values = new List<object>();

                for (int j = 0; j < valListItem.Count; j++)
                    values.Add(valListItem[j].GetContents());

                ((List<Tuple<uint, List<object>>>)result["REPORTS"])
                    .Add(Tuple.Create(rptid, values));
            }

            return result;
        }
    }


}
