import React, { useState } from "react";
import centerIcon from "../../../../assets/EmployeerDashboard/EmployerApplication/job-id.png";

// Import all external views
import ShortlistedView from "./ShortlistedSection";
import InReviewView from "./InReview";
import InterviewedView from "./Interviewed";
import OfferSentView from "./OfferSent";
import RejectedView from "./Rejected";
import NewApplication from "./NewApplication";
import AllApplication from "./AllApplication";

const tabs = [
  "New",
  "All",
  "Shortlisted",
  "In Review",
  "Interviewed",
  "Offer Sent",
  "Rejected",
];

const ApplicationsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showView, setShowView] = useState(null); // holds which view to show

  //  Tab-specific content
  const renderContent = () => {
    // If external view is active, show it
    if (showView) {
      switch (showView) {
        case "New":
          return <NewApplication />;
         case "All":
          return <AllApplication />;  
        case "Shortlisted":
          return <ShortlistedView />;
        case "In Review":
          return <InReviewView />;
        case "Interviewed":
          return <InterviewedView />;
        case "Offer Sent":
          return <OfferSentView />;
        case "Rejected":
          return <RejectedView />;
        default:
          return null;
      }
    }

    // Default tab content
    switch (tabs[activeTab]) {
      case "New":
        return (
          <>
            <img
              src={centerIcon}
              alt="empty"
              className="w-12 h-12 mb-4 opacity-60"
            />
            <h2 className="text-gray-600 font-semibold mb-1">
              No applications yet.
            </h2>
            <p className="text-gray-400 mb-6">
              Share your job posting to attract candidates.
            </p>
            <button 
            onClick={() => setShowView("New")}
            className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-6 py-2 rounded-md shadow">
              New Application
            </button>
          </>
        );

      case "All":
        return (
          <>
            <h2 className="text-gray-600 font-semibold mb-1">
              No applications found.
            </h2>
            <p className="text-gray-400 mb-6">
              All job applications will appear here.
            </p>
             <button 
            onClick={() => setShowView("All")}
            className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-6 py-2 rounded-md shadow">
              All Applications
            </button>
          </>
        );

      case "Shortlisted":
        return (
          <>
            <h2 className="text-gray-600 font-semibold mb-1">
              No shortlisted candidates yet.
            </h2>
            <p className="text-gray-400 mb-6">
              Your shortlisted candidates will appear here.
            </p>
            <button
              onClick={() => setShowView("Shortlisted")}
              className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-6 py-2 rounded-md shadow"
            >
              View Shortlisted
            </button>
          </>
        );

      case "In Review":
        return (
          <>
            <h2 className="text-gray-600 font-semibold mb-1">
              Nothing under review yet.
            </h2>
            <p className="text-gray-400 mb-6">
              Candidates you review will be shown here.
            </p>
            <button
              onClick={() => setShowView("In Review")}
              className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-6 py-2 rounded-md shadow"
            >
              View In Review
            </button>
          </>
        );

      case "Interviewed":
        return (
          <>
            <h2 className="text-gray-600 font-semibold mb-1">
              No interviews conducted yet.
            </h2>
            <p className="text-gray-400 mb-6">
              Schedule interviews to see them here.
            </p>
            <button
              onClick={() => setShowView("Interviewed")}
              className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-6 py-2 rounded-md shadow"
            >
              View Interviewed
            </button>
          </>
        );

      case "Offer Sent":
        return (
          <>
            <h2 className="text-gray-600 font-semibold mb-1">
              No offers sent yet.
            </h2>
            <p className="text-gray-400 mb-6">
              Candidates you send offers to will appear here.
            </p>
            <button
              onClick={() => setShowView("Offer Sent")}
              className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-6 py-2 rounded-md shadow"
            >
              View Offer Sent
            </button>
          </>
        );

      case "Rejected":
        return (
          <>
            <h2 className="text-gray-600 font-semibold mb-1">
              No rejected applications yet.
            </h2>
            <p className="text-gray-400 mb-6">
              Rejected candidates will appear here.
            </p>
            <button
              onClick={() => setShowView("Rejected")}
              className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-6 py-2 rounded-md shadow"
            >
              View Rejected
            </button>
          </>
        );

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
            onClick={() => {
              setActiveTab(index);
              setShowView(null); // reset external view when switching tab
            }}
            className={`px-6 py-2 text-sm font-medium transition ${
              activeTab === index
                ? "bg-[#3D2C8D] text-white rounded-t-md"
                : "text-gray-400 hover:text-[#3D2C8D]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Box */}
      <div className="border border-gray-300 rounded-b-lg min-h-screen flex flex-col items-center justify-center text-center p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default ApplicationsPage;
