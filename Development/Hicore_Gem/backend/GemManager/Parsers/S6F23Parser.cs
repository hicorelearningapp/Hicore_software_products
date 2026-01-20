using HSMSLib;
using HSMSLib.SecsItems;
using System.Collections.Generic;

namespace GemManager.Parsers
{
    public class S6F23Parser : IGemCommandParser
    {
        public string CommandName => "S6F23";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["RSDC"] = (uint)0
            };

            if (message.Body == null)
                return result;

            // RSDC may be U1, U2, or U4 depending on host
            if (message.Body is U1Item u1)
            {
                result["RSDC"] = u1.GetValue();
            }
            else if (message.Body is U2Item u2)
            {
                result["RSDC"] = u2.GetValue();
            }
            else if (message.Body is U4Item u4)
            {
                result["RSDC"] = u4.GetValue();
            }

            return result;
        }
    }



}
