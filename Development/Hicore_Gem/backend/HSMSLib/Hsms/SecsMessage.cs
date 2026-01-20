
using System;
using HSMSLib.SecsHsms;

namespace HSMSLib
{
    public enum SecsDirection
    {
        RX,
        TX
    }

    [Serializable]
    public class SecsMessage : MarshalByRefObject
    {
        /// <summary>
        /// SECS-II header (10 bytes). Contains Stream, Function, WBit (IsPrimary), TID, and SystemBytes.
        /// </summary>
        public MessageHeader Header { get; set; }

        /// <summary>
        /// SECS-II Body as a parsed SecsItem tree (List, ASCII, Binary, U2, etc).
        /// </summary>
        public SecsItem Body { get; set; }

        public SecsMessage()
        {
            Header = new MessageHeader();
        }

        // ---------------------------------------------------------------------
        // Basic Properties
        // ---------------------------------------------------------------------

        public int Stream
        {
            get => Header.Stream;
            set => Header.Stream = (byte)value;
        }

        public int Function
        {
            get => Header.Function;
            set => Header.Function = (byte)value;
        }

        /// <summary>
        /// True if primary message has W-bit = 1 (host expects a reply).
        /// </summary>
        public bool HasReply => Header.IsWaitBitSet;

        /// <summary>
        /// SECS-II Transaction ID (bytes 4-5 of header).
        /// </summary>
        public ushort TID
        {
            get => Header.TID;
            set => Header.TID = value;
        }

        /// <summary>
        /// System bytes (4 bytes, used for message matching).
        /// </summary>
        public byte[] SystemBytes
        {
            get => Header.SystemBytes;
            set => Header.SystemBytes = value;
        }

        /// <summary>
        /// Returns true for primary messages (IsPrimary bit in header).
        /// </summary>
        public bool IsPrimary => Header.IsPrimary;

        /// <summary>
        /// Returns true for secondary messages.
        /// </summary>
        public bool IsSecondary => !Header.IsPrimary;

        /// <summary>
        /// Returns SxFy formatted name, e.g., S1F3 W.
        /// For control messages, defers to header ToString.
        /// </summary>
        public override string ToString()
        {
            if (Header.IsControlMessage)
                return Header.ToString();

            return $"S{Stream}F{Function}" + (HasReply ? " W" : "");
        }

        // ---------------------------------------------------------------------
        // Helper Functions (VERY USEFUL for handlers)
        // ---------------------------------------------------------------------

        /// <summary>
        /// Create a proper secondary reply message for this primary message.
        /// Automatically sets Stream, Function, TID, and SystemBytes.
        /// </summary>
        public SecsMessage MakeReply()
        {
            if (!IsPrimary)
                throw new InvalidOperationException("Only primary messages can have replies.");

            var reply = new SecsMessage
            {
                Header = new MessageHeader()
                {
                    // keep DeviceId/SessionId if set
                    DeviceId = Header.DeviceId,
                    Stream = (byte)this.Stream,
                    Function = (byte)(this.Function + 1), // secondary = primary + 1
                    TID = this.TID,
                    IsPrimary = false, // reply is secondary
                    SystemBytes = this.Header.SystemBytes != null ? (byte[])this.Header.SystemBytes.Clone() : new byte[4]
                },
                Body = null
            };

            return reply;
        }

        /// <summary>
        /// Clone this message's header (useful for rebuilds). Does not clone Body deeply.
        /// </summary>
        public MessageHeader CloneHeader()
        {
            var cloned = new MessageHeader
            {
                DeviceId = this.Header.DeviceId,
                SessionId = this.Header.SessionId,
                Stream = this.Header.Stream,
                Function = this.Header.Function,
                TID = this.Header.TID,
                IsPrimary = this.Header.IsPrimary,
                // SystemBytes setter validates length; clone only if not null
                SystemBytes = this.Header.SystemBytes != null ? (byte[])this.Header.SystemBytes.Clone() : new byte[4]
            };
            return cloned;
        }

        /// <summary>
        /// Returns a shallow clone of the message (header cloned, body reference copied).
        /// Use this if you need a new message object but don't want to deep-copy body.
        /// </summary>
        public SecsMessage Clone()
        {
            return new SecsMessage
            {
                Header = this.CloneHeader(),
                Body = this.Body
            };
        }

        public DateTimeOffset ReceivedAt { get; set; }
        public DateTimeOffset SentAt { get; set; }

        public TimeSpan ReplyDuration => SentAt - ReceivedAt;

        public SecsDirection Direction { get;set;}

        public static SecsMessage FromHsms(HsmsMessage hsms)
        {
            if (hsms == null)
                throw new ArgumentNullException(nameof(hsms));

            var h = hsms.MessageHeader;

            // Build SECS-II wrapper
            var msg = new SecsMessage
            {
                Header = new MessageHeader
                {
                    // HSMS SessionId == SECS DeviceId
                    DeviceId = h.SessionId,
                    SessionId = h.SessionId,

                    Stream = h.Stream,
                    Function = h.Function,

                    IsPrimary = h.IsPrimary,
                    IsWaitBitSet = h.IsPrimary,

                    TID = h.TID,

                    SystemBytes = (byte[])h.SystemBytes.Clone(),

                    PType = h.PType,
                    SType = h.SType,
                    StatusCode = h.StatusCode
                },

                // HSMS parser already produced parsed SecsItem
                Body = hsms.SecsContent
            };

            return msg;
        }



    }
}
