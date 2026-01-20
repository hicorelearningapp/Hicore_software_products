using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib.SecsItems
{
    public class U4Item : SecsItem
    {
        private readonly List<uint> _contents = new List<uint>();

        public U4Item(params uint[] values)
        {
            SetContents(values);
        }

        public U4Item()
        {
        }

        protected override FormatCode FormatCode => FormatCode.U4;

        public override void SetContents(object contents)
        {
            if (contents == null)
            {
                _contents.Clear();
                return;
            }

            if (contents is uint[] arr)
            {
                SetContents(arr);
                return;
            }

            if (contents is IEnumerable<uint> enumerable)
            {
                SetContents(enumerable.ToArray());
                return;
            }

            throw new ArgumentException("U4Item requires uint[] or IEnumerable<uint>");
        }

        public void SetContents(uint[] contents)
        {
            _contents.Clear();

            if (contents == null || contents.Length == 0)
                return;

            _contents.AddRange(contents);
        }

        public override object GetContents()
        {
            return _contents.ToArray();
        }

        public uint GetValue()
        {
            return _contents.Count > 0 ? _contents[0] : 0u;
        }

        public override string ToString()
        {
            return "<U4" + GetItemCountAsString() + " " +
                   string.Join(" ", _contents) + ">";
        }

        protected override byte[] GetContentAsBytes()
        {
            if (_contents.Count == 0)
                return Array.Empty<byte>();

            var bytes = new byte[_contents.Count * 4];
            int offset = 0;

            foreach (uint value in _contents)
            {
                bytes[offset++] = (byte)(value >> 24);
                bytes[offset++] = (byte)(value >> 16);
                bytes[offset++] = (byte)(value >> 8);
                bytes[offset++] = (byte)value;
            }

            return bytes;
        }

        public override bool Equals(object obj)
        {
            var other = obj as U4Item;
            if (other == null)
                return false;

            if (_contents.Count != other._contents.Count)
                return false;

            for (int i = 0; i < _contents.Count; i++)
            {
                if (_contents[i] != other._contents[i])
                    return false;
            }

            return true;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                int hash = 17;
                foreach (var v in _contents)
                    hash = hash * 31 + v.GetHashCode();
                return hash;
            }
        }
    }

}
