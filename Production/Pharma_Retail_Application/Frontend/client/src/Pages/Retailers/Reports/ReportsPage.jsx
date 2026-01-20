import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is installed: npm install axios

import revenueIcon from "../../../assets/Reports/Revenue.png";
import ordersIcon from "../../../assets/Reports/orders.png";
import avgIcon from "../../../assets/Reports/avg.png";

import downloadIcon from "../../../assets/Reports/download.png";
import aiIcon from "../../../assets/Reports/ai.png";
import tickIcon from "../../../assets/Reports/Trend.png";

const BASE_URL = import.meta.env.VITE_API_BASE || "/api";

export default function ReportsAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Assuming a static retailer_id of 1 for now based on your curl example
  const retailerId = 1;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/reports/sales-dashboard/${retailerId}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching sales dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [retailerId]);

  // Map API values to your card structure
  const metricCards = [
    {
      title: "Total Revenue",
      value: loading ? "..." : `₹${data?.TotalRevenue?.toLocaleString() || 0}`,
      change: "+18.2% from last period", // Keeping static as requested unless API provides it
      icon: revenueIcon,
    },
    {
      title: "Total Orders",
      value: loading ? "..." : data?.TotalOrders || 0,
      change: "+12.5% from last period",
      icon: ordersIcon,
    },
    {
      title: "Avg Order Value",
      value: loading ? "..." : `₹${data?.AvgOrderValue?.toLocaleString() || 0}`,
      change: "+5.1% from last period",
      icon: avgIcon,
    },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 py-6">
      {/* Header + actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-[#115D29]">
            Reports & Analytics
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Track your business performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 bg-[#1F78C0] hover:bg-[#1661a3] text-white text-sm px-4 py-3 rounded-md shadow"
          >
            <img src={downloadIcon} alt="download" className="w-4 h-4" />
            <span>Download Report</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 bg-[#D9534F] hover:bg-[#c33f3f] text-white text-sm px-4 py-3 rounded-md shadow"
          >
            <img src={aiIcon} alt="ai" className="w-4 h-4" />
            <span>AI Analytics & Report</span>
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {metricCards.map((m, i) => (
          <div
            key={i}
            className="relative rounded-lg border border-[#C7DECF] bg-white p-5 min-h-[120px] flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-md text-[#115D29]">{m.title}</div>
              </div>

              <div className="w-10 h-10 flex items-center justify-center rounded-md">
                <img src={m.icon} alt={m.title} className="w-10 h-10" />
              </div>
            </div>

            <div>
              <div className="text-2xl md:text-xl font-semibold text-[#115D29] mt-3">
                {m.value}
              </div>
              <div className="text-sm text-[#2E9B47] mt-3 flex items-center gap-2">
                <img
                  src={tickIcon}
                  alt="tick"
                  className="w-5 h-5 object-contain"
                />
                <span className="text-sm">{m.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}