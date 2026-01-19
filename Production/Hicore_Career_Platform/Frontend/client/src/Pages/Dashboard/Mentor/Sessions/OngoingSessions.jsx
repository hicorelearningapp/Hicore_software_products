import React, { useEffect, useState } from "react";
import ongoingSessionIcon from "../../../../assets/MentorSessions/Calendar.png";
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

const OngoingSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch Ongoing Sessions
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
          `${API_BASE}/mentor/${mentorId}/sessions/ongoing`
        );

        setSessions(res.data || []);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load ongoing sessions");
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
        Loading ongoing sessions...
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
          src={ongoingSessionIcon}
          alt="Ongoing Session Icon"
          className="w-16 h-16 mb-4 mx-auto opacity-60 items-center justify-center"
        />

        <p className="text-gray-600 text-md font-semibold mb-2">
          No Ongoing Sessions.
        </p>
        <p className="text-gray-400 text-sm mb-6">
          Your live sessions will appear here
        </p>
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
            <div className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full w-max mb-3">
              Ongoing Session
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
              <a
                href={session.google_meet_link}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#3D2C8D] text-white rounded-md py-2 text-sm font-medium hover:bg-[#2c1f66] transition"
              >
                <Play size={16} /> Join Now
              </a>

              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-400 text-gray-700 rounded-md py-2 text-sm font-medium hover:bg-gray-100 transition">
                <RefreshCcw size={16} /> Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OngoingSessions;
