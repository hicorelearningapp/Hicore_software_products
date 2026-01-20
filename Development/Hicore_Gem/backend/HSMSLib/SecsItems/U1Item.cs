using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib.SecsItems
{
    public class U1Item : SecsItem
    {
        private readonly List<byte> _contents = new List<byte>();

        public U1Item(params byte[] contents)
        {
            SetContents(contents);
        }

        public U1Item()
        {
        }

        protected override FormatCode FormatCode => FormatCode.U1;

        public override void SetContents(object contents)
        {
            SetContents((byte[])contents);
        }

        public void SetContents(byte[] contents)
        {
            _contents.Clear();
            if (contents != null)
                _contents.AddRange(contents);

            ItemCount = _contents.Count;
        }

        public override object GetContents()
        {
            return _contents.ToArray();
        }

        public byte GetValue()
        {
            return _contents.Count > 0 ? _contents[0] : (byte)0;
        }

        public override string ToString()
        {
            return "<U1" + GetItemCountAsString() + PrintContents() + ">";
        }

        private string PrintContents()
        {
            if (_contents.Count == 0)
                return "";

            var sb = new StringBuilder();
            foreach (var b in _contents)
            {
                sb.Append(b);
                sb.Append(" ");
            }
            return sb.ToString();
        }

        protected override byte[] GetContentAsBytes()
        {
            return _contents.ToArray();
        }

        public override bool Equals(object obj)
        {
            var val = obj as U1Item;
            if (val == null) return false;
            if (val._contents.Count != _contents.Count) return false;

            for (int i = 0; i < _contents.Count; i++)
            {
                if (_contents[i] != val._contents[i])
                    return false;
            }
            return true;
        }

        public override int GetHashCode()
        {
            int hash = 17;
            foreach (var b in _contents)
                hash = hash * 31 + b.GetHashCode();
            return hash;
        }
    }
}
