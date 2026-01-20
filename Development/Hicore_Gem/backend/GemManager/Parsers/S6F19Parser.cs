using HSMSLib;
using HSMSLib.SecsItems;
using System.Collections.Generic;

namespace GemManager.Parsers
{
    public class S6F19Parser : IGemCommandParser
    {
        public string CommandName => "S6F19";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>();

            // Case 1: Body is directly U4
            if (message.Body is U4Item rptIdItem)
            {
                result["RPTID"] = rptIdItem.GetValue();
                return result;
            }

            // Case 2: Body is LIST containing U4
            var root = message.Body as ListItem;
            if (root == null || root.Count < 1)
                return result;

            if (root[0] is U4Item listRptId)
                result["RPTID"] = listRptId.GetValue();

            return result;
        }
    }



}
