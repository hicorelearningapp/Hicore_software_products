using GemManager;
using GemManager.Handlers;
using System.Collections.Generic;


namespace EquipmentSimulator
{
    public sealed class RemoteCommandHandler : IRemoteCommandHandler
    {
        private readonly IEquipmentStateComponent _state;

        public RemoteCommandHandler(IEquipmentStateComponent state)
        {
            _state = state;
        }

        public string CommandName => "REMOTE";

        public bool Validate(IReadOnlyDictionary<string, object> parameters, out byte ack)
        {
            ack = 0;
            return true;
        }

        public bool Execute(IReadOnlyDictionary<string, object> parameters, out byte ack)
        {
            ack = 0;
            _state.ControlState = EquipmentControlState.OnlineRemote;
            return true;
        }
    }
}
