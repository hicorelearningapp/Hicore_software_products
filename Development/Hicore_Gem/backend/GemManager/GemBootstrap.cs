using GemManager.Interface;
using HSMSLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager
{

    public class SecsMessageRouter
    {
        private readonly GemCommandDispatcher _dispatcher;
        private readonly HsmsSessionManager _hsms;
        private readonly IGemFacade _runtime;

        public SecsMessageRouter(
            GemCommandDispatcher dispatcher,
            HsmsSessionManager hsms,
            IGemFacade runtime)
        {
            _dispatcher = dispatcher;
            _hsms = hsms;
            _runtime = runtime;
        }

        /// <summary>
        /// Routes an incoming SECS-II message from HSMS to the correct handler,
        /// builds a reply (if W-bit is set), and sends it back.
        /// </summary>
        public async Task RouteAsync(SecsMessage msg)
        {
            try
            {
                _runtime.Logger.Info($"[SECS RX] {msg}");

                // ------------------------------------------------------------
                // Build a minimal GEM command request (no parsing here)
                // ------------------------------------------------------------
                var req = new GemCommandRequest(
                    commandName: $"S{msg.Stream}F{msg.Function}",
                    stream: msg.Stream,
                    function: msg.Function,
                    transactionId: msg.TID,
                    hostId: "HOST", // Can be extended for multi-host systems
                    parameters: new Dictionary<string, object>(),
                    rawMessage: msg
                );

                // ------------------------------------------------------------
                // Execute handler
                // ------------------------------------------------------------
                GemCommandResult result = await _dispatcher.ProcessAsync(req);

                // ------------------------------------------------------------
                // No reply required (W-bit = 0)
                // ------------------------------------------------------------
                if (!msg.HasReply)
                {
                    _runtime.Logger.Debug("[NO REPLY] W-bit = 0");
                    return;
                }

                // ------------------------------------------------------------
                // Build reply SxF(y+1)
                // ------------------------------------------------------------
                SecsMessage reply = ReplyBuilder.Build(msg, result);

                // ------------------------------------------------------------
                // Send reply back to host
                // ------------------------------------------------------------
                await _hsms.SendAsync(reply);

                _runtime.Logger.Info($"[SECS TX] {reply}");
            }
            catch (Exception ex)
            {
                _runtime.Logger.Error("[ROUTER ERROR] Unexpected exception", ex);
            }
        }
    }


    public class GemCommandDispatcher
    {
        private readonly IGemHandlerFactory _factory;

        public GemCommandDispatcher(IGemHandlerFactory factory)
        {
            _factory = factory;
        }

        /// <summary>
        /// Finds the correct handler for the incoming GEM request and executes it.
        /// </summary>
        public async Task<GemCommandResult> ProcessAsync(GemCommandRequest request)
        {
            // 1️⃣ Get handler for SxFy
            IGemCommandHandler handler = _factory.CreateHandler(request.CommandName);

            // 2️⃣ Execute handler
            try
            {
                return await handler.ExecuteAsync(request);
            }
            catch (Exception ex)
            {
                // 3️⃣ Capture unexpected exceptions
                return GemCommandResult.Fail(
                    errorCode: "HANDLER_ERROR",
                    errorMessage: ex.Message
                );
            }
        }
    }

    public static class GemBootstrap
    {
        public static IGemFacade InitializeGemSystem()
        {
            // ----------------------------------------
            // 1. Build Logger
            // ----------------------------------------
            ILogger logger = new FileLogger("logs", LoggerLevel.Debug);

            // ----------------------------------------
            // 2. Build Services
            // ----------------------------------------
            var status = new StatusServiceSim();
            var commState = new CommunicationStateManager();
            var controlState = new ControlStateManagerSim();
            var alarms = new AlarmService();
            var events = new EventReportServiceSim();
            var commands = new RemoteCommandServiceSim();
            var recipes = new RecipeServiceSim();
            var vidProvider = new VidProviderSim();
            var equipment = new EquipmentAdapterSim();

            // ----------------------------------------
            // 3. Build HSMS Manager
            // ----------------------------------------
            var hsms = new HsmsSessionManager(); // your existing HSMS layer

            // ----------------------------------------
            // 4. Create GEM Engine (runtime facade)
            // ----------------------------------------
            var runtime = new GemEngine(
                hsms,
                status,
                commState,
                controlState,
                alarms,
                events,
                commands,
                recipes,
                vidProvider,
                equipment,
                logger
            );

            // ----------------------------------------
            // 5. Build handler factory
            // ----------------------------------------
            var handlerFactory = new SingletonGemHandlerFactory(runtime);

            // ----------------------------------------
            // 6. Build command dispatcher
            // ----------------------------------------
            var cmdDispatcher = new GemCommandDispatcher(handlerFactory);

            // ----------------------------------------
            // 7. Build router (HSMS → GEM)
            // ----------------------------------------
            var router = new SecsMessageRouter(cmdDispatcher, runtime.Hsms, runtime);

            // ----------------------------------------
            // 8. Connect HSMS MessageReceived → router
            // ----------------------------------------
            runtime.Hsms.OnMessageReceived += async msg =>
            {
                await router.RouteAsync(msg);
            };

            return runtime;
        }
    }

}
