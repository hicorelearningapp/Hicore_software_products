using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace EquipmentSimulator.ViewModel
{
    public class MessageViewModel : BaseViewModel
    {
        public ObservableCollection<string> MessageLog { get; set; }


        public MessageViewModel()
        {
            MessageLog = new ObservableCollection<string>();
        }


        public void AddMessage(string msg)
        {
            App.Current.Dispatcher.Invoke(() =>
            {
                MessageLog.Add(msg);
                MessageLog.Add("-----------------------------------------");

            });
        }

    }
}
