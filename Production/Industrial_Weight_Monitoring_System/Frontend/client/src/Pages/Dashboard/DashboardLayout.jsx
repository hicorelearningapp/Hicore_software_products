import React from "react";
import DashboardNavbar from "./DashboardNavbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div>
      <DashboardNavbar />
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
