using System;
using System.Collections.Generic;
using System.Linq;

namespace HSMSLib
{
    public sealed class SecsMessageLogger
    {
        private readonly int _capacity;
        private readonly LinkedList<SecsLogEntry> _buffer;
        private readonly object _lock = new object();

        /// <summary>
        /// Raised when a new log entry is added (GUI listens to this).
        /// </summary>
        public event Action<SecsLogEntry> EntryAdded;

        public SecsMessageLogger(int capacity = 2000)
        {
            _capacity = capacity;
            _buffer = new LinkedList<SecsLogEntry>();
        }

        /// <summary>
        /// Returns a snapshot of existing log entries (for initial GUI load).
        /// </summary>
        public IList<SecsLogEntry> Snapshot()
        {
            lock (_lock)
            {
                return _buffer.ToList();
            }
        }

        /// <summary>
        /// Record a SECS message (RX or TX).
        /// </summary>
        public void Record(SecsMessage msg)
        {
            var entry = new SecsLogEntry
            {
                Timestamp = msg.Direction == SecsDirection.RX ? msg.ReceivedAt : msg.SentAt,

                Direction = msg.Direction,
                Stream = msg.Stream,
                Function = msg.Function,
                HasReply = msg.Header.IsWaitBitSet,
                SystemBytes = msg.SystemBytes,
                DeviceId = msg.Header.DeviceId,
                BodyText = msg.Body != null ? msg.Body.ToString() : null
            };

            lock (_lock)
            {
                _buffer.AddLast(entry);

                // Ring buffer behavior
                if (_buffer.Count > _capacity)
                {
                    _buffer.RemoveFirst();
                }
            }

            EntryAdded?.Invoke(entry);
        }
    }

}
