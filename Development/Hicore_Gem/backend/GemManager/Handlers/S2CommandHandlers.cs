using GemManager.Handlers;
using GemManager.Service;
using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager
{
    public class S2F1Handler : GemCommandHandler
    {
        public override string CommandName => "S2F1";

        IEquipmentStateComponent _equipmentStateComponent;

        public S2F1Handler(IGemFacade runtime) : base(runtime) {

            _equipmentStateComponent = runtime.Equipment.EquipmentStateComponent;
        }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            byte ack;


            if (_equipmentStateComponent.GoOnlineLocal())
            {
                ack = 0; // Accepted
            }
            else
            {
                ack = 1; // Denied
            }


            // Always reply OK if equipment is alive
            return Task.FromResult(
                GemCommandResult.Ok(
                    new Dictionary<string, object>
                    {
                    { "ACK", (byte)ack }
                    }
                )
            );
        }
    }


    public class S2F3Handler : GemCommandHandler
    {
        private readonly IEquipmentStateComponent _state;

        public override string CommandName => "S2F3";

        public S2F3Handler(IGemFacade runtime) : base(runtime) {

            _state = runtime.Equipment.EquipmentStateComponent;
        }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            byte ack = 0;
           switch(_state.ProcessState)
            {
                case EquipmentProcessState.Idle:
                    ack = 1;
                    break;
                case EquipmentProcessState.Running:
                    ack = 2;
                    break;
                case EquipmentProcessState.Paused:
                    ack = 3;
                    break;
                case EquipmentProcessState.Aborted:
                    ack = 4;
                    break;
            }

            // Always reply OK if equipment is alive
            return Task.FromResult(
                GemCommandResult.Ok(
                    new Dictionary<string, object>
                    {
                    { "ACK", ack}
                    }
                )
            );
        }
    }

    public class S2F7Handler : GemCommandHandler
    {
        public override string CommandName => "S2F7";

        public S2F7Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            var ecids = req.Parameters["ECID_LIST"] as List<ushort>;
            var reply = new List<object>();


            /// TODO 
            foreach (ushort ecid in ecids)
            {
                var ec = Runtime.Equipment.VariableComponent.GetVariable(ecid);
                //if (ec == null) continue;

                //reply.Add(new object[]
                //{
                //ecid,
                //ec.Name,
                //ec.Type,        // static/dynamic
                //ec.Access,      // R / R-W
                //ec.DataType,    // SECS-II format code
                //ec.Length
                //});
            }

            return Task.FromResult(
                        GemCommandResult.Ok(new Dictionary<string, object>
                        {
                { "EC_LIST", reply }
                        })
                    );
        }
    }

    public class S2F5Handler : GemCommandHandler
    {
        public override string CommandName => "S2F5";

        public S2F5Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            // Get All supported SV ID from Equipment. 


            return Task.FromResult(GemCommandResult.Ok());
        }
    }





    // =============================================================
    //  S2F13  Equipment Constant Request
    // =============================================================
    public class S2F13Handler : GemCommandHandler
    {
        public override string CommandName => "S2F13";

        public S2F13Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            List<GemVariable> gemVariables = new List<GemVariable>();

            if (req.Parameters.Count == 0)
            {
                gemVariables = Runtime.Equipment.VariableComponent.GetAllVariables().Where(v => v.Role == GemVariableRole.EC)
                .OrderBy(v => v.VariableId).ToList();
            }
            else
            {
                var ecids = (List<uint>)req.Parameters["ECID_LIST"];


                foreach (var ecid in ecids)
                {
                    var gemvariable = (GemVariable)Runtime.Equipment.VariableComponent.GetVariable(ecid);
                    gemVariables.Add(gemvariable);
                }
            }

            // Root list for S1F12
            var root = new ListItem();

            foreach (var gv in gemVariables)
            {
                // <L <U4 SVID> <A SV_NAME>>
                root.AddItem(new AsciiItem(gv.GetValue().ToString()));
            }


            // Return S1F12

            return Task.FromResult(GemCommandResult.Ok(new Dictionary<string, object>
                {
                    { "SV", root }
                }));
        }
    }

    // =============================================================
    //  S2F15  New EC Value Send 
    // =============================================================
    public class S2F15Handler : GemCommandHandler
    {
        public override string CommandName => "S2F15";

        public S2F15Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            var writes =
                req.Parameters["EC_WRITE_LIST"] as List<Tuple<ushort, object>>;

            byte ack = 0;

            if (writes == null || writes.Count == 0)
            {
                return Task.FromResult(
                    GemCommandResult.Ok(new Dictionary<string, object>
                    {
                    { "ACKC2", ack }
                    })
                );
            }

            /// return code
            /// 1 = denied for one or more variable
            /// 2 = busy 
            /// 3 = out of range for one or more variable
            /// 0 = accepted

            foreach (var w in writes)
            {
                ushort ecid = w.Item1;
                object value = w.Item2;

                var ec = Runtime.Equipment.VariableComponent.GetVariable(ecid);

                if (ec == null)
                {
                    ack = 1; // unknown ECID
                    break;
                }

                
                // TODO 
                //if (ec.EcAccess == 0)
                //{
                //    ack = 2; // read-only
                //    break;
                //}

                try
                {
                    Runtime.Equipment.VariableComponent.SetDataVariable(ecid, value);
                }
                catch
                {
                    ack = 3; // cannot comply
                    break;
                }
            }

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC2", ack }
                })
            );
        }
    }


    // =============================================================
    //  S2F17  Date/Time Request
    // =============================================================
    public class S2F17Handler : GemCommandHandler
    {
        public override string CommandName => "S2F17";

        public S2F17Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");

            return Task.FromResult(
                GemCommandResult.Ok(
                    new Dictionary<string, object>
                    {
                    { "DATETIME", timestamp }
                    }
                )
            );
        }
    }

  

    public sealed class S2F21Handler : GemCommandHandler
    {
        public S2F21Handler(IGemFacade runtime) : base(runtime) { }

        public override string CommandName => "S2F21";

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            var cmd = (string)req.Parameters["RCMD"];
            var parms = (Dictionary<string, object>)req.Parameters["PARAMS"];

            var result = Runtime.RemoteCommandService.Execute(cmd, parms);

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC5", AckToText(result) }
                })
            );
        }

        private string AckToText(byte ack)
        {
            switch (ack)
            {
                case 0: return "Accepted";
                case 1: return "Command does not exist";
                case 2: return "Cannot perform now";
                case 3: return "Parameter error";
                case 4: return "Rejected by equipment";
                default: return "Unknown";
            }
        }
    }


    public class S2F23Handler : GemCommandHandler
    {
        private readonly ITraceService _traceService;

        public override string CommandName => "S2F23";

        public S2F23Handler(IGemFacade runtime) : base(runtime)
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
                

                uint totsmp = (uint)parsed["SAMP_COUNT"];
                uint sampleperiod = (uint)parsed["SAMP_PERIOD"];
                var vids = (List<uint>)parsed["SVID_LIST"];

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


    // =============================================================
    //  S2F29  Equipment Constant Name List
    // =============================================================
    public class S2F29Handler : GemCommandHandler
    {
        public override string CommandName => "S2F29";

        public S2F29Handler(IGemFacade runtime) : base(runtime) { }

        /// <summary>
        ///  TODO 
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        /// 
    //    <L[6]
    //  <U4 5001>           /* ECID */
    //  <A "T3_Timeout">    /* ECNAME */
    //  <U4 1>              /* ECMIN: Minimum value allowed */
    //  <U4 120>            /* ECMAX: Maximum value allowed */
    //  <U4 45>             /* ECDEF: Default value */
    //  <A "Seconds">       /* UNITS */
    //>


        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            var list =
                req.Parameters["EC_VERIFY_LIST"] as List<Tuple<ushort, object>>;

            byte ack = 0;

            foreach (var item in list)
            {
                ushort ecid = item.Item1;
                object value = item.Item2;

                var ec = Runtime.Equipment.VariableComponent.GetVariable(ecid);
                if (ec == null)
                {
                    ack = 1; // unknown ECID
                    break;
                }

                //TODO

                //if (ec.EcAccess == 0)
                //{
                //    ack = 2; // read-only / invalid
                //    break;
                //}

                //if (!ec.ValidateValue(value)) // you may already have this
                //{
                //    ack = 2; // invalid value
                //    break;
                //}
            }

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC2", ack }
                })
            );
        }
    }

    // =============================================================
    //  S2F31  Set Date / Time
    // =============================================================
    public class S2F31Handler : GemCommandHandler
    {
        public override string CommandName => "S2F31";

        public S2F31Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            // ---------- Validate parameter ----------
            if (!req.Parameters.TryGetValue("DATETIME", out var value) ||
              !(value is string))
            {
                return Ack(2); // Format error
            }

            string timeStr = (string)value;

            // ---------- Parse time ----------
            if (!DateTime.TryParseExact(
                    timeStr,
                    "yyyyMMddHHmmss",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.None,
                    out var parsed))
            {
                return Ack(2); // Format error
            }

            // ---------- Apply time ----------
            try
            {
                Runtime.TimeService.SetHostTime(parsed);
            }
            catch
            {
                return Ack(1); // Not allowed
            }

            return Ack(0); // Accepted
        }

        private static Task<GemCommandResult> Ack(byte ackc2)
        {
            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC2", ackc2 }
                })
            );
        }
    }


    // =============================================================
    //  S2F33  Define Report
    // =============================================================
    public class S2F33Handler : GemCommandHandler
    {
        public override string CommandName => "S2F33";

        public S2F33Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            byte ack = 0;

            var reports =
                req.Parameters["REPORTS"] as List<Tuple<uint, List<uint>>>;

            if (reports == null || reports.Count == 0)
            {
                // Nothing to define → accept (host-friendly)
                Runtime.EventReportService.DeleteAllReports();

                return Task.FromResult(
                    GemCommandResult.Ok(new Dictionary<string, object>
                    {
                    { "ACKC2", ack }
                    })
                );
            }

            foreach (var rpt in reports)
            {
                uint rptid = rpt.Item1;
                List<uint> vids = rpt.Item2;

                // Validate all VIDs exist
                foreach (uint vid in vids)
                {
                    if (!Runtime.Equipment.VariableComponent.Exists(vid))
                    {
                        ack = 1; // Unknown VID
                        break;
                    }
                }

                if (ack != 0)
                    break;

                // Define / overwrite report
                Runtime.EventReportService.DefineReport(rptid, vids);
            }

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC2", AckToText(ack) }
                })
            );
        }

        private string AckToText(byte ack)
        {
            switch (ack)
            {
                case 0: return "Accepted";
                case 1: return "Denied insuffient Space";
                case 2: return "Denied Invalid format";
                case 3: return "Denied Already One report defined";
                case 4: return "Denied one variable id does not exist";
                default: return "Unknown";
            }
        }

    }


    // =============================================================
    //  S2F35  Link CEID to RPTID
    // =============================================================



    public class S2F35Handler : GemCommandHandler
    {
        public override string CommandName => "S2F35";

        public S2F35Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            byte ack = 0;


            if (req.Parameters.Count == 0)
            {
                Runtime.EventReportService.DeleteAllReports();
            }
            else
            {

                uint ceid = (uint)req.Parameters["CEID"];
                var rptids = req.Parameters["RPTIDS"] as List<uint>;


                foreach (uint rptid in rptids)
                {
                    bool ok = Runtime.EventReportService.LinkReport(ceid, rptid);
                    if (!ok)
                    {
                        ack = 1; // unknown CEID or RPTID
                        break;
                    }

                }
            }

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC2", AckToText(ack) }
                })
            );
        }

        private string AckToText(byte ack)
        {
            switch (ack)
            {
                case 0: return "Accepted";
                case 1: return "Denied insuffient Space";
                case 2: return "Denied Invalid format";
                case 3: return "Denied already One ceid link already defined";
                case 4: return "Denied one ceid id does not exist";
                default: return "Unknown";
            }
        }
    }




    // =============================================================
    //  S2F37  Enable/Disable Reports
    // =============================================================
    public class S2F37Handler : GemCommandHandler
    {
        public override string CommandName => "S2F37";

        public S2F37Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            byte ceed = (byte)req.Parameters["CEED"];
            var ceids = req.Parameters["CEIDS"] as List<uint>;
            byte ack = 0;

            if (ceids.Count == 0)
            {
                bool ok = ceed == 1;

                Runtime.EventReportService.UpdateAllEvents(ok);

            }
            else
            {

                foreach (uint ceid in ceids)
                {
                    bool ok = ceed == 1
                        ? Runtime.EventReportService.EnableEvent(ceid)
                        : Runtime.EventReportService.DisableEvent(ceid);

                    if (!ok)
                    {
                        ack = 1; // unknown CEID
                        break;
                    }
                }
            }

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC2", ack }
                })
            );
        }
    }

    // =============================================================
    //  S2F41  Remote Command
    // =============================================================



    public sealed class S2F39Handler : GemCommandHandler
    {
        public S2F39Handler(IGemFacade runtime) : base(runtime) { }

        public override string CommandName => "S2F39";

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            // S2F39 has no parameters (empty list)

            // Check if equipment can accept multi-block data
            bool ready = true;
             //   Runtime.MultiBlockService != null &&
               // Runtime.MultiBlockService.CanAccept;

            byte ack = ready ? (byte)0x00 : (byte)0x01;

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACK", ack }
                })
            );
        }
    }

    public sealed class S2F41Handler : GemCommandHandler
    {
        public S2F41Handler(IGemFacade runtime) : base(runtime) { }

        public override string CommandName => "S2F41";

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            var cmd = (string)req.Parameters["RCMD"];
            var parms = (Dictionary<string, object>)req.Parameters["PARAMS"];

            var result = Runtime.RemoteCommandService.Execute(cmd, parms);

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC5", AckToText(result) }
                })
            );
        }

       private string AckToText(byte ack)
        {
            switch (ack)
            {
                case 0: return "Accepted";
                case 1: return "Command does not exist";
                case 2: return "Cannot perform now";
                case 3: return "Parameter error";
                
                case 5: return "Rejected by equipment";
                case 6: return "No such Object exist";
                default: return "Unknown";
            }
        }
    }
 

    // =============================================================
    //  S2F43  Remote Command
    // =============================================================
    public class S2F43Handler : GemCommandHandler
    {
        public override string CommandName => "S2F43";

        public S2F43Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            byte ack;

            try
            {
                if (!Runtime.SpoolService.IsEnabled)
                {
                    ack = 1; // Spooling not enabled
                }
                else if (Runtime.IsBusy)
                {
                    ack = 3; // Equipment busy
                }
                else
                {
                    bool success = Runtime.SpoolService.Reset();
                    ack = success ? (byte)0 : (byte)2;
                }
            }
            catch
            {
                ack = 2; // Other rejection
            }

            return Task.FromResult(GemCommandResult.Ok(
                new Dictionary<string, object>
                {
                { "ACK", ack }
                }));
        }
    }



    public sealed class S2F45Handler : GemCommandHandler
    {
        public S2F45Handler(IGemFacade runtime) : base(runtime) { }

        public override string CommandName => "S2F45";

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            var dvlaList = (List<DvLimitDefinition>)req.Parameters["DVLA"];


            foreach (var dv in dvlaList)
            {
                Runtime.Equipment.VariableComponent.DefineLimits(dv);
            }

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACK", (byte)0x00 }
                })
            );
        }
    }



    public sealed class S2F47Handler : GemCommandHandler
    {
        public S2F47Handler(IGemFacade runtime) : base(runtime) { }

        public override string CommandName => "S2F47";

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            var dvids = (List<uint>)req.Parameters["DVIDS"];

            var defs = Runtime.Equipment.VariableComponent.GetLimits(dvids);

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "DVLA", defs }
                })
            );
        }
    }


    public sealed class S2F49Handler : GemCommandHandler
    {
        public S2F49Handler(IGemFacade runtime) : base(runtime) { }

        public override string CommandName => "S2F49";

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            // Get ERC model from equipment
            var commands = Runtime.Equipment
                .RemoteCommandComponent
                .GetEnhancedRemoteCommands();

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ERCS", commands }
                })
            );
        }
    }






}
