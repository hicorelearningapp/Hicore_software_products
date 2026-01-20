using HSMSLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager
{
    public static class ReplyBuilder
    {
        /// <summary>
        /// Builds a proper SECS-II SxF(y+1) secondary reply
        /// for the given primary message and handler result.
        /// </summary>
        public static SecsMessage Build(SecsMessage primary, GemCommandResult result)
        {
            // Create reply: SxF(y+1)
            SecsMessage reply = primary.MakeReply();

            // -------------------------
            // Error Case
            // -------------------------
            if (!result.Success)
            {
                // Build body:
                // Error → ASCII("ERROR MESSAGE")
                reply.Body = SecsItem.A(result.ErrorMessage ?? "ERROR");
                return reply;
            }

            // -------------------------
            // Success Case
            // -------------------------
            // Convert Data dictionary → SECS LIST
            // example:
            // result.Data["DeviceId"] → U2
            // result.Data["Status"] → ASCII
            // result.Data["VID_VALUES"] → LIST
            // -------------------------

            var items = new List<SecsItem>();

            foreach (var kv in result.Data)
            {
                SecsItem item = SecsItem.Build(kv.Value);
                items.Add(item);
            }

            reply.Body = SecsItem.L(items.ToArray());
            return reply;
        }
    }

}
