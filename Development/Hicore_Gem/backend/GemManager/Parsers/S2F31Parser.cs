using HSMSLib;
using System.Collections.Generic;

namespace GemManager.Parsers
{
    public class S2F31Parser : IGemCommandParser
    {
        public string CommandName => "S2F31";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["DATETIME"] = string.Empty
            };

            // Body must be ASCII (A)
            var timeItem = message.Body as AsciiItem;
            if (timeItem == null)
                return result;

            result["DATETIME"] = timeItem.GetValue();

            return result;
        }
    }

}
