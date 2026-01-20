using System;
using HSMSLib;
using GemManager.Interface;
using GemManager.Service;

namespace GemManager
{

    public class GemEngine : IGemFacade
    {
        // -------------------------
        // Core dependencies
        // -------------------------
        public HsmsEntity Hsms { get; }

        public SecsMessageDispatcher Dispatcher { get; private set; }

        public ISecsEndpoint SecsEndpoint { get; }

        public IGemInterface Equipment { get; }

        public ILogger Logger { get; }


        // -------------------------
        // GEM services
        // -------------------------
        public IStatusService StatusService { get; }
        public ICommunicationStateManager CommStateManager { get; }
        public IAlarmService AlarmService { get; }
        public IEventReportService EventReportService { get; }
        public IRemoteCommandHistoryService RemoteCommandHistoryService { get; }
        public IRemoteCommandService RemoteCommandService { get; }
        public IRecipeService Recipes { get; }
        public IDataCollectionState DataCollectionState { get; }
        public IMaterialService MaterialService { get; }
        public ITimeService TimeService { get; }
        public ITerminalService TerminalService { get; }
        public ISpoolingService SpoolService { get; }
        public ITraceService TraceService { get; }

        public bool IsBusy { get; private set; }

        public bool IsCommunicating => CommStateManager.IsCommunicating;
       
     
        // -------------------------
        // Ctor (Equipment-side GEM)
        // -------------------------
        public GemEngine(PassiveEntityConfig config, IGemInterface equipment)
        {
            Equipment = equipment;

            // Equipment GEM owns HSMS Passive
            Hsms = new PassiveHsmsEntity(config.HostName, config.Port);

            Logger = new FileLogger();

            StatusService = new StatusService(this,equipment, Logger);

            CommStateManager = new CommunicationStateManager(Hsms, Equipment);

            DataCollectionState = new DataCollectionState();

            AlarmService = new AlarmService(this,equipment, Logger);
            EventReportService = new EventReportService(this,equipment, StatusService);

            RemoteCommandHistoryService = new RemoteCommandHistoryService();

            RemoteCommandService = new RemoteCommandService(Equipment.EquipmentStateComponent, RemoteCommandHistoryService);

            Recipes = new RecipeService(equipment, Logger);
            MaterialService = new MaterialService();
            TimeService = new TimeService();
            TerminalService = new TerminalService();

            SpoolService = new SpoolingService(Hsms);
            TraceService = new TraceService(this,Equipment.VariableComponent, Logger);

            SecsEndpoint = new SecsAdapter(Hsms, new SecsMessageLogger());

            IsBusy = true;
        }

        // -------------------------
        // Start GEM server
        // -------------------------
        public virtual bool StartServer()
        {
            Logger.Info("Starting GEM Engine...");

            // Build dispatcher
            var handlerFactory = new SingletonGemHandlerFactory(this);
            var cmdDispatcher = new GemCommandDispatcher(handlerFactory);
            var parserFactory = new GemCommandParserFactory();

            Dispatcher = new SecsMessageDispatcher(
                this,
                Logger,
                cmdDispatcher,
                parserFactory);

            SecsEndpoint.SecsMessageReceived += msg =>
                SecsMessageReceived?.Invoke(msg);

            SecsEndpoint.SecsMessageSent += msg =>
                SecsMessageSent?.Invoke(msg);

            SecsEndpoint.SecsMessageReceived += async msg =>
            {
                SecsMessage reply = await Dispatcher.HandleAsync(msg);

                if (reply != null)
                {
                    reply.SentAt = DateTimeOffset.UtcNow;
                    SendSecsMessage(reply); // internal
                }
            };

            Hsms.Start();

            Logger.Info("GEM Engine started.");
            return true;
        }

        // -------------------------
        // Stop GEM server
        // -------------------------
        public virtual bool StopServer()
        {
            SecsEndpoint.Cleanup();
            Hsms.Stop();
            Logger.Info("GEM Engine stopped.");
            return true;
        }

        public void SendSecsMessage(SecsMessage msg)
        {
            SecsEndpoint.SendMessage(
                (byte)msg.Stream,
                (byte)msg.Function,
                msg.Header.IsWaitBitSet,
                msg.Body,
                "");
        }

        public void SendMessage(byte stream, byte function, bool waitBit, SecsItem body, string messageName = "")
        {
            SecsEndpoint.SendMessage(
                stream,
                function,
                waitBit,
                body,
                messageName);
        }

        public event Action<SecsMessage> SecsMessageReceived;
        public event Action<SecsMessage> SecsMessageSent;
    }
}


