using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;

namespace GemManager
{
    public class S3F3Parser : IGemCommandParser
    {
        public string CommandName => "S3F3";

        public Dictionary<string, object> Parse(SecsMessage msg)
        {
            var result = new Dictionary<string, object>();

            var moves = new List<Dictionary<string, object>>();

            // Expect top-level <L>
            var list = msg.Body as ListItem;
            if (list == null)
                throw new InvalidOperationException("S3F3 data is not a list");

            
           //  foreach (SecsItem item in list.

            for(int i = 0; i < list.Count; i++) 
            {
                var item = list[i];
                var moveList = item as ListItem;
                if (moveList == null || moveList.ItemCount < 3)
                    continue;

                string materialId = ((AsciiItem)moveList[0]).GetValue();
                string fromLocation = ((AsciiItem)moveList[1]).GetValue();
                string toLocation = ((AsciiItem)moveList[2]).GetValue();

                moves.Add(new Dictionary<string, object>
            {
                { "MATERIAL_ID", materialId },
                { "FROM_LOCATION", fromLocation },
                { "TO_LOCATION", toLocation }
            });
            }

            result["MOVES"] = moves;
            return result;
        }
    }
}
