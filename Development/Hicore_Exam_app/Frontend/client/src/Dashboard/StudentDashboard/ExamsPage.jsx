import React, { useState } from "react";

/* ICONS */
import arrowIcon from "../../assets/StudentDashboard/StudentDashHome/right-arrow.png";
import rightarrowIcon from "../../assets/StudentDashboard/StudentDashHome/arrow-right.png";

/* SCREENS */
import EnrolledExams from "./EnrolledExams";
import CompletedExams from "./CompletedExams";
import AllExams from "./AllExams";

const ExamsPage = () => {
  const [activeTab, setActiveTab] = useState("enrolled");
  const [showAllExams, setShowAllExams] = useState(false);

  const tabTitle =
    activeTab === "enrolled" ? "Enrolled Exams" : "Completed Exams";

  return (
    <div className="px-6 py-4">
      {/* TOP ROW (HIDDEN FOR ALL EXAMS PAGE) */}
      {!showAllExams && (
        <div className="flex items-center justify-between">
          {/* BREADCRUMB */}
          <div className="flex items-center gap-3 text-[#2758B3] text-md font-medium">
            <span className="cursor-pointer hover:underline">Dashboard</span>

            <img src={rightarrowIcon} alt="arrow" className="w-6 h-6" />

            <span className="cursor-pointer hover:underline">Exams</span>

            <img src={rightarrowIcon} alt="arrow" className="w-6 h-6" />

            <span className="font-medium">{tabTitle}</span>
          </div>

          {/* VIEW MORE EXAMS BUTTON */}
          <button
            onClick={() => setShowAllExams(true)}
            className="flex items-center gap-2 bg-[#0B4CFF] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
          >
            View More Exams
            <img src={arrowIcon} alt="arrow" className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* CONTENT */}
      <div className="mt-8">
        {/* ALL EXAMS PAGE */}
        {showAllExams ? (
          <AllExams onBack={() => setShowAllExams(false)} />
        ) : (
          <>
            {/* TABS */}
            <div className="flex w-full">
              <button
                onClick={() => setActiveTab("enrolled")}
                className={`w-1/2 py-4 text-center rounded-t-3xl font-medium transition
                  ${
                    activeTab === "enrolled"
                      ? "bg-[#BFD6FF] text-[#2758B3]"
                      : "text-gray-400"
                  }`}
              >
                Enrolled Exams
              </button>

              <button
                onClick={() => setActiveTab("completed")}
                className={`w-1/2 py-4 text-center rounded-t-3xl font-medium transition
                  ${
                    activeTab === "completed"
                      ? "bg-[#BFD6FF] text-[#2758B3]"
                      : "text-gray-400"
                  }`}
              >
                Completed Exams
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="border border-[#BFD6FF] rounded-b-3xl min-h-[400px] p-6">
              {activeTab === "enrolled" && <EnrolledExams />}
              {activeTab === "completed" && <CompletedExams />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExamsPage;
