// 📂 src/components/Interviews/Interviews.jsx
import React, { useState } from "react";
import clockIcon from "../../../../assets/StudentInterviewTab/Clock.png";
import checkIcon from "../../../../assets/StudentInterviewTab/right.png";
import crossIcon from "../../../../assets/StudentInterviewTab/close.png";
import chatIcon from "../../../../assets/StudentInterviewTab/message.png";
import downloadIcon from "../../../../assets/StudentInterviewTab/download.png";
import companyIcon from "../../../../assets/StudentInterviewTab/Vector.png";

// ✅ Main icon for initial state
import interviewMainIcon from "../../../../assets/StudentInterviewTab/Interview.png";

const interviewsData = {
  upcoming: [
    {
      title: "Software Engineer Intern",
      company: "TechNova Pvt. Ltd.",
      mode: "Online (Zoom)",
      date: "25 Aug 2025, 10:30 AM",
    },
    {
      title: "Software Engineer Intern",
      company: "TechNova Pvt. Ltd.",
      mode: "Online (Zoom)",
      date: "25 Aug 2025, 10:30 AM",
    },
  ],
  completed: [
    {
      status: "Selected",
      title: "Data Analyst",
      company: "Insight Corp.",
      mode: "Online (Zoom)",
      date: "15 July 2025",
    },
    {
      status: "Pending",
      title: "Data Analyst",
      company: "Insight Corp.",
      mode: "Online (Zoom)",
      date: "15 July 2025",
    },
  ],
  rejected: [
    {
      status: "Rejected",
      title: "Data Analyst",
      company: "Insight Corp.",
      mode: "Online (Zoom)",
      date: "15 July 2025",
    },
    {
      status: "Cancelled",
      title: "Data Analyst",
      company: "Insight Corp.",
      mode: "Online (Zoom)",
      date: "15 July 2025",
    },
  ],
};

const StatusBadge = ({ status }) => {
  const statusColors = {
    Selected: "bg-green-100 text-green-600 border border-green-400",
    Pending: "bg-gray-100 text-gray-600 border border-gray-300",
    Rejected: "bg-red-100 text-red-600 border border-red-400",
    Cancelled: "bg-yellow-100 text-yellow-600 border border-yellow-400",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${statusColors[status]}`}
    >
      {status === "Selected" && <span>✔</span>}
      {status === "Rejected" && <span>✖</span>}
      {status === "Cancelled" && <span>⚠</span>}
      {status}
    </span>
  );
};

const InterviewCard = ({ item, showActions, type }) => {
  const actionButtonColor =
    type === "upcoming"
      ? "bg-[#2D2A63] text-white"
      : type === "completed"
      ? "bg-green-600 text-white"
      : "bg-red-600 text-white";

  return (
    <div className="relative border border-gray-200 bg-white rounded-2xl shadow hover:shadow-lg transition-all p-4 mb-4 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex flex-col">
        {item.status && <StatusBadge status={item.status} />}
        <p className="text-md font-semibold text-blue-900 mt-2 mb-2 flex items-center gap-2">
          <span>👤</span> {item.title}
        </p>
        <p className="text-md text-blue-900 flex items-center mb-2 gap-2">
          <span>🏢</span> {item.company}
        </p>
        <p className="text-md text-blue-900 flex items-center mb-2 gap-2">
          <span>💻</span> {item.mode}
        </p>
        <p className="text-md text-blue-900 flex items-center mb-2 gap-2">
          <span>📅</span> {item.date}
        </p>

        {showActions && (
          <div className="flex gap-4 mt-3">
            <button
              className={`${actionButtonColor} w-full text-sm font-medium px-6 py-2 rounded-xl`}
            >
              Join
            </button>
            <button className="border border-gray-400 w-full text-sm font-medium px-6 py-2 rounded-xl hover:bg-gray-50">
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-center justify-between h-full">
        {!showActions && (
          <div className="flex gap-4 mb-3">
            <button className="bg-yellow-100 p-2 rounded-full hover:bg-yellow-200">
              <img src={chatIcon} alt="Chat" className="w-6 h-6" />
            </button>
            <button className="bg-yellow-100 p-2 rounded-full hover:bg-yellow-200">
              <img src={downloadIcon} alt="Download" className="w-6 h-6" />
            </button>
          </div>
        )}
        <img src={companyIcon} alt="Company" className="w-14 h-14" />
      </div>
    </div>
  );
};

const SectionContainer = ({ title, icon, bgColor, borderColor, children }) => (
  <div className={`${bgColor} rounded-2xl p-5 shadow-md`}>
    <div
      className={`flex flex-col items-center mb-4 border-b-2 ${borderColor} pb-3`}
    >
      <img src={icon} alt="Section Icon" className="w-12 h-12 mb-2" />
      <h2 className="text-[#2D2A63] text-lg font-semibold">{title}</h2>
    </div>
    {children}
  </div>
);

const Interviews = () => {
  const [showInterviews, setShowInterviews] = useState(false);

  return (
    <div className="p-6">
      {!showInterviews ? (
        // ================= Empty State =================
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <img
            src={interviewMainIcon}
            alt="Interview"
            className="w-24 h-24 mb-6 object-contain"
          />

          <p className="text-md text-gray-600 mb-6">
            No interviews scheduled yet. Apply for jobs to get interview invites
            here.
          </p>

          <button
            onClick={() => setShowInterviews(true)}
            className="bg-indigo-900 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition"
          >
            Apply for Jobs
          </button>
        </div>
      ) : (
        // ================= Dashboard =================
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upcoming Interviews */}
          <SectionContainer
            title={`${interviewsData.upcoming.length} Upcoming Interviews`}
            icon={clockIcon}
            bgColor="bg-[#F5F9FF]"
            borderColor="border-blue-300"
          >
            {interviewsData.upcoming.map((item, index) => (
              <InterviewCard
                key={index}
                item={item}
                showActions
                type="upcoming"
              />
            ))}
          </SectionContainer>

          {/* Completed Interviews */}
          <SectionContainer
            title={`${interviewsData.completed.length} Completed Interviews`}
            icon={checkIcon}
            bgColor="bg-[#F1FCEB]"
            borderColor="border-green-300"
          >
            {interviewsData.completed.map((item, index) => (
              <InterviewCard key={index} item={item} type="completed" />
            ))}
          </SectionContainer>

          {/* Rejected/Cancelled Interviews */}
          <SectionContainer
            title={`${interviewsData.rejected.length} Rejected/Cancelled Interviews`}
            icon={crossIcon}
            bgColor="bg-[#FFF6ED]"
            borderColor="border-red-300"
          >
            {interviewsData.rejected.map((item, index) => (
              <InterviewCard key={index} item={item} type="rejected" />
            ))}
          </SectionContainer>
        </div>
      )}
    </div>
  );
};

export default Interviews;
