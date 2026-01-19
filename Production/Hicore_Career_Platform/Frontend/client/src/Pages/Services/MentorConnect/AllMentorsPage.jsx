import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import MentorCard from "./MentorCard";
import CalendarModal from "./CalendarModal";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const AllMentorsPage = () => {
  const navigate = useNavigate();

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [domain, setDomain] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");

  const [selectedMentorId, setSelectedMentorId] = useState(null);
  const [openCalendar, setOpenCalendar] = useState(false);

  const handleBack = () => navigate("/mentor-connect");

  // ✅ Store the correct ID (prefer user_id if backend uses that)
  const handleBook = (mentorId) => {
    setSelectedMentorId(mentorId);
    setOpenCalendar(true);
  };

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch(`${API_BASE}/mentor/list`);
        const data = await res.json();
        const acceptedMentors = data?.filter(
          (mentor) => mentor.status === "accepted"
        );
        setMentors(acceptedMentors || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter((mentor) => {
    const query = searchQuery.toLowerCase();

    const fullName = `${mentor.first_name} ${mentor.last_name}`.toLowerCase();

    const matchesSearch =
      fullName.includes(query) ||
      mentor.professional_title?.toLowerCase().includes(query) ||
      mentor.tags?.some((tag) => tag.toLowerCase().includes(query));

    const matchesDomain = domain === "" || mentor.domain === domain;

    const mentorExp = parseInt(mentor.experience_years);
    const matchesExperience =
      experience === "" ||
      (experience === "1 - 2 yrs" && mentorExp >= 1 && mentorExp <= 2) ||
      (experience === "3 - 5 yrs" && mentorExp >= 3 && mentorExp <= 5) ||
      (experience === "6 - 10 yrs" && mentorExp >= 6 && mentorExp <= 10) ||
      (experience === "10+ yrs" && mentorExp >= 10);

    const matchesAvailability =
      availability === "" ||
      mentor.available_time_slots?.some((slot) =>
        slot.toLowerCase().includes(availability.toLowerCase())
      );

    return (
      matchesSearch &&
      matchesDomain &&
      matchesExperience &&
      matchesAvailability
    );
  });

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <button
        onClick={handleBack}
        className="mb-4 text-sm font-semibold text-blue-900 flex items-center hover:underline"
      >
        <FiArrowLeft className="mr-1" /> Back
      </button>

      {/* Search */}
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg mb-8">
        <div className="mb-6 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-md"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading mentors...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredMentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={{
                id: mentor.id,
                user_id: mentor.user_id, // keep original if present
                name: `${mentor.first_name} ${mentor.last_name}`,
                title: mentor.professional_title,
                experience: mentor.experience_years,
                company: mentor.company_name,
                tags: mentor.tags,
                image: mentor.image,
              }}
              // ✅ Pass the correct backend ID: prefer user_id, fallback to id
              onBook={() => handleBook(mentor.user_id || mentor.id)}
            />
          ))}
        </div>
      )}

      {openCalendar && (
        <CalendarModal
          isOpen={openCalendar}
          mentorId={selectedMentorId}
          onClose={() => setOpenCalendar(false)}
        />
      )}
    </div>
  );
};

export default AllMentorsPage;
