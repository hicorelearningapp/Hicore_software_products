using HostSimulator.Logic;
using HostSimulator.Model;
using System;
using System.ComponentModel;
using System.Windows.Input;

namespace HostSimulator.ViewModel
{
    public class HsmsSettingsViewModel : INotifyPropertyChanged
    {
        private readonly HsmsConfigService _configService = new HsmsConfigService();
        private HsmsConfig _config;


    
        public event PropertyChangedEventHandler PropertyChanged;

        public string IpAddress
        {
            get => _config.IpAddress;
            set { _config.IpAddress = value; OnPropertyChanged(nameof(IpAddress)); }
        }

        public int Port
        {
            get => _config.Port;
            set { _config.Port = value; OnPropertyChanged(nameof(Port)); }
        }

        public int T3Timeout
        {
            get => _config.T3Timeout;
            set { _config.T3Timeout = value; OnPropertyChanged(nameof(T3Timeout)); }
        }

        public int T5Timeout
        {
            get => _config.T5Timeout;
            set { _config.T5Timeout = value; OnPropertyChanged(nameof(T5Timeout)); }
        }

        public int T6Timeout
        {
            get => _config.T6Timeout;
            set { _config.T6Timeout = value; OnPropertyChanged(nameof(T6Timeout)); }
        }

        public int T7Timeout
        {
            get => _config.T7Timeout;
            set { _config.T7Timeout = value; OnPropertyChanged(nameof(T7Timeout)); }
        }


        public ICommand SaveCommand { get; }
        public ICommand CancelCommand { get; }

        public event Action CloseRequested;


        public HsmsSettingsViewModel()
        {
            // Load config at startup
            _config = _configService.Load();

            SaveCommand = new RelayCommand(_ => Save());
            CancelCommand = new RelayCommand(_ => Cancel());
        }

        private void Save()
        {
            _configService.Save(_config);
            System.Windows.MessageBox.Show("HSMS settings saved.");
        }

        private void Cancel()
        {
            // reload previous config
            _config = _configService.Load();
            // notify UI
            OnPropertyChanged(string.Empty);
            CloseRequested?.Invoke();
        }

        private void OnPropertyChanged(string name)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }
    }
}
