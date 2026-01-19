import React, { useState, useEffect } from "react";
import AllTalentProfiles from "./AllTalentProfiles";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const TopTalent = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch(`${API_BASE}/bookmark/list/${userId}`);
        const data = await res.json();

        const mapped = data.bookmarks.map((b) => ({
          id: b.id,
          user_id: b.data.user_id,
          name: b.data.name,
          title: b.data.title,
          location: b.data.location,
          experience_years: b.data.experience_years,
          skills: b.data.skills,
          bio: b.data.professional_bio,
          match_score: b.data.match_score,
          image: b.data.profile_image.startsWith("/api")
            ? b.data.profile_image.replace("/api", API_BASE)
            : b.data.profile_image,
        }));

        setProfiles(mapped);
      } catch (error) {
        console.error("Error loading bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchBookmarks();
  }, [userId]);

  if (loading) return <p className="text-blue-600 py-10">Loading...</p>;

  return (
    <div className="mx-auto max-w-screen-xl px-4">
      {/* ONLY THIS: Show bookmarked profiles list */}
      <AllTalentProfiles profiles={profiles} />
    </div>
  );
};

export default TopTalent;
