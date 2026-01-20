using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib.SecsItems
{
    public class U2Item : SecsItem
    {
        ArrayList contents = new ArrayList();

        public U2Item()
        { }

        public U2Item(params ushort[] valArray)
        {
            SetContents(valArray);
        }

        protected override FormatCode FormatCode
        {
            get
            {
                return FormatCode.U2;
            }
        }

        /// <summary>
        /// Sets the contents.
        /// </summary>
        /// <parameter name="contents">An <see cref="ushort"/> array representing contents to be stored in this item.</parameter>
        public override void SetContents(object contents)
        {
            SetContents((ushort[])contents);
        }

        public void SetContents(ushort[] contents)
        {
            this.contents.Clear();
            this.contents.AddRange(contents);
            this.ItemCount = this.contents.Count;
        }

        /// <summary>
        /// Gets the contents.
        /// </summary>
        /// <returns>An <see cref="ushort"/> array representing contents stored in this item.</returns>
        public override object GetContents()
        {
            return (ushort[])contents.ToArray(typeof(ushort));
        }

        public ushort GetValue()
        {
            return contents.Count > 0 ? (ushort)contents[0] : (ushort)0;
        }

        public override string ToString()
        {
            return "<U2" + GetItemCountAsString() + PrintContents(contents) + ">";
        }

        private string PrintContents(IList contents)
        {
            StringBuilder temp = new StringBuilder();
            foreach (ushort b in contents)
            {
                temp.Append(b);
                temp.Append(" ");
            }
            return temp.ToString();
        }

        protected override byte[] GetContentAsBytes()
        {
            ArrayList byteList = new ArrayList();
            foreach (ushort s in contents)
            {
                byteList.AddRange(ByteUtil.GetByteArray(s));
            }
            return (byte[])byteList.ToArray(typeof(byte));
        }

        public override bool Equals(object obj)
        {
            U2Item val = obj as U2Item;
            if (val == null)
                return false;

            return (ByteUtil.ArrayListCompare(contents, val.contents));
        }

        public override int GetHashCode()
        {
            return contents.GetHashCode();
        }

        public static bool operator ==(U2Item x, U2Item y)
        {
            return object.Equals(x, y);
        }

        public static bool operator !=(U2Item x, U2Item y)
        {
            return !(x == y);
        }

    }
}
