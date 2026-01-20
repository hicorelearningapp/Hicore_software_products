using System;
using System.Collections.Generic;
using EquipmentSimulator.Config;
using GemManager;


namespace EquipmentSimulator
{
    public class EventComponent : IEventComponent
    {
        private readonly Dictionary<uint, GemEvent> _events =
                new Dictionary<uint, GemEvent>();


        public void RegisterEvent(uint ceid, string name)
        {
            _events[ceid] = new GemEvent(ceid, name);
          
        }


      
        public void LoadFromConfig(EquipmentConfig config)
        {
            //_ceids.Clear();
            //_ceids.AddRange(config.SupportedEvents);
        }

        public IEnumerable<GemEvent> GetDefinedEvents() => _events.Values;
    
    }
}
