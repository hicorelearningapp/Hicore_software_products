using HSMSLib.SecsHsms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib
{

    #region HSMS Message & Factory

    // Base HsmsMessage and control/data message types
    public abstract class HsmsMessage : MarshalByRefObject
    {
        public static bool valueOfIsHexDump;
        protected MessageHeader messageHeader;
        protected const ushort HsmsStandardSessionId = 0xFFFF;

        public override object InitializeLifetimeService() => null;

        protected HsmsMessage(MessageHeader messageHeader) { this.messageHeader = messageHeader; }

        public override string ToString() => messageHeader.ToString();

        private void PrintHexadecimalArray(Array array, string arrayName)
        {
            int elemWidth = 2;
            string format = String.Format(" {{0:X{0}}}", elemWidth);
            string arrayCopier = "";
            for (int i = 0; i < array.Length; i++)
            {
                arrayCopier = arrayCopier + " " + String.Format(format, array.GetValue(i));
            }
            // simplified logging sink: write to Console for now
            Console.WriteLine(arrayName + arrayCopier);
        }

        public byte[] GetBytes()
        {
            // 1) Build HSMS 10-byte header
            byte[] headerBytes = messageHeader.GetBytes();

            // 2) Build valid SECS-II body (must contain format codes!)
            byte[] dataBytes = GetDataBytes();

            // 3) HSMS message length = header + body (NOT including length bytes)
            int msgLength = headerBytes.Length + dataBytes.Length;

            // 4) Convert length to 4-byte big-endian number
            byte[] messageLengthBytes = BitConverter.GetBytes(msgLength);
            if (BitConverter.IsLittleEndian)
                Array.Reverse(messageLengthBytes);

            // 5) Allocate final message array
            byte[] messageBytes = new byte[4 + msgLength];

            int idx = 0;

            // 6) Copy message length
            Array.Copy(messageLengthBytes, 0, messageBytes, idx, 4);
            idx += 4;

            // 7) Copy header
            Array.Copy(headerBytes, 0, messageBytes, idx, headerBytes.Length);
            idx += headerBytes.Length;

            // 8) Copy data
            Array.Copy(dataBytes, 0, messageBytes, idx, dataBytes.Length);

            return messageBytes;
        }

        public void PrintHexaDecimal()
        {
            try
            {
                byte[] headerBytes = messageHeader.GetBytes();
                byte[] dataBytes = GetDataBytes();
                byte[] messageLengthBytes = GetByteArray(headerBytes.Length + dataBytes.Length);
                if (valueOfIsHexDump)
                {
                    if (headerBytes.Length != 0) PrintHexadecimalArray(headerBytes, "HEADER :");
                    if (this is HsmsDataMessage)
                    {
                        if (messageLengthBytes.Length != 0) PrintHexadecimalArray(messageLengthBytes, "Message Length :");
                        if (dataBytes.Length != 0) PrintHexadecimalArray(dataBytes, "Message  :");
                    }
                }
            }
            catch { /* ignore for now */ }
        }

        protected static byte[] GetByteArray(int val)
        {
            byte[] array = new byte[4];
            int bitMask = 0x000000FF;
            for (int i = array.Length - 1; i >= 0; --i)
            {
                array[i] = (byte)(bitMask & val);
                val >>= 8;
            }
            return array;
        }

        public virtual byte[] GetDataBytes() { return new byte[0]; }

        public static uint GetMessageLength(byte b1, byte b2, byte b3, byte b4)
        {
            uint messageLength = b1;
            messageLength <<= 8; messageLength |= b2;
            messageLength <<= 8; messageLength |= b3;
            messageLength <<= 8; messageLength |= b4;
            return messageLength;
        }

        public MessageHeader MessageHeader => messageHeader;
        public virtual SecsItem SecsContent => null;
        internal virtual void ProcessMessage(object entity) { }
        internal virtual void BeforeSendMessage(object entity) { }
    }
    public class HsmsDataMessage : HsmsMessage
    {
        private SecsItem SecsItem;
        private string messageName;

        public static HsmsDataMessage Create(string messageName, byte stream, byte function, bool isWaitBitSet,
            SecsItem item, ushort deviceId)
        {
            var header = new MessageHeader();
            header.SessionId = deviceId;
            header.Stream = stream;
            header.Function = function;
            header.IsWaitBitSet = isWaitBitSet;
            header.SType = SessionType.DataMessage;
            header.SystemBytes = HsmsMessage.GetByteArray(0);
            return new HsmsDataMessage(messageName, header, item);
        }

        public HsmsDataMessage(MessageHeader messageHeader, SecsItem item) : this(null, messageHeader, item) { }

        public HsmsDataMessage(string messageName, MessageHeader messageHeader, SecsItem item) : base(messageHeader)
        {
            if (string.IsNullOrEmpty(messageName)) messageName = string.Format("S{0}F{1}", messageHeader.Stream, messageHeader.Function);
            this.messageName = messageName;
            this.SecsItem = item;
        }

        public override string ToString() => base.ToString() + Environment.NewLine + (SecsItem != null ? SecsItem.ToString() : "");

        public override byte[] GetDataBytes() => (SecsItem != null ? SecsItem.GetBytes() : new byte[0]);

        public bool IsResponseFor(HsmsDataMessage dataMessage) => IsResponseFor(dataMessage.MessageHeader);

        public bool IsResponseFor(MessageHeader otherHeader)
        {
            var thisHeader = this.MessageHeader;
            return (thisHeader.Stream == otherHeader.Stream &&
                ((thisHeader.Function == (byte)(otherHeader.Function + 1)) || (thisHeader.Function == 0)) &&
                IsMatch(thisHeader.SystemBytes, otherHeader.SystemBytes) &&
                thisHeader.SessionId == otherHeader.SessionId);
        }

        private static bool IsMatch(byte[] array1, byte[] array2)
        {
            if (array1 == null || array2 == null) return false;
            if (array1.Length != array2.Length) return false;
            for (int i = 0; i < array1.Length; ++i) if (array1[i] != array2[i]) return false;
            return true;
        }

        public string MessageName { get { return messageName; } set { messageName = value; } }

        public override SecsItem SecsContent => SecsItem;

        internal override void BeforeSendMessage(object entity)
        {
            // placeholder: check entity state etc.
        }

        internal override void ProcessMessage(object entity)
        {
            // placeholder: handle response timers etc.
        }
    }

    public abstract class HsmsControlMessage : HsmsMessage { protected HsmsControlMessage(MessageHeader header) : base(header) { } }
    public abstract class HsmsRequestMessage : HsmsControlMessage { protected HsmsRequestMessage(MessageHeader header) : base(header) { } }
    public abstract class HsmsResponseMessage : HsmsControlMessage { protected HsmsResponseMessage(MessageHeader header) : base(header) { } }

    public class SelectRequestMessage : HsmsRequestMessage
    {
        public SelectRequestMessage(MessageHeader header) : base(header) { }
        public static SelectRequestMessage Create()
        {
            var h = new MessageHeader();
            h.SType = SessionType.SelectRequest;
            h.SessionId = HsmsStandardSessionId;
            h.SystemBytes = HsmsMessage.GetByteArray(new Random().Next());
            return new SelectRequestMessage(h);
        }

        internal override void ProcessMessage(object entity)
        {
            var hsms = entity as HsmsEntity;
            if (hsms == null)
                return;

            var sm = hsms.StateMachine;

            // HSMS rule: Select.req valid only in NotSelected
            if (!sm.IsNotSelected)
            {
                // Reject selection
                var rspFail = SelectResponseMessage.Create(
                    MessageHeader.SessionId,
                    MessageHeader.SystemBytes);

                hsms.SendMessage(rspFail);
                return;
            }

            // Accept selection
            var rsp = SelectResponseMessage.Create(
                MessageHeader.SessionId,
                MessageHeader.SystemBytes);

            hsms.SendMessage(rsp);

            // 🔑 THIS IS THE MISSING LINE
            sm.GoSelected(new StateChangeArgs(hsms, this));
        }
    }

    public class SelectResponseMessage : HsmsResponseMessage
    {
        public SelectResponseMessage(MessageHeader header) : base(header) { }
        public static SelectResponseMessage Create(ushort sessionId, byte[] systemBytes)
        {
            var h = new MessageHeader();
            h.SType = SessionType.SelectResponse;
            h.SessionId = sessionId;
            h.SystemBytes = systemBytes;
            return new SelectResponseMessage(h);
        }
        internal override void ProcessMessage(object entity)
        {
            var hsms = entity as HsmsEntity;
            if (hsms == null)
                return;

            // Host receives Select.rsp → Selected
            hsms.StateMachine.GoSelected(
                new StateChangeArgs(hsms, this));
        }
    }

    public class DeselectRequestMessage : HsmsRequestMessage
    {
        public DeselectRequestMessage(MessageHeader header) : base(header) { }
        public static DeselectRequestMessage Create()
        {
            var h = new MessageHeader();
            h.SType = SessionType.DeselectRequest;
            h.SessionId = HsmsStandardSessionId;
            return new DeselectRequestMessage(h);
        }
        internal override void ProcessMessage(object entity)
        {
            var hsms = entity as HsmsEntity;
            if (hsms == null)
                return;

            var rsp = DeselectResponseMessage.Create(
                MessageHeader.SessionId,
                MessageHeader.SystemBytes);

            hsms.SendMessage(rsp);

            hsms.StateMachine.GoNotConnected(
                new StateChangeArgs(hsms, this));
        }
    }

    public class DeselectResponseMessage : HsmsResponseMessage
    {
        public DeselectResponseMessage(MessageHeader header) : base(header) { }
        public static DeselectResponseMessage Create(ushort sessionId, byte[] systemBytes)
        {
            var h = new MessageHeader();
          //   h.SType = SessionType.DeselectResponse;
            h.SessionId = sessionId;
            h.SystemBytes = systemBytes;
            return new DeselectResponseMessage(h);
        }
        internal override void ProcessMessage(object entity) { /* reply with LinkTestResponse if selected */ }

    }

    public class LinkTestRequestMessage : HsmsRequestMessage
    {
        public LinkTestRequestMessage(MessageHeader header) : base(header) { }
        public static LinkTestRequestMessage Create()
        {
            var h = new MessageHeader();
            h.SType = SessionType.LinkTestRequest;
            h.SessionId = HsmsStandardSessionId;
            h.SystemBytes = HsmsMessage.GetByteArray(new Random().Next());
            return new LinkTestRequestMessage(h);
        }
        internal override void ProcessMessage(object entity)
        {
            var hsms = entity as HsmsEntity;
            if (hsms == null)
                return;

            // Only respond if Selected
            if (!hsms.StateMachine.IsSelected)
                return;

            var rsp = LinkTestResponseMessage.Create(
                MessageHeader.SessionId,
                MessageHeader.SystemBytes);

            hsms.SendMessage(rsp);
        }
    }

    public class LinkTestResponseMessage : HsmsResponseMessage
    {
        public LinkTestResponseMessage(MessageHeader header) : base(header) { }
        public static LinkTestResponseMessage Create(ushort sessionId, byte[] systemBytes)
        {
            var h = new MessageHeader();
            h.SType = SessionType.LinkTestResponse;
            h.SessionId = sessionId;
            h.SystemBytes = systemBytes;
            return new LinkTestResponseMessage(h);
        }
        internal override void ProcessMessage(object entity)
        {
            // No state change
            // TimerManager may observe this if needed
        }
    }

    public class RejectRequestMessage : HsmsResponseMessage
    {
        public RejectRequestMessage(MessageHeader header) : base(header) { }
        public static RejectRequestMessage Create()
        {
            var h = new MessageHeader();
            h.SType = SessionType.RejectRequest;
            h.SessionId = HsmsStandardSessionId;
            return new RejectRequestMessage(h);
        }
        internal override void ProcessMessage(object entity)
        {
            // Log only
            // Do NOT change HSMS state
        }
    }

    public class SeparateRequestMessage : HsmsRequestMessage
    {
        public SeparateRequestMessage(MessageHeader header) : base(header) { }
        internal override void ProcessMessage(object entity) 
        {
            var hsms = entity as HsmsEntity;
            if (hsms == null)
                return;

            hsms.StateMachine.GoNotConnected(
                new StateChangeArgs(hsms, this));

            hsms.DropConnection();

        }
    }

    [Serializable]
    public class StateChangeArgs
    {
        HsmsEntity entity;
        HsmsMessage message;

        public StateChangeArgs(HsmsEntity entity, HsmsMessage message)
        {
            this.entity = entity;
            this.message = message;
        }

        public HsmsEntity HsmsEntity
        {
            get { return entity; }
        }
    }


    [Serializable]
    public class InvalidStateException : Exception
    {
        public InvalidStateException()
        {
        }

        public InvalidStateException(string message) : base(message)
        {
        }

        public InvalidStateException(string message, Exception inner) : base(message, inner)
        {
        }

        public InvalidStateException(SerializationInfo serializationInfo, StreamingContext context) : base(serializationInfo, context)
        {
        }
    }

    /// <summary>
    /// Represents errors that occurred during parsing.
    /// </summary>
    [Serializable]
    public class ParsingFailedException : Exception
    {
        public ParsingFailedException()
        {
        }

        public ParsingFailedException(string message) : base(message)
        {
        }

        public ParsingFailedException(string message, Exception inner) : base(message, inner)
        {
        }

        public ParsingFailedException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }

    static class HsmsMessageFactory
    {
        public static HsmsMessage CreateHsmsMessage(MessageHeader messageHeader, SecsItem item)
        {
            switch (messageHeader.SType)
            {
                case SessionType.DataMessage: return new HsmsDataMessage(messageHeader, item);
                case SessionType.SelectRequest: return new SelectRequestMessage(messageHeader);
                case SessionType.SelectResponse: return new SelectResponseMessage(messageHeader);
                case SessionType.DeselectRequest: return new DeselectRequestMessage(messageHeader);
                case SessionType.DeselectResponse: return new DeselectResponseMessage(messageHeader);
                case SessionType.LinkTestRequest: return new LinkTestRequestMessage(messageHeader);
                case SessionType.LinkTestResponse: return new LinkTestResponseMessage(messageHeader);
                case SessionType.RejectRequest: return new RejectRequestMessage(messageHeader);
                case SessionType.SeparateRequest: return new SeparateRequestMessage(messageHeader);
                default: throw new ArgumentException("Unknown Session Type");
            }
        }
    }
    #endregion
}
