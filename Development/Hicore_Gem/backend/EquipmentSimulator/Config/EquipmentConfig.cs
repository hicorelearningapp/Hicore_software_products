using GemManager;

using GemManager.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EquipmentSimulator.Config
{
    public class EquipmentConfig
    {
        public string EquipmentId { get; set; }
        public string ModelName { get; set; }
        public string SoftwareRevision { get; set; }

        public string ControlState { get; set; }
        public string ProcessState { get; set; }

        public double CpuUsage { get; set; }
        public double MemoryUsage { get; set; }

        public Dictionary<string, double> Temperatures { get; set; }
        public Dictionary<string, object> Variables { get; set; }

        public List<EquipmentConstantConfig> EquipmentConstants { get; set; }

        public List<StatusVariableConfig> StatusVariables { get; set; }

        public List<DataVariableConfig> DataVariables { get; set; }

        public List<GemAlarm> Alarms { get; set; }
        public List<GemRecipeInfo> Recipes { get; set; }

        public List<int> SupportedEvents { get; set; }
        public List<string> SupportedCommands { get; set; }

        public Dictionary<int, string> CarrierSlotMap { get; set; }
    }

}
