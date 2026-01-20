using HSMSLib;
using HSMSLib.SecsItems;
using System.Collections.Generic;

namespace GemManager
{
    public class S2F23Parser : IGemCommandParser
    {
        public string CommandName => "S2F23";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["TRID"] = (ushort)0,
                ["DSPER"] = string.Empty,
                ["SAMP_COUNT"] = (ushort)0,
                ["SAMP_PERIOD"] = (ushort)0,
                ["SVID_LIST"] = new List<ushort>()
            };

            var root = message.Body as ListItem;
            if (root == null || root.Count < 5)
                return result;

            // TRID
            if (root[0] is U2Item trid)
                result["TRID"] = trid.GetValue();

            // DSPER
            if (root[1] is AsciiItem dsper)
                result["DSPER"] = dsper.GetValue();

            // Sample Count
            if (root[2] is U2Item count)
                result["SAMP_COUNT"] = count.GetValue();

            // Sample Period
            if (root[3] is U2Item period)
                result["SAMP_PERIOD"] = period.GetValue();

            // SVID List
            var svidList = root[4] as ListItem;
            if (svidList != null)
            {
                for (int i = 0; i < svidList.Count; i++)
                {
                    if (svidList[i] is U2Item svid)
                    {
                        ((List<ushort>)result["SVID_LIST"])
                            .Add(svid.GetValue());
                    }
                }
            }

            return result;
        }
    }


}
