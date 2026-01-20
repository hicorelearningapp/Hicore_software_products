
using System;
using System.Net;
using System.Windows.Input;
using EquipmentSimulator.View;
using GemManager;

namespace EquipmentSimulator.ViewModel
{
    public class HsmsConnectionBarViewModel : BaseViewModel
    {

        private IEquipmentStateComponent _stateService;
        private IAlarmService _alarmService;
        private ICommunicationStateManager _communicationStateService;

        private int _activeAlarmCount;
        Action ConnectAction { get; set; }
        private bool onlineRemote = false;

        public int ActiveAlarmCount
        {
            get
            {
                if (_alarmService != null)
                {
                    _activeAlarmCount = _alarmService.ActiveAlarmCount;
                }
                return _activeAlarmCount;
            }

        }

        public string HsmsConnectionsState
        {
            get
            {
                return _communicationStateService.HsmsConnectionState.ToString();
            }

        }


        public string GemState
        {
            get
            {
                return _communicationStateService.GemCommState.ToString(); 
            }
        }

        private string _processState = EquipmentProcessState.Idle.ToString();

        public string ProcessState
        {
            get
            {
                return _processState; 
            }
            set
            {
                _processState = value;  
                OnPropertyChanged(nameof(ProcessState));
            }
           
        }

        public HsmsConnectionBarViewModel()
        {
            ConfigCommand = new RelayCommand(ExecuteConfig, (o) => true);
            ConnectCommand = new RelayCommand(ExecuteConnect, CanExecuteConnect);
            DisConnectCommand = new RelayCommand(ExecuteDisConnect, CanExecuteDisConnect);
            ChangeRemoteCommand = new RelayCommand(ExecuteRemoteCommand, (o) => true);

        }

        public void SetState(Action connectAction,
            IEquipmentStateComponent stateService,
            IAlarmService alarmService,
            ICommunicationStateManager communicationStateService)
        {

            _stateService = stateService;
            _alarmService = alarmService;
            _communicationStateService = communicationStateService;

            _communicationStateService.StateChanged += CommunicationStateService_StateChanged;
            _stateService.StateChanged += OnStateChanged;
            

            _alarmService.AlarmCountChanged += _ =>
            {
                OnPropertyChanged(nameof(ActiveAlarmCount));
            };


            ConnectAction = connectAction;
        }

        private void CommunicationStateService_StateChanged()
        {
            OnPropertyChanged(nameof(GemState));
            OnPropertyChanged(nameof(HsmsConnectionsState));
        }

    

        private void OnStateChanged()
        {
            ProcessState = _stateService.ProcessState.ToString();
            ControlState = _stateService.ControlState.ToString();
            
            OnPropertyChanged(nameof(GemState));
            OnPropertyChanged(nameof(HsmsConnectionsState));
            OnPropertyChanged(nameof(ControlState));
            OnPropertyChanged(nameof(ProcessState));
        }


        private string _ipAddress = "127.0.0.1";
        private int _portNumber = 5001;

        public string IpAddress
        {
            get => _ipAddress;
            set
            {
                _ipAddress = value;
                OnPropertyChanged();
            }
        }

        public int PortNumber
        {
            get => _portNumber;
            set
            {
                _portNumber = value;
                OnPropertyChanged(nameof(PortNumber));
            }
        }

        private string _onlineStatus = "Online Remote";
        public string OnlineStatus
        {
            get => _onlineStatus;
            set
            {
                _onlineStatus = value;
                OnPropertyChanged();
            }
        }

        



        private string _controlState = "Offline";
        public string ControlState
        {
            get => _controlState;
            set
            {
                _controlState = value;
                OnPropertyChanged(nameof(ControlState));
            }
        }

        public ICommand ConfigCommand { get; }
        public ICommand ConnectCommand { get; }
        public ICommand DisConnectCommand { get; }
        public ICommand ChangeRemoteCommand { get; }



        // CONFIG
        private void ExecuteConfig(object obj)
        {
            HsmsSettingsDialog hsmsSettingsDialog = new HsmsSettingsDialog();
            hsmsSettingsDialog.ShowDialog();

            // Save values to config file or memory
            // Example only
            System.Diagnostics.Debug.WriteLine($"Config Saved: IP={IpAddress}, PORT={PortNumber}");
            // MessageBox.Show("ExecuteConfig");
        }

        private bool CanExecuteConfig(object obj)
        {
            return ValidateIp() && PortNumber > 0;
        }

        // CONNECT
        private void ExecuteConnect(object obj)
        {
            // Example connection logic
            System.Diagnostics.Debug.WriteLine($"Connecting to {IpAddress}:{PortNumber} ...");

            ConnectAction.Invoke();
            System.Diagnostics.Debug.WriteLine("NotSelected successfully!");
        }
        private bool CanExecuteConnect(object obj)
        {
            return ValidateIp() && PortNumber > 0;
        }


        private void ExecuteDisConnect(object obj)
        {
            // MessageBox.Show("Disconnect");
        }

        private bool CanExecuteDisConnect(object obj)
        {
            return true;
        }


        private void ExecuteRemoteCommand(object obj)
        {
            if (!onlineRemote)
            {
                if (_stateService != null)
                {
                    if (_stateService.GoOnlineRemote())
                    {
                        OnlineStatus = "OnLine Local";
                        onlineRemote = true;
                    }
                }
            }
            else
            {
                if (_stateService != null)
                {
                    if (_stateService.GoOnlineLocal())
                    {
                        OnlineStatus = "OnLine Remote";
                        onlineRemote = false;
                    }
                }
            }
        }

        // Validate IP format
        private bool ValidateIp()
        {
            return IPAddress.TryParse(IpAddress, out _);
        }

    }
}
