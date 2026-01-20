import React, { useState } from "react";
import StudentDashboardNavbar from "./StudentDashboardNavbar";

import DashboardHome from "./DashboardHome";
import ExamsPage from "./ExamsPage";
import CalendarPage from "./CalendarPage";
import AnalyticsPage from "./AnalyticsPage";

const StudentDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardHome />;
      case "Exams":
        return <ExamsPage />;
      case "Calendar":
        return <CalendarPage />;
      case "Analytics":
        return <AnalyticsPage />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] ">
      {/* DASHBOARD NAVBAR */}
      <StudentDashboardNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* TAB CONTENT */}
      <div className=" bg-white p-8 ">
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboardPage;
