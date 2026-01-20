using System;
using System.Text.Json;

namespace GemManager
{
    public class EquipmentConstantConfig
    {
        public uint ECID { get; set; }
        public string Name { get; set; }
        public string DataType { get; set; }

        public object DefaultValue { get; set; }
        public object Min { get; set; }
        public object Max { get; set; }

        public bool Writable { get; set; }
        public bool Persistent { get; set; }
    }

    public class StatusVariableConfig
    {
        public uint SVID { get; set; }
        public string Name { get; set; }
        public string DataType { get; set; }

        // Optional metadata
        public string Unit { get; set; }
        public string Description { get; set; }
    }

    public class DataVariableConfig
    {
        public uint DVID { get; set; }
        public string Name { get; set; }
        public string DataType { get; set; }
        public string Description { get; set; }
    }

    public static class GemVariableFactory
    {
        private static GemDataType ParseGemDataType(string dataType)
        {
            switch (dataType.ToUpperInvariant())
            {
                case "A": return GemDataType.A;
                case "U1": return GemDataType.U1;
                case "U2": return GemDataType.U2;
                case "U4": return GemDataType.U4;
                case "I2": return GemDataType.I2;
                case "F4": return GemDataType.F4;
                case "F8": return GemDataType.F8;
                case "BOOLEAN": return GemDataType.Boolean;

                default:
                    throw new NotSupportedException("Unsupported DataType: " + dataType);
            }
        }

        private static object GetDefaultValueForType(GemDataType type)
        {
            switch (type)
            {
                case GemDataType.A: return string.Empty;
                case GemDataType.U1: return (byte)0;
                case GemDataType.U2: return (ushort)0;
                case GemDataType.U4: return (uint)0;
                case GemDataType.I2: return (short)0;
                case GemDataType.I4: return 0;
                case GemDataType.F4: return 0.0f;
                case GemDataType.F8: return 0.0;
                case GemDataType.Boolean: return false;
                default:
                    throw new NotSupportedException("Unsupported SV datatype");
            }
        }
        
        public static GemVariable CreateEcVariable(EquipmentConstantConfig cfg)
        {
            GemDataType dataType = ParseGemDataType(cfg.DataType);

            object defaultValue = ConvertValue(cfg.DefaultValue, dataType);
            object min = cfg.Min != null ? ConvertValue(cfg.Min, dataType) : null;
            object max = cfg.Max != null ? ConvertValue(cfg.Max, dataType) : null;

            var ec = new GemVariable(
                cfg.ECID,
                cfg.Name,
                GemVariableRole.EC,
                dataType,
                cfg.Writable ? GemVariableAccess.ReadWrite : GemVariableAccess.ReadOnly,
                defaultValue,
                cfg.Persistent
            );

            ec.Min = min;
            ec.Max = max;

            return ec;
        }

        public static GemVariable CreateSvVariable(StatusVariableConfig cfg)
        {
            GemDataType dataType = ParseGemDataType(cfg.DataType);

            // Initial value must exist (even dummy)
            object initialValue = GetDefaultValueForType(dataType);

            var sv = new GemVariable(
                vid: cfg.SVID,
                name: cfg.Name,
                role: GemVariableRole.SV,
                dataType: dataType,
                access: GemVariableAccess.ReadOnly,   // SV is ALWAYS read-only
                initialValue: initialValue,
                persistent: false
            );

            sv.Unit = cfg.Unit;
            sv.Description = cfg.Description;

            return sv;
        }

        public static GemVariable CreateDvVariable(DataVariableConfig cfg)
        {
            GemDataType dataType = ParseGemDataType(cfg.DataType);

            object initialValue = GetDefaultValueForType(dataType);

            var dv = new GemVariable(
                cfg.DVID,
                cfg.Name,
                GemVariableRole.DV,
                dataType,
                GemVariableAccess.ReadOnly,
                initialValue,
                false
            );

            dv.Description = cfg.Description;

            return dv;
        }

        public static object ConvertValue(object rawValue, GemDataType dataType)
        {
            if (rawValue is JsonElement je)
            {
                switch (dataType)
                {
                    case GemDataType.U1: return je.GetByte();
                    case GemDataType.U2: return je.GetUInt16();
                    case GemDataType.U4: return je.GetUInt32();
                    case GemDataType.I2: return je.GetInt16();
                    case GemDataType.I4: return je.GetInt32();
                    case GemDataType.F4: return (float)je.GetDouble();
                    case GemDataType.F8: return je.GetDouble();
                    case GemDataType.A: return je.GetString();
                }
            }

            throw new InvalidOperationException("Unsupported value conversion");
        }
    }
}
