using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager
{
    public enum GemVariableRole
    {
        EC,   // Equipment Constant
        SV,   // Status Variable
        DV    // Data Variable
    }

    public enum GemDataType
    {
        A,        // ASCII
        Boolean,
        U1, U2, U4, U8,
        I1, I2, I4, I8,
        F4, F8,
        Binary,
        List
    }

    public enum GemVariableAccess
    {
        ReadOnly,
        ReadWrite
    }

    public sealed class DvLimitDefinition
    {
        /// <summary>
        /// Data Variable ID (DVID)
        /// </summary>
        public uint Dvid { get; set; }

        /// <summary>
        /// One DV can have multiple limits
        /// </summary>
        public List<DvLimit> Limits { get; set; } = new List<DvLimit>();
    }


    public sealed class DvLimit
    {
        /// <summary>
        /// Limit identifier (LIMITID)
        /// </summary>
        public byte LimitId { get; set; }

        /// <summary>
        /// Enable / Disable this limit
        /// </summary>
        public bool Enabled { get; set; }

        /// <summary>
        /// Lower limit value
        /// </summary>
        public object Low { get; set; }

        /// <summary>
        /// Upper limit value
        /// </summary>
        public object High { get; set; }
    }

    public static class DvLimitValidator
    {
        public static bool IsValid(DvLimit limit)
        {
            if (limit.Low == null || limit.High == null)
                return false;

            try
            {
                double low = Convert.ToDouble(limit.Low);
                double high = Convert.ToDouble(limit.High);
                return low < high;
            }
            catch
            {
                return false;
            }
        }
    }


    public class GemVariable
    {
        public uint VariableId { get; private set; }
        public string Name { get; private set; }
        public GemVariableRole Role { get; private set; }
        public GemDataType DataType { get; private set; }
        public GemVariableAccess Access { get; private set; }
        public bool Persistent { get; private set; }

        private object _value;
        private readonly object _lock = new object();

        // Optional metadata
        public string Unit { get; set; }
        public object Min { get; set; }
        public object Max { get; set; }
        public string Description { get; set; }

        public GemVariable(
            uint vid,
            string name,
            GemVariableRole role,
            GemDataType dataType,
            GemVariableAccess access,
            object initialValue,
            bool persistent)
        {
            VariableId = vid;
            Name = name;
            Role = role;
            DataType = dataType;
            Access = access;
            Persistent = persistent;

            if (Access == GemVariableAccess.ReadWrite && Role != GemVariableRole.EC)
                throw new InvalidOperationException("Only EC can be writable");

            ValidateType(initialValue);
            _value = initialValue;
        }

        public object GetValue()
        {
            lock (_lock)
                return _value;
        }

        public void SetValue(object newValue)
        {
            if (Access == GemVariableAccess.ReadOnly)
                throw new InvalidOperationException("Variable is read-only");

            ValidateType(newValue);
            ValidateRange(newValue);

            lock (_lock)
                _value = newValue;
        }

        public void SetValueInternal(object value)
        {
            ValidateType(value);
            ValidateRange(value);

            lock (_lock)
            {
                _value = value;
            }
        }


        private void ValidateType(object value)
        {
            if (value == null)
                throw new ArgumentNullException("value");

            switch (DataType)
            {
                case GemDataType.A:
                    if (!(value is string)) Throw("ASCII string");
                    break;

                case GemDataType.Boolean:
                    if (!(value is bool)) Throw("Boolean");
                    break;

                case GemDataType.U1:
                    if (!(value is byte)) Throw("U1 (byte)");
                    break;

                case GemDataType.U2:
                    if (!(value is ushort)) Throw("U2 (ushort)");
                    break;

                case GemDataType.U4:
                    if (!(value is uint)) Throw("U4 (uint)");
                    break;

                case GemDataType.I2:
                    if (!(value is short)) Throw("I2 (short)");
                    break;

                case GemDataType.I4:
                    if (!(value is int)) Throw("I4 (int)");
                    break;

                case GemDataType.F4:
                    if (!(value is float)) Throw("F4 (float)");
                    break;

                case GemDataType.F8:
                    if (!(value is double)) Throw("F8 (double)");
                    break;

                case GemDataType.Binary:
                    if (!(value is byte[])) Throw("Binary");
                    break;
            }
        }

        private void ValidateRange(object value)
        {
            if (Min == null && Max == null)
                return;

            double v = Convert.ToDouble(value);

            if (Min != null && v < Convert.ToDouble(Min))
                throw new InvalidOperationException("Value below Min");

            if (Max != null && v > Convert.ToDouble(Max))
                throw new InvalidOperationException("Value above Max");
        }

        private void Throw(string expected)
        {
            throw new InvalidOperationException(
                "VID " + VariableId + " expects " + expected);
        }

        public override string ToString()
        {
            return "VID=" + VariableId +
                   ", Role=" + Role +
                   ", Name=" + Name +
                   ", Type=" + DataType +
                   ", Value=" + GetValue();
        }
    }

}
