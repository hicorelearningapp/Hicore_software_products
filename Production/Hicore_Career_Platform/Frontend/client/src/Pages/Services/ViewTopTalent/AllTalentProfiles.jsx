import React, { useState } from "react";
import talentProfiles from "./talentProfile";
import TalentProfileCard from "./TalentProfileCard";

const TalentProfile = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 6;

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = talentProfiles.slice(
    indexOfFirstProfile,
    indexOfLastProfile
  );

  const totalPages = Math.ceil(talentProfiles.length / profilesPerPage);

  return (
    <div className="mt-10">
      {/* Heading */}
      <h3 className="text-lg font-bold text-[#4631A1] mb-4">
        {talentProfiles.length} Profiles matched based on your hiring
        preferences
      </h3>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProfiles.map((profile) => (
          <TalentProfileCard key={profile.id} profile={profile} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-3 mt-6">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="flex items-center gap-1 text-blue-900 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          ← Previous
        </button>

        {/* Page Numbers with Single Center Ellipsis */}
        {(() => {
          let pages = [];

          if (totalPages <= 7) {
            // Case 1: Show all pages (small total)
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
          } else {
            // Case 2: Show first, last, and window around current with ONE ellipsis in middle
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            pages.push(1); // always first page

            if (start > 2) pages.push("..."); // one ellipsis before middle

            for (let i = start; i <= end; i++) {
              pages.push(i);
            }

            if (end < totalPages - 1) {
              if (!pages.includes("...")) pages.push("..."); // ensure only one dot
            }

            pages.push(totalPages); // always last page
          }

          return pages.map((page, i) =>
            page === "..." ? (
              <span key={i} className="px-3 py-1 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-[#4631A1] text-white"
                    : "text-[#4631A1] hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )
          );
        })()}

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="flex items-center gap-1 text-[#4631A1] disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default TalentProfile;
