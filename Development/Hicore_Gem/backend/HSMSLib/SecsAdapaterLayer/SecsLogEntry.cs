using HSMSLib;
using System;

namespace HSMSLib
{
    public sealed class SecsLogEntry
    {
        public DateTimeOffset Timestamp { get; set; }
        public SecsDirection Direction { get; set; }

        public int Stream { get; set; }
        public int Function { get; set; }
        public bool HasReply { get; set; }

        public ushort DeviceId { get; set; }
        public ushort TID { get; set; }

        public byte[] SystemBytes { get; set; }

        public string MessageText { get; set; }   // S1F13 W
        public string BodyText { get; set; }
    }

}
