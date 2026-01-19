import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Assets
import moreIcon from "../../../../assets/MentorProjects/Circlearrow.png";
import defaultProfile from "../../../../assets/MentorProjects/ongoing-image.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const RejectedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Get mentor ID from localStorage
  const mentorId = localStorage.getItem("userId");

  // ✅ Same image formatter as OngoingProjects
  const formatImagePath = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("app/")) {
      return imagePath.replace(/^app\//, "");
    }
    return imagePath;
  };

  // ✅ Fetch Rejected Projects
  useEffect(() => {
    if (!mentorId) return;

    const fetchRejectedProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE}/api/mentor/${mentorId}/rejected-projects`
        );

        setProjects(res.data?.data || res.data || []);
      } catch (err) {
        console.error("REJECTED PROJECTS ERROR:", err);
        setError("Failed to load rejected projects");
      } finally {
        setLoading(false);
      }
    };

    fetchRejectedProjects();
  }, [mentorId]);

  return (
    <div className="flex flex-col  text-center w-full">

      {/* ✅ LOADING STATE */}
      {loading && (
        <p className="text-gray-500 items-center justify-center font-medium mt-10">
          Loading rejected projects...
        </p>
      )}

      {/* ✅ ERROR STATE */}
      {error && (
        <p className="text-red-500 items-center justify-center font-medium mt-10">
          {error}
        </p>
      )}

      {/* ✅ EMPTY STATE */}
      {!loading && projects.length === 0 && !error && (
        <p className="text-gray-500  items-center justify-center font-medium mt-10">
          No rejected projects available
        </p>
      )}

      {/* ✅ REJECTED PROJECT LIST */}
      {!loading && projects.length > 0 && (
        <div className="max-w-7xl space-y-6 px-6 py-4 w-full">
          {projects.map((item) => (
            <div
              key={item.id}
              className="flex w-full items-center justify-between pb-4"
            >
              {/* ✅ LEFT SIDE */}
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.project?.image
                      ? `${API_BASE}/${formatImagePath(item.project.image)}`
                      : defaultProfile
                  }
                  alt={item.student?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div className="text-left">
                  <p className="text-green-600 text-sm font-medium">
                    Student Email: {item.student?.email || "—"}
                  </p>
                  <h2 className="text-sm font-semibold text-gray-900">
                    {item.student?.name}{" "}
                    <span className="font-normal">
                      - {item.project?.title}
                    </span>
                  </h2>

                  {/*<p className="text-green-600 text-sm font-medium">
                    Rejected on {item.rejected_date || "—"}
                  </p>*/}
                </div>
              </div>

              {/* ✅ RIGHT SIDE ICON */}
              <button>
                <img
                  src={moreIcon}
                  alt="action"
                  className="w-5 h-5 opacity-70 hover:opacity-100"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RejectedProjects;
