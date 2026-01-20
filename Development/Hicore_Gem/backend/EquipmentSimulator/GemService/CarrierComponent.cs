using System.Collections.Generic;
using EquipmentSimulator.Config;
using GemManager;


namespace EquipmentSimulator
{
    public class CarrierComponent : ICarrierComponent
    {
        private readonly Dictionary<int, string> _slots =
            new Dictionary<int, string>();

        public void LoadFromConfig(EquipmentConfig config)
        {
            _slots.Clear();
            foreach (var kv in config.CarrierSlotMap)
                _slots[kv.Key] = kv.Value;
        }

        public Dictionary<int, string> GetCarrierSlotMap()
            => new Dictionary<int, string>(_slots);

        public void SetCarrierSlot(int slot, string waferId)
            => _slots[slot] = waferId;

        public void OnLotStart(string lotId, string operatorId) { }
        public void OnLotEnd(string lotId) { }

        public void OnWaferStart(string waferId, int slot) { }
        public void OnWaferEnd(string waferId, int slot) { }
    }
}
