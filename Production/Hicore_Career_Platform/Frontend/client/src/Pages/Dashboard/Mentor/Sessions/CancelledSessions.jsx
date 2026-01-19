import React, { useEffect, useState } from "react";
import cancelledSessionIcon from "../../../../assets/MentorSessions/Calendar.png";
import {
  CalendarDays,
  Clock,
  Users,
  Video,
  Play,
  RefreshCcw,
} from "lucide-react";
import axios from "axios";

// ✅ API BASE
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const CancelledSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch Cancelled Sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);

        const mentorId = localStorage.getItem("userId");
        if (!mentorId) {
          setError("Mentor ID not found");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${API_BASE}/mentor/${mentorId}/sessions/cancelled`
        );

        setSessions(res.data || []);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load cancelled sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[250px] text-gray-500">
        Loading cancelled sessions...
      </div>
    );
  }

  // ✅ Error UI
  if (error) {
    return (
      <div className="flex justify-center items-center h-[250px] text-red-500 font-medium">
        {error}
      </div>
    );
  }

  // ✅ Empty State UI
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center w-full h-[300px]">
        <img
          src={cancelledSessionIcon}
          alt="Cancelled Session Icon"
          className="w-16 h-16 mb-4 mx-auto opacity-60"
        />

        <p className="text-gray-600 text-md font-semibold mb-2">
          No Cancelled Sessions.
        </p>
        <p className="text-gray-400 text-sm mb-6">
          Your cancelled session history will appear here
        </p>

        <button className="bg-[#3D2C8D] text-white text-sm font-medium px-6 py-2 rounded-md shadow hover:bg-[#2c1f66]">
          Go to Upcoming Sessions
        </button>
      </div>
    );
  }

  // ✅ Data UI
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Session Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="border border-gray-300 rounded-lg p-5 text-left shadow-sm"
          >
            {/* Status */}
            <div className="bg-yellow-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full w-max mb-3">
              Cancelled Session
            </div>

            {/* Title */}
            <h3 className="text-md font-semibold text-blue-900 mb-4">
              {session.topic || session.session_type}
            </h3>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-sm text-blue-900">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} />
                {session.date}
              </div>

              <div className="flex items-center gap-2">
                <Clock size={16} />
                {session.start_time} – {session.end_time}
              </div>

              <div className="flex items-center gap-2">
                <Users size={16} />
                {session.student_profile?.first_name}{" "}
                {session.student_profile?.last_name}
              </div>

              <div className="flex items-center gap-2">
                <Video size={16} />
                Online (Google Meet)
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                disabled
                className="flex-1 flex items-center justify-center gap-2 bg-gray-300 text-gray-600 rounded-md py-2 text-sm font-medium cursor-not-allowed"
              >
                <Play size={16} /> Cancelled
              </button>

              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-400 text-gray-700 rounded-md py-2 text-sm font-medium hover:bg-gray-100 transition">
                <RefreshCcw size={16} /> Re-schedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CancelledSessions;
