using System;
using System.Collections.Generic;
using System.Linq;
using EquipmentSimulator.Config;
using GemManager;


namespace EquipmentSimulator
{
    public class AlarmComponent : IAlarmComponent
    {
        private readonly Dictionary<int, GemAlarm> _alarms =
            new Dictionary<int, GemAlarm>();

        public event Action<GemAlarm> OnAlarmChanged;

        public void LoadFromConfig(EquipmentConfig config)
        {
            _alarms.Clear();
            foreach (var alarm in config.Alarms)
                _alarms[alarm.AlarmId] = alarm;
        }

        public List<GemAlarm> GetAlarmList()
            => _alarms.Values.ToList();

        public GemAlarm GetAlarm(int alarmId)
            => _alarms[alarmId];

        public void SetAlarm(int alarmId)
        {
            var alarm = _alarms[alarmId];
            if (alarm.State == GemAlarmState.Set)
                return;

            alarm.Set();
            OnAlarmChanged?.Invoke(alarm);
        }

        public void ClearAlarm(int alarmId)
        {
            var alarm = _alarms[alarmId];
            if (alarm.State == GemAlarmState.Cleared)
                return;

            alarm.Clear();
            OnAlarmChanged?.Invoke(alarm);
        }
    }
}
