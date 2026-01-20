import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import menu from "./menu";
import logoutIcon from "../../../assets/RetailersDashboard/logoutIcon.png";
import bellIcon from "../../../assets/RetailersDashboard/bell.png";
import searchIcon from "../../../assets/RetailersDashboard/search.png";
import userIcon from "../../../assets/RetailersDashboard/user.png";
import cart from "../../../assets/Customers/Dashboard/cart.png";

import Dashboard from "./Dashboard";
import Notification from "../Notifications/Notification";
import Help from "../Help/Help";
import ProfileAndSettings from "./ProfileAndSettings";
import StoreAvailability from "../StoreAvailability/StoreAvailability";
import PrescriptionPage from "./Prescriptions/PrescriptionPage";
import MyOrders from "./MyOrders/MyOrders";
import Medicines from "./Medicines/Medicines";

import ShoppingCart from "./Cart/ShoppingCart";

const COMPONENTS = {
  1: <Dashboard />,
  2: <Medicines />,
  3: <MyOrders />,
  4: <PrescriptionPage />,
  5: <StoreAvailability />,
  6: <ProfileAndSettings />,
  7: <Notification />,
  8: <Help />,
  9: <ShoppingCart />,
};

const CustomerDashoardLayout = () => {
  const [activeId, setActiveId] = useState(1);
  const navigate = useNavigate();

  //  If cart page → return only ShoppingCart page
  if (activeId === 9) {
    return <ShoppingCart />;
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FDF9] flex flex-col">
      
      {/* ---------------- NAVBAR ---------------- */}
      <nav
        className="
          w-full h-[88px]
          px-8 pt-8 pb-4
          bg-white
          shadow-[0px_4px_10px_rgba(0,0,0,0.12)]
          flex items-center justify-between
          z-20
        "
      >
        <h2
          onClick={() => navigate("/")}
          className="text-xl cursor-pointer font-semibold text-[#115D29]"
        >
          PharmaCart
        </h2>

        <div className="flex items-center gap-6">

          {/*  CLICK → SHOW FULL SHOPPING CART PAGE */}
          <img
            src={cart}
            className="w-5 h-5 cursor-pointer"
            onClick={() => setActiveId(9)}
          />

          <img src={bellIcon} className="w-5 h-5 cursor-pointer" />

          <div className="relative">
            <img
              src={searchIcon}
              className="w-5 h-5 absolute right-2 top-1/2 -translate-y-1/2 opacity-70"
            />
            <input
              type="text"
              placeholder="Search medicines, orders..."
              className="
                pl-3 pr-4 py-2 w-[260px]
                bg-[#F5F9F6] rounded-lg text-sm
                border border-[#D9E5DE]
                focus:outline-none
              "
            />
          </div>

          <div className="flex items-center gap-2">
            <img src={userIcon} className="w-7 h-7" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-[#115D29]">
                Customer Name
              </span>
              <span className="text-[10px] text-[#115D29]">Address</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ---------------- BODY CONTENT ---------------- */}
      <div className="flex w-full flex-1">
        
        {/* ---------------- SIDEBAR ---------------- */}
        <aside
          className="
            w-[256px]
            px-3 py-8
            border-r border-[#B5CDBD]
            bg-white
            flex flex-col justify-between
          "
        >
          <div className="flex flex-col gap-5">
            {menu.map((item) => {
              const isActive = activeId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`
                    px-4 py-2 rounded-md flex items-center gap-3 cursor-pointer
                    ${isActive ? "bg-[#0A8A4A]" : ""}
                  `}
                >
                  <img src={item.icon} className="w-5 h-5" />
                  <span
                    className={`
                      ${isActive ? "text-white" : "text-[#115D29]"}
                    `}
                  >
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-40"></div>

          <div className="text-[#D9534F] cursor-pointer px-4 flex items-center gap-3">
            <img src={logoutIcon} className="w-5 h-5" />
            Logout
          </div>
        </aside>

        {/* ---------------- MAIN CONTENT ---------------- */}
        <main className="flex-1 bg-white p-2">
          {COMPONENTS[activeId] ?? (
            <div className="w-full h-full flex items-center justify-center text-[#4B6A57]">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-2">Coming soon</h3>
                <p className="text-sm">This screen is not implemented yet.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CustomerDashoardLayout;
