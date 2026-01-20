using GemManager.Interface;
using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Service
{
    public sealed class TraceDefinition
    {
        public uint TraceId { get; }
        public uint SamplingPeriodMs { get; }
        public uint TotalSamples { get; }        // 0 = continuous
        public IReadOnlyList<uint> Vids { get; }

        public TraceDefinition(
            uint traceId,
            uint samplingPeriodMs,
            uint totalSamples,
            IReadOnlyList<uint> vids)
        {
            TraceId = traceId;
            SamplingPeriodMs = samplingPeriodMs;
            TotalSamples = totalSamples;
            Vids = vids;
        }
    }

   
    public interface ITraceService
    {
        // =========================
        // GEM RemoteCommandService
        // =========================

        // S6F1
        byte InitializeTrace(TraceDefinition definition);

        // S6F3
        byte StartTrace(uint traceId);

        // S6F4
        byte StopTrace(uint traceId);

        // =========================
        // Query for GUI
        // =========================

        IReadOnlyCollection<TraceDefinition> GetAllTraceDefinitions();
        IReadOnlyList<(uint vid, object value)> GetLastTraceValues(uint traceId);

        // =========================
        // Events (for GUI)
        // =========================

        event Action<TraceDefinition> TraceInitialized;
        event Action<TraceDefinition> TraceStarted;
        event Action<uint> TraceStopped;
        event Action<uint, uint, IReadOnlyList<(uint vid, object value)>> TraceSampled;
    }

    internal class TraceRuntime
    {
        public TraceDefinition Definition { get; }

        public System.Timers.Timer Timer { get; set; }

        public uint SampleCount { get; set; }

        // 🔑 Cache last values for GUI
        public Dictionary<uint, object> LastValues { get; }
            = new Dictionary<uint, object>();

        public TraceRuntime(TraceDefinition definition)
        {
            Definition = definition;
        }
    }


    public sealed class TraceService : ITraceService, IDisposable
    {
        private readonly IVariableComponent _variables;
        private readonly ILogger _logger;
        private IGemFacade _gemEngine;

        private readonly Dictionary<uint, TraceRuntime> _traces =
            new Dictionary<uint, TraceRuntime>();

        private readonly object _sync = new object();


        public event Action<TraceDefinition> TraceInitialized;

        public event Action<TraceDefinition> TraceStarted;
        public event Action<uint> TraceStopped;
        public event Action<uint, uint, IReadOnlyList<(uint vid, object value)>> TraceSampled;

        public TraceService(
            IGemFacade gemEngine,
            IVariableComponent variables,
            ILogger logger)
        {
            _gemEngine = gemEngine;
            _variables = variables;
            _logger = logger;
        }

        // =========================
        // S6F1 – Trace Initialize
        // =========================
        public byte InitializeTrace(TraceDefinition definition)
        {
            lock (_sync)
            {
                foreach (var vid in definition.Vids)
                {
                    if (!_variables.Exists(vid))
                    {
                        _logger.Warn($"Trace {definition.TraceId}: invalid VID {vid}");
                        return 1; // ACKC6 invalid VID
                    }
                }

                if (_traces.ContainsKey(definition.TraceId))
                {
                    _logger.Warn($"Trace {definition.TraceId} already exists");
                    return 2; // duplicate TRID
                }

                _traces[definition.TraceId] = new TraceRuntime(definition);

                _logger.Info($"Trace {definition.TraceId} initialized");

                TraceInitialized?.Invoke(definition);
                return 0;

            }
        }

        // =========================
        // S6F3 – Trace Start
        // =========================
        public byte StartTrace(uint traceId)
        {
            lock (_sync)
            {
                if (!_traces.TryGetValue(traceId, out var runtime))
                    return 1; // unknown TRID

                if (runtime.Timer != null)
                    return 0; // already running

                runtime.Timer = new System.Timers.Timer(
                    runtime.Definition.SamplingPeriodMs);

                runtime.Timer.AutoReset = true;
                runtime.Timer.Elapsed += (_, __) => SendTraceSample(runtime);
                runtime.Timer.Start();

                _logger.Info($"Trace {traceId} started");

                TraceStarted?.Invoke(runtime.Definition);
                return 0;
            }
        }

        // =========================
        // S6F4 – Trace Stop
        // =========================
        public byte StopTrace(uint traceId)
        {
            lock (_sync)
            {
                if (!_traces.TryGetValue(traceId, out var runtime))
                    return 1; // unknown TRID

                runtime.Timer?.Stop();
                runtime.Timer?.Dispose();
                runtime.Timer = null;

                runtime.SampleCount = 0;

                _logger.Info($"Trace {traceId} stopped");

                TraceStopped?.Invoke(traceId);
                return 0;
            }
        }

        // =========================
        // S6F5 – Trace Data Send
        // =========================
        private void SendTraceSample(TraceRuntime runtime)
        {
            lock (_sync)
            {
                runtime.SampleCount++;

                var valueList = new ListItem();
                var valuesForGui = new List<(uint vid, object value)>();

                foreach (var vid in runtime.Definition.Vids)
                {
                    object value;

                    try
                    {
                        value = _variables.GetVariable(vid);
                    }
                    catch
                    {
                        value = null;
                    }

                    // Cache last value
                    runtime.LastValues[vid] = value;
                    valuesForGui.Add((vid, value));

                    valueList.AddItem(SecsItemFactory.FromObject(value));
                }

                var body = new ListItem();
                body.AddItem(new U4Item(new[] { runtime.Definition.TraceId }));
                body.AddItem(new U4Item(new[] { runtime.SampleCount }));
                body.AddItem(valueList);

                _gemEngine.SendMessage(
                    stream: 6,
                    function: 5,
                    waitBit: false,
                    body);

                // Notify GUI
                TraceSampled?.Invoke(
                    runtime.Definition.TraceId,
                    runtime.SampleCount,
                    valuesForGui);

                // Auto-stop if limited
                if (runtime.Definition.TotalSamples > 0 &&
                    runtime.SampleCount >= runtime.Definition.TotalSamples)
                {
                    StopTrace(runtime.Definition.TraceId);
                }
            }
        }

        // =========================
        // GUI Query APIs
        // =========================
        public IReadOnlyCollection<TraceDefinition> GetAllTraceDefinitions()
        {
            lock (_sync)
            {
                return _traces.Values
                              .Select(t => t.Definition)
                              .ToList();
            }
        }

        public IReadOnlyList<(uint vid, object value)> GetLastTraceValues(uint traceId)
        {
            lock (_sync)
            {
                if (!_traces.TryGetValue(traceId, out var runtime))
                    return null;

                return runtime.LastValues
                              .Select(kv => (kv.Key, kv.Value))
                              .ToList();
            }
        }

        // =========================
        // Cleanup
        // =========================
        public void Dispose()
        {
            lock (_sync)
            {
                foreach (var rt in _traces.Values)
                {
                    rt.Timer?.Stop();
                    rt.Timer?.Dispose();
                }
                _traces.Clear();
            }
        }
    }



}
