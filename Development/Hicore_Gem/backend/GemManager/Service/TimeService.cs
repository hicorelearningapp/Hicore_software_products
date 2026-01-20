using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager
{
    public interface ITimeService
    {
        /// <summary>
        /// Sets equipment time based on host time (S2F31).
        /// </summary>
        void SetHostTime(DateTime hostTime);

        /// <summary>
        /// Gets current equipment time (used in events, alarms, traces).
        /// </summary>
        DateTime Now();

        /// <summary>
        /// Gets last host-synchronized time (optional, for diagnostics).
        /// </summary>
        DateTime? LastHostTime { get; }
    }


    public class TimeService : ITimeService
    {
        private TimeSpan _offset = TimeSpan.Zero;
        private DateTime? _lastHostTime;

        public DateTime? LastHostTime
        {
            get { return _lastHostTime; }
        }

        public void SetHostTime(DateTime hostTime)
        {
            _offset = hostTime - DateTime.Now;
            _lastHostTime = hostTime;
        }

        public DateTime Now()
        {
            return DateTime.Now + _offset;
        }
    }

}
