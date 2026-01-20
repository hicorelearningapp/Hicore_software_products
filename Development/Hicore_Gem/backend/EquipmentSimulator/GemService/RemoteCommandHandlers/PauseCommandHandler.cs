using GemManager;
using GemManager.Handlers;
using System.Collections.Generic;


namespace EquipmentSimulator
{
    public sealed class PauseCommandHandler : IRemoteCommandHandler
    {
        private readonly IEquipmentStateComponent _state;

        public PauseCommandHandler(IEquipmentStateComponent state)
        {
            _state = state;
        }

        public string CommandName => "PAUSE";

        public bool Validate(IReadOnlyDictionary<string, object> parameters, out byte ack)
        {
            ack = 0;
            if (_state.ProcessState != EquipmentProcessState.Running)
            {
                ack = 3;
                return false;
            }
            return true;
        }

        public bool Execute(IReadOnlyDictionary<string, object> parameters, out byte ack)
        {
            ack = 0;
            _state.PauseProcess();
            return true;
        }
    }
}
