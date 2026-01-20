using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Interface
{
    public enum ControlState
    {
        Local = 0,     // Operator control - Host commands rejected
        Remote = 1,    // Host control allowed
        Offline = 2    // No host control / offline maintenance
    }

    public enum EquipmentState
    {
        Unknown = 0,
        Idle = 1,          // Not processing, ready
        Ready = 2,         // Fully ready for a new command
        Setup = 3,         // Setting recipe, preparing
        Executing = 4,     // Running process
        Paused = 5,        // Paused mid-process
        Stopped = 6,       // Stopped/aborted
        Error = 7,         // Alarm state
        Maintenance = 8    // Under maintenance / not available
    }

    public enum ProcessState
    {
        NotProcessing = 0,
        RecipeSelected = 1,
        Loading = 2,
        Loaded = 3,
        Processing = 4,
        Unloading = 5,
        Completed = 6,
        Aborted = 7,
        Failed = 8
    }

    public interface IEquipmentCommandModule
    {
        void Register(IRemoteCommandService remoteCommandService);
    }

    public sealed class EnhancedRemoteCommand
    {
        public string Command { get; set; }
        public List<EnhancedCommandParameter> Parameters { get; set; } =
            new List<EnhancedCommandParameter>();
    }

    public sealed class EnhancedCommandParameter
    {
        public string Name { get; set; }
        public string DataType { get; set; }   // "U4", "I4", "F4", "A", etc.
        public bool Required { get; set; }
        public object Default { get; set; }
        public object Min { get; set; }
        public object Max { get; set; }
    }


}
