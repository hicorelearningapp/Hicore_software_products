using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace HostSimulator.ViewModel
{

    public class SecsMessageConfig
    {
        private readonly string filePath = "Config\\secs_command.json";

        private Dictionary<string, string> _entries =
            new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        public bool Load()
        {
            if (!File.Exists(filePath))
                return false;

            string json = File.ReadAllText(filePath);

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                ReadCommentHandling = JsonCommentHandling.Skip,
                AllowTrailingCommas = true
            };

            var dict = JsonSerializer.Deserialize<Dictionary<string, string>>(json, options);

            if (dict == null)
                throw new Exception("Failed to deserialize SECS JSON file.");

            var keysToRemove = dict.Keys.Where(k => k.StartsWith("//")).ToList();

            foreach (var key in keysToRemove)
            {
                dict.Remove(key);
            }

            _entries = dict;

            return true;
        }

        /// <summary>
        /// Returns all SxFy keys like S1F1, S2F23, etc.
        /// </summary>
        public IEnumerable<string> GetAllStreamFunction()
        {
            return _entries.Keys;
        }

        /// <summary>
        /// Returns the SECS-II body string for a given SxFy.
        /// </summary>
        public string GetStreamCommand(string streamFunction)
        {
            if (string.IsNullOrWhiteSpace(streamFunction))
                return string.Empty;

            if (_entries.TryGetValue(streamFunction, out string value))
                return value;

            return string.Empty;
        }
    }

    public class MessageViewModel : BaseViewModel
    {
        public ObservableCollection<string> MessageLog { get; }

        private SecStreamViewModel _secStreamViewModel;

        public SecStreamViewModel SecStreamViewParameter
        {
            get => _secStreamViewModel;
            set
            {
                _secStreamViewModel = value;
                OnPropertyChanged(nameof(SecStreamViewParameter)); // IMPORTANT
            }
        }

        public MessageViewModel()
        {
            SecStreamViewParameter = new SecStreamViewModel();
            MessageLog  = new ObservableCollection<string>();

            AddMessage("Message From Client..");
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
