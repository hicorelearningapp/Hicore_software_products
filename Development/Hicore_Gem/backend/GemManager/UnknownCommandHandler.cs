using System.Threading.Tasks;

namespace GemManager
{
    public class UnknownCommandHandler : GemCommandHandler
    {
        private readonly string _cmd;

        public override string CommandName => _cmd;

        public UnknownCommandHandler(string commandName, IGemFacade runtime)
            : base(runtime)
        {
            _cmd = commandName;
        }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            // Log error
          //    Runtime.Logger.Warn($"Unknown GEM command received: {_cmd}");

            // GEM-compliant return structure (SxFy reply builder will convert this)
            return Task.FromResult(
                GemCommandResult.Fail(
                    errorCode: "UNSUPPORTED_FUNCTION",
                    errorMessage: $"Command '{_cmd}' is not implemented."
                )
            );
        }
    }
}
