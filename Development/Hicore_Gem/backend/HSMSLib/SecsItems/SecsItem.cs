using System;

namespace HSMSLib
{

    /// <summary>
    /// The list of possible Secs Item Formats.
    /// </summary>
    [Serializable]
    public enum FormatCode : byte
    {
        // LIST
        List = 0x00,

        // Binary / Boolean / Text
        Binary = 0x01,
        Boolean = 0x19,
        Ascii = 0x10,
        Jis8 = 0x11,

        // Signed Integers
        I1 = 0x06,
        I2 = 0x07,
        I4 = 0x09,

        I8_Ext = 0x1A,


        // Floating Point
        F4 = 0x08,
        F8 = 0x0A,

        // Unsigned Integers
        U1 = 0x02,
        U2 = 0x03,
        U4 = 0x05
    }

    public abstract class SecsItem
    {
        /// <summary>
        /// For List: number of child items.
        /// For ASCII: length of string.
        /// For numeric arrays: number of elements.
        /// </summary>
        public int ItemCount { get; protected set; }

        /// <summary>
        /// Return SECS-II contents in runtime type.
        /// </summary>
        public abstract object GetContents();

        /// <summary>
        /// Set SECS-II contents based on runtime type.
        /// </summary>
        public abstract void SetContents(object value);

        /// <summary>
        /// Format code of this SECS-II item.
        /// </summary>
        protected virtual FormatCode FormatCode
        {
            get
            {
                return formatCode;
            }

            set
            {
                formatCode = value;
            }
        }

        protected FormatCode formatCode;

        /// <summary>
        /// Encodes only the data payload (no header).
        /// </summary>
        protected abstract byte[] GetContentAsBytes();

        /// <summary>
        /// Allows ListItem to add children; others override as needed.
        /// </summary>
        public virtual void AddItem(SecsItem item)
        {
            throw new InvalidOperationException("AddItem is only valid for ListItem.");
        }

        /// <summary>
        /// Encode entire SECS-II item (format + length + content).
        /// </summary>
        public virtual byte[] GetBytes()
        {
            // Content (raw payload)
            byte[] content = GetContentAsBytes();
            int contentLength = content.Length;

            // Convert contentLength → 1–3 bytes
            byte[] lengthArray = ByteUtil.GetLengthAsByteArray(contentLength);
            int lengthBytes = lengthArray.Length;

            // ----------------------------------------
            // ★ SEMI E5 rule:
            // firstByte = (FormatCode << 2) | (numLenBytes - 1)
            // ----------------------------------------
            byte firstByte = (byte)(
                ((byte)FormatCode << 2) |
                ((lengthBytes - 1) & 0x03)   // FIXED
            );

            // Build final output buffer: [format][length bytes][content bytes]
            byte[] output = new byte[1 + lengthBytes + contentLength];
            int offset = 0;

            output[offset++] = firstByte;

            // Copy length bytes
            Array.Copy(lengthArray, 0, output, offset, lengthBytes);
            offset += lengthBytes;

            // Copy content
            if (contentLength > 0)
                Array.Copy(content, 0, output, offset, contentLength);

            return output;
        }

        protected string GetItemCountAsString()
        {
            return $"[{ItemCount}/{ByteUtil.GetLengthAsByteArray(ItemCount).Length}] ";
        }

        public override string ToString()
            => $"{FormatCode} ({ItemCount})";

        internal virtual string ToString(int nestingLevel)
        {
            return ToString();
        }
    }

}
