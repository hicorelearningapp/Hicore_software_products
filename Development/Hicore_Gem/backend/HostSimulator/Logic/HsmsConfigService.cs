using HostSimulator.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace HostSimulator.Logic
{
    public class HsmsConfigService
    {
        private readonly string _configPath = "hsmsSettings.json";

        public HsmsConfig Load()
        {
            if (!File.Exists(_configPath))
            {
                // create default config
                var defaultConfig = new HsmsConfig
                {
                    IpAddress = "127.0.0.1",
                    Port = 5001,
                    T3Timeout = 45,
                    T5Timeout = 10,
                    T6Timeout = 5,
                    T7Timeout = 10
                };

                Save(defaultConfig);
                return defaultConfig;
            }

            string json = File.ReadAllText(_configPath);
            return JsonSerializer.Deserialize<HsmsConfig>(json);
        }

        public void Save(HsmsConfig config)
        {
            var json = JsonSerializer.Serialize(config, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            File.WriteAllText(_configPath, json);
        }
    }
}
