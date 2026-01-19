import React from "react";
import calendarIcon from "../../../assets/MentorPage/Calendar.png";
import chatIcon from "../../../assets/MentorPage/Chat.png";
import durationIcon from "../../../assets/MentorPage/time.png";
import tagsIcon from "../../../assets/MentorPage/Work.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const MentorCard = ({ mentor, onBook }) => {
  const formatAvailability = () => {
    if (!mentor.availability) return "";
    if (Array.isArray(mentor.availability))
      return mentor.availability.join(", ");
    if (typeof mentor.availability === "string") return mentor.availability;
    return "";
  };

  return (
    <div className="rounded-xl shadow-md border border-blue-900 overflow-hidden bg-white flex flex-col justify-between">
      {/* IMAGE */}
      <img
        src={
          mentor.image
            ? mentor.image.startsWith("http")
              ? mentor.image
              : `${API_BASE}/${mentor.image}`
            : "https://via.placeholder.com/300x250?text=No+Image"
        }
        alt={mentor.name}
        className="w-full h-64 object-cover"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/300x250?text=No+Image";
        }}
      />

      <div className="p-4">
        {/* NAME & TITLE */}
        <h3 className="font-semibold text-lg text-indigo-900 mb-2">
          {mentor.name}
        </h3>

        <p className="text-md text-blue-900 mb-4">
          {mentor.title || "Mentor"}
        </p>

        {/* CALENDAR & CHAT ICONS */}
        <div className="flex items-center justify-between text-sm text-blue-900 mb-4">
          <div className="flex items-center gap-2">
            <img src={calendarIcon} alt="Calendar" className="w-6 h-6" />
            <img src={chatIcon} alt="Chat" className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-2">
            <span>⭐ 5.0</span>
          </div>
        </div>

        {/* EXPERIENCE */}
        <div className="flex items-center gap-2 text-sm text-blue-900 mb-2">
          <img src={durationIcon} alt="Experience" className="w-5 h-5" />
          <span>
            {mentor.experience
              ? `${mentor.experience} years`
              : "N/A"}{" "}
            experience
          </span>
        </div>

        {/* TAGS */}
        <div className="flex items-center gap-2 text-sm text-blue-900 mb-2">
          <img src={tagsIcon} alt="Tags" className="w-5 h-5" />
          <span>
            {Array.isArray(mentor.tags)
            ? mentor.tags.join(", ")
            : typeof mentor.tags === "string"
            ? mentor.tags
            : "No tags"}
          </span>
        </div>

        {/* AVAILABILITY (optional) */}
        {formatAvailability() && (
          <div className="text-xs text-indigo-900 mt-2">
            <strong>Availability:</strong> {formatAvailability()}
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={onBook}
        className="bg-indigo-900 text-white py-4 font-semibold text-center hover:bg-indigo-800 transition"
      >
        Request Mentorship
      </button>
    </div>
  );
};

export default MentorCard;
