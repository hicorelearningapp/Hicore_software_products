using EquipmentSimulator.GemService;
using GemManager;
using GemManager.Interface;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EquipmentSimulator.ViewModel
{
    public class RemoteCommandListViewModel : BaseViewModel
    {
        public ObservableCollection<string> SupportedCommands { get; }

        public RemoteCommandListViewModel(IRemoteCommandComponent component)
        {
            SupportedCommands =
                new ObservableCollection<string>(
                    component.GetSupportedCommands());
        }
    }


    public class RemoteCommandViewModel : BaseViewModel
    {
        private IRemoteCommandHistoryService _historyService { get; set; }
        private IRemoteCommandService _remoteCommandService { get; set; }

        public ObservableCollection<RemoteCommandRecord> Commands { get; }
            = new ObservableCollection<RemoteCommandRecord>();


        public void SetServices(IRemoteCommandService remoteCommandService, IRemoteCommandHistoryService historyService)
        {
            _remoteCommandService = remoteCommandService;
            _historyService = historyService;
            _historyService.OnHistoryUpdated += OnHistoryUpdated;
        }

        public RemoteCommandViewModel()
        {
            Commands = new ObservableCollection<RemoteCommandRecord>();
        }


        private RemoteCommandRecord _selectedCommand;
        public RemoteCommandRecord SelectedCommand
        {
            get => _selectedCommand;
            set
            {
                _selectedCommand = value;
                OnPropertyChanged(nameof(SelectedCommand));
            }
        }

        private void OnHistoryUpdated()
        {
            System.Windows.Application.Current.Dispatcher.BeginInvoke(
           new Action(() =>
           {
               Refresh();
           }));
        }

        
        

        private void Refresh()
        {
            Commands.Clear();

            foreach (var cmd in _historyService.History)
                Commands.Add(cmd);

            //if (RemoteCommandService.Count > 0 && SelectedCommand == null)
            //    SelectedCommand = RemoteCommandService[^1]; // select latest
        }
    }

}
