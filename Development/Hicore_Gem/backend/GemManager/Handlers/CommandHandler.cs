using System.Threading.Tasks;

namespace GemManager
{
    public interface IGemCommandHandler
    {
        string CommandName { get; }
        Task<GemCommandResult> ExecuteAsync(GemCommandRequest req);
    }

    public abstract class GemCommandHandler : IGemCommandHandler
    {
        public abstract string CommandName { get; }

        protected readonly IGemFacade Runtime;

        protected GemCommandHandler(IGemFacade runtime)
        {
            Runtime = runtime;
        }

        public abstract Task<GemCommandResult> ExecuteAsync(GemCommandRequest req);
    }
}
