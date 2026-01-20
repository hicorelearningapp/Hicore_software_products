using GemManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace EquipmentSimulator.Logic
{
    public sealed class VariableSimulator : IDisposable
    {
        private readonly Dictionary<uint, GemVariable> _vars;
        private readonly Random _random = new Random();
        private Timer _timer;

        public VariableSimulator(Dictionary<uint, GemVariable> vars)
        {
            _vars = vars ?? throw new ArgumentNullException(nameof(vars));
        }

        public void Start()
        {
            // Run immediately, then every 3 seconds
            _timer = new Timer(UpdateVariables, null, TimeSpan.Zero, TimeSpan.FromSeconds(3));
        }

        private void UpdateVariables(object state)
        {
            lock (_vars)
            {
                foreach (var variable in _vars.Values)
                {
                    // Example: simulate numeric values
                    if (variable.GetValue() is int)
                    {
                        variable.SetValue(_random.Next(0, 100));
                    }
                    else if (variable.GetValue() is double)
                    {
                        variable.SetValue(Math.Round(_random.NextDouble() * 100, 2));
                    }
                    else if (variable.GetValue() is bool)
                    {
                        variable.SetValue(_random.Next(0, 2) == 1);
                    }
                    else
                    {
                        // fallback: timestamp
                        variable.SetValue(DateTime.Now.ToString("HH:mm:ss"));
                    }
                }
            }

            // Optional: notify GEM / GUI
            // OnVariablesUpdated?.Invoke();
        }

        public void Stop()
        {
            _timer?.Dispose();
            _timer = null;
        }

        public void Dispose()
        {
            Stop();
        }
    }

}
