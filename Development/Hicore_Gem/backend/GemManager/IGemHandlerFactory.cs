namespace GemManager
{
    public interface IGemHandlerFactory
    {
        /// <summary>
        /// Creates or retrieves a command handler for a given GEM command.
        /// </summary>
        IGemCommandHandler CreateHandler(string commandName);

        /// <summary>
        /// Registers or overrides a handler (usually equipment side).
        /// </summary>
        void RegisterOverride(IGemCommandHandler handler);
    }
}
