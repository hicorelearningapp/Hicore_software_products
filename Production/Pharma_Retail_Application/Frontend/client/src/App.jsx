import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Home from "./Pages/Home";
import RetailersLanding from "./Pages/Retailers/RetailersHome/RetailersLanding";
import RetailersDashboardLayout from "./Pages/Retailers/RetailersDashboard/RetailersDashboardLayout";
import DistributorsLanding from "./Pages/Distributors/DistributorsHome/DistributorsLanding";
import DistributorDashboardLayout from "./Pages/Distributors/DistibutorsDashboard/DistributorDashboardLayout";
import Footer from "./Components/Footer";
import CustomerLanding from "./Pages/Customers/CustomersHome/CustomerLanding";
import CustomerDashoardLayout from "./Pages/Customers/CustomersDashboard/CustomerDashoardLayout";
import LoginNew from "./Pages/Auth/LoginNew";

const AppWrapper = () => {
  const location = useLocation();

  const hideFooterRoutes = [
    "/retailers-dashboard",
    "/distributors-dashboard",
    "/customers-dashboard",
  ];

  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginNew />} />

        <Route path="/retailers" element={<RetailersLanding />} />
        <Route
          path="/retailers-dashboard"
          element={<RetailersDashboardLayout />}
        />

        <Route path="/distributors" element={<DistributorsLanding />} />
        <Route
          path="/distributors-dashboard"
          element={<DistributorDashboardLayout />}
        />

        <Route path="/customers" element={<CustomerLanding />} />
        <Route
          path="/customers-dashboard"
          element={<CustomerDashoardLayout />}
        />
      </Routes>

      {/*  Footer only when allowed */}
      {!shouldHideFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;
