using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Handlers
{
    public interface IRemoteCommandHandler
    {
        string CommandName { get; }

        /// <summary>
        /// Validate parameters only (no state change)
        /// </summary>
        bool Validate(
            IReadOnlyDictionary<string, object> parameters,
            out byte ackc5);

        /// <summary>
        /// Execute command
        /// </summary>
        bool Execute(
            IReadOnlyDictionary<string, object> parameters,
            out byte ackc5);
    }


    public interface IRemoteCommandComponent
    {
        IReadOnlyCollection<string> GetSupportedCommands();

        byte ExecuteCommand(
            string commandName,
            IReadOnlyDictionary<string, object> parameters);
    }

    public sealed class RemoteCommandComponent : IRemoteCommandComponent
    {
        private readonly Dictionary<string, IRemoteCommandHandler> _handlers =
            new Dictionary<string, IRemoteCommandHandler>();

        public void Register(IRemoteCommandHandler handler)
        {
            if (handler == null)
                throw new ArgumentNullException(nameof(handler));

            _handlers[handler.CommandName] = handler;
        }

        public IReadOnlyCollection<string> GetSupportedCommands()
            => _handlers.Keys.ToList();

        public byte ExecuteCommand(
            string commandName,
            IReadOnlyDictionary<string, object> parameters)
        {
            if (!_handlers.TryGetValue(commandName, out var handler))
                return 1; // ACKC5 = command not supported

            // 1️⃣ Validate
            if (!handler.Validate(parameters, out var ack))
                return ack;

            // 2️⃣ Execute
            if (!handler.Execute(parameters, out ack))
                return ack;

            return 0; // success
        }
    }
}
