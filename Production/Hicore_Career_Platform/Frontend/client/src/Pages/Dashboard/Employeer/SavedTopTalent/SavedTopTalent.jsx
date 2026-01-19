// src/Services/ViewTopTalent/SavedTopTalent.jsx
import React, { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";

import emptyBookmark from "../../../../assets/EmployeerDashboard/EmployerApplication/empty-bookmark.png";

import locationIcon from "../../../../assets/Employer/CandidateProfile/location.png";
import experienceIcon from "../../../../assets/Employer/CandidateProfile/work.png";
import bookmarkIcon from "../../../../assets/Employer/CandidateProfile/save.png";
import tickicon from "../../../../assets/Employer/CandidateProfile/Correct.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const SavedTopTalent = () => {
  const [showProfiles, setShowProfiles] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = Number(localStorage.getItem("userId"));

  // 📌 Fetch bookmarked candidate profiles
  useEffect(() => {
    if (!showProfiles) return;

    const fetchBookmarks = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE}/bookmark/list/${userId}`);
        if (!res.ok) throw new Error("Failed to load saved candidates");

        const data = await res.json();

        const extracted = data.bookmarks.map((b) => {
          let img = b.data.profile_image || "";
          if (img.startsWith("/")) img = img.substring(1);
          img = `${API_BASE}/${img}`; // final image URL

          return {
            id: b.id,
            user_id: b.data.user_id,
            name: b.data.name,
            role: b.data.title,
            location: b.data.location,
            experience: `${b.data.experience_years} years`,
            skills: b.data.skills,
            bio: b.data.professional_bio,
            match_score: b.data.match_score,
            image: img,
          };
        });

        setProfiles(extracted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [showProfiles]);

  return (
    <div className="flex flex-col m-4 items-center justify-center min-h-screen text-center bg-white rounded-lg border border-[#343079] p-6">

      {/* Empty screen */}
      {!showProfiles && (
        <>
          <img
            src={emptyBookmark}
            alt="empty bookmark"
            className="w-16 h-16 mb-6 opacity-70"
          />

          <h2 className="text-gray-600 font-semibold text-lg mb-2">
            You haven’t saved any candidates yet
          </h2>

          <p className="text-gray-400 mb-6 text-sm">
            Browse candidate profiles and save the ones you’re interested in.
          </p>

          <button
            onClick={() => setShowProfiles(true)}
            className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all text-white px-6 py-2 rounded-md shadow text-sm font-medium"
          >
            View Candidate Profiles
          </button>
        </>
      )}

      {/* When user clicks "View Candidate Profiles" */}
      {showProfiles && (
        <>
          {loading ? (
            <p className="text-center text-blue-600 py-10">Loading...</p>
          ) : profiles.length === 0 ? (
            <p className="text-gray-500 mt-6">No saved profiles found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex flex-col justify-between h-[500px] p-5 border border-[#C0BFD5] rounded-lg bg-white hover:shadow-md transition"
                >
                  {/* TOP Section */}
                  <div className="flex gap-5">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-1/2 h-[190px] rounded-lg border object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                      }}
                    />

                    <div className="w-1/2 flex flex-col gap-2 text-left">
                      <h6 className="font-bold text-[16px] text-[#343079]">
                        {profile.name}
                      </h6>

                      <p className="font-semibold text-[14px] text-[#343079]">
                        {profile.role}
                      </p>

                      <div className="flex items-center gap-2">
                        <img src={locationIcon} className="w-4 h-4" />
                        <span className="text-[14px]">
                          {profile.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <img src={experienceIcon} className="w-4 h-4" />
                        <span className="text-[14px]">
                          {profile.experience}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="bg-green-600 text-white rounded-full px-4 py-1 text-sm">
                      {profile.match_score}% Match
                    </div>

                    <img
                      src={bookmarkIcon}
                      className="w-6 h-6"
                      style={{
                        filter:
                          "brightness(0) saturate(100%) invert(31%) sepia(75%) saturate(2963%) hue-rotate(204deg) brightness(97%) contrast(101%)",
                      }}
                    />
                  </div>

                  {/* Bio */}
                  <p className="text-[15px] text-[#343079] mt-2 line-clamp-3 text-left">
                    {profile.bio}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-[#F0F7FF] text-[#3F6699] rounded-full px-4 py-1 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-row gap-2 mt-6">
                    <button className="flex flex-row w-1/2 h-[40px] items-center justify-center gap-2 border border-[#343079] rounded-lg">
                      <FiEye className="w-[20px] h-[20px]" />
                      <h2 className="text-[14px] font-semibold text-[#343079]">
                        Profile
                      </h2>
                    </button>

                    <button className="flex flex-row w-1/2 h-[40px] items-center justify-center gap-2 bg-[#343079] rounded-lg">
                      <img src={tickicon} className="w-[20px] h-[20px]" />
                      <h2 className="text-white text-[14px] font-semibold">
                        Shortlist
                      </h2>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavedTopTalent;
