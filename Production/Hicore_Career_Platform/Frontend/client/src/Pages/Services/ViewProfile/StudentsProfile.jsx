import React, { useState, useEffect } from "react";
import StudentCard from "./StudentCard";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const StudentsProfile = () => {
  const [studentProfiles, setStudentProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 12;

  useEffect(() => {
    const fetchStudentProfiles = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("🌐 Fetching student profiles from:", `${API_BASE}/profile/role/student`);

        const response = await fetch(`${API_BASE}/profile/role/student`);

        console.log("📩 /profile/role/student raw response:", response);

        if (!response.ok) {
          throw new Error(`Failed to fetch student profiles (${response.status})`);
        }

        const textData = await response.text();
        console.log("📜 /profile/role/student response text:", textData);

        let profilesData;
        try {
          profilesData = JSON.parse(textData);
        } catch (parseErr) {
          console.error("❌ JSON parse error for /profile/role/student:", parseErr);
          throw new Error("Invalid JSON in /profile/role/student response");
        }

        // The API may return { profiles: [...] } or a direct array
        const allProfiles = Array.isArray(profilesData)
          ? profilesData
          : profilesData.profiles || [];

        console.log("✅ Parsed student profiles:", allProfiles);

        setStudentProfiles(allProfiles);
      } catch (err) {
        console.error("❌ Error fetching student profiles:", err);
        setError("Failed to load student profiles.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfiles();
  }, []);

  // ✅ Pagination logic
  const totalPages = Math.ceil(studentProfiles.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = studentProfiles.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleNext = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);
  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage((p) => p - 1);

  // === UI States ===
  if (loading)
    return (
      <div className="flex justify-center items-center h-96 text-indigo-700">
        <div className="text-lg font-semibold animate-pulse">
          Loading student profiles...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 py-8 font-medium">{error}</div>
    );

  if (studentProfiles.length === 0)
    return (
      <div className="text-center text-gray-600 py-8">
        No student profiles found.
      </div>
    );

  // === Render ===
  return (
    <div className="w-full px-4">
      <div className="max-w-8xl m-8 bg-white border border-gray-300 rounded-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-900">
            Meet Our Student Network
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 m-10 gap-6">
          {currentStudents.map((student, idx) => (
            <StudentCard key={idx} student={student} />
          ))}
        </div>

        {/* ✅ Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-4">
            {currentPage > 1 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-2 rounded-md text-white text-sm font-semibold bg-indigo-900 hover:bg-indigo-800"
              >
                Previous
              </button>
            )}
            {currentPage < totalPages && (
              <button
                onClick={handleNext}
                className="px-6 py-2 rounded-md text-white text-sm font-semibold bg-indigo-900 hover:bg-indigo-800"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsProfile;
