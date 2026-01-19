import React, { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const InternshipDashboard = () => {
  const [appliedInternships, setAppliedInternships] = useState([]);

  // =============================
  // 📌 FETCH APPLIED INTERNSHIPS
  // =============================
  const fetchAppliedInternships = async () => {
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) return;

      const userRes = await fetch(`${API_BASE}/auth/users`);
      const users = await userRes.json();
      const currentUser = users?.find((u) => u.email === email);

      if (!currentUser) return;

      const applyer_id = currentUser.id;

      const appliedRes = await fetch(
        `${API_BASE}/applications/by-applyer/${applyer_id}`
      );

      const appliedData = await appliedRes.json();
      setAppliedInternships(appliedData || []);
    } catch (error) {
      console.error("Error fetching internships:", error);
    }
  };

  useEffect(() => {
    fetchAppliedInternships();
  }, []);

  return (
    <div className="min-h-screen border border-blue-900 m-4 p-4 rounded-lg bg-[#fdfdfd]">

      {/* =============================
          🟦 APPLIED INTERNSHIP SECTION
      ============================= */}
      <div className="mt-6 ml-10 mr-8 px-4">
        <h2 className="text-xl font-bold text-[#343079] mb-4">
          Applied Internships
        </h2>

        {appliedInternships.filter((job) => job.posting_type === "Internship")
          .length === 0 ? (
          <p className="text-gray-500">No internship applications found.</p>
        ) : (
          <ul className="space-y-3">

            {appliedInternships
              .filter((job) => job.posting_type === "Internship") // ✔ Only Internships
              .map((intern) => (
                <li
                  key={intern.id}
                  className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm flex justify-between items-center"
                >
                  {/* Internship Title */}
                  <p className="font-semibold text-blue-900">
                    {intern.job_title}
                  </p>

                  {/* Status */}
                  <span className="px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-800 capitalize">
                    {intern.stage || "submitted"}
                  </span>
                </li>
              ))}

          </ul>
        )}
      </div>
    </div>
  );
};

export default InternshipDashboard;
