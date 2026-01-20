using HSMSLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager
{
    public interface ISpoolingService
    {
        // Current spooling state
        bool IsEnabled { get; }

        // Enable / Disable spooling (S2F41)
        void SetEnabled(bool enable);

        // Clear all spooled messages (S2F43)
        bool Reset();

        // Called by GEM before sending an event/alarm
        void HandleOutgoingMessage(HsmsMessage message);

        // Called when communication becomes established
        void Flush();

        // Optional observability
        event Action<bool> SpoolingStateChanged;
        event Action<int> SpoolDepthChanged;
    }

    public sealed class SpoolingService : ISpoolingService
    {
        private readonly Queue<HsmsMessage> _queue =
            new Queue<HsmsMessage>();

        private readonly HsmsEntity _hsms;
        private readonly object _sync = new object();

        public bool IsEnabled { get; private set; }

        public event Action<bool> SpoolingStateChanged;
        public event Action<int> SpoolDepthChanged;

        public SpoolingService(HsmsEntity hsms)
        {
            _hsms = hsms;
        }

        public void SetEnabled(bool enable)
        {
            lock (_sync)
            {
                IsEnabled = enable;
                SpoolingStateChanged?.Invoke(enable);

                // If disabled, flush immediately
                if (!enable)
                    Flush();
            }
        }

        public bool Reset()
        {
            lock (_sync)
            {
                _queue.Clear();
                SpoolDepthChanged?.Invoke(0);
            }
            return true;
        }

        public void HandleOutgoingMessage(HsmsMessage message)
        {
            lock (_sync)
            {
                if (!IsEnabled || _hsms.StateMachine.IsSelected)
                {
                    // Send immediately
                    _hsms.SendMessage(message);
                    return;
                }

                // Buffer message
                _queue.Enqueue(message);
                SpoolDepthChanged?.Invoke(_queue.Count);
            }
        }

        public void Flush()
        {
            lock (_sync)
            {
                if (!_hsms.StateMachine.IsSelected)
                    return;

                while (_queue.Count > 0)
                {
                    var msg = _queue.Dequeue();
                    _hsms.SendMessage(msg);
                }

                SpoolDepthChanged?.Invoke(0);
            }
        }
    }



}
