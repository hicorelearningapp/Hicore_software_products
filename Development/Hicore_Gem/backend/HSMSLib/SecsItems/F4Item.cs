using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib.SecsItems
{
    public class F4Item : SecsItem
    {
        private readonly List<float> _values = new List<float>();

        public F4Item() { }

        public F4Item(params float[] values)
        {
            SetContents(values);
        }

        protected override FormatCode FormatCode => FormatCode.F4;

        public override void SetContents(object contents)
        {
            SetContents((float[])contents);
        }

        public void SetContents(float[] values)
        {
            _values.Clear();
            _values.AddRange(values);
            ItemCount = _values.Count;
        }

        public override object GetContents()
        {
            return _values.ToArray();
        }

        public float GetValue()
        {
            return _values.Count > 0 ? _values[0] : 0f;
        }

        public override string ToString()
        {
            return $"<F4{GetItemCountAsString()}{string.Join(" ", _values)}>";
        }

        protected override byte[] GetContentAsBytes()
        {
            // SECS-II uses BIG ENDIAN
            var bytes = new List<byte>();

            foreach (float f in _values)
            {
                byte[] temp = BitConverter.GetBytes(f);

                if (BitConverter.IsLittleEndian)
                    Array.Reverse(temp);

                bytes.AddRange(temp);
            }

            return bytes.ToArray();
        }

        public override bool Equals(object obj)
        {
            if (obj is F4Item other)
                return _values.SequenceEqual(other._values);

            return false;
        }

        public override int GetHashCode()
        {
            return _values.GetHashCode();
        }

        public static bool operator ==(F4Item a, F4Item b)
        {
            return Equals(a, b);
        }

        public static bool operator !=(F4Item a, F4Item b)
        {
            return !Equals(a, b);
        }
    }
}
