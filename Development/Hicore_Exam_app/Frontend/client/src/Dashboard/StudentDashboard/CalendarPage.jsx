import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 – 20:00

const events = [
  { date: "2025-09-25", hour: 14, label: "Chemistry Exam", type: "exam" },
  { date: "2025-09-27", hour: 15, label: "Physics Practice", type: "practice" },
];

const typeStyles = {
  exam: "bg-red-100 text-red-500",
  practice: "bg-green-100 text-green-600",
  revision: "bg-purple-100 text-purple-600",
};

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("monthly");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const monthLabel =
    viewMode === "monthly"
      ? currentDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })
      : `Week of ${startOfWeek.toLocaleDateString()}`;

  const handlePrev = () => {
    setCurrentDate(
      new Date(
        year,
        viewMode === "monthly" ? month - 1 : month,
        viewMode === "monthly" ? 1 : currentDate.getDate() - 7
      )
    );
  };

  const handleNext = () => {
    setCurrentDate(
      new Date(
        year,
        viewMode === "monthly" ? month + 1 : month,
        viewMode === "monthly" ? 1 : currentDate.getDate() + 7
      )
    );
  };

  return (
    <div className="w-full bg-white rounded-xl  p-6">
      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 text-[#2758B3] font-semibold">
          <ChevronLeft className="cursor-pointer" onClick={handlePrev} />
          <span>{monthLabel}</span>
          <ChevronRight className="cursor-pointer" onClick={handleNext} />
        </div>

        {/* VIEW TOGGLE */}
        <div className="flex items-center bg-[#F2F6FF] rounded-full p-1">
          <button
            onClick={() => setViewMode("monthly")}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              viewMode === "monthly"
                ? "bg-[#2758B3] text-white"
                : "text-[#2758B3]"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              viewMode === "weekly"
                ? "bg-[#2758B3] text-white"
                : "text-[#2758B3]"
            }`}
          >
            Weekly
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            + Add Event
          </button>
          <button className="flex items-center gap-2 bg-[#2758B3] text-white px-4 py-2 rounded-full text-sm font-medium">
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* MONTHLY VIEW */}
      {viewMode === "monthly" && (
        <div className="border border-[#B0CBFE] rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 bg-[#F9FBFF]">
            {days.map((day) => (
              <div
                key={day}
                className="text-center py-3 text-sm font-semibold text-[#2758B3] border-r border-[#B0CBFE] last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {Array.from({ length: totalCells }).map((_, index) => {
              const dateNum = index - firstDayOfMonth + 1;
              const isValid = dateNum > 0 && dateNum <= daysInMonth;

              return (
                <div
                  key={index}
                  className="h-28 border border-[#B0CBFE] p-2 text-sm"
                >
                  {isValid && <span className="text-gray-500">{dateNum}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEKLY VIEW */}
      {viewMode === "weekly" && (
        <div className="border border-[#B0CBFE] rounded-xl overflow-hidden">
          <div className="grid grid-cols-8 bg-[#F9FBFF]">
            <div className="border-r border-[#B0CBFE]" />
            {weekDates.map((d) => (
              <div
                key={d.toDateString()}
                className="text-center py-3 text-sm font-semibold text-[#2758B3] border-r border-[#B0CBFE] last:border-r-0"
              >
                {days[d.getDay()]} <br /> {d.getDate()}
              </div>
            ))}
          </div>

          {hours.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-8 border-t border-[#B0CBFE]"
            >
              <div className="text-xs text-gray-400 p-2 border-r border-[#B0CBFE]">
                {hour}:00
              </div>

              {weekDates.map((d) => {
                const dateKey = d.toISOString().split("T")[0];
                const event = events.find(
                  (e) => e.date === dateKey && e.hour === hour
                );

                return (
                  <div
                    key={dateKey + hour}
                    className="h-12 border-r border-[#B0CBFE] p-1 last:border-r-0"
                  >
                    {event && (
                      <div
                        className={`text-xs px-2 py-1 rounded-full w-fit ${
                          typeStyles[event.type]
                        }`}
                      >
                        {event.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* LEGEND */}
      <div className="flex items-center gap-6 mt-6 text-sm text-[#2758B3]">
        <span className="font-semibold">Event Categories:</span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-sm" /> Practice
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-sm" /> Exam
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-purple-500 rounded-sm" /> Revision
        </span>
      </div>
    </div>
  );
};

export default CalendarPage;
