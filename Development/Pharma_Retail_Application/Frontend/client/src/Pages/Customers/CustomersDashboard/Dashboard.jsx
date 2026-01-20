import React, { useState } from "react";

// import assets (paths same as your project)
import moneyIcon from "../../../assets/Distributors/Dashboard/orders.png";
import cartIcon from "../../../assets/Distributors/Dashboard/pending-order.png";
import alertIcon from "../../../assets/Distributors/Dashboard/stock-expire.png";
import usersIcon from "../../../assets/Distributors/Dashboard/value.png";

import trendUpGreen from "../../../assets/Distributors/Dashboard/Demand.png";
import trendUpRed from "../../../assets/Distributors/Dashboard/Loss.png";

import searchLabsIcon from "../../../assets/Customers/Dashboard/search-labs.png";
import consultDoctorIcon from "../../../assets/Customers/Dashboard/consult-doctor.png";
import emergencyHelpIcon from "../../../assets/Customers/Dashboard/emergency-help.png";
import wellnessIcon from "../../../assets/Customers/Dashboard/wellness.png";

import uploadIcon from "../../../assets/Customers/Dashboard/upload-icon.png";
import orderIcon from "../../../assets/Customers/Dashboard/order-icon.png";
import repeatIcon from "../../../assets/Customers/Dashboard/repeat-icon.png";
import doctorIcon from "../../../assets/Customers/Dashboard/doctor-icon.png";

import locationIcon from "../../../assets/Customers/Dashboard/locationIcon.png";
import invoiceIcon from "../../../assets/Customers/Dashboard/invoiceIcon.png";

import SearchLabsFullPage from "./SearchLabsFullPage";
import SearchDoctors from "./ConsultDoctor/SearchDoctors";
import EmergencyHelp from "./EmergencyHelp";
import WellnessFullPage from "./WellnessFullPage";

// <-- ADDED: import external DoctorVerification component (your file)
import DoctorVerification from "./DoctorVerification";

/* -------------------------------------------------
                ORIGINAL DASHBOARD CODE
-------------------------------------------------- */

const DashboardCard = ({ title, value, icon, trend, trendColor }) => {
  const trendIcon =
    trendColor === "green"
      ? trendUpGreen
      : trendColor === "red"
      ? trendUpRed
      : "";

  return (
    <div className="bg-white border rounded-xl p-4 w-full shadow-sm transition-all duration-300 border-[#BFDAC8]">
      <div className="flex justify-between items-start">
        <p className="text-[#115D29] text-md">{title}</p>
        <div className="flex items-center justify-center rounded-lg">
          <img src={icon} alt="icon" className="w-10 h-10" />
        </div>
      </div>

      <h2 className="text-lg font-medium mt-4 text-[#115D29]">{value}</h2>

      <div
        className={`mt-4 text-sm flex items-center gap-2 ${
          trendColor === "green"
            ? "text-green-600"
            : trendColor === "red"
            ? "text-red-500"
            : "text-gray-600"
        }`}
      >
        {trendIcon && <img src={trendIcon} alt="trend" className="w-5 h-5" />}
        <span>{trend}</span>
      </div>
    </div>
  );
};

const FeatureBox = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    type="button"
    className="w-full text-left flex items-center bg-white border border-[#D2CDCD] rounded-lg h-[60px] justify-between pr-6 pl-4 transition-all duration-200 hover:border-[#2874BA] hover:border-2 hover:shadow-md cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <img src={icon} alt={label} className="w-12 h-auto" />
      <p className="text-[#115D29] font-medium">{label}</p>
    </div>
  </button>
);

const InnerBox = ({ icon, label, bg, border }) => (
  <div
    className="flex items-center justify-center gap-3 rounded-lg text-center"
    style={{
      width: "100%",
      height: "71px",
      background: bg,
      border: `1px solid ${border}`,
      padding: "4px 16px",
      borderRadius: "8px",
    }}
  >
    <img src={icon} alt={label} className="w-5 h-5" />
    <p className="text-[#115D29] font-medium text-sm">{label}</p>
  </div>
);

const Dashboard = () => {
  const [isSearchLabsOpen, setIsSearchLabsOpen] = useState(false);
  const [isSearchDoctorsOpen, setIsSearchDoctorsOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isWellnessOpen, setIsWellnessOpen] = useState(false);

  const [isDoctorVerifyOpen, setIsDoctorVerifyOpen] = useState(false); // <-- existing

  return (
    <div className="p-4 sm:p-5 md:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-[#115D29] mb-4 sm:mb-6">
        Welcome back! Here’s what’s happening today
      </h1>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <DashboardCard
          title="Total Orders"
          value="24"
          icon={moneyIcon}
          trend="+12.5% from yesterday"
          trendColor="green"
        />
        <DashboardCard
          title="Active Orders"
          value="8"
          icon={cartIcon}
          trend="+8.2% from yesterday"
          trendColor="green"
        />
        <DashboardCard
          title="Pending Orders"
          value="30"
          icon={alertIcon}
          trend="Critical from yesterday"
          trendColor="red"
        />
        <DashboardCard
          title="Refill Due"
          value="1.2Cr"
          icon={usersIcon}
          trend="+15.3% from yesterday"
          trendColor="green"
        />
      </div>

      {/* FEATURE PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <FeatureBox
          icon={searchLabsIcon}
          label="Search Labs"
          onClick={() => setIsSearchLabsOpen(true)}
        />

        <FeatureBox
          icon={consultDoctorIcon}
          label="Consult Doctor"
          onClick={() => setIsSearchDoctorsOpen(true)}
        />

        <FeatureBox
          icon={emergencyHelpIcon}
          label="Emergency Help"
          onClick={() => setIsEmergencyOpen(true)}
        />

        <FeatureBox
          icon={wellnessIcon}
          label="Wellness"
          onClick={() => setIsWellnessOpen(true)}
        />
      </div>

      {/* Remaining sections unchanged */}
      <div className="w-full flex justify-center mt-6">
        <div className="flex flex-col lg:flex-row gap-5" style={{ width: "100%", height: "286px" }}>
          
          <div
            className="rounded-lg border flex flex-col justify-around items-center"
            style={{
              flex: 0.25,
              padding: "20px",
              borderColor: "#B5CDBD",
              borderRadius: "8px",
              borderWidth: "1px",
            }}
          >
            <InnerBox
              icon={uploadIcon}
              label="Upload Prescription"
              bg="#2874BA08"
              border="#2874BA"
            />
            <InnerBox
              icon={orderIcon}
              label="Order Medicines"
              bg="#08890808"
              border="#30B130"
            />
            <InnerBox
              icon={repeatIcon}
              label="Repeat Last Order"
              bg="#AF840D08"
              border="#AF840D"
            />
          </div>

          <div
            className="rounded-lg border flex flex-col"
            style={{
              flex: 0.75,
              padding: "20px",
              background:
                "linear-gradient(102.45deg, #EFF7FF 5.75%, #FFFFFF 30.68%, #EFF7FF 78.28%, #FFFFFF 88.23%)",
              borderColor: "#B5CDBD",
              borderRadius: "8px",
              borderWidth: "1px",
            }}
          >
            <p className="text-[#2874BA] text-lg font-semibold mb-10">
              Are you a Doctor?
            </p>

            <div className="flex items-center gap-6">
              <img src={doctorIcon} alt="doctor" className="h-40" />

              <div className="flex flex-col justify-center">
                <p className="text-[#2874BA] text-sm font-medium mb-5">
                  Order prescribed medicines directly for your patients — no waiting, no confusion.
                </p>

                <p className="text-[#2874BA] text-xs mb-10">
                  Connect with nearby pharmacies, upload the prescription, and ensure timely delivery to your patient’s doorstep.
                </p>

                <div className="flex gap-3">
                  {/* BUTTON OPENING DOCTOR VERIFICATION PANEL */}
                  <button
                    className="bg-[#2874BA] w-full text-white rounded-lg"
                    style={{
                      height: "44px",
                      padding: "4px 16px",
                      borderRadius: "8px",
                      fontFamily: "Roboto",
                      fontWeight: 600,
                      fontSize: "14px",
                      lineHeight: "36px",
                      textAlign: "center",
                    }}
                    onClick={() => setIsDoctorVerifyOpen(true)} // <-- opens imported component
                  >
                    Order for Patient
                  </button>

                  <button
                    className="border border-[#2874BA] text-[#2874BA] rounded-lg w-full"
                    style={{
                      height: "44px",
                      padding: "4px 16px",
                      borderRadius: "8px",
                      fontFamily: "Roboto",
                      fontWeight: 600,
                      fontSize: "14px",
                      lineHeight: "36px",
                      textAlign: "center",
                    }}
                  >
                    Find Partner Retailer
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>


      {/* Recent Orders unchanged */}
      <div className="w-full flex justify-center mt-6">
        <div
          className="flex flex-col gap-4"
          style={{
            width: "100%",
            height: "336px",
            padding: "20px",
            border: "1px solid #B5CDBD",
            borderRadius: "8px",
          }}
        >
          <div className="flex justify-between items-center">
            <p className="text-[#115D29] font-semibold text-lg">Your Recent Orders</p>
            <p className="text-[#2874BA] text-sm font-medium cursor-pointer">View All &gt;</p>
          </div>

          <div className="flex gap-4 justify-between w-full">
            {[1, 2, 3].map((item, index) => (
              <div
                key={index}
                style={{
                  width: "100%",
                  height: "244px",
                  padding: "16px",
                  border: "1px solid #E7EFEA",
                  borderRadius: "8px",
                }}
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <p className="text-[#115D29] font-semibold text-sm">Order #ORD-3829</p>

                    <div
                      style={{
                        width: "120px",
                        height: "32px",
                        borderRadius: "80px",
                        background: index === 2 ? "#30B130" : "#30B1300D",
                        border: "1px solid #30B130",
                        padding: "4px 16px",
                      }}
                      className="flex items-center justify-center text-xs font-medium text-center"
                    >
                      {index === 2 ? (
                        <span className="text-white">Delivered</span>
                      ) : (
                        <span className="text-[#30B130]">Out for Delivery</span>
                      )}
                    </div>
                  </div>

                  <p className="text-[#115D29] text-xs mt-6">
                    Arriving today by 6:00 PM
                  </p>
                  <p className="text-[#115D29] text-xs mt-1">
                    Order Date: 28 Oct 2025
                  </p>
                  <p className="text-[#115D29] text-xs mt-1">
                    Medplus Pharmacy
                  </p>
                  <p className="text-[#115D29] text-xs mt-1">3 items</p>
                </div>

                <button
                  className="flex items-center justify-center bg-[#115D29] text-white rounded-lg gap-2"
                  style={{ width: "100%", height: "44px", borderRadius: "8px" }}
                >
                  <img
                    src={index === 2 ? invoiceIcon : locationIcon}
                    alt="icon"
                    className="w-4 h-4"
                  />
                  {index === 2 ? "View Invoice" : "Track Live"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Panels */}
      <SearchLabsFullPage
        open={isSearchLabsOpen}
        onClose={() => setIsSearchLabsOpen(false)}
      />
      
      <SearchDoctors
        open={isSearchDoctorsOpen}
        onClose={() => setIsSearchDoctorsOpen(false)}
      />

      <EmergencyHelp
        open={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      <WellnessFullPage
        open={isWellnessOpen}
        onClose={() => setIsWellnessOpen(false)}
      />

      {/* DOCTOR VERIFICATION OVERLAY - imported component */}
      <DoctorVerification
        open={isDoctorVerifyOpen}
        onClose={() => setIsDoctorVerifyOpen(false)}
      /> 
      
    </div>
  );
};

export default Dashboard;
