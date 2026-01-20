using GemManager;
using GemManager.Handlers;
using System.Collections.Generic;


namespace EquipmentSimulator
{
    public sealed class SpoolingCommandHandler : IRemoteCommandHandler
    {
        private readonly ISpoolingService _spooling;

        public SpoolingCommandHandler(ISpoolingService spooling)
        {
            _spooling = spooling;
        }

        public string CommandName => "SPOOLING";

        public bool Validate(
            IReadOnlyDictionary<string, object> parameters,
            out byte ack)
        {
            ack = 0;

            if (!parameters.ContainsKey("ENABLE"))
            {
                ack = 2;
                return false;
            }

            return true;
        }

        public bool Execute(
            IReadOnlyDictionary<string, object> parameters,
            out byte ack)
        {
            ack = 0;

            bool enable =
                parameters["ENABLE"] is bool b ? b :
                ((byte)parameters["ENABLE"] == 1);

            _spooling.SetEnabled(enable);
            return true;
        }
    }
    

}
