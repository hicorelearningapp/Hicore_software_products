using GemManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace EquipmentSimulator.Logic
{
    public sealed class TimerVariableSimulator : IVariableSimulator
    {
        private readonly Dictionary<uint, GemVariable> _vars;
        private readonly Action<uint, object> _onChanged;
        private readonly Random _random = new Random();
        private Timer _timer;

        public TimerVariableSimulator(
            Dictionary<uint, GemVariable> vars,
            Action<uint, object> onChanged)
        {
            _vars = vars;
            _onChanged = onChanged;
        }

        public void Start()
        {
            _timer = new Timer(Update, null,
                TimeSpan.Zero, TimeSpan.FromSeconds(3));
        }

        private void Update(object state)
        {
            lock (_vars)
            {
                foreach (var v in _vars.Values)
                {
                    if (v.Role == GemVariableRole.EC)
                        continue;

                    var old = v.GetValue();
                    var next = GenerateValue(v);

                    if (!Equals(old, next))
                    {
                        v.SetValueInternal(next);
                        _onChanged?.Invoke(v.VariableId, next);
                    }
                }
            }
        }

        private object GenerateValue(GemVariable v)
        {
            switch (v.DataType)
            {
                case GemDataType.Boolean:
                    return !(bool)v.GetValue();

                case GemDataType.U1:
                    return (byte)_random.Next(0, byte.MaxValue);

                case GemDataType.U2:
                    return (ushort)_random.Next(0, ushort.MaxValue);

                case GemDataType.U4:
                    return (uint)_random.Next(0, int.MaxValue);

                case GemDataType.I1:
                    return (sbyte)_random.Next(sbyte.MinValue, sbyte.MaxValue);

                case GemDataType.I2:
                    return (short)_random.Next(short.MinValue, short.MaxValue);

                case GemDataType.I4:
                    return _random.Next(-1000, 1000);

                case GemDataType.F4:
                    return (float)(_random.NextDouble() * 100.0);

                case GemDataType.F8:
                    return _random.NextDouble() * 100.0;

                case GemDataType.A:
                    return DateTime.Now.ToString("HH:mm:ss");

                default:
                    return v.GetValue(); // safe fallback
            }
        }



        public void Stop() => _timer?.Dispose();
        public void Dispose() => Stop();
    }

}
