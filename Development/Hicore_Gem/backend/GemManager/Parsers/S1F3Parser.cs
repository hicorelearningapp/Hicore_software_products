using HSMSLib;
using System;
using System.Collections.Generic;

namespace GemManager
{
    public class S1F3Parser : IGemCommandParser
    {
        public string CommandName => "S1F3";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            return new Dictionary<string, object>
            {
                ["SVIDS"] = SecsValueParser.ParseU4List(message.Body)
            };
        }
    }
}
