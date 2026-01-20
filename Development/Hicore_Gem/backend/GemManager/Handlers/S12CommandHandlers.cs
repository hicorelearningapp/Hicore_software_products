using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Handlers
{
    public class S12F1Handler : GemCommandHandler
    {
        public override string CommandName => "S12F1";

        public S12F1Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            string mid = (string)req.Parameters["MID"];
            string mapid = (string)req.Parameters["MAPID"];
            ushort rows = (ushort)req.Parameters["ROWS"];
            ushort cols = (ushort)req.Parameters["COLS"];
            byte[] data = (byte[])req.Parameters["MAPDATA"];

            byte ack = 0;

            // Minimal validation
            if (rows == 0 || cols == 0 || data.Length == 0)
                ack = 1;

            // Optional: store map
            // Runtime.WaferMaps.Store(mid, mapid, rows, cols, data);

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC12", ack }
                })
            );
        }
    }
}
