using GemManager;
using GemManager.Handlers;
using System.Collections.Generic;


namespace EquipmentSimulator
{
    public class PpStartCommandHandler : IRemoteCommandHandler
    {
        private readonly IEquipmentStateComponent _state;

        public PpStartCommandHandler(IEquipmentStateComponent state)
        {
            _state = state;
        }

        public string CommandName => "PPSTART";

        public bool Validate(IReadOnlyDictionary<string, object> parameters, out byte ack)
        {
            ack = 0;
            if (_state.ProcessState == EquipmentProcessState.Running)
            {
                ack = 3; // cannot perform now
                return false;
            }
            return true;
        }

        public bool Execute(IReadOnlyDictionary<string, object> parameters, out byte ack)
        {
            ack = 0;
            _state.StartProcess();
            return true;
        }
    }
}
