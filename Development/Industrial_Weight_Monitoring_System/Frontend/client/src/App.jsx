import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop";

import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import DashboardHome from "./Pages/Dashboard/DashboardHome/DashboardHome";
import DashboardLayout from "./Pages/Dashboard/DashboardLayout";
import Inventory from "./Pages/Dashboard/Inventory/Inventory";
import Device from "./Pages/Dashboard/AddDevice/Device";
import Trackdevice from "./Pages/Dashboard/TrackDevice/Trackdevice";
import DeviceDetails from "./Pages/Dashboard/TrackDevice/DeviceDetails";
import Orders from "./Pages/Dashboard/Orders/Orders";
import PlaceOrder from "./Pages/Dashboard/Orders/PlaceOrder";
import OrderNow from "./Pages/Dashboard/Orders/OrderNow";
import Settings from "./Pages/Dashboard/Settings/Settings";
import Notification from "./Pages/Dashboard/Notification/Notification";
import Addnewitem from "./Pages/Dashboard/Addnewitem/Addnewitem";

const AppWrapper = () => {
  const location = useLocation();

  const shouldHideLayout =
    location.pathname.startsWith("/dashboard") ||
    location.pathname === "/login";

  return (
    <>
      {!shouldHideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Standalone dashboard pages */}
        <Route path="/dashboard/device-details" element={<DeviceDetails />} />
        <Route path="/dashboard/place-order" element={<PlaceOrder />} />
        <Route path="/dashboard/order-now" element={<OrderNow />} />

        {/* Dashboard layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="add-device" element={<Device />} />
          <Route path="add-newitem" element={<Addnewitem />} />
          <Route path="track-device" element={<Trackdevice />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notification />} />
        </Route>
      </Routes>

      {!shouldHideLayout && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppWrapper />
    </Router>
  );
};

export default App;
