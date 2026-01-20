using GemManager.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager
{
   
    public class S6F1Handler : GemCommandHandler
    {
        private readonly ITraceService _traceService;

        public override string CommandName => "S6F1";

        public S6F1Handler(IGemFacade runtime) : base(runtime)
        {
            _traceService = runtime.TraceService;
        }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            byte ackc6 = 1; // default: error

            try
            {
                // -----------------------------
                // Get parsed values (from parser)
                // -----------------------------
                var parsed = req.Parameters;

                uint trid = (uint)parsed["TRID"];
                uint dsper = (uint)parsed["DSPER"];
                uint totsmp = (uint)parsed["TOTSMP"];
                var vids = (List<uint>)parsed["VIDS"];

                // -----------------------------
                // Basic validation
                // -----------------------------
                if (trid == 0 || dsper == 0 || vids.Count == 0)
                {
                    ackc6 = 1; // invalid format / parameters
                }
                else
                {
                    // -----------------------------
                    // Initialize trace (GEM side)
                    // -----------------------------
                    var definition = new TraceDefinition(
                        trid,
                        dsper,
                        totsmp,
                        vids
                    );

                    ackc6 = _traceService.InitializeTrace(definition);
                }
            }
            catch (Exception ex)
            {
                Runtime.Logger.Error("S6F1Handler failed", ex);
                ackc6 = 2; // internal error
            }

            // -----------------------------
            // Reply S6F2 (ACKC6)
            // -----------------------------
            return Task.FromResult(
                GemCommandResult.Ok(
                    new Dictionary<string, object>
                    {
                    { "ACKC6", ackc6 }
                    }
                )
            );
        }
    }
    public class S6F3Handler : GemCommandHandler
    {
        private readonly ITraceService _traceService;

        public override string CommandName => "S6F3";

        public S6F3Handler(IGemFacade runtime) : base(runtime)
        {
            _traceService = runtime.TraceService;
        }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            byte ackc6 = 1; // default: error

            try
            {
                var parsed = req.Parameters;

                uint trid = (uint)parsed["TRID"];

                if (trid == 0)
                {
                    ackc6 = 1; // invalid TRID
                }
                else
                {
                    ackc6 = _traceService.StartTrace(trid);
                }
            }
            catch (Exception ex)
            {
                Runtime.Logger.Error("S6F3Handler failed", ex);
                ackc6 = 2; // internal error
            }

            // Reply S6F4 (ACKC6)
            return Task.FromResult(
                GemCommandResult.Ok(
                    new Dictionary<string, object>
                    {
                    { "ACKC6", ackc6 }
                    }
                )
            );
        }
    }


    public class S6F5Handler : GemCommandHandler
    {
        private readonly ITraceService _traceService;

        public override string CommandName => "S6F5";

        public S6F5Handler(IGemFacade runtime) : base(runtime)
        {
            _traceService = runtime.TraceService;
        }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            byte ackc6 = 1; // default: error

            try
            {
                var parsed = req.Parameters;

                uint trid = (uint)parsed["TRID"];

                if (trid == 0)
                {
                    ackc6 = 1; // invalid TRID
                }
                else
                {
                    ackc6 = _traceService.StopTrace(trid);
                }
            }
            catch (Exception ex)
            {
                Runtime.Logger.Error("S6F5Handler failed", ex);
                ackc6 = 2; // internal error
            }

            // Reply S6F4 (ACKC6)
            return Task.FromResult(
                GemCommandResult.Ok(
                    new Dictionary<string, object>
                    {
                    { "ACKC6", ackc6 }
                    }
                )
            );
        }
    }



    public sealed class S6F6Handler : GemCommandHandler
    {
        private readonly ITraceService _traceService;

        public override string CommandName => "S6F6";

        public S6F6Handler(IGemFacade runtime) : base(runtime)
        {
            _traceService = runtime.TraceService;
        }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            byte ackc6 = 1; // default: error

            try
            {
                var parsed = req.Parameters;
                uint trid = (uint)parsed["TRID"];

                if (trid == 0)
                {
                    ackc6 = 1; // invalid TRID
                }
                else
                {
                    ackc6 = _traceService.StopTrace(trid);
                }
            }
            catch (Exception ex)
            {
                Runtime.Logger.Error("S6F4Handler failed", ex);
                ackc6 = 2; // internal error
            }

            // Reply S6F5 (ACKC6)
            return Task.FromResult(
                GemCommandResult.Ok(
                    new Dictionary<string, object>
                    {
                    { "ACKC6", ackc6 }
                    }
                )
            );
        }
    }

    public class S6F11Handler : GemCommandHandler
    {
        public override string CommandName => "S6F11";

        public S6F11Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            // Optional debug access
            uint ceid = (uint)req.Parameters["CEID"];

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC6", (byte)0 }
                })
            );
        }
    }


    public class S6F13Handler : GemCommandHandler
    {
        public override string CommandName => "S6F13";

        public S6F13Handler(IGemFacade runtime) : base(runtime) { }

        public override async Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            uint ceid = (uint)req.Parameters["CEID"];
            byte ack;

            // Unknown CEID
            if (!Runtime.EventReportService.IsEventKnown(ceid))
            {
                ack = 1;
            }
            // Event disabled
            else if (!Runtime.EventReportService.IsEventEnabled(ceid))
            {
                ack = 2;
            }
            else

            {
                await Runtime.EventReportService.SendEventAsync(ceid);
                // Accepted → send S6F11 immediately
                // SendS6F11Async(ceid);
                ack = 0;
            }

            return GemCommandResult.Ok(new Dictionary<string, object>
        {
            { "ACKC6", ack }
        });
        }
    }




    public class S6F15Handler : GemCommandHandler
    {
        public override string CommandName => "S6F15";

        public S6F15Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            // Optional: read values for logging
            uint ceid = (uint)req.Parameters["CEID"];
            byte ackCode = (byte)req.Parameters["ACKCODE"];

            // No state change required in most tools

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC6", (byte)0 }   // Accepted
                })
            );
        }
    }


    public class S6F17Handler : GemCommandHandler
    {
        public override string CommandName => "S6F17";

        public S6F17Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            // Optional hooks (safe even if they do nothing)
            // Runtime.EventReports.ResetPending();
            // Runtime.AlarmService.ResetPending();

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC6", (byte)0 }   // Accepted
                })
            );
        }
    }

    public class S6F19Handler : GemCommandHandler
    {
        public override string CommandName => "S6F19";

        public S6F19Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            // Optional: same reset logic as S6F17
            // Runtime.EventReports.ResetPending();
            // Runtime.AlarmService.ResetPending();

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC6", (byte)0 }   // Accepted
                })
            );
        }
    }


    public class S6F23Handler : GemCommandHandler
    {
        public override string CommandName => "S6F23";

        public S6F23Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            var list = new List<object>();

            // Expose events from EventReportService
            foreach (var ev in Runtime.EventReportService .GetAllEvents())
            {
                list.Add(new object[]
                {
                ev.Ceid,
                ev.Name
                });
            }

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "EVENT_LIST", list }
                })
            );
        }
    }

}
