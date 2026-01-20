
using System;
using System.Linq;

using System.Collections.Generic;

using GemManager.Interface;
using HSMSLib;
using HSMSLib.SecsItems;


namespace GemManager
{
  


    public interface IAlarmService
    {
       void SetAlarmReportingEnabled(bool enabled);
        IReadOnlyList<GemAlarm> GetAlarmList();

        int ActiveAlarmCount { get; }

        event Action AlarmsChanged;
        event Action<int> AlarmCountChanged;
    }

    public class AlarmService : IAlarmService
    {
        private readonly ILogger _logger;
        private readonly IGemInterface _equipment;
        private readonly IGemFacade _gemEngine;

        private readonly List<GemAlarm> _alarms = new List<GemAlarm>();


        private bool _alarmReportingEnabled = true; // controlled by S5F3 later

        public AlarmService(IGemFacade gemEngine, IGemInterface equipment, ILogger logger)
        {
            _equipment = equipment;
            _gemEngine = gemEngine;
            _logger = logger;

            // ✅ Initial sync from equipment
            foreach (var alarm in equipment.AlarmComponent.GetAlarmList())
                _alarms.Add(alarm.Clone());


            equipment.AlarmComponent.OnAlarmChanged += OnAlarmChanged;
        }

        public event Action AlarmsChanged;
        public event Action<int> AlarmCountChanged;

        public int ActiveAlarmCount =>
            _alarms.Count(a => a.State == GemAlarmState.Set);

      
        // ✅ Central alarm update logic
        private void UpdateAlarmCache(GemAlarm alarm)
        {
            var existing = _alarms.FirstOrDefault(a => a.AlarmId == alarm.AlarmId);

            if (existing == null)
            {
                // First occurrence
                _alarms.Add(alarm);
            }
            else
            {
                // Update existing alarm
                existing.State = alarm.State;
                existing.LastChangedUtc = DateTime.Now;
            }
        }

        // ✅ UI reads ONLY from AlarmService
        public IReadOnlyList<GemAlarm> GetAlarmList()
        {
            return _alarms.AsReadOnly();
        }

        // ============================================================
        //  Equipment → GEM (notification)
        // ============================================================

        private void OnAlarmChanged(GemAlarm alarm)
        {
            if (alarm == null)
                return;


            // ✅ UPDATE INTERNAL CACHE
            UpdateAlarmCache(alarm);

            // ✅ Notify UI
            AlarmsChanged?.Invoke();
            AlarmCountChanged?.Invoke(ActiveAlarmCount);

            // GEM → Host
            if (_alarmReportingEnabled)
                SendS5F1(alarm);
           
        }

        // ============================================================
        //  GEM → Host (S5F1)
        // ============================================================

        private void SendS5F1(GemAlarm alarm)
        {
            var list = new ListItem();
            list.AddItem(new U2Item((ushort)alarm.AlarmId));
            list.AddItem(new U1Item(
                alarm.State == GemAlarmState.Set ? (byte)1 : (byte)0));
            list.AddItem(new AsciiItem(alarm.Description));
           
            _gemEngine.SendMessage(
                stream: 5,
                function: 1,
                waitBit: true,
                list
            );

            _logger.Info(
                $"[S5F1] Alarm {(alarm.State == GemAlarmState.Set ? "SET" : "CLEAR")} " +
                $"ALID={alarm.AlarmId} {alarm.Description}"
            );
        }

        // ============================================================
        //  Host → GEM (S5F3 support – optional for now)
        // ============================================================

        public void SetAlarmReportingEnabled(bool enabled)
        {
            _alarmReportingEnabled = enabled;
            _logger.Info($"[ALARM REPORTING] {(enabled ? "ENABLED" : "DISABLED")}");
        }
    }
}