using GemManager;
using GemManager.Handlers;
using System.Collections.Generic;


namespace EquipmentSimulator
{
    public sealed class AbortCommandHandler : IRemoteCommandHandler
    {
        private readonly IEquipmentStateComponent _state;

        public AbortCommandHandler(IEquipmentStateComponent state)
        {
            _state = state;
        }

        public string CommandName => "ABORT";

        public bool Validate(IReadOnlyDictionary<string, object> parameters, out byte ack)
        {
            ack = 0;
            return true;
        }

        public bool Execute(IReadOnlyDictionary<string, object> parameters, out byte ack)
        {
            ack = 0;
            _state.AbortProcess();
            return true;
        }
    }
}
