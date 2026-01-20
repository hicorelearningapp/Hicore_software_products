using System;
using System.Collections.Generic;

namespace GemManager
{
    public enum Severity { Minor, Major, Critical };

    public abstract class VariableMeta
    {
        public uint Id { get; set; }
        public string Name { get; set; }
        public byte DataType { get; set; }   // U4, A, F8...
        public byte Length { get; set; }
    }

    public class EquipmentConstantMeta
    {
        public ushort Ecid { get; set; }
        public string Name { get; set; }
        public byte Type { get; set; }      // static / dynamic
        public byte Access { get; set; }    // R / RW
        public byte DataType { get; set; }  // A, U2, F4...
        public byte Length { get; set; }
    }

    public enum EquipmentControlState
    {
        Offline,
        OnlineLocal,
        OnlineRemote
    }

    public enum EquipmentProcessState
    {
        Idle,
        Running,
        Aborted,
        Paused,
        Completed,
        Error
    }

    public enum SecsFormat
    {
        U1, U2, U4, I1, I2, I4, F4, F8, A, B
    }

    public enum PortState
    {
        Unknown,
        LoadReady,
        UnloadReady,
        Loading,
        Unloading,
        Processing,
        Completed,
        Error
    }

    public enum LoadState
    {
        Empty,
        Loading,
        Loaded,
        Unloading
    }

    public class GemResult
    {
        public bool Success { get; }
        public string ErrorCode { get; }
        public string Message { get; }

        public static GemResult Ok(string message = "") =>
            new GemResult(true, string.Empty, message);

        public static GemResult Fail(string errorCode, string message = "") =>
            new GemResult(false, errorCode, message);

        public GemResult(bool success, string errorCode, string message)
        {
            Success = success;
            ErrorCode = errorCode;
            Message = message;
        }

        public override string ToString() =>
            Success ? $"Success: {Message}" : $"Error[{ErrorCode}]: {Message}";
    }

    public class GemReportDefinition
    {
        public int ReportId { get; set; }         // RPTID (local mapping)
        public int Ceid { get; set; }             // CEID that triggers this report
        public List<string> Vids { get; set; } = new List<string>();
        public bool IsEnabled { get; set; } = true;
    }

    public class GemRecipeInfo
    {
        public string RecipeId { get; set; } = string.Empty;
        public long SizeBytes { get; set; }
        public string Checksum { get; set; } = string.Empty; // e.g. SHA256 hex
        public string Version { get; set; } = "1.0";
        public DateTime LastModifiedUtc { get; set; }
        public string Author { get; set; }
        public Byte[] Body { get; set; }

    }
}
