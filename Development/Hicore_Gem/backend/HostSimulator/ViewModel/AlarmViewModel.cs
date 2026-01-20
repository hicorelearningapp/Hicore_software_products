using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace HostSimulator.ViewModel
{
    public class AlarmViewModel : BaseViewModel
    {

        // Collection of alarms
        public ObservableCollection<AlarmModel> Alarms { get; set; }

        // Command for Acknowledging Alarms
        public ICommand AcknowledgeCommand { get; set; }

        public AlarmViewModel()
        {
            // Sample Alarm Data
            Alarms = new ObservableCollection<AlarmModel>
            {
                new AlarmModel { AlarmID = "A001", Message = "Temperature High", Status = "Active" },
                new AlarmModel { AlarmID = "A002", Message = "Pressure Low", Status = "Active" },
                new AlarmModel { AlarmID = "A003", Message = "Valve Error", Status = "Resolved" }
            };

            HostSimulatorApp.Instance.SecsMessageReceived += (e) =>
            {
                if (e.Stream == 5 && e.Function == 1)
                {

                }
        };

            // Initialize Command
            AcknowledgeCommand = new RelayCommand(AcknowledgeAlarm);
        }

        private void AcknowledgeAlarm(object parameter)
        {
            if (parameter is string alarmID)
            {
                var alarm = Alarms.FirstOrDefault(a => a.AlarmID == alarmID);
                if (alarm != null)
                {
                    alarm.Status = "Acknowledged";
                    OnPropertyChanged(nameof(Alarms));
                }
            }
        }
    }

    // Alarm Model
    public class AlarmModel : BaseViewModel
    {
        private string status;
        public string AlarmID { get; set; }
        public string Message { get; set; }

        public string Status
        {
            get { return status; }
            set { status = value; OnPropertyChanged(nameof(Status)); }
        }
    }
}
