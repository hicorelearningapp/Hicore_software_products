using HSMSLib;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Threading.Tasks;

namespace GemManager
{
    public interface IEventReportComponet
    {
        bool LinkReport(uint ceid, uint rptid);
        void AssignVid(int rptid, int vid);

        IEnumerable<GemEvent> GetAllEvents();

        IEnumerable<int> GetReports(int ceid);
        IEnumerable<int> GetVids(int rptid);

        bool EnableEvent(uint ceid);
        bool DisableEvent(uint ceid);

        bool IsEventEnabled(uint ceid);

        bool IsEventKnown(uint ceid);


        // ---- S2F33 ----
        void DefineReport(uint rptid, IEnumerable<uint> vids);

    }

    public interface IGemCommunicationStateComponent
    {
        // Transport / protocol state (derived from HSMS)
        HsmsConnectionState HsmsState { get; }

        // GEM-level communication state (E30)
        GemCommunicationState GemCommState { get; }

        // Raised when either HSMS or GEM comm state changes
        event Action StateChanged;
    }



    public interface IEquipmentStateComponent
    {
        // ============================
        // Control HsmsInternalState (equipment driven, host influenced)
        // ============================
        EquipmentControlState ControlState { get; set; }

        // ============================
        // Process HsmsInternalState (equipment-owned)
        // ============================
        EquipmentProcessState ProcessState { get; set; }

        bool IsOnline { get; }
        bool IsRemote { get; }


        bool GoOnlineLocal();

        bool GoOnlineRemote();

        bool GoOffline();

        // ============================
        // Process control (explicit transitions)
        // ============================
        void StartProcess();
        void StopProcess();
        void AbortProcess();
        void PauseProcess();
        void ResumeProcess();

        // ============================
        // Events
        // ============================
        event Action StateChanged;
    }

    public interface IAlarmComponent
    {
        // Alarm database
        List<GemAlarm> GetAlarmList();

        GemAlarm GetAlarm(int alarmId);

        void SetAlarm(int alarmId);
        void ClearAlarm(int alarmId);

        // Notification → GEM
        event Action<GemAlarm> OnAlarmChanged;
    }

    public interface IVariableComponent
    {
        // Discovery
        List<GemVariable> GetAllVariables();

        // Read
        object GetVariable(uint vid);

        GemVariable GetGemVariable(uint vid);

        // Write
        void SetEquipmentConstant(uint ecid, object value); // Host → EC
        void UpdateStatusVariable(uint svid, object value); // Equipment → SV
        void SetDataVariable(uint dvid, object value);      // Equipment → DV

        // Change notification → GEM
        event Action<uint, object> OnVariableChanged;

        bool Exists(uint vid);

        void DefineLimits(DvLimitDefinition definition);

        IReadOnlyList<DvLimitDefinition> GetLimits(IEnumerable<uint> dvids);


    }

    public interface IEventComponent
    {
        // Supported CEIDs
        IEnumerable<GemEvent> GetDefinedEvents();
    }

    public interface IRecipeComponent
    {
        // ===============================
        // Recipe discovery
        // ===============================
        IReadOnlyList<string> GetRecipeList();

        bool Exists(string recipeId);

        // ===============================
        // Recipe data
        // ===============================
        byte[] GetRecipeBody(string recipeId);

        // ===============================
        // Recipe lifecycle
        // ===============================
        void CreateRecipe(string recipeId, byte[] initialBody);

        void StoreRecipe(string recipeId, byte[] body);

        void DeleteRecipe(string recipeId);

        // S7F5 / S7F6 (Equipment → Host)
        byte[] UploadRecipe(string recipeId);

        // S7F3 / S7F4 (Host → Equipment)
        void DownloadRecipe(string recipeId, byte[] body);

        // ===============================
        // Recipe selection
        // ===============================
        void SelectRecipe(string recipeId);

        string GetSelectedRecipe();

        // ===============================
        // Notifications (GUI / GEM)
        // ===============================
        event Action<string> RecipeCreated;
        event Action<string> RecipeStored;
        event Action<string> RecipeDeleted;
        event Action<string> SelectedRecipeChanged;
    }

    public interface ICarrierComponent
    {
        // Manual carrier support
        Dictionary<int, string> GetCarrierSlotMap();
        void SetCarrierSlot(int slot, string waferId);

        // Lot lifecycle
        void OnLotStart(string lotId, string operatorId);
        void OnLotEnd(string lotId);

        // Wafer lifecycle
        void OnWaferStart(string waferId, int slot);
        void OnWaferEnd(string waferId, int slot);
    }

    public interface IRemoteCommandComponent
    {
        IReadOnlyList<string> GetSupportedCommands();

        IReadOnlyList<string> GetEnhancedRemoteCommands();

        bool ExecuteCommand(
            string commandName,
            Dictionary<string, object> parameters
        );
    }

    public interface IDiagnosticComponent
    {
        double GetCpuUsage();
        double GetMemoryUsage();
        Dictionary<string, double> GetSystemTemperatures();
    }

    public interface IGemInterface
    {
        // ============================================================
        // Equipment identity & time (S1)
        // ============================================================
        string GetEquipmentId();
        string GetModelName();
        string GetSoftwareRevision();

        DateTime GetEquipmentTime();
        void SetEquipmentTime(DateTime time);

        // ============================================================
        // Capability access (Option-1 core)
        // ============================================================
        IEquipmentStateComponent EquipmentStateComponent { get; }
        IVariableComponent VariableComponent { get; }
        IAlarmComponent AlarmComponent { get; }
        IEventComponent EventComponent { get; }
        IRecipeComponent RecipeComponent { get; }
        ICarrierComponent CarrierComponent { get; }
        IRemoteCommandComponent RemoteCommandComponent { get; }
        IDiagnosticComponent DiagnosticComponent { get; }

        // ============================================================
        // Communication lifecycle (HSMS)
        // ============================================================
        void OnCommunicationEstablished();
        void OnCommunicationLost(string reason);
    }

}
