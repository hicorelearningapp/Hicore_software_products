using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager
{
    /// <summary>
    /// Equipment → GEM Engine API.
    /// This interface is implemented by the Equipment Software.
    /// GEM Engine calls these to retrieve values,
    /// and Equipment calls these to notify GEM of changes.
    ///
    /// Every method is mapped to a SECS-II Stream/Function or CEID.
    /// </summary>
    public interface IGemEquipmentApi
    {
        // ============================================================
        // 1. ALARMS (S5 STREAM)
        // ============================================================

        /// <summary>
        /// Raise an alarm → GEM sends S5F1 Alarm Report (A).
        /// CEID: ALARM_SET
        /// </summary>
        void RaiseAlarm(int alarmId, string description);

        /// <summary>
        /// Clear an alarm → GEM sends S5F1 Alarm Report (cleared).
        /// CEID: ALARM_CLEAR
        /// </summary>
        void ClearAlarm(int alarmId);


        // ============================================================
        // 2. EVENTS & REPORTS (S6F11)
        // ============================================================

        /// <summary>
        /// Trigger CEID event → GEM sends S6F11 Event Report.
        /// </summary>
        /// <param name="ceid">Collection Event ID.</param>
        /// <param name="reportData">Map of VID/value pairs.</param>
        void SendEvent(int ceid, Dictionary<string, object> reportData);


        // ============================================================
        // 3. VARIABLES (S1/S2)
        // ============================================================

        /// <summary>
        /// Equipment notifies GEM that a variable changed.
        /// GEM will check if variable is linked to CEIDs
        /// and trigger S6F11 events if required.
        /// </summary>
        void NotifyVariableChanged(string vid, object value);


        // ============================================================
        // 4. CONTROL STATE (LOCAL/REMOTE/HOST)
        // ============================================================

        /// <summary>
        /// Set equipment control state.
        /// CEID: CONTROL_STATE_CHANGED.
        /// </summary>
        void SetControlState(EquipmentControlState state);


        // ============================================================
        // 5. PROCESS STATE (IDLE/RUNNING/PAUSED)
        // ============================================================

        /// <summary>
        /// Update process state.
        /// CEID: PROCESS_STATE_CHANGED.
        /// </summary>
        void SetProcessState(EquipmentProcessState state);


        // ============================================================
        // 6. REMOTE COMMAND COMPLETION (S2F42)
        // ============================================================

        /// <summary>
        /// Report completion of an S2F41 Remote Command.
        /// GEM sends S2F42 with success or failure status.
        /// </summary>
        void ReportCommandComplete(string commandName, bool success, string message);


        // ============================================================
        // 7. RECIPE NOTIFICATIONS (S7 STREAM)
        // ============================================================

        /// <summary>
        /// Notify GEM that a recipe has been selected.
        /// CEID: PP_SELECTED.
        /// </summary>
        void OnRecipeSelected(string recipeId);

        /// <summary>
        /// Notify GEM of process start for the selected recipe.
        /// CEID: PROCESS_START.
        /// </summary>
        void OnRecipeStarted(string recipeId);

        /// <summary>
        /// Notify GEM that recipe execution completed.
        /// CEID: PROCESS_COMPLETE.
        /// </summary>
        void OnRecipeCompleted(string recipeId);


        // ============================================================
        // 8. CARRIER / WAFER HANDLING (200mm/300mm)
        // ============================================================

        /// <summary>
        /// Carrier loaded on equipment.
        /// CEID: CARRIER_LOAD.
        /// </summary>
        void OnCarrierLoaded(string carrierId);

        /// <summary>
        /// Carrier unloaded.
        /// CEID: CARRIER_UNLOAD.
        /// </summary>
        void OnCarrierUnloaded(string carrierId);

        /// <summary>
        /// Wafer processing started.
        /// CEID: WAFER_START.
        /// </summary>
        void OnWaferStart(string waferId, int slot);

        /// <summary>
        /// Wafer processing completed.
        /// CEID: WAFER_END.
        /// </summary>
        void OnWaferEnd(string waferId, int slot);


        // ============================================================
        // 9. TIME SYNCHRONIZATION (S2F31)
        // ============================================================

        /// <summary>
        /// Update equipment clock after host sends S2F31.
        /// </summary>
        void UpdateClock(DateTime newTime);


        // ============================================================
        // 10. DIAGNOSTICS (OPTIONAL – CEID-BASED)
        // ============================================================

        /// <summary>
        /// Report CPU usage (%). If linked to CEID,
        /// GEM sends S6F11.
        /// </summary>
        void UpdateCpuUsage(double cpuPercent);

        /// <summary>
        /// Report memory usage (%).
        /// </summary>
        void UpdateMemoryUsage(double memoryPercent);

        /// <summary>
        /// Update temperature of internal module/sensor.
        /// CEID: TEMP_UPDATE.
        /// </summary>
        void UpdateTemperature(string sensorName, double tempCelsius);
    }
}

