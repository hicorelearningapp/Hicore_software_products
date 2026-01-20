import React, { useEffect, useState } from "react";
import axios from "axios";

// Assets
import step4icon from "../../../assets/Dashboard/Home/step4.png";
import lowstockicon from "../../../assets/Dashboard/Home/low-stock.png";
import criticalicon from "../../../assets/Dashboard/Home/critical.png";
import deviceicon from "../../../assets/Dashboard/Home/device.png";

// Components
import Device from "./Device";
import Livemap from "./Livemap";
import LiveInventorytable from "./LiveInventorytable";

/* ================= API BASE ================= */
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const api = {
  inventory: `${API_BASE}/inventory`,
  devices: `${API_BASE}/devices`,
};

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);

  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    linkedDevices: 0,
  });

  const [deviceStats, setDeviceStats] = useState({
    online: 0,
    total: 0,
  });

  /* ================= FETCH DASHBOARD DATA ================= */
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [inventoryRes, deviceRes] = await Promise.all([
        axios.get(api.inventory),
        axios.get(api.devices),
      ]);

      /* INVENTORY */
      if (inventoryRes.data?.success) {
        const inv = inventoryRes.data.data;
        setInventoryStats({
          totalItems: inv.TotalItems || 0,
          lowStock: inv.LowStock || 0,
          outOfStock: inv.OutOfStock || 0,
          linkedDevices: inv.LinkedDevices || 0,
        });
      }

      /* DEVICES */
      if (deviceRes.data?.success) {
        const dev = deviceRes.data.data;
        const totalDevices =
          (dev.Online || 0) +
          (dev.Offline || 0) +
          (dev.Unlinked || 0) +
          (dev.LowBattery || 0);

        setDeviceStats({
          online: dev.Online || 0,
          total: totalDevices,
        });
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* ================= CARD CONFIG ================= */
  const cards = [
    {
      number: inventoryStats.totalItems,
      label: "Total SKUs",
      color: "#2ECC71",
      img: step4icon,
    },
    {
      number: inventoryStats.lowStock,
      label: "Low Stock Items",
      color: "#F1C40F",
      img: lowstockicon,
    },
    {
      number: inventoryStats.outOfStock,
      label: "Critical Alerts",
      color: "#E74C3C",
      img: criticalicon,
    },
    {
      number: `${deviceStats.online}/${deviceStats.total}`,
      label: "Devices Online",
      color: "#2ECC71",
      img: deviceicon,
    },
  ];

  return (
    <div className="p-[20px] md:p-[36px]">
      <div className="flex flex-col rounded-[24px] md:rounded-[36px] p-[20px] md:p-[36px] gap-[24px] border border-[#8A939B]">

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] md:gap-[24px]">
          {cards.map((item, index) => (
            <div
              key={index}
              className="flex flex-row items-center gap-[8px] p-[8px] rounded-[80px] border border-[#E7EAEC]"
            >
              {/* ICON */}
              <div className="p-[14px] md:p-[16px] rounded-[80px] bg-[#F4F6F8] shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]">
                <img
                  src={item.img}
                  className="w-[28px] h-[28px] md:w-[32px] md:h-[32px]"
                  alt={item.label}
                />
              </div>

              {/* TEXT */}
              <div className="flex flex-col">
                <span
                  className="font-semibold text-[16px] md:text-[18px]"
                  style={{ color: item.color }}
                >
                  {loading ? "--" : item.number}
                </span>
                <span
                  className="text-[12px] md:text-[14px] font-medium"
                  style={{ color: item.color }}
                >
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ================= DEVICE + MAP ================= */}
        <div className="flex flex-col lg:flex-row gap-[24px]">
          <div className="w-full lg:w-[35%]">
            <Device />
          </div>
          <div className="w-full lg:w-[65%]">
            <Livemap />
          </div>
        </div>

        {/* ================= LIVE INVENTORY TABLE ================= */}
        <LiveInventorytable />
      </div>
    </div>
  );
};

export default DashboardHome;
