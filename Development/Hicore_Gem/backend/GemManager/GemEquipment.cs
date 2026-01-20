
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager
{
    public partial class GemEquipment : IGemEquipmentApi
    {
        public void ClearAlarm(int alarmId)
        {
            throw new NotImplementedException();
        }

        public void NotifyVariableChanged(string vid, object value)
        {
            throw new NotImplementedException();
        }

        public void OnCarrierLoaded(string carrierId)
        {
            throw new NotImplementedException();
        }

        public void OnCarrierUnloaded(string carrierId)
        {
            throw new NotImplementedException();
        }

        public void OnRecipeCompleted(string recipeId)
        {
            throw new NotImplementedException();
        }

        public void OnRecipeSelected(string recipeId)
        {
            throw new NotImplementedException();
        }

        public void OnRecipeStarted(string recipeId)
        {
            throw new NotImplementedException();
        }

        public void OnWaferEnd(string waferId, int slot)
        {
            throw new NotImplementedException();
        }

        public void OnWaferStart(string waferId, int slot)
        {
            throw new NotImplementedException();
        }

        public void RaiseAlarm(int alarmId, string description)
        {
            throw new NotImplementedException();
        }

        public void ReportCommandComplete(string commandName, bool success, string message)
        {
            throw new NotImplementedException();
        }

        public void SendEvent(int ceid, Dictionary<string, object> reportData)
        {
            throw new NotImplementedException();
        }

        public void SetControlState(EquipmentControlState state)
        {
            throw new NotImplementedException();
        }

        public void SetProcessState(EquipmentProcessState state)
        {
            throw new NotImplementedException();
        }

        public void UpdateClock(DateTime newTime)
        {
            throw new NotImplementedException();
        }

        public void UpdateCpuUsage(double cpuPercent)
        {
            throw new NotImplementedException();
        }

        public void UpdateMemoryUsage(double memoryPercent)
        {
            throw new NotImplementedException();
        }

        public void UpdateTemperature(string sensorName, double tempCelsius)
        {
            throw new NotImplementedException();
        }
    }
}
