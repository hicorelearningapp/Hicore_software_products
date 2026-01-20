using HSMSLib;
using System.Collections.Generic;

namespace GemManager
{
    public class S2F3Parser : IGemCommandParser
    {
        public string CommandName => "S2F3";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            return new Dictionary<string, object>
            {
                ["ECIDS"] = SecsValueParser.ParseU2List(message.Body)
            };
        }
    }
}
