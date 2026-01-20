using GemManager;
using GemManager.Service;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace EquipmentSimulator.ViewModel
{
    public sealed class TraceInfoViewModel : BaseViewModel
    {
        public uint TraceId { get; }
        public uint PeriodMs { get; }
        public int VariableCount { get; }

        private string _state;
        public string State
        {
            get => _state;
            set { _state = value; OnPropertyChanged(nameof(State)); }
        }

        public TraceInfoViewModel(uint trid, uint periodMs, int varCount)
        {
            TraceId = trid;
            PeriodMs = periodMs;
            VariableCount = varCount;
            State = "Defined"; // Defined | Running | Stopped
        }
    }

    public sealed class TraceSampleViewModel
    {
        public DateTime TimeUtc { get; }
        public uint Vid { get; }
        public string Name { get; }
        public object Value { get; }

        public TraceSampleViewModel(uint vid, string name, object value)
        {
            TimeUtc = DateTime.UtcNow;
            Vid = vid;
            Name = name;
            Value = value;
        }
    }

    public sealed class TraceBrowserViewModel : BaseViewModel
    {
        // -------- Left pane --------
        public ObservableCollection<TraceInfoViewModel> Traces { get; set; } = new ObservableCollection<TraceInfoViewModel>();


        private TraceInfoViewModel _selectedTrace;
        public TraceInfoViewModel SelectedTrace
        {
            get => _selectedTrace;
            set
            {
                _selectedTrace = value;
                OnPropertyChanged(nameof(SelectedTrace));
                LoadLatestSamples();
            }
        }

        // -------- Right pane --------
        public ObservableCollection<TraceSampleViewModel> LatestSamples { get; } = new ObservableCollection<TraceSampleViewModel>();

        public ObservableCollection<TraceSampleViewModel> SampleHistory { get; } = new ObservableCollection<TraceSampleViewModel>();


        private ITraceService _traceService;
        private IVariableComponent _variables;

        private const int MaxHistory = 50;

        public TraceBrowserViewModel()
        {

        }

        public void SetTraceService(ITraceService traceService,
            IVariableComponent variables)
        {
            _traceService = traceService;
            _variables = variables;

            HookTraceEvents();
            LoadExistingTraces();
        }
    
        private void LoadExistingTraces()
        {
            foreach (var def in _traceService.GetAllTraceDefinitions())
            {
                Traces.Add(new TraceInfoViewModel(
                    def.TraceId,
                    def.SamplingPeriodMs,
                    def.Vids.Count));
            }
        }

        private TraceInfoViewModel Find(uint trid) => Traces.First(t => t.TraceId == trid);

        private static void RunOnUi(Action a)
        {
            Application.Current.Dispatcher.Invoke(a);
        }

        private void HookTraceEvents()
        {

            _traceService.TraceInitialized += def =>
            {
                RunOnUi(() =>
                {
                    Traces.Add(new TraceInfoViewModel(
                                        def.TraceId,
                                        def.SamplingPeriodMs,
                                        def.Vids.Count));
                });
            };

            _traceService.TraceStarted += def =>
            {
                RunOnUi(() =>
                {
                    Find(def.TraceId).State = "Running";
                });
            };

            _traceService.TraceStopped += trid =>
            {
                RunOnUi(() =>
                {
                    Find(trid).State = "Stopped";
                });
            };

            _traceService.TraceSampled += (trid, sampleNo, values) =>
            {
                RunOnUi(() =>
                {
                    if (SelectedTrace?.TraceId != trid)
                        return;

                    LatestSamples.Clear();

                    foreach (var (vid, value) in values)
                    {
                        var v = (GemVariable)_variables.GetGemVariable(vid);

                        var sample = new TraceSampleViewModel(
                            vid,
                            v?.Name ?? "",
                            value);

                        LatestSamples.Add(sample);

                        // Keep bounded history
                        SampleHistory.Insert(0, sample);
                        if (SampleHistory.Count > MaxHistory)
                            SampleHistory.RemoveAt(SampleHistory.Count - 1);
                    }
                });
            };
        }
        private void LoadLatestSamples()
        {
            LatestSamples.Clear();
            SampleHistory.Clear();

            if (SelectedTrace == null)
                return;

            var last = _traceService.GetLastTraceValues(SelectedTrace.TraceId);
            if (last == null)
                return;

            foreach (var (vid, value) in last)
            {
                var v = _variables.GetGemVariable(vid);
                LatestSamples.Add(new TraceSampleViewModel(
                    vid,
                    v?.Name ?? "",
                    value));
            }
        }

    }

    public class TraceDataViewModel : BaseViewModel
    {

    }
}
