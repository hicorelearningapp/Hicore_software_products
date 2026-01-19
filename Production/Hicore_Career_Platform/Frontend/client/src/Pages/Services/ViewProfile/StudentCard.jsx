import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const StudentCard = ({ student }) => {
  const navigate = useNavigate();

  if (!student || !student.basicInfo) return null;

  const { basicInfo, skillsResume, projects } = student;

  const fullName = `${basicInfo.first_name || ""} ${basicInfo.last_name || ""}`.trim();
  const title = basicInfo.professional_title || "Student";
  const location = basicInfo.location || "Location not specified";

  // ✅ Construct full image URL
  const profileImage = basicInfo.profile_image
    ? `${API_BASE}/${basicInfo.profile_image.replace(/^\/+/, "")}`
    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const skills =
    Array.isArray(skillsResume?.resume_skills) && skillsResume.resume_skills.length > 0
      ? skillsResume.resume_skills.join(", ")
      : "No skills listed";

  const projectCount = projects?.length || 0;
  const projectNames =
    projectCount > 0
      ? projects.map((p) => p.project_name).join(", ")
      : "No projects added";

  const handleViewProfile = () => {
    navigate(`/viewstudentprofile/${basicInfo.user_id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200 }}
      onClick={handleViewProfile}
      className="cursor-pointer rounded-xl shadow-md border border-indigo-200 overflow-hidden bg-white flex flex-col justify-between hover:shadow-lg transition"
    >
      {/* ✅ Profile Image */}
      <img
        src={profileImage}
        alt={fullName || "Profile"}
        className="w-full h-56 object-cover"
        onError={(e) =>
          (e.target.src =
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png")
        }
      />

      {/* ✅ Info Section */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-indigo-900 mb-1">
          {fullName || "Unnamed Student"}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{title}</p>
        <p className="text-xs text-gray-500 mb-3">{location}</p>

        <div className="text-sm text-blue-900 mb-2">
          <strong>Skills:</strong> {skills}
        </div>

        <div className="text-sm text-blue-900 mb-2">
          <strong>Projects ({projectCount}):</strong> {projectNames}
        </div>
      </div>
    </motion.div>
  );
};

export default StudentCard;
