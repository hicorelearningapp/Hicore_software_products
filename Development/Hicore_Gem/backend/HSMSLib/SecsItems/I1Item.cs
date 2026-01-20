using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib.SecsItems
{
    public class I1Item : SecsItem
    {
        private readonly List<sbyte> _contents = new List<sbyte>();

        public I1Item() { }

        public I1Item(params sbyte[] values)
        {
            SetContents(values);
        }

        protected override FormatCode FormatCode => FormatCode.I1;

        public override void SetContents(object contents)
        {
            SetContents((sbyte[])contents);
        }

        public void SetContents(sbyte[] values)
        {
            _contents.Clear();
            _contents.AddRange(values);
            ItemCount = _contents.Count;
        }

        public override object GetContents()
        {
            return _contents.ToArray();
        }

        public sbyte GetValue()
        {
            return _contents.Count > 0 ? _contents[0] : (sbyte)0;
        }

        public override string ToString()
        {
            return $"<I1{GetItemCountAsString()}{string.Join(" ", _contents)}>";
        }

        protected override byte[] GetContentAsBytes()
        {
            var bytes = new byte[_contents.Count];
            for (int i = 0; i < _contents.Count; i++)
                bytes[i] = (byte)_contents[i]; // SECS-II I1 → signed 1-byte
            return bytes;
        }

        public override bool Equals(object obj)
        {
            var other = obj as I1Item;
            if (other == null) return false;
            if (other._contents.Count != _contents.Count) return false;

            for (int i = 0; i < _contents.Count; i++)
                if (_contents[i] != other._contents[i])
                    return false;

            return true;
        }

        public override int GetHashCode()
        {
            return _contents.GetHashCode();
        }
    }
}
