using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib.SecsItems
{
    public class F8Item : SecsItem
    {
        private readonly List<double> _values = new List<double>();

        public F8Item() { }

        public F8Item(params double[] values)
        {
            SetContents(values);
        }

        protected override FormatCode FormatCode => FormatCode.F8;

        // -------------------------
        // Set Contents
        // -------------------------
        public override void SetContents(object contents)
        {
            SetContents((double[])contents);
        }

        public void SetContents(double[] values)
        {
            _values.Clear();
            _values.AddRange(values);
            ItemCount = _values.Count;
        }

        // -------------------------
        // Get Contents
        // -------------------------
        public override object GetContents()
        {
            return _values.ToArray();
        }

        public double GetValue()
        {
            return _values.Count > 0 ? _values[0] : 0.0;
        }

        // -------------------------
        // ToString()
        // -------------------------
        public override string ToString()
        {
            return "<F8" + GetItemCountAsString() + string.Join(" ", _values) + ">";
        }

        // -------------------------
        // Convert to SECS-II bytes (big endian)
        // -------------------------
        protected override byte[] GetContentAsBytes()
        {
            List<byte> bytes = new List<byte>(_values.Count * 8);

            foreach (double d in _values)
            {
                byte[] floatBytes = BitConverter.GetBytes(d);

                if (BitConverter.IsLittleEndian)
                    Array.Reverse(floatBytes);

                bytes.AddRange(floatBytes);
            }

            return bytes.ToArray();
        }

        // -------------------------
        // Equality
        // -------------------------
        public override bool Equals(object obj)
        {
            F8Item other = obj as F8Item;
            if (other == null)
                return false;

            if (other._values.Count != _values.Count)
                return false;

            for (int i = 0; i < _values.Count; i++)
                if (_values[i] != other._values[i])
                    return false;

            return true;
        }

        public override int GetHashCode()
        {
            return _values.GetHashCode();
        }

        public static bool operator ==(F8Item x, F8Item y)
        {
            return object.Equals(x, y);
        }

        public static bool operator !=(F8Item x, F8Item y)
        {
            return !(x == y);
        }
    }

}
