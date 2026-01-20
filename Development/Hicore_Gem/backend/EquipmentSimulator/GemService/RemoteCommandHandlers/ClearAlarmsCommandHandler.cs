using GemManager;
using GemManager.Handlers;
using System.Collections.Generic;


namespace EquipmentSimulator
{
    public sealed class ClearAlarmsCommandHandler : IRemoteCommandHandler
    {
        private readonly IAlarmComponent _alarms;

        public ClearAlarmsCommandHandler(IAlarmComponent alarms)
        {
            _alarms = alarms;
        }

        public string CommandName => "CLEAR_ALARMS";

        public bool Validate(IReadOnlyDictionary<string, object> parameters, out byte ack)
        {
            ack = 0;
            return true;
        }

        public bool Execute(IReadOnlyDictionary<string, object> parameters, out byte ack)
        {
            ack = 0;
            foreach (var a in _alarms.GetAlarmList())
                _alarms.ClearAlarm(a.AlarmId);

            return true;
        }
    }
}
