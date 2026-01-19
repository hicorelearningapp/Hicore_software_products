import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";

// ✅ API BASE
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [sessions, setSessions] = useState({
    upcoming: [],
    ongoing: [],
    completed: [],
    cancelled: [],
  });
  const [loading, setLoading] = useState(true);

  const daysInMonth = currentMonth.daysInMonth();
  const startDay = currentMonth.startOf("month").day();

  // ✅ Fetch All 4 Session Types
  useEffect(() => {
    const fetchCalendarSessions = async () => {
      try {
        setLoading(true);

        const mentorId = localStorage.getItem("userId");
        if (!mentorId) {
          setLoading(false);
          return;
        }

        const [upcomingRes, ongoingRes, completedRes, cancelledRes] =
          await Promise.all([
            axios.get(`${API_BASE}/mentor/${mentorId}/sessions/upcoming`),
            axios.get(`${API_BASE}/mentor/${mentorId}/sessions/ongoing`),
            axios.get(`${API_BASE}/mentor/${mentorId}/sessions/completed`),
            axios.get(`${API_BASE}/mentor/${mentorId}/sessions/cancelled`),
          ]);

        const upcoming = [];
        const ongoing = [];
        const completed = [];
        const cancelled = [];

        const currentMonthIndex = currentMonth.month();

        const mapToMonth = (data, targetArray) => {
          data.forEach((session) => {
            const sessionDate = dayjs(session.date);
            if (sessionDate.month() === currentMonthIndex) {
              targetArray.push(sessionDate.date());
            }
          });
        };

        mapToMonth(upcomingRes.data || [], upcoming);
        mapToMonth(ongoingRes.data || [], ongoing);
        mapToMonth(completedRes.data || [], completed);
        mapToMonth(cancelledRes.data || [], cancelled);

        setSessions({ upcoming, ongoing, completed, cancelled });
      } catch (error) {
        console.error("Calendar API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarSessions();
  }, [currentMonth]);

  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const renderDays = () => {
    const days = [];

    // ✅ Empty slots before first day
    for (let i = 0; i < startDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-gray-300" />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      let bgColor = "";

      if (sessions.upcoming.includes(day))
        bgColor = "bg-blue-500 text-white";
      else if (sessions.ongoing.includes(day))
        bgColor = "bg-indigo-900 text-white";
      else if (sessions.completed.includes(day))
        bgColor = "bg-green-600 text-white";
      else if (sessions.cancelled.includes(day))
        bgColor = "bg-gray-400 text-white";

      days.push(
        <div
          key={day}
          className={`h-24 flex items-center justify-center border border-gray-300 text-lg font-semibold ${bgColor}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-6xl mx-auto p-8 bg-white rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={prevMonth}
          className="px-3 py-2 border border-gray-300 text-blue-900 rounded-md hover:bg-gray-100"
        >
          &lt;
        </button>

        <button
          onClick={nextMonth}
          className="px-3 py-2 border border-gray-300 text-blue-900 rounded-md hover:bg-gray-100"
        >
          &gt;
        </button>

        <h2 className="text-xl text-blue-900">
          {currentMonth.format("MMMM YYYY")}
        </h2>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 text-center font-bold text-gray-700 text-lg">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="h-12 flex items-center justify-center border border-gray-300"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Loading calendar...
        </div>
      ) : (
        <div className="grid grid-cols-7 border border-gray-300">
          {renderDays()}
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-8 mt-6 text-lg flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-blue-500 inline-block"></span>
          Upcoming
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-indigo-900 inline-block"></span>
          Ongoing
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-green-600 inline-block"></span>
          Completed
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-gray-400 inline-block"></span>
          Cancelled
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
