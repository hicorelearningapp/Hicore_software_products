using GemManager.Service;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EquipmentSimulator.ViewModel
{
    public class TerminalMessageViewModel : BaseViewModel
    {
        public TerminalMessageViewModel()
        {
            HostMessageText = new ObservableCollection<string>();
        }
        public ITerminalService _terminalServer { get; set; }

        public ObservableCollection<string> HostMessageText { get; set; }

        public ObservableCollection<string> EquipmentMessageText { get; set; }

        public void SetTerminalService(ITerminalService terminalService)
        {
            _terminalServer = terminalService;
            _terminalServer._displayAction += _terminalServer__displayAction;
        }

        private void _terminalServer__displayAction(string msg)
        {
            App.Current.Dispatcher.Invoke(() =>
            {
                HostMessageText.Add(msg);
            });
        }
    }
}
