using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Parsers
{


    public sealed class S2F41Parser : IGemCommandParser
    {
        public string CommandName => "S2F41";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["RCMD"] = null,
                ["PARAMS"] = new Dictionary<string, object>()
            };

            var root = message.Body as ListItem;
            if (root == null || root.Count < 2)
                return result;

            // RCMD
            var rcmdItem = root[0] as AsciiItem;
            if (rcmdItem != null)
                result["RCMD"] = rcmdItem.GetValue();

            // CP list
            var cpList = root[1] as ListItem;
            if (cpList == null)
                return result;

            var parameters =
                (Dictionary<string, object>)result["PARAMS"];

            for (int i = 0; i < cpList.Count; i++)
            {
                var cp = cpList[i] as ListItem;
                if (cp == null || cp.Count != 2)
                    continue;

                var nameItem = cp[0] as AsciiItem;
                if (nameItem == null)
                    continue;

                string name = nameItem.GetValue();

                object value = cp[1].GetContents();

                parameters[name] = value;
            }

            return result;
        }
    }



}
