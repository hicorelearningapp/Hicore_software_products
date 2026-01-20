using EquipmentSimulator.Config;
using EquipmentSimulator.ViewModel;
using GemManager;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;


namespace EquipmentSimulator
{
    public class RemoteCommandComponent : IRemoteCommandComponent
    {
        private readonly List<string> _remotecommands =
            new List<string>();

        private readonly List<string> _enhancedremotecommands =
            new List<string>();


        public void LoadFromConfig(EquipmentConfig config)
        {
            _remotecommands.Clear();

            foreach (var cmd in config.SupportedCommands)
                _remotecommands.Add(cmd);
        }

        public IReadOnlyList<string> GetSupportedCommands()
        {
            return _remotecommands.AsReadOnly();
        }

        public IReadOnlyList<string> GetEn()
        {
            return _remotecommands.AsReadOnly();
        }


        public bool IsSupported(string commandName)
        {
            return _remotecommands.Any(c =>
                string.Equals(c, commandName,
                    StringComparison.OrdinalIgnoreCase));
        }

        public bool ExecuteCommand(string commandName, Dictionary<string, object> parameters)
        {
            return true;
        }

        public IReadOnlyList<string> GetEnhancedRemoteCommands()
        {
            return _enhancedremotecommands.AsReadOnly();
        }
    }
}
