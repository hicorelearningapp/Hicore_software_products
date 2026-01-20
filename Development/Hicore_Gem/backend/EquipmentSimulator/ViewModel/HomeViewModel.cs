using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EquipmentSimulator.ViewModel
{
    public class HomeViewModel : BaseViewModel
    {
        public ObservableCollection<string> MessageLog { get; set; }

        public HomeViewModel()
        {
             MessageLog = new ObservableCollection<string>();

              AddMessage("Message from Client");
        }


        public void AddMessage(string msg)
        {
            App.Current.Dispatcher.Invoke(() =>
            {
                MessageLog.Add(msg);
            });
        }

    }
}
