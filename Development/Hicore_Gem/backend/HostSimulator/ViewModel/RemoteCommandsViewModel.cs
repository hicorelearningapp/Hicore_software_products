using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace HostSimulator.ViewModel
{
    public class RemoteCommandsViewModel : BaseViewModel
    {
        public ObservableCollection<string> EquipmentCommands { get; }
        public ObservableCollection<string> RecipeCommands { get; }
        public ObservableCollection<string> MaterialCommands { get; }
        public ObservableCollection<string> MaintenanceCommands { get; }

        public ICommand RunCommand { get; }

        public RemoteCommandsViewModel()
        {
            EquipmentCommands = new ObservableCollection<string>
            {
                "START", "STOP", "ABORT", "PAUSE", "RESUME", "RESET", "INITIALIZE"
            };

            RecipeCommands = new ObservableCollection<string>
            {
                "SET_PPID", "SELECT_RECIPE", "VERIFY_RECIPE", "DELETE_RECIPE"
            };

            MaterialCommands = new ObservableCollection<string>
            {
                "LOAD", "UNLOAD", "MAP", "START_LOT", "END_LOT",
                "CLAMP", "UNCLAMP", "OPEN_DOOR", "CLOSE_DOOR"
            };

            MaintenanceCommands = new ObservableCollection<string>
            {
                "CLEAN_CHAMBER", "PUMP_DOWN", "VENT", "HOME_ALL", "CALIBRATE"
            };

            RunCommand = new RelayCommand(ExecuteRemoteCommand);
        }

        private void ExecuteRemoteCommand(object commandName)
        {
            string cmd = commandName?.ToString();
            if (string.IsNullOrWhiteSpace(cmd))
                return;

            // TODO: Build and send S2F41 GEM remote command here
            // Example:
            System.Diagnostics.Debug.WriteLine($"Executing Remote Command: {cmd}");
        }
    }
}
