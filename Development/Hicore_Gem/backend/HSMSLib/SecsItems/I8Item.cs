using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib.SecsItems
{
    public class I8Item : SecsItem
    {
        private readonly List<long> _contents = new List<long>();

        public I8Item(params long[] values)
        {
            SetContents(values);
        }

        public I8Item()
        {
        }

        protected override FormatCode FormatCode => FormatCode.I8_Ext;

        public override void SetContents(object contents)
        {
            SetContents((long[])contents);
        }

        public void SetContents(long[] values)
        {
            _contents.Clear();
            _contents.AddRange(values);
            ItemCount = _contents.Count;
        }

        public override object GetContents()
        {
            return _contents.ToArray();
        }

        public long GetValue()
        {
            return _contents.Count > 0 ? _contents[0] : 0L;
        }

        public override string ToString()
        {
            return $"<I8{GetItemCountAsString()}{string.Join(" ", _contents)}>";
        }

        protected override byte[] GetContentAsBytes()
        {
            // SECS requires big-endian encoding
            List<byte> bytes = new List<byte>();

            foreach (long value in _contents)
            {
                byte[] raw = BitConverter.GetBytes(value);
                if (BitConverter.IsLittleEndian)
                    Array.Reverse(raw);

                bytes.AddRange(raw);
            }

            return bytes.ToArray();
        }

        public override bool Equals(object obj)
        {
            if (obj is I8Item other)
                return _contents.SequenceEqual(other._contents);

            return false;
        }

        public override int GetHashCode()
        {
            return _contents.GetHashCode();
        }

        public static bool operator ==(I8Item x, I8Item y)
        {
            return Equals(x, y);
        }

        public static bool operator !=(I8Item x, I8Item y)
        {
            return !(x == y);
        }
    }

}
