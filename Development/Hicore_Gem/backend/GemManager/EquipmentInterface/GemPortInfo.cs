using System;
using System.Collections.Generic;

namespace GemManager
{
    public class GemPortInfo
    {
        /// <summary>
        /// Numerical port identifier (0, 1, 2...)
        /// </summary>
        public int PortId { get; set; }

        /// <summary>
        /// Human-readable name: "LOADPORT1", "LP2", etc.
        /// </summary>
        public string PortName { get; set; } = string.Empty;

        /// <summary>
        /// Current port state (LoadReady, UnloadReady, Processing, Completed, etc.)
        /// </summary>
        public PortState State { get; set; } = PortState.Unknown;

        /// <summary>
        /// Current port load/unload state.
        /// Example: Empty, Loading, Loaded, Unloading.
        // </summary>
        public LoadState LoadState { get; set; } = LoadState.Empty;

        /// <summary>
        /// Carrier ID or Cassette ID on this port.
        /// For 200mm: Cassette barcode.
        /// For 300mm: CarrierID from ID reader.
        /// </summary>
        public string CarrierId { get; set; }

        /// <summary>
        /// Total number of slots in the carrier/cassette.
        /// 200mm: usually 25.
        /// 300mm: 25.
        /// </summary>
        public int TotalSlots { get; set; } = 25;

        /// <summary>
        /// Mapping: Slot number → Wafer ID.
        /// A null value means the slot is empty.
        /// </summary>
        public Dictionary<int, string> Slots { get; set; } = new Dictionary<int, string>();

        /// <summary>
        /// True if port is physically present or active.
        /// Optional for tools with variable port count.
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Timestamp of last port state change.
        /// </summary>
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        public override string ToString() =>
            $"Port {PortId} ({PortName}) - EquipmentStateComponent={State}, LoadState={LoadState}, Carrier={CarrierId}";
    }

}
