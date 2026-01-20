import React, { useState } from "react";
import TeacherDashboardNavbar from "./TeacherDashboardNavbar";

import DashboardHome from "./DashboardHome";
import ExamsPage from "./ExamsPage";
import CalendarPage from "./CalendarPage";
import AnalyticsPage from "./AnalyticsPage";
import ClassesPage from "./ClassesPage";

const TeacherDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardHome />;
      case "Exams":
        return <ExamsPage />;
      case "Classes":
        return <ClassesPage/>;
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
      <TeacherDashboardNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* TAB CONTENT */}
      <div className=" bg-white p-8 ">{renderContent()}</div>
    </div>
  );
};

export default TeacherDashboardPage;
