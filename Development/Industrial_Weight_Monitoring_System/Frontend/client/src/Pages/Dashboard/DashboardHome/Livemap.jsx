import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mapicon from "../../../assets/Dashboard/Home/map.png";
import { formatDistanceToNow } from 'date-fns'; // Optional: npm install date-fns

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const Livemap = () => {
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({ online: 0, offline: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/devices`);
      if (response.data.success) {
        const { Devices, Online, Offline } = response.data.data;
        setDevices(Devices || []);
        setStats({ online: Online || 0, offline: Offline || 0 });
      }
    } catch (error) {
      console.error("Error fetching map devices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    // Optional: Poll every 60 seconds for live updates
    const interval = setInterval(fetchDevices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Helper to determine status color
  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'online') return "#2ECC71";
    if (s === 'offline') return "#E74C3C";
    return "#8A939B"; // Default/Unknown
  };

  return (
    <div className="flex flex-col gap-[20px] rounded-[24px] md:rounded-[36px] border border-[#E7EAEC] p-[16px] md:p-[20px] bg-white">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[12px]">
        <h2 className="font-semibold text-[16px] leading-[28px] text-[#0A2A43]">
          Live Device Map
        </h2>

        {/* LEGEND */}
        <div className="flex flex-row gap-[16px] flex-wrap">
          <div className="flex flex-row gap-[8px] items-center">
            <span className="rounded-full w-[14px] h-[14px] bg-[#2ECC71]" />
            <span className="text-[14px] leading-[26px] text-[#0A2A43]">Online ({stats.online})</span>
          </div>

          <div className="flex flex-row gap-[8px] items-center">
            <span className="rounded-full w-[14px] h-[14px] bg-[#E74C3C]" />
            <span className="text-[14px] leading-[26px] text-[#0A2A43]">Offline ({stats.offline})</span>
          </div>
        </div>

        {/* DEVICE COUNT */}
        <span className="text-[14px] leading-[26px] text-[#0A2A43]">
          {devices.length} devices registered
        </span>
      </div>

      {/* MAP IMAGE */}
      <div className="relative">
        <img
          src={mapicon}
          alt="Live Map"
          className="border border-[#E7EAEC] rounded-[24px] md:rounded-[36px] w-full h-[300px] object-cover"
        />
        {/* If you have coordinates, you could absolute-position dots here using Latitude/Longitude */}
      </div>

      {/* EVENTS SECTION */}
      <div className="flex flex-col rounded-[24px] md:rounded-[36px] border border-[#E7EAEC] p-[16px] md:p-[20px] gap-[20px] max-h-[400px] overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="text-center py-4 text-[#8A939B]">Loading devices...</div>
        ) : devices.length > 0 ? (
          devices.map((device) => (
            <div
              key={device.DeviceId}
              className="flex flex-col md:flex-row md:items-center justify-between gap-[12px] pb-4 border-b border-[#F4F6F8] last:border-0"
            >
              {/* LEFT SIDE */}
              <div className="flex flex-row items-start gap-[12px]">
                <span
                  className="w-[12px] h-[12px] rounded-full mt-[6px] shrink-0"
                  style={{ backgroundColor: getStatusColor(device.Status) }}
                ></span>

                <div className="flex flex-col gap-[2px]">
                  <span className="text-[14px] text-[#0A2A43] font-semibold">
                    {device.LocationName || "Unknown Location"}
                  </span>
                  <span className="text-[13px] text-[#8A939B]">
                    {device.DeviceName} ({device.DeviceType})
                  </span>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex flex-col md:items-end gap-[2px]">
                <span className="text-[14px] text-[#0A2A43] font-medium">
                  Capacity: {device.Capacity}g
                </span>
                <span className="text-[12px] text-[#8A939B]">
                  Last synced: {device.UpdatedAt ? formatDistanceToNow(new Date(device.UpdatedAt)) + " ago" : "Never"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-[#8A939B]">No devices found.</div>
        )}
      </div>
    </div>
  );
};

export default Livemap;