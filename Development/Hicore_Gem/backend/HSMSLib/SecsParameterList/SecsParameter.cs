using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace HSMSLib
{
    public class SecsStream
    {
        public int StreamId { get; set; }
        public string Description { get; set; }
        public List<SecsFunction> Functions { get; set; }
    }

    public class SecsFunction
    {
        public int FunctionId { get; set; }
        public string Name { get; set; }
        public bool IsPrimary { get; set; }
        public List<SecsParameter> Parameters { get; set; }
    }

    public class SecsParameter
    {
        public string Name { get; set; }
        public string DataType { get; set; }
        public object Value { get; set; }
        public List<SecsParameter> Children { get; set; }
    }

    public class StreamReader
    {
        public List<SecsStream> LoadSecsConfig()
        {
            string configFile = Path.Combine(AppContext.BaseDirectory, "Config", "secs_streams.json");

            if (!File.Exists(configFile))
                throw new FileNotFoundException($"SECS config file not found: {configFile}");

            string json = File.ReadAllText(configFile);

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                ReadCommentHandling = JsonCommentHandling.Skip,
                AllowTrailingCommas = true,
                IncludeFields = false // set to true if your models use fields instead of properties
            };

            return JsonSerializer.Deserialize<List<SecsStream>>(json, options)
                   ?? new List<SecsStream>();
        }
    }
}
