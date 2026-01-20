using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib.SecsItems
{
    public class I4Item : SecsItem
    {
        private readonly List<int> _contents = new List<int>();

        public I4Item(params int[] values)
        {
            SetContents(values);
        }

        public I4Item()
        {
        }

        protected override FormatCode FormatCode => FormatCode.I4;

        public override void SetContents(object contents)
        {
            SetContents((int[])contents);
        }

        public void SetContents(int[] values)
        {
            _contents.Clear();
            _contents.AddRange(values);
            ItemCount = _contents.Count;
        }

        public override object GetContents()
        {
            return _contents.ToArray();
        }

        public int GetValue()
        {
            return _contents.Count > 0 ? _contents[0] : 0;
        }

        public override string ToString()
        {
            return $"<I4{GetItemCountAsString()}{string.Join(" ", _contents)}>";
        }

        protected override byte[] GetContentAsBytes()
        {
            // SECS requires big-endian encoding
            List<byte> bytes = new List<byte>();

            foreach (int value in _contents)
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
            if (obj is I4Item other)
                return _contents.SequenceEqual(other._contents);

            return false;
        }

        public override int GetHashCode()
        {
            return _contents.GetHashCode();
        }

        public static bool operator ==(I4Item x, I4Item y)
        {
            return Equals(x, y);
        }

        public static bool operator !=(I4Item x, I4Item y)
        {
            return !(x == y);
        }
    }

}
