import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  startOfDay,
} from "date-fns";
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import TimeSlotForm from "./SlotForm";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const CalendarModal = ({ isOpen, onClose, mentorId }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [confirmedSlot, setConfirmedSlot] = useState(null);
  
  // ✅ NEW STATE FOR LOADING
  const [isBooking, setIsBooking] = useState(false);

  // ✅ TYPE & TOPIC
  const [type, setType] = useState("");
  const [about, setAbout] = useState("");

  // ✅ PROFILE DATA
  const [student, setStudent] = useState(null);

  const [apiAvailableDates, setApiAvailableDates] = useState([]);
  const today = startOfDay(new Date());

  // ✅ USER ID FROM LOCAL STORAGE
  const userId = localStorage.getItem("user_id");

  /* ================= PROFILE API (FIXED) ================= */
  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ No user_id in localStorage");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/profile/${userId}`);
        const data = await res.json();

        console.log("✅ Profile API Data:", data);

        const info = data?.basicInfo; // ✅ FIX HERE

        if (info) {
          setStudent({
            id: info.user_id,
            name: `${info.first_name} ${info.last_name}`,
            email: info.email,
          });

          console.log("✅ Student Loaded:", {
            id: info.user_id,
            name: `${info.first_name} ${info.last_name}`,
            email: info.email,
          });
        } else {
          console.error("❌ basicInfo missing in API response");
        }
      } catch (err) {
        console.error("❌ Profile fetch failed", err);
      }
    };

    fetchProfile();
  }, [userId]);

  /* ================= AVAILABLE DATES ================= */
 useEffect(() => {
  if (!mentorId || !isOpen) return;

  const fetchAvailableDates = async () => {
    try {
      const url = `${API_BASE}/mentor/${mentorId}/available-dates`;
      const res = await fetch(url);
      const data = await res.json();

      console.log("📅 Raw available dates response:", data);

      // ✅ Support both: plain array or { available_dates: [...] }
      const rawDates = Array.isArray(data)
        ? data
        : data?.available_dates || [];

      const parsedDates = rawDates.map((d) => ({
        dateObj: startOfDay(new Date(`${d}T00:00:00`)),
        dateStr: d,
      }));

      setApiAvailableDates(parsedDates);

      if (parsedDates.length > 0) {
        const nextAvailable = parsedDates
          .map((d) => d.dateObj)
          .sort((a, b) => a - b)
          .find((d) => d >= today);

        setCurrentMonth(nextAvailable || today);
      } else {
        setCurrentMonth(today);
      }

      setSelectedDate(null);
      setShowForm(false);
      setConfirmedSlot(null);
    } catch (err) {
      console.error("Failed to load available dates", err);
      setApiAvailableDates([]);
    }
  };

  fetchAvailableDates();
}, [mentorId, isOpen]);


  const renderHeader = () => (
    <div className="flex flex-col items-start gap-4 mb-10">
      <div
        className="text-sm text-indigo-900 cursor-pointer flex items-center gap-1"
        onClick={onClose}
      >
        <FiArrowLeft className="text-lg" />
        Back
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center border"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center border"
          >
            <FiChevronRight />
          </button>
        </div>

        <div className="text-indigo-900 font-semibold text-base">
          {format(currentMonth, "MMM yyyy")}
        </div>
      </div>
    </div>
  );

  const renderDays = () => {
    const start = startOfWeek(currentMonth);
    return (
      <div className="grid grid-cols-7 text-center font-medium text-sm text-gray-500 border-t border-l border-gray-400">
        {Array(7)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="py-5 border-r border-b border-gray-400 bg-white"
            >
              {format(addDays(start, i), "EEE")}
            </div>
          ))}
      </div>
    );
  };

  const renderCells = () => {
    const startDate = startOfWeek(startOfMonth(currentMonth));
    const endDate = endOfWeek(endOfMonth(currentMonth));
    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const cells = [];

      for (let i = 0; i < 7; i++) {
        const matchedApiDate = apiAvailableDates.find((d) =>
          isSameDay(d.dateObj, startOfDay(day))
        );

        const isApiAvailable = !!matchedApiDate;
        const isToday = isSameDay(day, today);
        const isSelected =
          selectedDate &&
          isSameDay(day, startOfDay(selectedDate.dateObj));

        let style = "text-indigo-900";

        if (!isSameMonth(day, currentMonth)) {
          style = "text-gray-300";
        } else if (!isApiAvailable) {
          style = "bg-gray-300 text-gray-600 cursor-not-allowed";
        } else if (isSelected) {
          style = "bg-blue-400 text-white border border-white";
        } else if (isToday) {
          style =
            "bg-indigo-900 text-white cursor-pointer hover:bg-indigo-800";
        } else {
          style += " hover:bg-indigo-100 cursor-pointer";
        }

        cells.push(
          <div
            key={day.toISOString()}
            className={`h-14 flex items-center justify-center text-sm border-r border-b border-gray-400 ${style}`}
            onClick={() => {
              if (!matchedApiDate) return;

              const newSelected = {
                dateObj: matchedApiDate.dateObj,
                dateStr: matchedApiDate.dateStr,
              };

              setSelectedDate(newSelected);
              setShowForm(true);

              console.log("✅ Date selected:", newSelected);
            }}
          >
            {format(day, "d")}
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div className="grid grid-cols-7" key={day.toISOString()}>
          {cells}
        </div>
      );
    }

    return <div className="border-l border-gray-400">{rows}</div>;
  };

  /* ================= FINAL BOOK SLOT API ================= */
  const handleFinalBooking = async () => {
    if (!confirmedSlot) return alert("Select a slot");
    if (!type.trim() || !about.trim())
      return alert("Type and Topic are mandatory!");
    if (!student) return alert("Profile not loaded");

    // START LOADING STATE
    setIsBooking(true);

    const payload = {
      slot_id: confirmedSlot.slot_id,
      mentor_id: mentorId,
      student_id: student.id,
      student_email: student.email,
      student_name: student.name,
      session_type: type,
      topic: about,
    };

    try {
      const res = await fetch(`${API_BASE}/mentor/slot/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Booking failed");

      alert("✅ Slot booked successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Slot booking failed");
    } finally {
        // STOP LOADING STATE REGARDLESS OF SUCCESS/FAILURE
        setIsBooking(false);
    }
  };

  /* ================= UI RENDER ================= */
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="fixed inset-0 bg-white flex flex-col p-10 pb-20 overflow-y-auto">
        <div className="relative flex flex-col w-full h-full">
          {renderHeader()}
          {renderDays()}
          {renderCells()}

          {/* ✅ LEGENDS */}
          <div className="flex gap-6 mt-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-[#343079] rounded" /> Today
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-400 rounded border border-white" />
              Selected
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-gray-300 rounded" />
              No slots available
            </div>
          </div>

          {/* ✅ TYPE & TOPIC (UNCHANGED UI) */}
          <div className="mt-10 flex flex-col gap-6">
            <div className="flex flex-row items-center gap-4">
              <label className="text-sm font-semibold text-[#343079]">
                Type *
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-[400px] border border-[#343079] rounded-md px-4 py-3 text-sm"
              />
            </div>

            <div className="flex flex-row items-center gap-4">
              <label className="text-sm font-semibold text-[#343079]">
                Topic *
              </label>
              <input
                type="text"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-[400px] border border-[#343079] rounded-md px-4 py-3 text-sm"
              />
            </div>
          </div>

          {/* ✅ FINAL CONFIRM BUTTON (UPDATED) */}
          <button
            onClick={handleFinalBooking}
            // Disable button if not confirmed, type/about is missing, OR if a booking is already in progress
            disabled={!confirmedSlot || !type || !about || isBooking}
            className={`mt-10 w-[300px] py-3 rounded-md text-white text-sm font-semibold
              ${
                confirmedSlot && type && about && !isBooking
                  ? "bg-indigo-900 hover:bg-indigo-800"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            {/* Show "Booking..." when loading, otherwise show "Final Confirm Booking" */}
            {isBooking ? "Booking..." : "Final Confirm Booking"}
          </button>

          {/* ✅ SLOT POPUP */}
          {showForm && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-50">
              <div className="w-full max-w-xl p-6 bg-white rounded-xl shadow-xl">
                <TimeSlotForm
                  selectedDateObj={selectedDate?.dateObj}
                  selectedDateStr={selectedDate?.dateStr}
                  mentorId={mentorId}
                  onBack={() => setShowForm(false)}
                  onConfirm={(slotData) => {
                    setConfirmedSlot(slotData);
                    setShowForm(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default CalendarModal;