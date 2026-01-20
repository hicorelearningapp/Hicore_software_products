using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace HSMSLib
{
    internal abstract class TimerBase : IDisposable
    {
        private int _timeoutMs;
        private bool _cancelled;
        private Timer _timer;
        private bool _disposed;

        protected TimerBase()
        {
        }

        public int TimeOut
        {
            get { return _timeoutMs; }
            set { _timeoutMs = value; }
        }

        /// <summary>
        /// Starts or restarts the timer.
        /// </summary>
        public void Start()
        {
            if (_disposed)
                throw new ObjectDisposedException(GetType().Name);

            _cancelled = false;

            if (_timer == null)
            {
                _timer = new Timer(InternalTimeoutCallback, null, _timeoutMs, Timeout.Infinite);
            }
            else
            {
                _timer.Change(_timeoutMs, Timeout.Infinite);
            }
        }

        /// <summary>
        /// Cancels timer (prevents timeout handler from firing).
        /// </summary>
        public virtual void Cancel()
        {
            _cancelled = true;

            if (_timer != null)
            {
                _timer.Change(Timeout.Infinite, Timeout.Infinite);
            }
        }

        private void InternalTimeoutCallback(object state)
        {
            // If Cancel() has been called, skip timeout.
            if (_cancelled || _disposed)
                return;

            try
            {
                TimeoutHandler();
            }
            catch
            {
                // Never allow a background timer thread to crash an app.
                // Let derived class do its job.
            }
        }

        /// <summary>
        /// Implemented in derived classes to handle actual timeout.
        /// </summary>
        protected abstract void TimeoutHandler();

        public abstract TimeoutType TimeoutType { get; }

        public virtual void Dispose()
        {
            if (_disposed)
                return;

            _disposed = true;

            if (_timer != null)
            {
                try { _timer.Dispose(); } catch { }
                _timer = null;
            }
        }
    }

    internal class T7Timer : TimerBase
    {
        private readonly HsmsEntity _entity;

        public T7Timer(HsmsEntity entity)
        {
            _entity = entity;
        }

        protected override void TimeoutHandler()
        {
            _entity.OnTimeoutOccurred(this);
            _entity.DropConnection();
        }

        public override TimeoutType TimeoutType
        {
            get { return TimeoutType.T7; }
        }
    }

    internal class T6Timer : TimerBase
    {
        private readonly HsmsEntity _entity;

        public T6Timer(HsmsEntity entity)
        {
            _entity = entity;
        }

        protected override void TimeoutHandler()
        {
            _entity.OnTimeoutOccurred(this);
            _entity.DropConnection();
        }

        public override TimeoutType TimeoutType
        {
            get { return TimeoutType.T6; }
        }
    }

    internal class T3Timer : TimerBase
    {
        private readonly HsmsEntity _entity;
        private readonly HsmsDataMessage _dataMessage;

        public T3Timer(HsmsEntity entity, HsmsDataMessage dataMessage)
        {
            _entity = entity;
            _dataMessage = dataMessage;
        }

        internal HsmsDataMessage DataMessage
        {
            get { return _dataMessage; }
        }

        protected override void TimeoutHandler()
        {
            _entity.OnTimeoutOccurred(this);

            // Re-enter Selected state
            _entity.OnT3Timeout();

            // If equipment, send message 9,9
            if (_entity.EntityType == HsmsEntityType.Equipment)
            {
                var bin = new BinaryItem(_dataMessage.MessageHeader.GetBytes());

                _entity.SendMessage(
                    HsmsDataMessage.Create(
                        null,   // session ID (no change)
                        9,
                        9,
                        false,
                        bin,
                        _entity.DeviceID));
            }

            _entity.RemoveTransactionTimer(this);
        }

        public override void Cancel()
        {
            base.Cancel();
            _entity.RemoveTransactionTimer(this);
        }

        public override TimeoutType TimeoutType
        {
            get { return TimeoutType.T3; }
        }
    }

    internal class T5Timer : TimerBase
    {
        private readonly HsmsEntity _entity;
        private AutoResetEvent _resetEvent;

        public T5Timer(HsmsEntity entity)
        {
            _entity = entity;
        }

        internal AutoResetEvent ResetEvent
        {
            get { return _resetEvent; }
            set { _resetEvent = value; }
        }

        protected override void TimeoutHandler()
        {
            _entity.OnTimeoutOccurred(this);

            if (_resetEvent != null)
            {
                try { _resetEvent.Set(); }
                catch (ObjectDisposedException) { }
            }
        }

        /// <summary>
        /// T5 Cancel must fire the event to unblock waiting threads.
        /// </summary>
        public override void Cancel()
        {
            if (_resetEvent != null)
            {
                try { _resetEvent.Set(); }
                catch (ObjectDisposedException) { }
            }

            base.Cancel();
        }

        public override TimeoutType TimeoutType
        {
            get { return TimeoutType.T5; }
        }
    }
}
