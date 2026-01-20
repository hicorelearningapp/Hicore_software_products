using HSMSLib.SecsHsms;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;


namespace HSMSLib
{

    [Serializable]
    public sealed class ByteParsingFailedException : Exception
    {
        /// <summary>
        /// Byte index where parsing failed.
        /// </summary>
        public int ErrorIndex { get; }

        public ByteParsingFailedException(int errorIndex)
            : base($"Byte parsing failed at index {errorIndex}.")
        {
            ErrorIndex = errorIndex;
        }

        public ByteParsingFailedException(int errorIndex, Exception inner)
            : base($"Byte parsing failed at index {errorIndex}.", inner)
        {
            ErrorIndex = errorIndex;
        }

        // Serialization constructor
        private ByteParsingFailedException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
            ErrorIndex = info.GetInt32(nameof(ErrorIndex));
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            base.GetObjectData(info, context);
            info.AddValue(nameof(ErrorIndex), ErrorIndex);
        }
    }

    public class ByteParser
    {
        private readonly byte[] _data;
        private int _index;

        public int Index => _index;
        public byte[] ByteArray => _data;

        public ByteParser(byte[] data)
        {
            _data = data ?? throw new ArgumentNullException(nameof(data));
        }

        // -----------------------------------------------------------
        // Main entry: returns all messages contained in the byte buffer
        // -----------------------------------------------------------
        internal HsmsMessage[] Parse()
        {
            var messages = new List<HsmsMessage>();

            while (!IsEndOfContent())
                messages.Add(ParseMessage());

            return messages.ToArray();
        }

        private bool IsEndOfContent() => _index >= _data.Length;

        // -----------------------------------------------------------
        // Parse a single HSMS message
        // -----------------------------------------------------------
        private HsmsMessage ParseMessage()
        {
            int messageLength = ReadMessageLength();
            MessageHeader header = ReadMessageHeader();

            SecsItem item = null;

            // Message body > 10 means SECS-II item exists
            if (messageLength > 10)
                item = ReadSecsItem();

            return HsmsMessageFactory.CreateHsmsMessage(header, item);
        }


        // ===========================================================
        //               FIXED 100% CORRECT SECS-II PARSER
        // ===========================================================
        internal SecsItem ReadSecsItem()
        {
            byte formatByte = ReadByte();
            SecsFormat format = (SecsFormat)((formatByte & 0xFC) >> 2);
            int numLengthBytes = (formatByte & 0x03) + 1;

            // read length (count for LIST, byte-length for others)
            int length = 0;
            for (int i = 0; i < numLengthBytes; i++)
                length = (length << 8) | ReadByte();

            // LIST — special rule
            if (format == SecsFormat.List)
            {
                var children = new List<SecsItem>();

                for (int i = 0; i < length; i++)
                {
                    SecsItem child = ReadSecsItem();
                    children.Add(child);
                }

                return new ListItem(children);
            }

            // NON-LIST ITEMS → length = number of data bytes
            Ensure(length);

            byte[] rawItem = new byte[1 + numLengthBytes + length];
            int pos = 0;

            rawItem[pos++] = formatByte;

            // write length bytes
            for (int i = numLengthBytes - 1; i >= 0; i--)
                rawItem[pos + i] = (byte)(length >> (8 * (numLengthBytes - 1 - i)));

            pos += numLengthBytes;

            // copy value bytes
            for (int i = 0; i < length; i++)
                rawItem[pos + i] = ReadByte();

            // parse atomic type
            SecsParser parser = new SecsParser();
            return parser.Parse(rawItem);
        }


        // -----------------------------------------------------------
        // HSMS Message Length (first 4 bytes big endian)
        // -----------------------------------------------------------
        private int ReadMessageLength()
        {
            Ensure(4);
            int len = ByteUtil.GetByteArrayAsLength(_data, _index, 4);
            _index += 4;
            return len;
        }


        // -----------------------------------------------------------
        // Parse HSMS Message Header (SEMI E37)
        // -----------------------------------------------------------
        internal MessageHeader ReadMessageHeader()
        {
            MessageHeader header = new MessageHeader();

            header.SessionId = ReadUShort();

            byte headerByte2 = ReadByte();
            byte headerByte3 = ReadByte();

            header.PType = (ReadByte() == 0)
                ? PresentationType.SecsIIEncoding
                : PresentationType.Reserved;

            header.SType = GetSessionType(ReadByte());

            header.SystemBytes = new byte[]
            {
            ReadByte(), ReadByte(), ReadByte(), ReadByte()
            };

            if (header.SType == SessionType.DataMessage &&
                header.PType == PresentationType.SecsIIEncoding)
            {
                header.IsWaitBitSet = (headerByte2 & 0x80) != 0;
                header.Stream = (byte)(headerByte2 & 0x7F);
                header.Function = headerByte3;
            }
            else
            {
                header.StatusCode = headerByte3;
            }

            return header;
        }


         //-----------------------------------------------------------
         //Session Type decoding
         //-----------------------------------------------------------
        private static SessionType GetSessionType(byte b)
        {
            switch (b)
            {
                case 0:
                    return SessionType.DataMessage;

                case 1:
                    return SessionType.SelectRequest;

                case 2:
                    return SessionType.SelectResponse;

                case 3:
                    return SessionType.DeselectRequest;

                case 4:
                    return SessionType.DeselectResponse;

                case 5:
                    return SessionType.LinkTestRequest;

                case 6:
                    return SessionType.LinkTestResponse;

                case 7:
                    return SessionType.RejectRequest;

                case 9:
                    return SessionType.SeparateRequest;

                default:
                    throw new ByteParsingFailedException(-1);
            }
        }


        // -----------------------------------------------------------
        // Numeric Reads
        // -----------------------------------------------------------
        internal ushort ReadUShort()
        {
            Ensure(2);
            ushort val = (ushort)(_data[_index] << 8 | _data[_index + 1]);
            _index += 2;
            return val;
        }

        internal short ReadShort() => (short)ReadUShort();

        internal uint ReadUInt()
        {
            Ensure(4);
            uint val =
                ((uint)_data[_index] << 24) |
                ((uint)_data[_index + 1] << 16) |
                ((uint)_data[_index + 2] << 8) |
                _data[_index + 3];

            _index += 4;
            return val;
        }

        internal int ReadInt() => (int)ReadUInt();

        internal byte ReadByte()
        {
            Ensure(1);
            return _data[_index++];
        }


        // -----------------------------------------------------------
        // Bounds check
        // -----------------------------------------------------------
        private void Ensure(int size)
        {
            if (_index + size > _data.Length)
                throw new ByteParsingFailedException(_index);
        }
    }

}
