import React, { useState } from "react";
import earningimg from "../../../../assets/MentoDashboardLayout/Earnings/profit.png";
import projectIcon from "../../../../assets/MentoDashboardLayout/Earnings/projects.png"; 
import bookmarkIcon from "../../../../assets/MentoDashboardLayout/Earnings/save.png"; 

const opportunities = [
  {
    id: 1,
    title: "AI Resume Screening Project",
    type: "Projects",
    earning: "₹200/session",
    duration: "4 hours total",
    mentees: 3,
    status: "Open",
  },
  {
    id: 2,
    title: "1:1 Mentorship Session – Python Basics",
    type: "1:1 Mentorship",
    earning: "₹1,000/session",
    duration: "1 hour",
    mentees: 2,
    status: "Limited Slots",
  },
  {
    id: 3,
    title: "Mock Interview – Data Analyst Role",
    type: "Mock Interviews",
    earning: "₹150/session",
    duration: "1 hour",
    mentees: 5,
    status: "Urgent",
  },
  {
    id: 4,
    title: "Career Path Discussion – Cloud Engineering",
    type: "Career Guidance",
    earning: "₹500/session",
    duration: "2 hours",
    mentees: 1,
    status: "Open",
  },
];

const Earninghome = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [showOpportunities, setShowOpportunities] = useState(false);

  const tabs = [
    "All",
    "Projects",
    "1:1 Mentorship",
    "Mock Interviews",
    "Career Guidance",
  ];

  const filteredOpportunities =
    activeTab === "All"
      ? opportunities
      : opportunities.filter((op) => op.type === activeTab);

  return (
    <div className="w-full h-[844px] opacity-100 rounded-tl-[8px]">
      {/* Tabs Section */}
      <div className="w-full h-[37px] opacity-100 flex space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setShowOpportunities(false);
            }}
            className={`h-[37px] px-6 py-2 font-poppins font-medium text-sm leading-[100%] ${
              activeTab === tab
                ? "bg-[#343079] text-white rounded-tl-[8px] rounded-tr-[8px]"
                : "text-[#C0BFD5]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Container */}
      <div className="w-full h-auto opacity-100 gap-4 rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px] p-[20px] border border-[#343079]">
        {!showOpportunities ? (
          // Default "No earnings" screen
          <div className="flex flex-col items-center justify-center h-[600px] text-center">
            <div className="flex items-center justify-center">
              <img
                src={earningimg}
                alt="Earnings"
                className="w-[100px] h-[100px] object-cover opacity-100"
              />
            </div>
            <p className="w-full h-8 text-center text-[#A4A2B3] font-poppins font-bold text-[16px] leading-8">
              No earnings to show yet.
            </p>
            <p className="w-full h-8 text-center text-[#A4A2B3] font-poppins font-normal text-[16px] leading-8">
              Complete your first task to see your earnings here.
            </p>
            <button
              onClick={() => setShowOpportunities(true)}
              className="bg-[#343079] text-white px-6 py-2 rounded-md mt-4"
            >
              Explore Opportunities
            </button>
          </div>
        ) : (
          // Opportunities Cards
          <div className="grid grid-cols-2 gap-6">
            {filteredOpportunities.map((op) => (
              <div
                key={op.id}
                className="border border-[#C0BFD5] rounded-lg p-5 shadow-sm bg-white flex flex-col justify-between"
              >
                {/* Top Section */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {/* Same Icon for all */}
                    <div className="w-[56px] h-[56px] flex items-center justify-center">
                      <img
                        src={projectIcon}
                        alt="Opportunity Icon"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="h-[56px] flex flex-col justify-center gap-2">
                      <h3 className="font-semibold text-[#343079]">
                        {op.title}
                      </h3>
                      <p className="text-sm text-[#8E8CA8]">Type: {op.type}</p>
                    </div>
                  </div>

                 {/* Bookmark */}
                 <button className="hover:opacity-80">
                  <img src={bookmarkIcon} alt="Bookmark" className="w-5 h-5 object-contain"/>
                 </button>

                </div>

                {/* Middle Section */}
                <div className="mt-4 space-y-3 text-sm text-[#1E1E2D]">
                  <p>
                    <span className="text-[#343079]">Earning Potential:</span>{" "}
                    <span className="font-semibold text-[#343079]">
                      {op.earning}
                    </span>
                  </p>
                  <p>
                    <span className="text-[#343079]">Duration:</span>{" "}
                    <span className="font-semibold text-[#343079]">{op.duration}</span>
                  </p>
                  <p>
                    <span className="text-[#343079]">Mentees Waiting:</span>{" "}
                    <span className="font-semibold text-[#343079]">{op.mentees}</span>
                  </p>
                </div>

                {/* Status + Actions */}
                <div className="mt-4 mb-4 flex items-center justify-between">
                  {/* Status Pill */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      op.status === "Open"
                        ? "bg-[#E8FFDD] text-[#008000]"
                        : op.status === "Limited Slots"
                        ? "bg-[#FFFFD4] text-[#FECD0C]"
                        : "bg-[#FFFAEF] text-[#FF0000]"
                    }`}
                  >
                    Status: {op.status}
                  </span>
                </div>
                {/* Actions */}
                  <div className="flex w-full gap-3">
                    <button className="flex-1 bg-[#343079] text-white px-5 py-2 rounded-md text-sm font-medium">
                      {op.type === "Projects" || op.type === "1:1 Mentorship"
                        ? "Accept"
                        : "Apply"}
                    </button>
                    <button className="flex-1 border border-[#343079] text-[#343079] px-5 py-2 rounded-md text-sm font-medium">
                      View Details
                    </button>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Earninghome;
