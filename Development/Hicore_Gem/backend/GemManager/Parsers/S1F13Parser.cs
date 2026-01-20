using HSMSLib;
using HSMSLib.SecsItems;
using System.Collections.Generic;

namespace GemManager.Parsers
{
    public class S1F13Parser : IGemCommandParser
    {
        public string CommandName => "S1F13";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>();

            var root = message.Body as ListItem;
            if (root == null)
                return result;

            if (root.Count > 0 && root[0] is AsciiItem hostId)
                result["HOST_ID"] = hostId.GetValue();

            if (root.Count > 1 && root[1] is AsciiItem hostRevision)
                result["HOST_REVISION"] = hostRevision.GetValue();

            return result;
        }
    }


}
