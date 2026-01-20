import React from "react";

// Import your assets
import moneyIcon from "../../../assets/Distributors/Dashboard/orders.png";
import cartIcon from "../../../assets/Distributors/Dashboard/pending-order.png";
import alertIcon from "../../../assets/Distributors/Dashboard/stock-expire.png";
import usersIcon from "../../../assets/Distributors/Dashboard/value.png";

// Trend icons
import trendUpGreen from "../../../assets/Distributors/Dashboard/Demand.png";
import trendUpRed from "../../../assets/Distributors/Dashboard/Loss.png";

// Action icons
import correctIcon from "../../../assets/DashboardPage/tick.png";
import wrongIcon from "../../../assets/DashboardPage/wrong.png";

const newOrders = [
  { id: "ORD-001", name: "Rajesh Kumar", amount: "₹850" },
  { id: "ORD-002", name: "Priya Sharma", amount: "₹620" },
  { id: "ORD-003", name: "Amit Patel", amount: "₹1,240" },
];

const lowStockItems = [
  { name: "Paracetamol500mg", brand: "Dolo", left: 45 },
  { name: "Amoxicillin 250mg", brand: "Dolo", left: 32 },
  { name: "Cetirizine 10mg", brand: "Dolo", left: 28 },
];

const trendBoxes = [
  {
    region: "North Region:",
    title: "Cough Syrups 125%",
    bg: "bg-[#FBF6E6]",
    border: "border-[#F0E6C8]",
  },
  {
    region: "South Region:",
    title: "Antibiotics 118%",
    bg: "bg-[#F8FFEB]",
    border: "border-[#EBF6D0]",
  },
  {
    region: "East Region:",
    title: "Pain Relief 112%",
    bg: "bg-[#F3FFF8]",
    border: "border-[#E8F8F0]",
  },
  {
    region: "West Region:",
    title: "Cold Relief 112%",
    bg: "bg-[#F6F2FF]",
    border: "border-[#EEE6FF]",
  },
];

const deliveries = [
  { driver: "Driver Name1", order: "ORD-045", location: "Location Name1" },
  { driver: "Driver Name2", order: "ORD-023", location: "Location Name2" },
  { driver: "Driver Name3", order: "ORD-023", location: "Location Name2" },
];

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
        <span >{trend}</span>
      </div>
    </div>
  );
};

const StatusPill = ({ text }) => {
  const classes =
    text === "Pending"
      ? "bg-red-50 text-red-600"
      : text === "Completed"
      ? "bg-green-50 text-green-600"
      : "bg-blue-50 text-blue-600";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${classes}`}>
      {text}
    </span>
  );
};

const Dashboard = () => {
  return (
    <div className="p-4 sm:p-5 md:p-6">
      {/* Allow selection on inputs/buttons/links */}
      <style>{`
        input, textarea, button, a, select, [contenteditable="true"] {
          user-select: text !important;
        }
      `}</style>

      {/* Header */}
      <h1 className="text-xl sm:text-2xl font-bold text-[#115D29] mb-4 sm:mb-6">
        Welcome back! Here’s what’s happening today
      </h1>

      {/* Top summary cards (kept same) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <DashboardCard
          title="Total Orders"
          value="24"
          icon={moneyIcon}
          trend="+12.5% from yesterday"
          trendColor="green"
        />
        <DashboardCard
          title="Pending Orders"
          value="8"
          icon={cartIcon}
          trend="+8.2% from yesterday"
          trendColor="green"
        />
        <DashboardCard
          title="Stock Expiring Soon"
          value="30"
          icon={alertIcon}
          trend="Critical from yesterday"
          trendColor="red"
        />
        <DashboardCard
          title="Total Stock Value"
          value="1.2Cr"
          icon={usersIcon}
          trend="+15.3% from yesterday"
          trendColor="green"
        />
      </div>

      {/* === NEW LOWER PANELS: 2x2 grid matching the image === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Restock Predictor (top-left) — updated to match image */}
        <div
          className="bg-white border rounded-xl p-5 shadow-sm"
          style={{ borderColor: "#BFDAC8" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#115D29] font-semibold">
              AI Restock Predictor
            </h2>
            <a className="text-sm text-[#2F7A36] hover:underline">View All ›</a>
          </div>

          <div className="space-y-4">
            {lowStockItems.map((it, i) => (
              <div
                key={i}
                className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center bg-white rounded-lg p-4"
                style={{ border: "2px solid #E8F3EB" }}
              >
                {/* Name */}
                <div className="text-sm text-[#115D29] font-medium truncate">
                  {it.name}
                </div>

                {/* Brand */}
                <div className="text-sm text-[#115D29] font-medium">
                  {it.brand}
                </div>

                {/* Units Left */}
                <div className="text-sm text-red-500 font-medium text-center">
                  {it.left} units left
                </div>

                {/* Button */}
                <div className="flex justify-end">
                  <button
                    className="rounded-md text-sm font-semibold px-4 py-2"
                    style={{
                      backgroundColor: "#154c2a",
                      color: "#ffffff",
                    }}
                  >
                    Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retailer Orders (top-right) */}
        <div className="bg-white border rounded-xl p-5 shadow-sm border-[#BFDAC8]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#115D29] font-semibold">Retailer Orders</h2>
            <a className="text-sm text-[#2F7A36] hover:underline">View All ›</a>
          </div>

          <div className="space-y-3">
            {newOrders.map((o, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white border border-[#E8F3EB] rounded-lg p-4"
              >
                <div className="grid grid-cols-3 gap-4 flex-1 items-center">
                  <div className="text-sm text-[#115D29] font-medium">
                    {o.id}
                  </div>
                  <div className="text-sm text-gray-600">{o.name}</div>
                  <div className="text-sm text-[#115D29] font-medium">
                    {o.amount}
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center">
                    <img src={correctIcon} alt="ok" className="w-5 h-5" />
                  </button>
                  <button className="w-8 h-8 rounded-full  flex items-center justify-center">
                    <img src={wrongIcon} alt="no" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Trends (bottom-left) */}
        <div className="bg-white border rounded-xl p-5 shadow-sm border-[#BFDAC8]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#115D29] font-semibold">Market Trends</h2>
            <div className="text-sm text-gray-500">Last synced: Today</div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {trendBoxes.map((t, i) => (
              <div
                key={i}
                className={`rounded-lg p-6 shadow-md shadow-gray-400 text-center ${t.bg}`}
                style={{
                  border: `1px solid ${
                    t.border.replace("border-", "") || t.border
                  }`,
                }}
              >
                <div className="text-sm text-[#2F7A36]">{t.region}</div>
                <div className="text-sm font-semibold text-[#115D29] mt-3">
                  {t.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Deliveries (bottom-right) */}
        <div className="bg-white border rounded-xl p-5 shadow-sm border-[#BFDAC8]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#115D29] font-semibold">Active Deliveries</h2>
            <div className="text-sm text-gray-500">Last synced: 5 min ago</div>
          </div>

          <div className="space-y-3">
            {deliveries.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white border border-[#E8F3EB] rounded-lg p-4"
              >
                <div className="grid grid-cols-3 gap-4 flex-1 items-center">
                  <div className="text-sm text-[#115D29] font-medium">
                    {d.driver}
                  </div>
                  <div className="text-sm text-gray-700">{d.order}</div>
                  <div className="text-sm text-gray-700">{d.location}</div>
                </div>

                <button className="bg-[#115D29] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#0e3f1b] transition">
                  Track
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
