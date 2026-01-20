using System.Collections.Generic;
using GemManager;


namespace EquipmentSimulator
{
    public class DiagnosticsComponent : IDiagnosticComponent
    {
        public double GetCpuUsage() => 12.5;
        public double GetMemoryUsage() => 38.2;

        public Dictionary<string, double> GetSystemTemperatures()
        {
            return new Dictionary<string, double>
        {
            { "Chamber1", 65.0 },
            { "Chamber2", 67.2 },
            { "Robot", 45.0 }
        };
        }
    }
}
