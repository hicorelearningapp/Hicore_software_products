using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib
{
    public class BinaryItem : SecsItem
    {
        private List<byte> _contents = new List<byte>();

        public BinaryItem() { }

        public BinaryItem(params byte[] values)
        {
            SetContents(values);
        }

        protected override FormatCode FormatCode => FormatCode.Binary;

        public override void SetContents(object contents)
        {
            SetContents((byte[])contents);
        }

        public void SetContents(byte[] contents)
        {
            _contents = new List<byte>(contents);
            ItemCount = _contents.Count;
        }

        public override object GetContents()
        {
            return _contents.ToArray();
        }

        public byte[] GetValues()
        {
            return _contents.ToArray();
        }

        public byte GetValue()
        {
            return _contents.Count > 0 ? _contents[0] : (byte)0;
        }

        public override string ToString()
        {
            return $"<B[{ItemCount}] {BitConverter.ToString(_contents.ToArray()).Replace("-", " ")}>";
        }

        protected override byte[] GetContentAsBytes()
        {
            return _contents.ToArray();
        }

        public override bool Equals(object obj)
        {
            if (obj is BinaryItem other)
            {
                if (other._contents.Count != _contents.Count)
                    return false;

                for (int i = 0; i < _contents.Count; i++)
                {
                    if (_contents[i] != other._contents[i])
                        return false;
                }
                return true;
            }
            return false;
        }

        public override int GetHashCode()
        {
            int hash = 17;
            foreach (var b in _contents)
                hash = hash * 31 + b;
            return hash;
        }
    }

}
