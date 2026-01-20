using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Handlers
{

    public class S3F1Handler : GemCommandHandler
    {
        public override string CommandName => "S3F1";

        public S3F1Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            // Host should not send S3F1, but we ACK anyway
            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC3", (byte)0 }
                })
            );
        }
    }

    public class S3F3Handler : GemCommandHandler
    {
        public override string CommandName => "S3F3";

        public S3F3Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {

             /// Parsing
            var moves = (List<Dictionary<string, object>>)req.Parameters["MOVES"];

            byte ack = 0;

            foreach (var move in moves)
            {
                string materialId = move["MATERIAL_ID"].ToString();
                string toLocation = move["TO_LOCATION"].ToString();

                ack = Runtime.MaterialService.MoveMaterial(materialId, toLocation);

                if (ack != 0)
                    break;
            }

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACK", ack }
                })
            );
        }
    }

    public class S3F5Handler : GemCommandHandler
    {
        public override string CommandName => "S3F5";

        public S3F5Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            byte aled = (byte)req.Parameters["ALED"];
            byte ack;

            if (aled == 1)
                ack = Runtime.DataCollectionState.IsEnabled ? (byte)0 : (byte)1;
            else
                ack = !Runtime.DataCollectionState.IsEnabled ? (byte)0 : (byte)1;

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC3", ack }
                }) 
            );
        }
    }
}
