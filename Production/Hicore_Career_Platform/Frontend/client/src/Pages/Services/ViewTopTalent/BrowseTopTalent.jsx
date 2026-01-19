import React, { useState, useEffect } from "react";
import searchImage from "../../../assets/Toptalent/secondPage-image.png";
import { useNavigate } from "react-router-dom";

import locationIcon from "../../../assets/Employer/CandidateProfile/location.png";
import experienceIcon from "../../../assets/Employer/CandidateProfile/work.png";
import bookmarkIcon from "../../../assets/Employer/CandidateProfile/save.png";
import eyeicon from "../../../assets/Employer/CandidateProfile/Eye.png";
import tickicon from "../../../assets/Employer/CandidateProfile/Correct.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

// ===== Simple Toast UI =====
const Toast = ({ toast }) => {
  if (!toast.visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        background: toast.type === "error" ? "#d93737" : "#2b7cff",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: 8,
        fontSize: 14,
        zIndex: 1500,
      }}
    >
      {toast.message}
    </div>
  );
};

const BrowseTopTalent = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarkLoadingIds, setBookmarkLoadingIds] = useState(new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const navigate = useNavigate();

  const showToast = (msg, type = "success") => {
    setToast({ visible: true, message: msg, type });
    setTimeout(
      () => setToast({ visible: false, message: "", type: "success" }),
      2000
    );
  };

  const getCurrentUserId = () => {
    const raw = localStorage.getItem("userId");
    return raw ? Number(raw) : null;
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);

        const matchRes = await fetch(`${API_BASE}/match/getmatch?top_k=5`);
        if (!matchRes.ok) throw new Error("Failed to load profiles");

        const matchData = await matchRes.json();

        const updatedProfiles = await Promise.all(
          matchData.results.map(async (item) => {
            try {
              const res = await fetch(`${API_BASE}/profile/${item.user_id}`);
              if (!res.ok) return item;

              const data = await res.json();
              const basic = data.basicInfo || {};

              return {
                ...item,
                user_id: item.user_id,
                name: `${basic.first_name || ""} ${
                  basic.last_name || ""
                }`.trim(),
                role: data.jobPreference?.job_titles || "Software Developer",
                location: basic.location || "India",
                experience:
                  data.workExperience?.length !== undefined
                    ? `${data.workExperience.length} years`
                    : "0 years",
                skills: data.skillsResume?.resume_skills || [],
                bio:
                  basic.professional_bio ||
                  "Passionate developer with strong focus on building efficient digital products.",
                image: basic.profile_image
                  ? `${API_BASE}/${basic.profile_image}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                match_score: item.match_score ?? 0,
              };
            } catch {
              return item;
            }
          })
        );

        setProfiles(updatedProfiles);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // ========= FINAL WORKING BOOKMARK HANDLER ============
  const handleBookmarkClick = async (profile) => {
    const pid = String(profile.user_id);
    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      showToast("Login required", "error");
      return;
    }

    if (bookmarkLoadingIds.has(pid)) return;

    setBookmarkLoadingIds((s) => new Set([...s, pid]));

    try {
      let rawImage = profile.image || "";
      const prefix = `${API_BASE}/`;
      if (rawImage.startsWith(prefix)) rawImage = rawImage.replace(prefix, "");
      rawImage = rawImage.replace(/^\//, "");

      const payload = {
        user_id: currentUserId,
        bookmark_type: "ai_match",
        bookmarked_data: {
          user_id: profile.user_id,
          name: profile.name,
          title: profile.role,
          location: profile.location,
          experience_years:
            Number(String(profile.experience).replace(/[^\d]/g, "")) || 0,
          skills: profile.skills,
          profile_image: rawImage,
          professional_bio: profile.bio,
          match_score: profile.match_score,
        },
      };

      const res = await fetch(`${API_BASE}/bookmark/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const txt = await res.text();
      if (!res.ok) throw new Error(txt);

      setBookmarkedIds((set) => new Set([...set, pid]));
      showToast("Bookmarked Successfully ✔");
    } catch (err) {
      showToast("Bookmark Failed ❌", "error");
    } finally {
      setBookmarkLoadingIds((s) => {
        const next = new Set(s);
        next.delete(pid);
        return next;
      });
    }
  };

  if (loading)
    return <p className="text-center text-blue-600 py-10">Loading...</p>;

  if (error)
    return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <div className="px-4 sm:px-6 md:px-12 py-8">
      <Toast toast={toast} />

      <button
        onClick={() => window.history.back()}
        className="text-[#4631A1] mb-6 flex items-center gap-2 hover:underline"
      >
        ← Back
      </button>

      <div className="flex justify-center">
        <img src={searchImage} className="h-40 sm:h-48 object-contain" />
      </div>

      <h2 className="text-center text-3xl font-semibold text-[#2b2b5f] mt-6">
        Find the Perfect Fit, Instantly
      </h2>

      <p className="text-center text-lg text-[#2b2b5f] mt-2 max-w-2xl mx-auto">
        AI-curated profiles of professionals ready to bring value to your team.
      </p>

      <h3 className="text-lg font-bold text-[#4631A1] mt-10 mb-4">
        Top 5 AI Recommended Profiles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile, idx) => {
          const pid = String(profile.user_id);
          const loading = bookmarkLoadingIds.has(pid);
          const saved = bookmarkedIds.has(pid);

          return (
            <div
              key={idx}
              className="flex flex-col justify-between h-[500px] p-5 border border-[#C0BFD5] rounded-lg"
            >
              {/* TOP SECTION */}
              <div className="flex gap-5">
                <img
                  src={profile.image}
                  className="w-1/2 h-[190px] rounded-lg border object-cover"
                />

                <div className="w-1/2 flex flex-col gap-2">
                  <h6 className="font-bold text-[16px] text-[#343079]">
                    {profile.name}
                  </h6>
                  <p className="font-semibold text-[14px] text-[#343079]">
                    {profile.role}
                  </p>

                  <div className="flex items-center gap-2">
                    <img src={locationIcon} className="w-4 h-4" />
                    <span className="text-[14px]">{profile.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <img src={experienceIcon} className="w-4 h-4" />
                    <span className="text-[14px]">{profile.experience}</span>
                  </div>
                </div>
              </div>

              {/* MATCH + BOOKMARK */}
              <div className="flex items-center justify-between mt-3">
                <div className="bg-green-600 text-white rounded-full px-4 py-1 text-sm">
                  {profile.match_score}% Match
                </div>

                <button onClick={() => handleBookmarkClick(profile)} disabled={loading}>
                  <img
                    src={bookmarkIcon}
                    className="w-6 h-6"
                    style={{
                      filter: saved
                        ? "brightness(0) saturate(100%) invert(31%) sepia(75%) saturate(2963%) hue-rotate(204deg) brightness(97%) contrast(101%)"
                        : "grayscale(1)",
                      opacity: loading ? 0.6 : 1,
                    }}
                  />
                </button>
              </div>

              {/* BIO */}
              <p className="text-[15px] text-[#343079] mt-2 line-clamp-3">
                {profile.bio}
              </p>

              {/* SKILLS */}
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills.map((s, i) => (
                  <span
                    key={i}
                    className="bg-[#F0F7FF] text-[#3F6699] rounded-full px-4 py-1 text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* BUTTONS */}
              <div className="flex flex-row gap-2 mt-6">
                <button
                  onClick={() => navigate(`/view-top-talent/${profile.user_id}`)}
                  className="flex flex-row w-1/2 h-[40px] items-center justify-center gap-2 border border-[#343079] rounded-lg"
                >
                  <img src={eyeicon} className="w-[20px] h-[20px]" />
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
          );
        })}
      </div>
    </div>
  );
};

export default BrowseTopTalent;
