using GemManager;
using GemManager.Handlers;
using System.Collections.Generic;


namespace EquipmentSimulator
{
    public sealed class PpStopCommandHandler : IRemoteCommandHandler
    {
        private readonly IEquipmentStateComponent _state;

        public PpStopCommandHandler(IEquipmentStateComponent state)
        {
            _state = state;
        }

        public string CommandName => "PPSTOP";

        public bool Validate(IReadOnlyDictionary<string, object> parameters, out byte ack)
        {
            ack = 0;
            return true;
        }

        public bool Execute(IReadOnlyDictionary<string, object> parameters, out byte ack)
        {
            ack = 0;
            _state.StopProcess();
            return true;
        }
    }
}
