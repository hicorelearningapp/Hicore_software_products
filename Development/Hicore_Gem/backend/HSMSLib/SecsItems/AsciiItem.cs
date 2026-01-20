using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib
{
    public class AsciiItem : SecsItem
    {
        private string _contents = string.Empty;

        public AsciiItem() { }

        public AsciiItem(string value)
        {
            SetContents(value);
        }

        protected override FormatCode FormatCode => FormatCode.Ascii;

        public override object GetContents() => _contents;

        public string GetValue() => _contents;

        public override void SetContents(object value)
        {
            SetContents(value as string ?? string.Empty);
        }

        public void SetContents(string value)
        {
            _contents = value ?? string.Empty;
            ItemCount = _contents.Length;
        }

        public override string ToString()
        {
            return string.IsNullOrEmpty(_contents)
                ? $"<A{GetItemCountAsString()}>"
                : $"<A{GetItemCountAsString()}\"{_contents}\">";
        }

        protected override byte[] GetContentAsBytes()
        {
            return System.Text.Encoding.ASCII.GetBytes(_contents);
        }

        // Clean, simple equality
        public override bool Equals(object obj)
        {
            return obj is AsciiItem other && _contents == other._contents;
        }

        public override int GetHashCode() => _contents.GetHashCode();

    }
}
