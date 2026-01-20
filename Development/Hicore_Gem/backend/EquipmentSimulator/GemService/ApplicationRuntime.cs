using GemManager;
using GemManager.Interface;
using HSMSLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EquipmentSimulator.GemService
{
    public interface IApplicationRuntime
    {
        IGemFacade Gem { get; }
    }


    public class ApplicationRuntime : IApplicationRuntime
    {
        public IGemFacade Gem { get; }

        public ApplicationRuntime()
        {
            var equipment = new GemInterface();
            var config = new PassiveEntityConfig();
            var gemEngine = new GemEngine(config, equipment);

            IEquipmentCommandModule commandModule = new EquipmentCommandModule(equipment);

            commandModule.Register(gemEngine.RemoteCommandService);

            Gem = gemEngine;
        }
    }
}
