using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib.SecsItems
{
    public class I2Item : SecsItem
    {
        private readonly List<short> _contents = new List<short>();

        public I2Item() { }

        public I2Item(params short[] values)
        {
            SetContents(values);
        }

        protected override FormatCode FormatCode => FormatCode.I2;

        // -------------------------
        //  Set Contents
        // -------------------------
        public override void SetContents(object contents)
        {
            SetContents((short[])contents);
        }

        public void SetContents(short[] values)
        {
            _contents.Clear();
            _contents.AddRange(values);
            ItemCount = _contents.Count;
        }

        // -------------------------
        //  Get Contents
        // -------------------------
        public override object GetContents()
        {
            return _contents.ToArray();
        }

        public short GetValue()
        {
            return _contents.Count > 0 ? _contents[0] : (short)0;
        }

        // -------------------------
        //  SECS-II Text Print
        // -------------------------
        public override string ToString()
        {
            return $"<I2{GetItemCountAsString()}{PrintContents()}>";
        }

        private string PrintContents()
        {
            if (_contents.Count == 0)
                return "";

            var sb = new StringBuilder();
            foreach (short val in _contents)
                sb.Append(val).Append(" ");

            return sb.ToString();
        }

        // -------------------------
        //  SECS-II Binary Encoding
        // -------------------------
        protected override byte[] GetContentAsBytes()
        {
            var bytes = new List<byte>(_contents.Count * 2);

            foreach (short value in _contents)
            {
                // SECS-II requires BIG-ENDIAN
                byte[] s = BitConverter.GetBytes(value);
                if (BitConverter.IsLittleEndian)
                    Array.Reverse(s);

                bytes.AddRange(s);
            }

            return bytes.ToArray();
        }

        // -------------------------
        //  Equality
        // -------------------------
        public override bool Equals(object obj)
        {
            var other = obj as I2Item;
            if (other == null || other._contents.Count != _contents.Count)
                return false;

            for (int i = 0; i < _contents.Count; i++)
                if (_contents[i] != other._contents[i])
                    return false;

            return true;
        }

        public override int GetHashCode()
        {
            int hash = 17;
            foreach (short v in _contents)
                hash = hash * 31 + v.GetHashCode();
            return hash;
        }

        public static bool operator ==(I2Item x, I2Item y)
            => Equals(x, y);

        public static bool operator !=(I2Item x, I2Item y)
            => !Equals(x, y);
    }
}
