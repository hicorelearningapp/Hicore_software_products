using GemManager;
using GemManager.Handlers;
using System.Collections.Generic;


namespace EquipmentSimulator
{
    public sealed class ResumeCommandHandler : IRemoteCommandHandler
    {
        private readonly IEquipmentStateComponent _state;

        public ResumeCommandHandler(IEquipmentStateComponent state)
        {
            _state = state;
        }

        public string CommandName => "RESUME";

        public bool Validate(IReadOnlyDictionary<string, object> parameters, out byte ack)
        {
            ack = 0;
            if (_state.ProcessState != EquipmentProcessState.Paused)
            {
                ack = 3;
                return false;
            }
            return true;
        }

        public bool Execute(IReadOnlyDictionary<string, object> parameters, out byte ack)
        {
            ack = 0;
            _state.ResumeProcess();
            return true;
        }
    }
}
