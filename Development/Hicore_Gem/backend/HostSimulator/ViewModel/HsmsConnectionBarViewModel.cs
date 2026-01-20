using HostSimulator.View;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;

namespace HostSimulator.ViewModel
{
    internal class HsmsConnectionBarViewModel : BaseViewModel
    {
        public HsmsConnectionBarViewModel()
        {
            ConfigCommand = new RelayCommand(ExecuteConfig, CanExecuteConfig);
            ConnectCommand = new RelayCommand(ExecuteConnect, CanExecuteConnect);
            DisConnectCommand = new RelayCommand(ExecuteDisConnect, CanExecuteDisConnect);

        }
        private string _ipAddress = "127.0.0.1";
        private int _portNumber = 5001;

        public string IpAddress
        {
            get => _ipAddress;
            set
            {
                _ipAddress = value;
                OnPropertyChanged(nameof(IpAddress));
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
        public ICommand ConfigCommand { get; }
        public ICommand ConnectCommand { get; }
        public ICommand DisConnectCommand { get; }

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

            HostSimulatorApp.Instance.Configure(IpAddress, PortNumber);

            HostSimulatorApp.Instance.Start();

            System.Diagnostics.Debug.WriteLine("NotSelected successfully!");

       }

        private bool CanExecuteConnect(object obj)
        {
            return ValidateIp() && PortNumber > 0;
        }


        private void ExecuteDisConnect(object obj)
        {
            HostSimulatorApp.Instance.Disconnect();
        }

        private bool CanExecuteDisConnect(object obj)
        {
            return true;
        }

        // Validate IP format
        private bool ValidateIp()
        {
            return IPAddress.TryParse(IpAddress, out _);
        }

    }
}
