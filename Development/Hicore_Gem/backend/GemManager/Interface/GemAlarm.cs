using System;

namespace GemManager
{
    public enum GemAlarmState
    {
        Cleared = 0,
        Set = 1
    }

    public class GemAlarm
    {
        public int AlarmId { get; set; }

        public string Description { get; set; }

        public GemAlarmState State { get; set; }

        public DateTime LastChangedUtc { get; set; }

        public GemAlarm()
        {

        }
        public GemAlarm(int alarmId, string description)
        {
            AlarmId = alarmId;
            Description = description;
            State = GemAlarmState.Cleared;
            LastChangedUtc = DateTime.UtcNow;
        }

        public GemAlarm Clone()
        {
            return new GemAlarm 
            {
                AlarmId = this.AlarmId,
                Description = this.Description,
                State = this.State,
                LastChangedUtc = this.LastChangedUtc
            };
        }

        public void Set()
        {
            if (State == GemAlarmState.Set)
                return;

            State = GemAlarmState.Set;
            LastChangedUtc = DateTime.UtcNow;
        }

        public void Clear()
        {
            if (State == GemAlarmState.Cleared)
                return;

            State = GemAlarmState.Cleared;
            LastChangedUtc = DateTime.UtcNow;
        }


        public bool IsActive => State == GemAlarmState.Set;

    }
}
