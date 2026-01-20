using System;
using System.Threading.Tasks;

namespace GemManager
{
    public class GemCommandDispatcher
    {
        private readonly IGemHandlerFactory _factory;

        public GemCommandDispatcher(IGemHandlerFactory factory)
        {
            _factory = factory;
        }

        /// <summary>
        /// Uses the handler factory to find the correct SxFy handler,
        /// executes it, and returns the GemCommandResult.
        /// </summary>
        public async Task<GemCommandResult> ProcessAsync(GemCommandRequest request)
        {
            try
            {
                // 1️⃣ Find correct handler (ex: S1F1 → S1F1Handler)
                IGemCommandHandler handler = _factory.CreateHandler(request.CommandName);

                // 2️⃣ Execute handler
                return await handler.ExecuteAsync(request);
            }
            catch (Exception ex)
            {
                // 3️⃣ Catch unexpected errors and return GEM-friendly failure
                return GemCommandResult.Fail(
                    errorCode: "HANDLER_EXCEPTION",
                    errorMessage: ex.Message
                );
            }
        }
    }
}
