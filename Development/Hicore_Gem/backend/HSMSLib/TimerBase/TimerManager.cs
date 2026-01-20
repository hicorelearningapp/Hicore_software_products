using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib
{

    internal class TimerManager
    {
        private readonly HsmsEntity _entity;

        private readonly T7Timer _t7Timer;
        private readonly T6Timer _t6Timer;
        private readonly T5Timer _t5Timer;

        private int _t3Timeout;

        internal TimerManager(HsmsEntity entity)
        {
            if (entity == null) throw new ArgumentNullException(nameof(entity));

            _entity = entity;

            _t5Timer = new T5Timer(entity);
            _t6Timer = new T6Timer(entity);
            _t7Timer = new T7Timer(entity);
        }

        // --------------------------
        // Timer Properties
        // --------------------------

        internal T7Timer T7 { get { return _t7Timer; } }
        internal T6Timer T6 { get { return _t6Timer; } }
        internal T5Timer T5 { get { return _t5Timer; } }

        internal int T3Timeout
        {
            get { return _t3Timeout; }
            set { _t3Timeout = value; }
        }

        // --------------------------
        // T3 Timer Creation
        // --------------------------

        internal T3Timer CreateT3Timer(HsmsDataMessage dataMessage)
        {
            if (dataMessage == null)
                throw new ArgumentNullException(nameof(dataMessage));

            T3Timer timer = new T3Timer(_entity, dataMessage);
            timer.TimeOut = _t3Timeout;

            return timer;
        }

        // --------------------------
        // Reset Logic
        // --------------------------

        /// <summary>
        /// Reset HSMS timers T6, T7 and all outstanding transaction T3 timers.
        /// DOES NOT reset T5 because T5 defines how long to wait before reconnect.
        /// </summary>
        internal void Reset()
        {
            _t6Timer.Cancel();
            _t7Timer.Cancel();

            // Cancel all T3 timers waiting for replies
            _entity.RemoveAllTransactionTimers();
        }

    /// <summary>
    /// Reset absolutely EVERYTHING including T5.
    /// Use this when the entire HSMS entity is being shut down.
    // </summary>
    internal void ResetAll()
        {
            _t5Timer.Cancel();
            Reset();
        }
    }
}
