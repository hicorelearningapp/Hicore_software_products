using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib.SecsItems
{
    public class BooleanItem : SecsItem
    {
        private readonly List<byte> _contents = new List<byte>();

        public BooleanItem() { }

        public BooleanItem(params bool[] values)
        {
            foreach (var v in values)
                _contents.Add(v ? (byte)1 : (byte)0);

            ItemCount = _contents.Count;
        }

        public BooleanItem(params byte[] values)
        {
            _contents.AddRange(values);
            ItemCount = _contents.Count;
        }

        protected override FormatCode FormatCode => FormatCode.Boolean;

        // --- Contents ---
        public override void SetContents(object contents)
        {
            if (!(contents is byte[] arr))
                throw new ArgumentException("BooleanItem expects byte[]");

            SetContents(arr);
        }

        public void SetContents(byte[] arr)
        {
            _contents.Clear();
            _contents.AddRange(arr);
            ItemCount = _contents.Count;
        }

        public override object GetContents()
        {
            return _contents.ToArray();
        }

        public bool GetValue()
        {
            return _contents.Count > 0 && _contents[0] != 0;
        }

        // --- Encoding ---
        protected override byte[] GetContentAsBytes()
        {
            return _contents.ToArray();
        }

        public override string ToString()
        {
            return $"<BOOLEAN [{ItemCount}] {_contents.Count} bytes>";
        }
    }
}
