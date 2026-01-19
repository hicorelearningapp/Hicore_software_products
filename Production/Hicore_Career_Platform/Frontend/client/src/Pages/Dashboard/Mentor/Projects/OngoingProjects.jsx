import React, { useState, useEffect } from "react";
import axios from "axios";

// ✅ Assets
import ongoingProjectIcon from "../../../../assets/MentorProjects/Projects.png";
import projectImage from "../../../../assets/MentorProjects/ongoing-image.png";
import bookmarkIcon from "../../../../assets/MentorProjects/Save.png";
import chatIcon from "../../../../assets/MentorProjects/message.png";
import downloadIcon from "../../../../assets/MentorProjects/Download.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const OngoingProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mentorId = localStorage.getItem("userId");
  
  const formatImagePath = (imagePath) => {
  if (!imagePath) return "";
  // "app/uploads/projects/PMI1/image_PMI1.jpeg" → "uploads/projects/PMI1/image_PMI1.jpeg"
  if (imagePath.startsWith("app/")) {
    return imagePath.replace(/^app\//, "");
  }
  return imagePath;
};

  // ✅ Fetch Ongoing Projects
  useEffect(() => {
    if (!mentorId) return;

    const fetchOngoingProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE}/api/mentor/${mentorId}/ongoing-projects`
        );
        setProjects(res.data || []);
      } catch (err) {
        console.error("ONGOING PROJECTS ERROR:", err);
        setError("Failed to load ongoing projects");
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingProjects();
  }, [mentorId]);

  /* ✅ FUNCTION TO RETURN STATUS TAG COLOR */
  const getStatusTag = (status) => {
    switch (status) {
      case "accepted":
        return {
          label: "In Progress",
          color: "bg-blue-100 text-blue-600",
        };
      case "completed":
        return {
          label: "Completed – Awaiting Approval",
          color: "bg-green-100 text-green-600",
        };
      default:
        return {
          label: status,
          color: "bg-gray-100 text-gray-600",
        };
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center w-full">

      {/* ✅ LOADING STATE */}
      {loading && (
        <p className="text-gray-500 font-medium mt-10">
          Loading ongoing projects...
        </p>
      )}

      {/* ✅ ERROR STATE */}
      {error && (
        <p className="text-red-500 font-medium mt-10">
          {error}
        </p>
      )}

      {/* ✅ EMPTY STATE */}
      {!loading && projects.length === 0 && (
        <>
          <img
            src={ongoingProjectIcon}
            alt="Ongoing Project Icon"
            className="w-16 h-16 mb-4 mx-auto opacity-60"
          />

          <p className="text-gray-600 font-semibold mb-2">
            No active projects yet.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Accept mentee projects to begin
          </p>
        </>
      )}

      {/* ✅ PROJECT CARDS */}
      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-7xl">
          {projects.map((item) => {
            const tag = getStatusTag(item.status);

            return (
              <div
                key={item.session_id}
                className="border border-gray-300 p-3 rounded-lg shadow-md bg-white overflow-hidden"
              >
                {/* ✅ Project Image */}
               <img
  src={
    item.project?.image
      ? `${API_BASE}/${formatImagePath(item.project.image)}`
      : projectImage
  }
  alt="Project"
  className="w-full h-50 object-contain"
/>

                {/* ✅ Icons */}
                <div className="flex items-center space-x-3 px-4 py-2">
                  <img src={bookmarkIcon} alt="bookmark" className="w-7 h-7 cursor-pointer" />
                  <img src={chatIcon} alt="chat" className="w-5 h-5 cursor-pointer" />
                  <img src={downloadIcon} alt="download" className="w-5 h-5 cursor-pointer" />
                </div>

                {/* ✅ Status Tag */}
                <div className="px-4 mb-2 mt-1 text-left">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${tag.color}`}
                  >
                    {tag.label}
                  </span>
                </div>

                {/* ✅ Content */}
                <div className="px-4 py-3 text-left">
                  <h3 className="text-lg font-bold text-blue-900 mb-5">
                    {item.project?.title}
                  </h3>

                  <p className="text-md text-blue-900 mb-4">
                    <strong>Mentee Email:</strong> {item.student?.email}
                  </p>

                  {/* ✅ Progress (Static Until API Supports It) */}
                  {/*<div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{ width: "50%" }}
                    ></div>
                  </div>*/}

                  {/*<p className="text-md text-green-500">
                    50% Completed
                  </p>*/}

                  {/* ✅ Buttons */}
                  <div className="flex space-x-3 mt-4">
                    <button className="flex-1 bg-[#3D2C8D] text-white py-2 rounded-md hover:bg-[#2c1f66]">
                      View Project
                    </button>

                    <button className="flex-1 border border-[#3D2C8D] text-[#3D2C8D] py-2 rounded-md hover:bg-[#f1f0ff]">
                      Give Feedback
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OngoingProjects;
