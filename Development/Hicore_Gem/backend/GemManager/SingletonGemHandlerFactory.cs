using GemManager.Handlers;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GemManager
{
    public class SingletonGemHandlerFactory : IGemHandlerFactory
    {
        private readonly Dictionary<string, IGemCommandHandler> _handlers =
            new Dictionary<string, IGemCommandHandler>();

        private readonly IGemFacade _runtime;

        public SingletonGemHandlerFactory(IGemFacade runtime)
        {
            _runtime = runtime;

            // =========================================================
            //  STREAM 1 — Equipment / Communication
            // =========================================================
            _handlers["S1F1"] = new S1F1Handler(runtime);
            _handlers["S1F3"] = new S1F3Handler(runtime);
           //  _handlers["S1F5"] = new S1F5Handler(runtime);
            _handlers["S1F11"] = new S1F11Handler(runtime);
            _handlers["S1F13"] = new S1F13Handler(runtime);
            _handlers["S1F15"] = new S1F15Handler(runtime);
            _handlers["S1F17"] = new S1F17Handler(runtime);

            // =========================================================
            //  STREAM 2 — Variable, EC, Time, Remote Command
            // =========================================================
            _handlers["S2F1"]  = new S2F1Handler(runtime);
            _handlers["S2F3"]  = new S2F3Handler(runtime);
            _handlers["S2F5"]  = new S2F5Handler(runtime);
            _handlers["S2F7"]  = new S2F7Handler(runtime);
            _handlers["S2F13"] = new S2F13Handler(runtime);
            _handlers["S2F15"] = new S2F15Handler(runtime);
            _handlers["S2F17"] = new S2F17Handler(runtime);
            _handlers["S2F21"] = new S2F21Handler(runtime);
            _handlers["S2F23"] = new S2F23Handler(runtime);
            _handlers["S2F29"] = new S2F29Handler(runtime);
            _handlers["S2F31"] = new S2F31Handler(runtime);
            _handlers["S2F33"] = new S2F33Handler(runtime);
            _handlers["S2F35"] = new S2F35Handler(runtime);
            _handlers["S2F37"] = new S2F37Handler(runtime);

            _handlers["S2F39"] = new S2F39Handler(runtime);


            _handlers["S2F41"] = new S2F41Handler(runtime);
            _handlers["S2F43"] = new S2F43Handler(runtime);
            _handlers["S2F45"] = new S2F45Handler(runtime);
            _handlers["S2F47"] = new S2F47Handler(runtime);


            

            _handlers["S3F1"] = new S3F1Handler(runtime);
            _handlers["S3F3"] = new S3F3Handler(runtime);
            _handlers["S3F5"] = new S3F5Handler(runtime);

            // =========================================================
            //  STREAM 5 — AlarmService
            // =========================================================
            _handlers["S5F1"] = new S5F1Handler(runtime);
            _handlers["S5F3"] = new S5F3Handler(runtime);
            _handlers["S5F5"] = new S5F5Handler(runtime);

            // =========================================================
            //  STREAM 6 — EventReportService / Reports / Trace
            // =========================================================
            _handlers["S6F1"] = new S6F1Handler(runtime);
            _handlers["S6F3"] = new S6F3Handler(runtime);
            _handlers["S6F5"] = new S6F5Handler(runtime);

            _handlers["S6F11"] = new S6F11Handler(runtime);


            


            _handlers["S6F13"] = new S6F13Handler(runtime);
            _handlers["S6F15"] = new S6F15Handler(runtime);
            _handlers["S6F17"] = new S6F17Handler(runtime);
            _handlers["S6F19"] = new S6F19Handler(runtime);
            _handlers["S6F23"] = new S6F23Handler(runtime);

            // =========================================================
            //  STREAM 7 — RecipeComponent
            // =========================================================
            _handlers["S7F1"] = new S7F1Handler(runtime);
            _handlers["S7F3"] = new S7F3Handler(runtime);
            _handlers["S7F5"] = new S7F5Handler(runtime);
            _handlers["S7F17"] = new S7F17Handler(runtime);
            _handlers["S7F19"] = new S7F19Handler(runtime);


            _handlers["S10F1"] = new S10F1Handler(runtime);
            _handlers["S10F3"] = new S10F3Handler(runtime);


            _handlers["S12F1"] = new S12F1Handler(runtime);

        }

        public IGemCommandHandler CreateHandler(string commandName)
        {
            if (_handlers.TryGetValue(commandName, out var handler))
                return handler;

            return new UnknownCommandHandler(commandName, _runtime);
        }

        // Equipment override support
        public void RegisterOverride(IGemCommandHandler handler)
        {
            _handlers[handler.CommandName] = handler;
        }
    }
}
