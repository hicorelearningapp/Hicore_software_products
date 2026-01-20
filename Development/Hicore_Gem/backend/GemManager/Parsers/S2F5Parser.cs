using HSMSLib;
using System.Collections.Generic;

namespace GemManager
{
    public class S2F5Parser : IGemCommandParser
    {
        public string CommandName => "S2F5";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            return new Dictionary<string, object>
            {
                ["ECID_LIST"] = SecsValueParser.ParseU2List(message.Body)
            };
        }
    }
}
