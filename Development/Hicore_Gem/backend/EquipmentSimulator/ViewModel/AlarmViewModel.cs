using GemManager;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;

namespace EquipmentSimulator.ViewModel
{
    public class GemAlarmViewModel : BaseViewModel
    {
        private readonly GemAlarm _model;
        private readonly IAlarmComponent _alarmComponent;

        public GemAlarmViewModel(GemAlarm model, IAlarmComponent alarmComponent)
        {
            _model = model;
            _alarmComponent = alarmComponent;

            FireCommand = new RelayCommand(
                _ => _alarmComponent.SetAlarm(AlarmId),
                _ => !IsSet);

            ClearCommand = new RelayCommand(
                _ => _alarmComponent.ClearAlarm(AlarmId),
                _ => IsSet);
        }

        public int AlarmId => _model.AlarmId;
        public string Description => _model.Description;
        public GemAlarmState State => _model.State;
        public DateTime LastChangedUtc => _model.LastChangedUtc;

        public bool IsSet => State == GemAlarmState.Set;

        public ICommand FireCommand { get; }
        public ICommand ClearCommand { get; }

        public void Update(GemAlarm updated)
        {
            _model.State = updated.State;
            _model.LastChangedUtc = updated.LastChangedUtc;

            Refresh();
        }

        public void Refresh()
        {
            OnPropertyChanged(nameof(State));
            OnPropertyChanged(nameof(IsSet));
            OnPropertyChanged(nameof(LastChangedUtc));
            CommandManager.InvalidateRequerySuggested();
        }
    }

    public class AlarmStatusViewModel : BaseViewModel
    {
        public ObservableCollection<GemAlarmViewModel> Alarms { get; private set; }

        private IAlarmComponent _alarmComponent;

        public void SetAlarms(IAlarmComponent alarmComponent)
        {
            _alarmComponent = alarmComponent;

            Alarms = new ObservableCollection<GemAlarmViewModel>(
                alarmComponent.GetAlarmList()
                              .Select(a => new GemAlarmViewModel(a, _alarmComponent))
            );

            OnPropertyChanged(nameof(Alarms));

            _alarmComponent.OnAlarmChanged += OnAlarmChanged;
        }

        private void OnAlarmChanged(GemAlarm alarm)
        {
            var vm = Alarms.FirstOrDefault(a => a.AlarmId == alarm.AlarmId);
            if (vm == null)
                return;

            Application.Current.Dispatcher.Invoke(() =>
            {
                vm.Refresh();
            });
        }
    }
}
