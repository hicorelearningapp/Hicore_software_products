using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Handlers
{
    public class S10F1Handler : GemCommandHandler
    {
        public override string CommandName => "S10F1";

        public S10F1Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            // byte tid = (byte)req.Parameters["TID"];
            string txt = req.Parameters["MESSAGE"] as string ?? string.Empty;

            byte ackc10;

            try
            {
                Runtime.TerminalService.ShowMessage(0, txt);
                ackc10 = 0; // accepted
            }
            catch (InvalidOperationException)
            {
                ackc10 = 1; // terminal unavailable
            }
            catch
            {
                ackc10 = 3; // rejected
            }

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC10", ackc10 }
                })
            );
        }
    }


    public class S10F3Handler : GemCommandHandler
    {
        public override string CommandName => "S10F3";

        public S10F3Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            string text = req.Parameters["TEXT"].ToString();

            if (!Runtime.TerminalService.IsAvailable)
            {
                return Task.FromResult(
                    GemCommandResult.Ok(new Dictionary<string, object>
                    {
                { "ACK", (byte)1 } // Terminal not available
                    })
                );
            }

            Runtime.TerminalService.Display(text);

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
            { "ACK", (byte)0 }
                })
            );
        }
    }

   

    
}
