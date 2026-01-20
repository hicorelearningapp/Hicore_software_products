
using System;
using GemManager.Interface;
using GemManager.Service;
using HSMSLib;

namespace GemManager
{
    public interface IGemFacade
    {
        // ============================================================
        // 1. HSMS SESSION MANAGER
        // ============================================================
        /// <summary>
        /// Underlying HSMS entity (Active or Passive).
        /// Handles HSMS connection, select, deselect, timers, sending/receiving.
        /// </summary>
        //      HsmsEntity Hsms { get; }

        /// <summary>
        /// Responsible for routing incoming SECS messages → GEM handlers.
        /// </summary>
        //   SecsMessageDispatcher Dispatcher { get; }

     //    ISecsEndpoint SecsEndpoint { get; }


        // ============================================================
        // 2. GEM CORE SERVICES
        // ============================================================

        /// <summary>
        /// SVID / VID Status variables (S1F3, S1F11, etc.)
        /// </summary>
        IStatusService StatusService { get; }

        /// <summary>
        /// GEM Communication EquipmentStateComponent (Offline, Online Local, Online Remote)
        /// Managed through S1F17, S1F15, S1F1 responses.
        /// </summary>
        ICommunicationStateManager CommStateManager { get; }

        /// <summary>
        /// Alarm Service 
        /// </summary>
        IAlarmService AlarmService { get; }

        IDataCollectionState DataCollectionState { get; }


        /// <summary>
        /// GEM Event / Report system (CEID → RPTID → VIDs)
        /// </summary>
        IEventReportService EventReportService { get; }

        /// <summary>
        /// Remote command system for S2F41/S2F42.
        /// </summary>
        IRemoteCommandService RemoteCommandService { get; }

        /// <summary>
        /// GEM Recipe service (Upload/Download/List/Delete)
        /// </summary>
        IRecipeService Recipes { get; }

        // ============================================================
        // 3. EQUIPMENT IMPLEMENTATION (OEM PROVIDES THIS)
        // ============================================================

        /// <summary>
        /// The physical equipment API implementation.
        /// GEM uses this to call into the real machine.
        /// </summary>
        IGemInterface Equipment { get; }

        // ============================================================
        // 4. LOGGER
        // ============================================================

        ILogger Logger { get; }

        /// <summary>
        /// StartServer Communication
        /// </summary>
        /// <returns></returns>
        /// 
        IMaterialService MaterialService { get; }

        /// <summary>
        /// TimeService
        /// </summary>
        ITimeService TimeService { get; }

        /// <summary>
        /// TerminalService
        /// </summary>
        ITerminalService TerminalService { get; }

        /// <summary>
        /// SpoolService
        /// </summary>
        ISpoolingService SpoolService { get; }


        /// <summary>
        /// 
        /// </summary>
        IRemoteCommandHistoryService RemoteCommandHistoryService { get; }

        /// <summary>
        /// 
        /// </summary>
        ITraceService TraceService { get; }


        /// <summary>
        /// IsBusy
        /// </summary>
        bool IsBusy { get; }


        /// <summary>
        /// IsCommunicating
        /// </summary>

        bool IsCommunicating { get; }


        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        bool StartServer();

        /// <summary>
        /// StopServer
        /// </summary>
        /// <returns></returns>
        bool StopServer();


        void SendSecsMessage(SecsMessage msg);

        void SendMessage(byte stream, byte function, bool waitBit, SecsItem body, string messageName = "");

        event Action<SecsMessage> SecsMessageReceived;
        event Action<SecsMessage> SecsMessageSent;
    }
}
    

