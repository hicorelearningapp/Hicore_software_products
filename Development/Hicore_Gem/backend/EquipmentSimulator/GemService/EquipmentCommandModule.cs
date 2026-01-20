using GemManager;
using GemManager.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EquipmentSimulator.GemService
{
    public sealed class EquipmentCommandModule : IEquipmentCommandModule
    {
        private readonly GemInterface _equipment;

        public EquipmentCommandModule(GemInterface equipment)
        {
            _equipment = equipment;
        }

        public void Register(IRemoteCommandService remoteCommandService)
        {
            remoteCommandService.RegisterHandler(
                new PpSelectCommandHandler(_equipment.RecipeComponent));

            remoteCommandService.RegisterHandler(new PpSelectCommandHandler(_equipment.RecipeComponent));
            remoteCommandService.RegisterHandler(new PpStartCommandHandler(_equipment.EquipmentStateComponent));
            remoteCommandService.RegisterHandler(new PpStopCommandHandler(_equipment.EquipmentStateComponent));
            remoteCommandService.RegisterHandler(new RemoteCommandHandler(_equipment.EquipmentStateComponent));
            remoteCommandService.RegisterHandler(new LocalCommandHandler(_equipment.EquipmentStateComponent));
            remoteCommandService.RegisterHandler(new PauseCommandHandler(_equipment.EquipmentStateComponent));
            remoteCommandService.RegisterHandler(new ResumeCommandHandler(_equipment.EquipmentStateComponent));
            remoteCommandService.RegisterHandler(new AbortCommandHandler(_equipment.EquipmentStateComponent));
            remoteCommandService.RegisterHandler(new ClearAlarmsCommandHandler(_equipment.AlarmComponent));

        }
    }
}
