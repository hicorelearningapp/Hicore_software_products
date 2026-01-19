import React, { useState } from "react";
import UpcomingSessions from "./UpcomingSessions";
import OngoingSessions from "./OngoingSessions";
import CompletedSessions from "./CompletedSessions";
import CancelledSessions from "./CancelledSessions";
import CalendarView from "./CalendarView";

const tabs = [
  "Upcoming Sessions",
  "Ongoing Sessions",
  "Completed Sessions",
  "Cancelled Sessions",
  "Calender View",
];

const SessionsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const renderContent = () => {
      switch (activeTab) {
        case 0:
          return <UpcomingSessions />;
        case 1:
          return <OngoingSessions />;
        case 2:
          return <CompletedSessions />;
        case 3:
          return <CancelledSessions />;
        case 4:
          return <CalendarView />;
        default:
          return null;
      }
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-md font-medium transition ${
              activeTab === index
                ? "text-white bg-blue-900 rounded-t-lg"
                : "text-gray-500 hover:text-[#3D2C8D]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Container for Content */}
      <div className="border border-blue-900 rounded-b-lg p-10  min-h-screen  flex overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default SessionsPage;
