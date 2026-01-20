using GemManager.Interface;
using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using static GemManager.GemRecipeInfo;

namespace GemManager
{

    public interface IStatusService
    {
        void Set(int vid, object value);
        object Get(int vid);
        IReadOnlyDictionary<int, object> GetAll();
    }


    public class StatusService : IStatusService
    {
        private readonly IGemInterface _equipment;
        private readonly ILogger _logger;
        private readonly IGemFacade _gemEngine;
        private readonly System.Timers.Timer _timer;

        private List<uint> _periodicSvids = new List<uint>();

        private int _timeDelay = 5000;

        public StatusService(IGemFacade gemEngine, IGemInterface equipment, ILogger logger)
        {
            _gemEngine = gemEngine;
            _equipment = equipment;
            _logger = logger; 

            _timer = new System.Timers.Timer(_timeDelay); // 2 sec
            _timer.Elapsed += (sender, e) => SendPeriodicS1F6();

        }

        public void StartPeriodicReporting(List<uint> svids)
        {
            _periodicSvids = svids.ToList();
            _timer.Start();
        }

        public void StopPeriodicReporting()
        {
            _timer.Stop();
            _periodicSvids.Clear();
        }

        private void SendPeriodicS1F6()
        {
            if (_periodicSvids.Count == 0)
                return;

            var list = new ListItem();

            foreach (uint svid in _periodicSvids)
            {
                object value = _equipment.VariableComponent.GetVariable(svid);

                if (value is float f)
                    list.AddItem(new F4Item(f));
                else if (value is int i)
                    list.AddItem(new I4Item(i));
                else
                    list.AddItem(new AsciiItem(value?.ToString() ?? ""));
            }

            _gemEngine.SendMessage(
                stream: 1,
                function: 6,
                waitBit: false,
                list
            );
        }


        private readonly Dictionary<int, object> _data = new Dictionary<int, object>();

        public void Set(int vid, object value) => _data[vid] = value;

        public object Get(int vid) => _data.TryGetValue(vid, out var v) ? v : null;

        public IReadOnlyDictionary<int, object> GetAll() => _data;

        public object GetVidValue(uint vid)
        {
            try
            {
                return _equipment.VariableComponent.GetVariable(vid);
            }
            catch (Exception ex)
            {
                _logger.Error($"Failed to read VID {vid}", ex);
                return null;
            }
        }

        public IReadOnlyList<GemVariable> GetAllVariables()
        {
            return _equipment.VariableComponent.GetAllVariables();
        }
    }
}