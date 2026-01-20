using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib.SecsItems
{
    public class ListItem : SecsItem
    {
        private readonly List<SecsItem> _items = new List<SecsItem>();

        public ListItem()
        {
            ItemCount = _items.Count;
            formatCode = FormatCode.List;   // IMPORTANT
        }

        public ListItem(IEnumerable<SecsItem> items)
        {
            foreach (var item in items)
                AddItem(item);
            formatCode = FormatCode.List;   // IMPORTANT
        }


        public override void AddItem(SecsItem item)
        {
            _items.Add(item);
            ItemCount = _items.Count;
        }

        public override object GetContents()
        {
            return _items.ToArray();
        }

        public override void SetContents(object contents)
        {
            throw new InvalidOperationException("Cannot set contents directly on ListItem.");
        }

        public SecsItem this[int index]
        {
            get => _items[index];
            set => _items[index] = value;
        }

        public int Count => _items.Count;


        protected override FormatCode FormatCode 
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

        public override byte[] GetBytes()
        {
            // CHILD CONTENT
            byte[] childBytes = GetContentAsBytes();

            // ---------------------------------------------
            // LIST-LENGTH = number of children (NOT byte length!)
            // ---------------------------------------------
            int listLength = _items.Count;

            // For LIST, length often fits in 1 byte (unless >255 children)
            byte[] lengthArray = ByteUtil.GetLengthAsByteArray(listLength);
            int numLenBytes = lengthArray.Length;

            // format = 00 (LIST), lenCode = numLenBytes - 1
            byte formatByte = (byte)(
                ((byte)SecsFormat.List << 2) |
                ((numLenBytes - 1) & 0x03)   // FIXED
            );

            // [format][length][child bytes]
            byte[] result = new byte[1 + numLenBytes + childBytes.Length];
            int offset = 0;

            result[offset++] = formatByte;

            Array.Copy(lengthArray, 0, result, offset, numLenBytes);
            offset += numLenBytes;

            if (childBytes.Length > 0)
                Array.Copy(childBytes, 0, result, offset, childBytes.Length);

            return result;
        }



        protected override byte[] GetContentAsBytes()
        {
            List<byte> data = new List<byte>();
            foreach (var i in _items)
                data.AddRange(i.GetBytes());
            return data.ToArray();
        }

     

        public override string ToString() => ToString(0);

        internal override string ToString(int nesting)
        {
            StringBuilder sb = new StringBuilder();
            string indent = new string(' ', nesting * 3);

            sb.Append("<L").Append(GetItemCountAsString()).Append(Environment.NewLine);

            foreach (SecsItem item in _items)
            {
                sb.Append(indent)
                  .Append("   ")
                  .Append(item.ToString(nesting + 1))
                  .Append(Environment.NewLine);
            }

            sb.Append(indent).Append(">");

            return sb.ToString();
        }

        public override bool Equals(object obj)
        {
            if (!(obj is ListItem other)) return false;

            if (other.Count != Count) return false;

            for (int i = 0; i < Count; i++)
                if (!_items[i].Equals(other._items[i]))
                    return false;

            return true;
        }

        public override int GetHashCode() => _items.GetHashCode();

        public static bool operator ==(ListItem a, ListItem b) => Equals(a, b);
        public static bool operator !=(ListItem a, ListItem b) => !Equals(a, b);
    }

}
