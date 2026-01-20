using HSMSLib;
using HSMSLib.SecsItems;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Policy;
using System.Threading.Tasks;

namespace GemManager
{
    // =============================================================
    //  S1F1  Are You There?
    // =============================================================
    public class S1F1Handler : GemCommandHandler
    {
        public override string CommandName => "S1F1";

        public S1F1Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            return Task.FromResult(GemCommandResult.Ok(new Dictionary<string, object>
            {
                { "EQID", Runtime.Equipment.GetEquipmentId() },
                { "MODEL", Runtime.Equipment.GetModelName() },
                { "SOFTREV", Runtime.Equipment.GetSoftwareRevision() }
            }));
        }
    }

    // =============================================================
    //  S1F3  Selected SVID Request 
    // =============================================================
    public class S1F3Handler : GemCommandHandler
    {
        public override string CommandName => "S1F3";

        public S1F3Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            var svids = (List<uint>)req.Parameters["SVIDS"];


            var svValues = new List<object>();

            foreach (uint svid in svids)
            {
                // Get current value from equipment
                object value = Runtime.Equipment.VariableComponent.GetVariable(svid);

                if (value == null)
                {
                    // GEM rule: return empty value if unknown
                    svValues.Add(string.Empty);
                    Runtime.Logger.Warn($"Unknown SVID requested: {svid}");
                }
                else
                {
                    svValues.Add(value);
                }
            }

            return Task.FromResult(GemCommandResult.Ok(new Dictionary<string, object>
            {
                { "SV", svValues }
            }));
        }
    }

    // Get All the Status variable IDs
    public class S1F5Handler : GemCommandHandler
    {
        public override string CommandName => "S1F5";

        public S1F5Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            // 1. Get ALL status variables from equipment
            // 1. Get ALL Status Variables in defined order
            var allSvs = Runtime.Equipment.VariableComponent
                .GetAllVariables()
                .Where(v => v.Role == GemVariableRole.SV)
                .OrderBy(v => v.VariableId);

            var svValues = new List<object>();

            var root = new ListItem();

            foreach (var sv in allSvs)
            {
                // 2. Convert value to SecsItem
                // Get current value from equipment
                object value = Runtime.Equipment.VariableComponent.GetVariable(sv.VariableId);

                if (value == null)
                {
                    // GEM rule: return empty value if unknown
                    svValues.Add(string.Empty);
                    Runtime.Logger.Warn($"Unknown SVID requested: {sv.VariableId}");
                }
                else
                {
                    svValues.Add(value);
                }
            }

            return Task.FromResult(GemCommandResult.Ok(new Dictionary<string, object>
            {
                { "SV", svValues }
            }));
        }
    }

    // =============================================================
    //  S1F11  Status Request all svids 
    // =============================================================
    public class S1F11Handler : GemCommandHandler
    {
        public override string CommandName => "S1F11";

        public S1F11Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            List<GemVariable> gemVariables = new List<GemVariable>();

            if (req.Parameters.Count == 0)
            {
                gemVariables = Runtime.Equipment.VariableComponent.GetAllVariables().Where(v => v.Role == GemVariableRole.SV)
                .OrderBy(v => v.VariableId).ToList();
            }
            else
            {
                var svids = (List<uint>)req.Parameters["SVIDS"];


                foreach (var svid in svids)
                {
                    var gemvariable = (GemVariable)Runtime.Equipment.VariableComponent.GetVariable(svid);
                    gemVariables.Add(gemvariable);
                }
            }

            // Root list for S1F12
            var root = new ListItem();

            foreach (var gv in gemVariables)
            {
                // <L <U4 SVID> <A SV_NAME>>
                var pair = new ListItem();
                pair.AddItem(new U4Item(gv.VariableId));
                pair.AddItem(new AsciiItem(gv.Name));
                pair.AddItem(new AsciiItem(gv.Unit));
                root.AddItem(pair);
            }


            // Return S1F12

            return Task.FromResult(GemCommandResult.Ok(new Dictionary<string, object>
                {
                    { "SV", root }
                }));
        }
    }


    // =============================================================
    //  S1F13  Establish Communications
    // =============================================================
    public class S1F13Handler : GemCommandHandler
    {
        public override string CommandName => "S1F13";

        public S1F13Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            byte commAck = 0;

            if (Runtime.CommStateManager.HsmsConnectionState != HsmsConnectionState.Selected)
            {
                commAck = 1;
            }
            else if (Runtime.CommStateManager.IsCommunicating)
                commAck = 1;
            else
            {
                Runtime.CommStateManager.OnCommAccepted();
                Runtime.Equipment.OnCommunicationEstablished();

                commAck = 0;
            }

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
            { "COMMACK", commAck }
                })
            );
        }
    }


    public class S1F14Handler : GemCommandHandler
    {
        public override string CommandName => "S1F14";

        public S1F14Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            byte commAck = (byte)req.Parameters["COMMACK"];

            if (commAck == 0)
            {
                Runtime.CommStateManager.OnCommAccepted();
            }

            return Task.FromResult(GemCommandResult.Ok(new Dictionary<string, object>
            {
                { "Ack", commAck },
                { "MODEL", Runtime.Equipment.GetModelName() },
                { "SOFTREV", Runtime.Equipment.GetSoftwareRevision() }
            }));

        }
    }

    // =============================================================
    //  S1F15  Request OFFLINE
    // =============================================================
    public class S1F15Handler : GemCommandHandler
    {
        public override string CommandName => "S1F15";

        public S1F15Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            byte offlAck;

            if (!Runtime.Equipment.EquipmentStateComponent.IsOnline)
            {
                // Already Offline
                offlAck = 2;
            }
            else
            {
                // Go Offline
                if (!Runtime.Equipment.EquipmentStateComponent.GoOffline())
                {
                    offlAck = 1;
                }
                else
                    offlAck = 0;
            }


            // OFLACK = 0 (Accepted)
            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "OFLACK", offlAck }
                })
            );
        }
    }

    // =============================================================
    //  S1F17  Request ONLINE
    // =============================================================
    public class S1F17Handler : GemCommandHandler
    {
        public override string CommandName => "S1F17";

        public S1F17Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            byte onlAck;

            if (Runtime.Equipment.EquipmentStateComponent.IsOnline)
            {
                // Already ONLINE
                onlAck = 2;
            }
            else
            {
                // Go ONLINE
                if(!Runtime.Equipment.EquipmentStateComponent.GoOnlineLocal())
                {
                    onlAck = 1;
                }
                else
                    onlAck = 0;
            }

            // Reply S1F18
            return Task.FromResult(
                GemCommandResult.Ok(
                    new Dictionary<string, object>
                    {
                    { "ONLACK", onlAck }
                    }
                )
            );
        }
    }
}

