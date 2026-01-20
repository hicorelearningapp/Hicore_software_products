using HSMSLib;
using HSMSLib.SecsItems;
using System.Collections.Generic;

namespace GemManager.Parsers
{
    public class S5F5Parser : IGemCommandParser
    {
        public string CommandName => "S5F5";

        public Dictionary<string, object> Parse(SecsMessage message)
        {
            var result = new Dictionary<string, object>
            {
                ["ALARM_ID_LIST"] = new List<uint>()
            };

            var root = message.Body as ListItem;
            if (root == null)
                return result;

            for (int i = 0; i < root.Count; i++)
            {
                if (root[i] is U4Item alarmIdItem)
                {
                    ((List<uint>)result["ALARM_ID_LIST"])
                        .Add(alarmIdItem.GetValue());
                }
            }

            return result;
        }
    }



}
