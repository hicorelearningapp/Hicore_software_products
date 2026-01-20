import React, { useEffect, useState } from "react";
import { getDashboard } from "./retailerApi";

// Import your assets
import moneyIcon from "../../../assets/DashboardPage/money-icon.png";
import cartIcon from "../../../assets/DashboardPage/cart-icon.png";
import alertIcon from "../../../assets/DashboardPage/alert-icon.png";
import usersIcon from "../../../assets/DashboardPage/user-icon.png";

// Trend icons
import trendUpGreen from "../../../assets/DashboardPage/Demand.png";
import trendUpRed from "../../../assets/DashboardPage/Loss.png";

// Action icons
import correctIcon from "../../../assets/DashboardPage/tick.png";
import wrongIcon from "../../../assets/DashboardPage/wrong.png";

const DashboardCard = ({ title, value, icon, trend, trendColor }) => {
  const trendIcon =
    trendColor === "green"
      ? trendUpGreen
      : trendColor === "red"
      ? trendUpRed
      : "";

  return (
    <div
      className="
        bg-white border rounded-xl 
        p-4 sm:p-5 md:p-6 md:pb-3 
        w-full shadow-sm 
        transition-all duration-300 cursor-pointer
        hover:shadow-md hover:shadow-green-700 border-[#B5CDBD]
      "
    >
      <div className="flex justify-between items-start">
        <p className="text-green-800 font-medium text-base sm:text-lg md:text-lg">
          {title}
        </p>

        <div className="flex items-center justify-center rounded-lg transition-all duration-300 hover:bg-green-700">
          <img
            src={icon}
            alt="icon"
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
          />
        </div>
      </div>

      <h2 className="text-md sm:text-xl md:text-xl font-medium mt-4 text-green-800">
        {value}
      </h2>

      <div
        className={`mt-5 text-xs sm:text-sm flex items-center gap-2 ${
          trendColor === "green"
            ? "text-green-600"
            : trendColor === "red"
            ? "text-red-500"
            : "text-gray-600"
        }`}
      >
        <img
          src={trendIcon}
          alt="trend-icon"
          className="w-3 h-3 sm:w-4 sm:h-4"
        />
        <span>{trend}</span>
      </div>
    </div>
  );
};

const StatusPill = ({ text }) => {
  const classes =
    text === "Pending"
      ? "bg-red-100 text-red-600"
      : text === "Completed"
      ? "bg-green-100 text-green-600"
      : "bg-blue-100 text-blue-600";

  return (
    <span
      className={`px-4 py-1 rounded-full text-sm font-medium ${classes} w-24 text-center`}
    >
      {text}
    </span>
  );
};

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    TodaySales: 0,
    NewOrders: 0,
    LowStockCount: 0,
    NewOrdersList: [],
    RecentOrders: [],
    LowStock: [],
  });

  const retailer_id = 1;

  useEffect(() => {
    getDashboard(retailer_id).then((data) => {
      if (data) setDashboard(data);
    });
  }, []);

  return (
    <div
      className="p-4 sm:p-5 md:p-6"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      <style>{`
        input, textarea, button, a, select, [contenteditable="true"] {
          user-select: text !important;
          -webkit-user-select: text !important;
        }
      `}</style>

      <h1 className="text-xl sm:text-2xl font-bold text-green-800 mb-4 sm:mb-6">
        Welcome back! Here’s what’s happening today
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <DashboardCard
          title="Today's Sales"
          value={`₹${dashboard.TodaySales}`}
          icon={moneyIcon}
          trend="+0.0% from yesterday"
          trendColor="green"
        />

        <DashboardCard
          title="New Orders"
          value={dashboard.NewOrders}
          icon={cartIcon}
          trend="+0.0% from yesterday"
          trendColor="green"
        />

        <DashboardCard
          title="Low Stock Items"
          value={dashboard.LowStockCount}
          icon={alertIcon}
          trend="Critical from yesterday"
          trendColor="red"
        />

        <DashboardCard
          title="Active Customers"
          value="0"
          icon={usersIcon}
          trend="+0.0% from yesterday"
          trendColor="green"
        />
      </div>

      {/* LOWER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NEW ORDERS */}
        <div className="bg-white border border-[#B5CDBD] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between mb-4">
            <h2 className="text-green-800 font-semibold text-lg">New Orders</h2>
            <a className="text-sm text-green-700 hover:underline">View All →</a>
          </div>

          {dashboard.NewOrdersList.length === 0 ? (
            <p className="text-gray-500 text-sm">No new orders</p>
          ) : (
            dashboard.NewOrdersList.map((o) => (
              <div
                key={o.OrderID}
                className="border border-gray-200 rounded-lg p-6 flex items-center hover:bg-green-50 hover:border-green-500 transition cursor-pointer"
              >
                <div className="grid grid-cols-3 flex-1 gap-4">
                  <div className="text-sm text-green-800 font-medium">
                    ORD-{o.OrderID}
                  </div>
                  <div className="text-sm text-gray-700">{o.CustomerName}</div>
                  <div className="text-sm text-green-800 font-medium">
                    ₹{o.Price}
                  </div>
                </div>

                <div className="flex gap-3 ml-6">
                  <button className="p-1 rounded-full hover:bg-green-50">
                    <img src={correctIcon} className="w-5 h-5" />
                  </button>
                  <button className="p-1 rounded-full hover:bg-red-50">
                    <img src={wrongIcon} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* RECENT */}
          <div className="mt-6">
            <div className="flex justify-between mb-3">
              <h3 className="text-green-800 font-semibold">Recent Orders</h3>
              <a className="text-sm text-green-700 hover:underline">
                View All →
              </a>
            </div>

            {dashboard.RecentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent orders</p>
            ) : (
              dashboard.RecentOrders.map((r) => (
                <div
                  key={r.OrderID}
                  className="border border-gray-200 rounded-lg p-6 hover:bg-green-50 hover:border-green-500 transition cursor-pointer"
                >
                  <div className="grid grid-cols-4 items-center gap-8">
                    <div className="text-sm text-green-800 font-medium">
                      ORD-{r.OrderID}
                    </div>
                    <div className="text-sm text-gray-700">
                      {r.CustomerName}
                    </div>
                    <div className="text-sm text-green-800 font-medium">
                      ₹{r.Price}
                    </div>
                    <div className="flex justify-end">
                      <StatusPill text={r.Status} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* LOW STOCK */}
        <div className="bg-white border border-[#B5CDBD] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between mb-4">
            <h2 className="text-green-800 font-semibold text-lg">
              Low Stock Alerts
            </h2>
            <a className="text-sm text-green-700 hover:underline">Reorder →</a>
          </div>

          {dashboard.LowStock.length === 0 ? (
            <p className="text-gray-500 text-sm">No low stock alerts</p>
          ) : (
            dashboard.LowStock.map((item, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-4 flex items-start justify-between hover:bg-red-50 hover:border-red-500 transition cursor-pointer"
              >
                <div>
                  <div className="text-sm text-green-800 font-medium">
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Min: {item.min}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-50 text-red-600">
                    {item.left} units left
                  </div>
                  <div className="text-sm text-gray-500">Exp: {item.exp}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
