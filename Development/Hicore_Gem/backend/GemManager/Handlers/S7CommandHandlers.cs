using GemManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager
{
    // =============================================================
    //  S7F1  Recipe Directory Request
    // =============================================================
    public class S7F1Handler : GemCommandHandler
    {
        public override string CommandName => "S7F1";

        public S7F1Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            // S7F1 has NO parameters

            // Ask equipment for recipe directory
            IReadOnlyList<string> recipeIds =
                Runtime.Recipes.GetRecipeList();

            // S7F2 reply: list of PPIDs
            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "PPID_LIST", recipeIds }
                })
            );
        }
    }

    // =============================================================
    //  S7F3  Recipe Download
    // =============================================================
    public class S7F3Handler : GemCommandHandler
    {
        public override string CommandName => "S7F3";

        public S7F3Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            string ppid = (string)req.Parameters["PPID"];
            byte[] body = Encoding.ASCII.GetBytes((string)req.Parameters["PPBODY"]);

            byte ackc7 = 0;

            Runtime.Recipes.DownloadRecipe(ppid, body);

            /*
            if (!Runtime.ControlState.IsRemote)
                ackc7 = 3;           // No permission
            else if (!Runtime.Recipes.DownloadRecipe(ppid, body))
                ackc7 = 4;           // Rejected by equipment
            else
                ackc7 = 0;           // Accepted
            */

            return Task.FromResult(
               GemCommandResult.Ok(new Dictionary<string, object>
               {
                { "ACKC7", ackc7 }
               })
           );


        }
    }

    // =============================================================
    //  S7F5  Recipe Download
    // =============================================================
    public class S7F5Handler : GemCommandHandler
    {
        public override string CommandName => "S7F5";

        public S7F5Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            string ppid = (string)req.Parameters["PPID"];
           //  byte[] body = (byte[])req.Parameters["PPBODY"];

            byte ackc7 = 0;

            byte[] body = null; 

         //   if (!Runtime.ControlState.IsRemote)
         //  {
         // ackc7 = 3; // No permission
         // }
         // else
            {
                body = Runtime.Recipes.UploadRecipe(ppid);
                // ackc7 = body != null ? (byte)0 : (byte)1;
            }

           

            return Task.FromResult(
               GemCommandResult.Ok(new Dictionary<string, object>
               {
                { "ACKC7", ackc7 },
                { "PPBODY", body ?? Array.Empty<byte>() }
               })
           );
        }
    }


    public class S7F17Handler : GemCommandHandler
    {
        public override string CommandName => "S7F17";

        public S7F17Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            string ppid = (string)req.Parameters["PPID"];

            byte ackc7;

            if (!Runtime.Equipment.EquipmentStateComponent.IsRemote)
                ackc7 = 3;
            else
            {
                try
                {
                    Runtime.Recipes.DeleteRecipe(ppid);
                    ackc7 = 0;
                }
                catch
                {
                    ackc7 = 1;
                }
            }

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC7", ackc7 }
                })
            );
        }
    }


    public class S7F19Handler : GemCommandHandler
    {
        public override string CommandName => "S7F19";

        public S7F19Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            // Bulk purge not supported
            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC7", (byte)1 } // Not supported
                })
            );
        }
    }

}


