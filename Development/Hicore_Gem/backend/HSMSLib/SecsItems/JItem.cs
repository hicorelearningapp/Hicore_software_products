using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib.SecsItems
{
    public class JItem : SecsItem
    {
        private string contents;

        public JItem(string contents)
        {
            SetContents(contents);
        }

        public JItem()
        { }

        protected override FormatCode FormatCode
        {
            get
            {
                return FormatCode.Jis8;
            }
        }

        /// <summary>
        /// Gets the contents
        /// </summary>
        /// <returns>A <see cref="string"/> that represents the value of the item.</returns>
        public override object GetContents()
        {
            return contents;
        }

        public string GetValue()
        {
            return contents;
        }

        public override string ToString()
        {
            return "<J" + GetItemCountAsString() + @"""" + contents + @"""" + ">";
        }

        /// <summary>
        /// Sets the contents.
        /// </summary>
        /// <parameter name="contents">A <see cref="string"/> that represents the value to be stored in the item.</parameter>
        public override void SetContents(object contents)
        {
            SetContents((string)contents);
        }

        public void SetContents(string contents)
        {
            this.contents = contents;
            this.ItemCount = this.contents.Length;
        }

        protected override byte[] GetContentAsBytes()
        {
            return System.Text.ASCIIEncoding.ASCII.GetBytes(contents);
        }

        public override bool Equals(object obj)
        {
            JItem val = obj as JItem;
            if (val == null)
                return false;

            return (contents == val.contents);
        }

        public override int GetHashCode()
        {
            return contents.GetHashCode();
        }

        public static bool operator ==(JItem x, JItem y)
        {
            return object.Equals(x, y);
        }

        public static bool operator !=(JItem x, JItem y)
        {
            return !(x == y);
        }
    }
}
