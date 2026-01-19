import React, { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const SlotForm = ({
  selectedDateObj,
  selectedDateStr,
  mentorId,
  onBack,
  onConfirm,
}) => {
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dateStr = selectedDateStr; // ✅ EXACT BACKEND DATE

  // ✅ FETCH SLOTS
  useEffect(() => {
    if (!dateStr || !mentorId) return;

    const fetchSlots = async () => {
      try {
        setLoading(true);
        setError("");
        setSlots([]);
        setSelectedSlotId(null);

        const url = `${API_BASE}/mentor/${mentorId}/slots/${dateStr}`;
        console.log("✅ Fetching slots:", url);

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load slots");

        const data = await res.json();
        console.log("✅ Slots response:", data);

       const normalizedSlots = Array.isArray(data)
  ? data.map((slot) => ({
      slot_id: slot.id,                 // ✅ map id → slot_id
      start: slot.start_time,           // ✅ map start_time → start
      end: slot.end_time,               // ✅ map end_time → end
      status: slot.status,
    }))
  : [];

setSlots(normalizedSlots);

      } catch (err) {
        console.error("❌ Slot API Error:", err);
        setError("Failed to load slots.");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [mentorId, dateStr]);

  // ✅ BLOCK FILLED SLOTS
  const handleSlotClick = (slot) => {
    if (slot.status === "filled") return; // 🚫 BLOCK SELECTION
    setSelectedSlotId((prev) =>
      prev === slot.slot_id ? null : slot.slot_id
    );
  };

  // ✅ CONFIRM SLOT
  const handleConfirm = () => {
    const selectedSlot = slots.find(
      (s) => s.slot_id === selectedSlotId
    );

    if (!selectedSlot || selectedSlot.status === "filled") return;

    onConfirm({
      slot_id: selectedSlot.slot_id,
      time: `${selectedSlot.start} - ${selectedSlot.end}`,
      date: dateStr,
    });
  };

  const availableCount = slots.filter(
    (s) => s.status === "available"
  ).length;

  return (
    <div className="w-full h-full p-4">
      {/* ✅ TITLE */}
      <h2 className="text-md font-bold text-indigo-900 mb-4 text-center">
        {loading
          ? "Loading slots..."
          : `${availableCount} Slots Available`}
      </h2>

      {/* ✅ ERROR */}
      {error && (
        <p className="text-center text-xs text-red-500 mb-3">
          {error}
        </p>
      )}

      {/* ✅ EMPTY STATE */}
      {!loading && slots.length === 0 && !error && (
        <p className="text-center text-xs text-gray-500 mb-4">
          No slots available for this date.
        </p>
      )}

      {/* ✅ SLOT GRID */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {!loading &&
          slots.map((slot) => {
            const isSelected = selectedSlotId === slot.slot_id;
            const isFilled = slot.status === "filled";
            const label = `${slot.start} - ${slot.end}`;

            return (
              <div
                key={slot.slot_id}
                onClick={() => handleSlotClick(slot)}
                className={`text-xs px-3 py-3 rounded border text-center font-medium transition
                  ${
                    isFilled
                      ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                      : isSelected
                      ? "bg-blue-500 text-white border-blue-500 cursor-pointer"
                      : "text-indigo-900 border-indigo-900 hover:bg-indigo-50 cursor-pointer"
                  }
                `}
              >
                {label}
              </div>
            );
          })}
      </div>

      {/* ✅ ACTION BUTTONS */}
      <div className="flex justify-between gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-md border border-indigo-900 text-indigo-900 w-1/2 text-sm"
        >
          Cancel
        </button>

        <button
          onClick={handleConfirm}
          disabled={
            !selectedSlotId ||
            slots.find((s) => s.slot_id === selectedSlotId)?.status ===
              "filled"
          }
          className={`px-4 py-2 rounded-md w-1/2 text-sm font-semibold
            ${
              selectedSlotId &&
              slots.find((s) => s.slot_id === selectedSlotId)?.status !==
                "filled"
                ? "bg-indigo-900 text-white hover:bg-indigo-800"
                : "bg-gray-300 text-white cursor-not-allowed"
            }`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default SlotForm;
