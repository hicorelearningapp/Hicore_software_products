using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace EquipmentSimulator.Config
{
    public class EquipmentConfigManager
    {
        private readonly string _filePath;
        private FileSystemWatcher _watcher;

        public EquipmentConfig CurrentConfig { get; private set; }

        public event Action<EquipmentConfig> OnConfigReloaded;

        public EquipmentConfigManager(string filePath = "config\\equipment_config.json")
        {
            _filePath = filePath;

            LoadConfig();
            StartWatching();
        }

        public void LoadConfig()
        {
            string json = File.ReadAllText(_filePath);

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            CurrentConfig = JsonSerializer.Deserialize<EquipmentConfig>(json, options);

            // Notify subscribers (GemInterface)
            OnConfigReloaded?.Invoke(CurrentConfig);

            Console.WriteLine("Config loaded.");
        }

        private void StartWatching()
        {
            _watcher = new FileSystemWatcher(Path.GetDirectoryName(_filePath) ?? ".", Path.GetFileName(_filePath));
            _watcher.NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.Size | NotifyFilters.LastWrite;

            _watcher.Changed += (s, e) =>
            {
                Thread.Sleep(200); // wait for write to finish
                LoadConfig();
                Console.WriteLine("Config auto-reloaded.");
            };

            _watcher.EnableRaisingEvents = true;
        }
    }
}
