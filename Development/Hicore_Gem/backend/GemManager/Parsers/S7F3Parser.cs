using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;

namespace GemManager
{
    public class S7F3Parser : IGemCommandParser
    {
        public string CommandName => "S7F3";

        public Dictionary<string, object> Parse(SecsMessage msg)
        {
            var result = new Dictionary<string, object>();

            var root = msg.Body as ListItem;
            if (root == null || root.Count < 2)
                throw new Exception("S7F5 body must be <L [2]>");

            // ---- PPID ----
            var ppidItem = root[0] as AsciiItem;
            if (ppidItem == null)
                throw new Exception("S7F5 PPID must be ASCII");

            result["PPID"] = ppidItem.GetValue();

            // ---- Recipe Body ----
            var bodyItem = root[1];

            var ascii = bodyItem as AsciiItem;
            if (ascii != null)
            {
                result["PPBODY"] = ascii.GetValue(); // string
                return result;
            }

            var binary = bodyItem as BinaryItem;
            if (binary != null)
            {
                result["PPBODY"] = binary.GetValue(); // byte[]
                return result;
            }

            throw new Exception("Unsupported PPBODY format in S7F5");
        }


    }



}
