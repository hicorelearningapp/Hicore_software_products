using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.Design;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;

namespace HostSimulator.ViewModel
{
    internal class SingleMessageViewModel : BaseViewModel
    {
        private string outgoingmessage;
        public String OutgoingMessage
        {
            get => outgoingmessage;
            set
            {
                outgoingmessage = value;
                OnPropertyChanged(nameof(OutgoingMessage));
            }
        }

        public SingleMessageViewModel()
        {

            BrowseCommand = new RelayCommand(_ => BrowseFile());

            SendMessageCommand = new RelayCommand(_ => SendTextCommand());

            // Load JSON
            _config.Load();

            // Fill ComboBox list
            foreach (var key in _config.GetAllStreamFunction())
            {
                Commands.Add(key);

            }
        }

        private readonly SecsMessageConfig _config = new SecsMessageConfig();

        public ObservableCollection<string> Commands { get; set; }
            = new ObservableCollection<string>();

        private string _selectedCommand;
        public string SelectedCommand
        {
            get => _selectedCommand;
            set
            {
                if (_selectedCommand != value)
                {
                    _selectedCommand = value;
                    OnPropertyChanged(nameof(SelectedCommand));

                    // Auto-update command body
                    CommandBody = _config.GetStreamCommand(_selectedCommand);

                    OutgoingMessage = CommandBody;
                }
            }
        }

        private string _commandBody;
        public string CommandBody
        {
            get => _commandBody;
            set
            {
                _commandBody = value;
                OnPropertyChanged(nameof(CommandBody));
            }
        }

        public ICommand BrowseCommand { get; }

        public ICommand SendMessageCommand { get; }
        
        public ICommand ConfigCommand { get; }


        private void SendTextCommand()
        {
            string command = SelectedCommand.Split('_')[0];
           ///  MessageBox.Show(CommandBody);
            HostSimulatorApp.Instance.Send(command, OutgoingMessage);
        }

  

        private void BrowseFile()
        {
            var dialog = new OpenFileDialog
            {
                Title = "Select Text File",
                Filter = "Text Files (*.txt)|*.txt"
            };

            if (dialog.ShowDialog() == true)
            {
                OutgoingMessage = File.ReadAllText(dialog.FileName);
            }
        }

    }
}
