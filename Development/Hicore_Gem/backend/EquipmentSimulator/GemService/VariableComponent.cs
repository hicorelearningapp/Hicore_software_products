using EquipmentSimulator.Config;
using EquipmentSimulator.Logic;
using GemManager;
using System;
using System.Collections.Generic;
using System.Linq;


namespace EquipmentSimulator
{
    public interface IVariableSimulator : IDisposable
    {
        void Start();
        void Stop();
    }

    internal sealed class DvRuntime
    {
        public uint Dvid { get; }
        public object CurrentValue { get; set; }

        // LIMITID → limit
        public Dictionary<byte, DvLimit> Limits { get; } =
            new Dictionary<byte, DvLimit>();

        public DvRuntime(uint dvid)
        {
            Dvid = dvid;
        }
    }

    public class VariableComponent : IVariableComponent
    {
        private readonly Dictionary<uint, GemVariable> _vars = new Dictionary<uint, GemVariable>();

        public event Action<uint, object> OnVariableChanged;

        private IVariableSimulator _simulator;

        public EquipmentRunMode RunMode { get; private set; } = EquipmentRunMode.Simulation;

        public void UpdateFromHardware(uint svid, object value)
        {
            if (RunMode != EquipmentRunMode.RealEquipment)
                return;

            UpdateStatusVariable(svid, value);
        }

        public void LoadFromConfig(EquipmentConfig config)
        {
            _vars.Clear();

            foreach (var ec in config.EquipmentConstants)
                _vars[ec.ECID] = GemVariableFactory.CreateEcVariable(ec);

            foreach (var sv in config.StatusVariables)
                _vars[sv.SVID] = GemVariableFactory.CreateSvVariable(sv);

            foreach (var dv in config.DataVariables)
                _vars[dv.DVID] = GemVariableFactory.CreateDvVariable(dv);

            Initialize(RunMode);
        }

        public bool Exists(uint vid)
        {
            return _vars.ContainsKey(vid);
        }

        public List<GemVariable> GetAllVariables()
            => _vars.Values.ToList();

        public object GetVariable(uint vid)
            => _vars[vid].GetValue();

        public void SetEquipmentConstant(uint ecid, object value)
        {
            var v = _vars[ecid];
            if (v.Role != GemVariableRole.EC)
                throw new InvalidOperationException("Not an EC");

            v.SetValue(value);
            OnVariableChanged?.Invoke(ecid, value);
        }

        public void UpdateStatusVariable(uint svid, object value)
        {
            var v = _vars[svid];
            if (v.Role != GemVariableRole.SV)
                throw new InvalidOperationException("Not an SV");

            v.SetValueInternal(value);
            OnVariableChanged?.Invoke(svid, value);
        }

        public void SetDataVariable(uint dvid, object value)
        {
            var v = _vars[dvid];
            if (v.Role != GemVariableRole.DV)
                throw new InvalidOperationException("Not a DV");

            v.SetValueInternal(value);
        }

        public bool HasVariable(uint vid)
        {
            return _vars.ContainsKey(vid);
        }

        // ---------------------------------------------------
        // Define DV Limit Attributes (S2F45)
        // ---------------------------------------------------

        private readonly Dictionary<uint, DvRuntime> _dvs = new Dictionary<uint, DvRuntime>();

        private readonly object _sync = new object();


        private static void ValidateLimit(DvLimit limit)
        {
            if (limit == null)
                throw new ArgumentNullException(nameof(limit));

            if (limit.Low == null || limit.High == null)
                throw new InvalidOperationException("Limit LOW/HIGH required");

            double low, high;

            try
            {
                low = Convert.ToDouble(limit.Low);
                high = Convert.ToDouble(limit.High);
            }
            catch
            {
                throw new InvalidOperationException("Limit values must be numeric");
            }

            if (low >= high)
                throw new InvalidOperationException("LOW must be < HIGH");
        }


        public void DefineLimits(DvLimitDefinition def)
        {
            if (def == null)
                throw new ArgumentNullException(nameof(def));

            lock (_sync)
            {
                if (!_dvs.TryGetValue(def.Dvid, out var dv))
                    throw new InvalidOperationException($"Unknown DVID {def.Dvid}");

                foreach (var limit in def.Limits)
                {
                    ValidateLimit(limit);

                    // Replace or add LIMITID
                    dv.Limits[limit.LimitId] = Clone(limit);
                }
            }
        }

        public IReadOnlyList<DvLimitDefinition> GetLimits(IEnumerable<uint> dvids)
        {
            if (dvids == null)
                throw new ArgumentNullException(nameof(dvids));

            var result = new List<DvLimitDefinition>();

            lock (_sync)
            {
                foreach (var dvid in dvids)
                {
                    if (!_dvs.TryGetValue(dvid, out var dv))
                        continue; // SEMI: ignore unknown DVIDs

                    if (dv.Limits.Count == 0)
                        continue; // no limits defined

                    var def = new DvLimitDefinition
                    {
                        Dvid = dvid
                    };

                    foreach (var limit in dv.Limits.Values)
                    {
                        def.Limits.Add(Clone(limit));
                    }

                    result.Add(def);
                }
            }

            return result;
        }


        private static DvLimit Clone(DvLimit src)
        {
            return new DvLimit
            {
                LimitId = src.LimitId,
                Enabled = src.Enabled,
                Low = src.Low,
                High = src.High
            };
        }

        public GemVariable GetGemVariable(uint vid)
        {
            _vars.TryGetValue(vid, out var v);
            return v;
        }

        public GemVariableRole GetRole(uint vid)
        {
            return _vars[vid].Role;
        }

        public GemVariable GetEc(uint ecid)
        {
            if (!_vars.TryGetValue(ecid, out var v))
                return null;

            return v.Role == GemVariableRole.EC ? v : null;
        }

        public IReadOnlyCollection<GemVariable> GetAllEcs()
        {
            return _vars.Values
                .Where(v => v.Role == GemVariableRole.EC)
                .ToList();
        }

        public bool TrySetEquipmentConstant(uint ecid, object value, out byte ackc2)
        {
            ackc2 = 0;

            if (!_vars.TryGetValue(ecid, out var v))
            {
                ackc2 = 1; // unknown ECID
                return false;
            }

            if (v.Role != GemVariableRole.EC)
            {
                ackc2 = 1;
                return false;
            }

            if (v.Access == GemVariableAccess.ReadOnly)
            {
                ackc2 = 2; // read-only
                return false;
            }

            //if (!v.Validate(value))
            //{
            //    ackc2 = 2; // invalid value
            //    return false;
            //}

            v.SetValue(value);
            OnVariableChanged?.Invoke(ecid, value);
            return true;
        }

        public void Initialize(EquipmentRunMode mode)
        {
            RunMode = mode;

            if (mode == EquipmentRunMode.Simulation)
            {
                _simulator = new TimerVariableSimulator(
                    _vars,
                    (vid, val) => OnVariableChanged?.Invoke(vid, val));

                _simulator.Start();
            }
        }


    }
}
