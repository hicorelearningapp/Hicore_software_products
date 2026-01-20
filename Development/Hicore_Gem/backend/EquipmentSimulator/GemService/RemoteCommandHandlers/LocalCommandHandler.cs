using GemManager;
using GemManager.Handlers;
using System.Collections.Generic;


namespace EquipmentSimulator
{
    public sealed class LocalCommandHandler : IRemoteCommandHandler
    {
        private readonly IEquipmentStateComponent _state;

        public LocalCommandHandler(IEquipmentStateComponent state)
        {
            _state = state;
        }

        public string CommandName => "LOCAL";

        public bool Validate(IReadOnlyDictionary<string, object> parameters, out byte ack)
        {
            ack = 0;
            return true;
        }

        public bool Execute(IReadOnlyDictionary<string, object> parameters, out byte ack)
        {
            ack = 0;
            _state.ControlState = EquipmentControlState.OnlineLocal;
            return true;
        }
    }
}
