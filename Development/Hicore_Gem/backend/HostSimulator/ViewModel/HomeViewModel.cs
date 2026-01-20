using HSMSLib;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace HostSimulator.ViewModel
{
    public class HomeViewModel : BaseViewModel
    {
        public ObservableCollection<string> MessageLog { get; }


        private void PrintMessage(SecsMessage e)
        {
            AddMessage(e.ReceivedAt.ToString());
            string format = " S" + e.Stream + " F" + e.Function;
            AddMessage(format);
            if (e.Body != null)
            {
                AddMessage(e.Body.ToString());
            }
        }

        public HomeViewModel()
        {
            MessageLog = new ObservableCollection<string>();

            AddMessage("Message from Client");

            HostSimulatorApp.Instance.SecsMessageReceived += (e) =>
            {
                PrintMessage(e);
            };

            HostSimulatorApp.Instance.SecsMessageSent += (e) =>
            {
                PrintMessage(e);
            };

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
