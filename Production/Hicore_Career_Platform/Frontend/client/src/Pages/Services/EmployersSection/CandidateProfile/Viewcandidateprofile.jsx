import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import locationIcon from "../../../../assets/Employer/CandidateProfile/location.png";
import experienceIcon from "../../../../assets/Employer/CandidateProfile/work.png";
import bookmarkIcon from "../../../../assets/Employer/CandidateProfile/save.png";
import shareIcon from "../../../../assets/Employer/CandidateProfile/chat.png";
import eyeicon from "../../../../assets/Employer/CandidateProfile/Eye.png";
import tickicon from "../../../../assets/Employer/CandidateProfile/Correct.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const ViewCandidateProfile = ({ filters = {} }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch all candidate profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        console.log("🌐 Fetching candidate profiles from:", `${API_BASE}/profile`);
        const res = await axios.get(`${API_BASE}/profile`);
        const allProfiles = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        setProfiles(allProfiles);
      } catch (err) {
        console.error("❌ Error fetching profiles:", err);
        setError("Failed to load candidate profiles.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  // ✅ Filtering logic
  const filteredProfiles = profiles.filter((profile) => {
    const basic = profile.basicInfo || {};
    const skills = profile.skillsResume?.resume_skills || [];
    const jobTitle = profile.jobPreference?.job_titles || "";
    const location = basic.location || "";
    const name = `${basic.first_name || ""} ${basic.last_name || ""}`;

    const matchSearch =
      !filters.search ||
      name.toLowerCase().includes(filters.search.toLowerCase()) ||
      jobTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
      skills.some((s) =>
        s.toLowerCase().includes(filters.search.toLowerCase())
      );

    const matchJob =
      !filters.jobTitle ||
      jobTitle.toLowerCase().includes(filters.jobTitle.toLowerCase());

    const matchSkills =
      !filters.skills ||
      skills.some((s) =>
        s.toLowerCase().includes(filters.skills.toLowerCase())
      );

    const matchLocation =
      !filters.location ||
      location.toLowerCase().includes(filters.location.toLowerCase());

    return matchSearch && matchJob && matchSkills && matchLocation;
  });

  // ✅ UI states
  if (loading)
    return (
      <div className="text-center py-10 text-[#343079] font-semibold">
        Loading candidate profiles...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-semibold py-10">
        {error}
      </div>
    );

  if (!filteredProfiles.length)
    return (
      <div className="text-center py-10 text-[#343079] font-semibold">
        No profiles found matching your filters.
      </div>
    );

  // ✅ Render cards
  return (
    <div className="w-full h-fit p-4">
      <h2 className="w-full text-[20px] font-poppins font-semibold text-[#343079] mb-6">
        {filteredProfiles.length} Profiles matched based on your hiring preferences
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {filteredProfiles.map((profile, idx) => {
          const basic = profile.basicInfo || {};
          const skills = profile.skillsResume?.resume_skills || [];
          const name = `${basic.first_name || ""} ${basic.last_name || ""}`;
          const title =
            profile.jobPreference?.job_titles ||
            basic.professional_title ||
            "Frontend Developer";
          const location = basic.location || "India";
          const experienceCount = profile.workExperience?.length || 0;
          const image = basic.profile_image
            ? `${API_BASE}/${basic.profile_image}`
            : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

          return (
            <div
              key={idx}
              className="flex flex-col justify-between h-[500px] p-5 border border-[#C0BFD5] rounded-lg hover:shadow-lg transition-shadow"
            >
              {/* === Top Section === */}
              <div className="flex gap-5">
                <img
                  src={image}
                  alt={name}
                  className="w-1/2 h-[192px] rounded-lg border object-cover"
                />
                <div className="w-1/2 flex flex-col gap-2">
                  <h6 className="font-bold text-[16px] text-[#343079]">
                    {name}
                  </h6>
                  <p className="text-[14px] text-[#AEADBE]">
                    {basic.professional_title || "Software Developer"}
                  </p>
                  <p className="font-semibold text-[14px] text-[#343079]">
                    {title}
                  </p>

                  <div className="flex items-center gap-2">
                    <img src={locationIcon} className="w-4 h-4" alt="" />
                    <span className="text-[14px]">{location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <img src={experienceIcon} className="w-4 h-4" alt="" />
                    <span className="text-[14px]">
                      {experienceCount} years experience
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#008000]" />
                    <span className="text-[14px]">Actively looking for job</span>
                  </div>
                </div>
              </div>

              {/* === Match + Actions === */}
              <div className="flex items-center justify-between mt-3">
                <div className="bg-[#008000] text-white rounded-full px-4 py-1 text-sm">
                  92% Match
                </div>
                <div className="flex gap-3">
                  <img src={bookmarkIcon} alt="Bookmark" className="w-6 h-6" />
                  <img src={shareIcon} alt="Share" className="w-6 h-6" />
                </div>
              </div>

              {/* === About === */}
              <p className="text-[15px] text-[#343079] leading-[22px] mt-2 line-clamp-3">
                {basic.professional_bio ||
                  "Passionate developer with a strong focus on building efficient, user-friendly web applications."}
              </p>

              {/* === Skills === */}
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="bg-[#F0F7FF] text-[#3F6699] rounded-full px-4 py-1 text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* === Buttons === */}
              <div className="flex flex-row gap-2 mt-6">
                <button
                  onClick={() => navigate(`/candidate-profile/${basic.user_id}`)}
                  className="flex flex-row w-1/2 h-[40px] items-center justify-center gap-2 border border-[#343079] rounded-lg hover:bg-[#F4F3FF] transition"
                >
                  <img src={eyeicon} alt="eye" className="w-[20px] h-[20px]" />
                  <h2 className="text-[14px] font-semibold text-[#343079]">
                    View Full Profile
                  </h2>
                </button>

                <button className="flex flex-row w-1/2 h-[40px] items-center justify-center gap-2 bg-[#343079] rounded-lg hover:bg-[#2b276a] transition">
                  <img src={tickicon} alt="tick" className="w-[20px] h-[20px]" />
                  <h2 className="text-[14px] font-semibold text-white">
                    Invite to Apply
                  </h2>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewCandidateProfile;
