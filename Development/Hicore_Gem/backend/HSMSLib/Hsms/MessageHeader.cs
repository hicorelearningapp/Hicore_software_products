using System;


namespace HSMSLib
{
    namespace SecsHsms
    {
        public enum PresentationType : byte
        {
            SecsIIEncoding = 0x00,
            Reserved = 0x01
        }

        public enum SessionType : byte
        {
            DataMessage = 0x00,
            SelectRequest = 0x01,
            SelectResponse = 0x02,
            DeselectRequest = 0x03,
            DeselectResponse = 0x04,
            LinkTestRequest = 0x05,
            LinkTestResponse = 0x06,
            RejectRequest = 0x07,
            SeparateRequest = 0x09
        }

        /// <summary>
        /// HSMS 10-byte SECS-II Header
        /// ---------------------------
        /// 2 bytes  : Session ID
        /// 2 bytes  : HEADER FIELDS (W-bit, Stream, Function)
        /// 1 byte   : PType
        /// 1 byte   : SType
        /// 4 bytes  : System Bytes
        /// </summary>
        public class MessageHeader : MarshalByRefObject
        {
            // -------------------------
            // Internal storage
            // -------------------------
            private ushort _sessionId;      // DeviceId for SECS-II; Session for HSMS
            private byte _stream;
            private byte _function;
            private bool _isPrimary;
            private ushort _tid;
            private byte[] _systemBytes = new byte[4];

            // HSMS Control header fields
            public PresentationType PType { get; set; } = PresentationType.SecsIIEncoding;
            public SessionType SType { get; set; } = SessionType.DataMessage;

            public override object InitializeLifetimeService() => null;

            // -------------------------
            // Properties
            // -------------------------

            public ushort SessionId
            {
                get => _sessionId;
                set => _sessionId = value;
            }

            public ushort DeviceId
            {
                get => _sessionId;   // same field
                set => _sessionId = value;
            }

            public byte Stream
            {
                get => _stream;
                set => _stream = value;
            }

            public byte Function
            {
                get => _function;
                set => _function = value;
            }

            public bool IsPrimary
            {
                get => _isPrimary;
                set => _isPrimary = value;
            }

            // GEM compatibility alias
            public bool IsWaitBitSet
            {
                get => _isPrimary;
                set => _isPrimary = value;
            }

            public ushort TID
            {
                get => _tid;
                set => _tid = value;
            }

            public byte[] SystemBytes
            {
                get => _systemBytes;
                set
                {
                    if (value == null || value.Length != 4)
                        throw new ArgumentException("SystemBytes must be 4 bytes.");
                    _systemBytes = value;
                }
            }

            // HSMS Control Messages sometimes include a StatusCode
            // Used for Select.rsp, Deselect.rsp, Reject.req
            private byte _statusCode;

            public byte StatusCode
            {
                get => _statusCode;
                set => _statusCode = value;
            }

            public bool IsControlMessage => SType != SessionType.DataMessage;


            public byte[] GetBytes()
            {
                var header = new byte[10];

                // For HSMS CONTROL MESSAGES:
                if (IsControlMessage)
                {
                    header[0] = 0x00;
                    header[1] = 0x00;

                    // For control messages, Stream/Function are not used.
                    header[2] = 0x00;
                    header[3] = 0x00;

                    header[4] = (byte)PType;
                    header[5] = (byte)SType;

                    Buffer.BlockCopy(_systemBytes, 0, header, 6, 4);
                    return header;
                }

                // --------------------
                // For SECS-II DATA messages (HSMS style)
                // --------------------
                // SessionId (DeviceId)
                header[0] = (byte)(_sessionId >> 8);
                header[1] = (byte)(_sessionId & 0xFF);

                // Byte 2: W-bit (bit7) + Stream (bits 0–6)
                byte b2 = (byte)(_stream & 0x7F);
                if (_isPrimary)    // or IsWaitBitSet
                    b2 |= 0x80;
                header[2] = b2;

                // Byte 3: Function
                header[3] = _function;

                // Byte 4: PType (0 = SECS-II)
                header[4] = (byte)PType;

                // Byte 5: SType (0 = Data Message)
                header[5] = (byte)SType;

                // Bytes 6–9: SystemBytes (used as TID/transaction ID in HSMS)
                Buffer.BlockCopy(_systemBytes, 0, header, 6, 4);

                return header;
            }

            // -------------------------
            // Encode (SECS-II or HSMS Control)
            // -------------------------
            //public byte[] GetBytes()
            //{
            //    var header = new byte[10];

            //    // For HSMS CONTROL MESSAGES:
            //    if (IsControlMessage)
            //    {
            //        header[0] = 0x00;
            //        header[1] = 0x00;
            //        header[2] = 0x00;
            //        header[3] = 0x00;

            //        header[4] = (byte)PType;
            //        header[5] = (byte)SType;

            //        Buffer.BlockCopy(_systemBytes, 0, header, 6, 4);
            //        return header;
            //    }

            //    // --------------------
            //    // For SECS-II DATA messages
            //    // --------------------
            //    header[0] = (byte)(_sessionId >> 8);
            //    header[1] = (byte)(_sessionId & 0xFF);

            //    header[2] = (byte)((_stream << 1) & 0xFE);
            //    if (_isPrimary) header[2] |= 0x01;

            //    header[3] = _function;

            //    header[4] = (byte)(_tid >> 8);
            //    header[5] = (byte)(_tid & 0xFF);

            //    Buffer.BlockCopy(_systemBytes, 0, header, 6, 4);

            //    return header;
            //}

            // -------------------------
            // Decode 10-byte HSMS/SECS Header
            // -------------------------
            //public static MessageHeader FromBytes(byte[] hdr)
            //{
            //    if (hdr == null || hdr.Length != 10)
            //        throw new ArgumentException("Header must be 10 bytes.");

            //    var h = new MessageHeader();

            //    // CONTROL MESSAGE CHECK
            //    byte ptype = hdr[4];
            //    byte stype = hdr[5];

            //    if (stype != (byte)SessionType.DataMessage)
            //    {
            //        // It's an HSMS Control Message
            //        h.PType = (PresentationType)ptype;
            //        h.SType = (SessionType)stype;

            //        Buffer.BlockCopy(hdr, 6, h._systemBytes, 0, 4);
            //        return h;
            //    }

            //    // -------------------------
            //    // SECS-II DATA MESSAGE
            //    // -------------------------
            //    h.SType = SessionType.DataMessage;

            //    h._sessionId = (ushort)((hdr[0] << 8) | hdr[1]);

            //    byte s = hdr[2];
            //    h._stream = (byte)((s & 0xFE) >> 1);
            //    h._isPrimary = (s & 0x01) != 0;

            //    h._function = hdr[3];

            //    h._tid = (ushort)((hdr[4] << 8) | hdr[5]);

            //    Buffer.BlockCopy(hdr, 6, h._systemBytes, 0, 4);

            //    return h;
            //}


            public static MessageHeader FromBytes(byte[] hdr)
            {
                if (hdr == null || hdr.Length != 10)
                    throw new ArgumentException("Header must be 10 bytes.");

                var h = new MessageHeader();

                h._sessionId = (ushort)((hdr[0] << 8) | hdr[1]);
                h.PType = (PresentationType)hdr[4];
                h.SType = (SessionType)hdr[5];

                Buffer.BlockCopy(hdr, 6, h._systemBytes, 0, 4);

                if (h.SType != SessionType.DataMessage)
                {
                    // HSMS control message
                    return h;
                }

                // SECS-II DATA message
                byte s = hdr[2];
                h._stream = (byte)(s & 0x7F);
                h._isPrimary = (s & 0x80) != 0;

                h._function = hdr[3];

                // Optionally map SystemBytes → TID if you want
                // e.g. h._tid = (ushort)((hdr[6] << 8) | hdr[7]);

                h._tid = (ushort)((h._systemBytes[2] << 8) | h._systemBytes[3]);


                return h;
            }


            public override string ToString()
            {
                if (IsControlMessage)
                    return $"HSMS {SType}  SYS={BitConverter.ToString(SystemBytes)}";

                return $"S{Stream}F{Function} {(IsPrimary ? "W" : "")} TID={TID}";
            }
        }

    }
}