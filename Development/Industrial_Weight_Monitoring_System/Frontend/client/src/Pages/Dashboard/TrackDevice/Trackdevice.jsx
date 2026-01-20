import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Assets
import addicon from "../../../assets/Dashboard/Inventory/add-icon.png";
import onlineicon from "../../../assets/Dashboard/AddDevice/Online.png";
import unlinkicon from "../../../assets/Dashboard/AddDevice/Unlink.png";
import offlineicon from "../../../assets/Dashboard/AddDevice/Offline.png";
import lowbatteryicon from "../../../assets/Dashboard/AddDevice/Low Battery.png";
import azicon from "../../../assets/Dashboard/Inventory/A-Z.png";
import zaicon from "../../../assets/Dashboard/Inventory/Z-A.png";
import searchicon from "../../../assets/Dashboard/Inventory/Search.png";
import deleteicon from "../../../assets/Dashboard/Home/Delete.png";
import deleteimg from "../../../assets/Dashboard/Inventory/deleteimg.png";
import deletesuccess from "../../../assets/Dashboard/Inventory/deletesuccess.png";
import mapicon from "../../../assets/Dashboard/Home/map.png";

// Components
import Addnewdevice from "./Addnewdevice";

// API Configuration
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const statusStyles = {
  online: { bg: "#2ECC711A", text: "#2ECC71", label: "Online" },
  lowbattery: { bg: "#F3F4F5", text: "#3E4246", label: "Low Battery" },
  offline: { bg: "#E74C3C1A", text: "#E74C3C", label: "Offline" },
  unlinked: { bg: "#B3BDC533", text: "#0A2A43", label: "Unlinked" },
};

const TrackDevice = () => {
  const navigate = useNavigate();

  // Data States
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({ Online: 0, Unlinked: 0, Offline: 0, LowBattery: 0 });
  const [loading, setLoading] = useState(true);

  // UI States
  const [isDescending, setIsDescending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddItem, setShowAddItem] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  // Filters - Updated "Unlink" to "Unlinked" to match API consistency
  const [filters, setFilters] = useState({
    "Online": false, "Offline": false, "Low Battery": false, "Unlinked": false,
  });

  // 1. Fetch Data from API
  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/devices`);
      if (response.data.success) {
        setDevices(response.data.data.Devices);
        setStats({
          Online: response.data.data.Online,
          Offline: response.data.data.Offline,
          Unlinked: response.data.data.Unlinked,
          LowBattery: response.data.data.LowBattery
        });
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // 2. Delete Device Logic
  const handleDeleteDevice = async () => {
    try {
      const response = await axios.delete(`${API_BASE}/devices/${selectedDeviceId}`);
      if (response.data.success) {
        setShowDelete(false);
        setShowDeleteSuccess(true);
        fetchDevices(); // Refresh list
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete device. Please try again.");
    }
  };

  // 3. Filter and Sort Logic
  const filteredAndSortedData = useMemo(() => {
    let data = [...devices];

    // Search Filter
    if (searchQuery) {
      data = data.filter(item =>
        item.DeviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.DeviceId?.toString().includes(searchQuery) ||
        item.LocationName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status Filter
    const activeFilters = Object.keys(filters).filter(key => filters[key]);
    if (activeFilters.length > 0) {
      data = data.filter(item => activeFilters.includes(item.Status));
    }

    // Sort Logic
    data.sort((a, b) => {
      const nameA = a.DeviceName?.toLowerCase() || "";
      const nameB = b.DeviceName?.toLowerCase() || "";
      return isDescending ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
    });

    return data;
  }, [devices, searchQuery, filters, isDescending]);

  const toggleFilter = (label) => {
    setFilters((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const statCards = [
    { number: stats.Online, label: "Devices Online", color: "#2ECC71", img: onlineicon },
    { number: stats.Unlinked, label: "Unlinked", color: "#0A2A43", img: unlinkicon },
    { number: stats.Offline, label: "Offline", color: "#E74C3C", img: offlineicon },
    { number: stats.LowBattery, label: "Low Battery", color: "#F1C40F", img: lowbatteryicon }
  ];

  return (
    <div className="p-[16px] md:p-[36px]">
      <div className="flex flex-col rounded-[24px] md:rounded-[36px] p-[20px] md:p-[36px] gap-[24px] md:gap-[36px] border border-[#8A939B] bg-white">

        {/* 1. HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex flex-col gap-[8px]">
            <h2 className="font-semibold text-[18px] md:text-[20px] text-[#0A2A43]">Tracking Device</h2>
            <p className="text-[14px] md:text-[16px] text-[#0A2A43]">Real-Time Device Monitoring</p>
          </div>
          <button
            onClick={() => setShowAddItem(true)}
            className="flex w-full sm:w-auto h-[42px] px-[24px] py-[10px] rounded-[80px] gap-[8px] bg-[#1769FF] items-center justify-center text-white font-semibold text-[14px]"
          >
            <img src={addicon} className="w-[18px] h-[18px] invert brightness-0" alt="add" />
            Add New Device
          </button>
        </div>

        {/* 2. STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] md:gap-[24px]">
          {statCards.map((item, index) => (
            <div key={index} className="flex flex-row items-center gap-[12px] p-[12px] rounded-[80px] border border-[#E7EAEC]">
              <div className="w-[48px] h-[48px] md:w-[52px] md:h-[52px] flex items-center justify-center rounded-full bg-[#F4F6F8] flex-shrink-0">
                <img src={item.img} className="w-[20px] h-[20px]" alt={item.label} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[18px] md:text-[20px] leading-tight" style={{ color: item.color }}>{item.number}</span>
                <span className="text-[12px] md:text-[14px] font-medium" style={{ color: item.color }}>{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Map View Placeholder */}
        <div className='rounded-[24px] md:rounded-[36px] overflow-hidden border border-[#E7EAEC]'>
          <img src={mapicon} className='w-full h-[300px] md:h-[648px] object-cover' alt="map view" />
        </div>

        {/* 3. FILTERS & SEARCH */}
        <div className="flex flex-col xl:flex-row rounded-[24px] md:rounded-[80px] bg-[#F4F6F8] p-[12px] md:px-[32px] md:py-[16px] gap-[16px] items-stretch xl:items-center">

          <div className="flex flex-col md:flex-row gap-[16px]">
            {/* Sort Toggle */}
            <div className="flex flex-row self-start rounded-[80px] border border-[#E7EAEC] bg-white p-[6px] gap-[12px] items-center">
              <img src={azicon} className="w-[18px] ml-2" alt="A-Z" />
              <button
                onClick={() => setIsDescending(!isDescending)}
                className={`relative w-[50px] h-[26px] rounded-[80px] border border-[#B3BDC5] flex items-center transition-colors ${isDescending ? "bg-[#1769FF]" : "bg-[#D1D5DB]"}`}
              >
                <div className={`w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-300 ${isDescending ? "translate-x-[26px]" : "translate-x-0"}`} />
              </button>
              <img src={zaicon} className="w-[18px] mr-2" alt="Z-A" />
            </div>

            {/* Filter Container */}
            <div className="flex flex-wrap items-center px-[16px] py-[10px] gap-x-[20px] gap-y-[10px] rounded-[20px] md:rounded-[80px] border border-[#E7EAEC] bg-white">
              <label className="text-[13px] font-bold text-[#0A2A43]">Filter by:</label>
              {["Online", "Offline", "Low Battery", "Unlinked"].map((label, idx) => (
                <label key={idx} className="flex items-center gap-[8px] cursor-pointer" onClick={() => toggleFilter(label)}>
                  <div className={`w-[16px] h-[16px] rounded-[4px] border flex items-center justify-center transition-all ${filters[label] ? "bg-[#0A2A43] border-[#0A2A43]" : "border-[#B3BDC5]"}`}>
                    {filters[label] && <svg width="8" height="6" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                  <span className="text-[13px] text-[#0A2A43] font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="flex flex-1 items-center gap-[12px] rounded-[80px] px-[20px] py-[10px] border border-[#8A939B] bg-white">
            <input
              type="text"
              placeholder="Search by name, ID or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-[14px] outline-none bg-transparent"
            />
            <img src={searchicon} alt="search" className="w-[18px] h-[18px] opacity-60" />
          </div>
        </div>

        {/* 4. DATA SECTION */}
        <div className="rounded-[20px] md:rounded-[28px] overflow-hidden border border-[#E7EAEC]">
          {loading ? (
            <div className="p-20 text-center text-gray-400 font-medium">Synchronizing device data...</div>
          ) : (
            <>
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block overflow-x-auto no-scrollbar">
                <table className="w-full text-center min-w-[700px]">
                  <thead className="bg-[#0A2A43] text-white text-[14px]">
                    <tr>
                      <th className="py-5 font-medium px-4 text-left pl-10">Device ID</th>
                      <th className="font-medium px-4">Device Name</th>
                      <th className="font-medium px-4">Battery</th>
                      <th className="font-medium px-4">Location</th>
                      <th className="font-medium px-4">Status</th>
                      <th className="font-medium px-4 text-right pr-10">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7EAEC]">
                    {filteredAndSortedData.map((row) => {
                      const s = statusStyles[row.Status.toLowerCase().replace(" ", "")] || statusStyles.online;
                      return (
                        <tr
                          key={row.DeviceId}
                          onClick={() => navigate('/dashboard/device-details', { state: { device: row } })}
                          className="text-[14px] text-[#0A2A43] hover:bg-[#F3F4F5] transition-colors cursor-pointer"
                        >
                          <td className="py-6 font-medium text-left pl-10">{row.DeviceId}</td>
                          <td>{row.DeviceName}</td>
                          <td className={`font-bold ${row.Battery < 20 ? 'text-[#E74C3C]' : 'text-[#0A2A43]'}`}>{row.Battery}%</td>
                          <td>{row.LocationName}</td>
                          <td>
                            <span className="inline-block px-[16px] py-[4px] rounded-full text-[12px] font-bold" style={{ background: s.bg, color: s.text }}>
                              {row.Status}
                            </span>
                          </td>
                          <td className="text-right pr-10">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedDeviceId(row.DeviceId); setShowDelete(true); }}
                              className="hover:scale-110 p-2 hover:bg-red-50 rounded-full transition-all"
                            >
                              <img src={deleteicon} className="w-[20px] h-[20px]" alt="delete" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARD VIEW */}
              <div className="block md:hidden divide-y divide-[#E7EAEC]">
                {filteredAndSortedData.map((row) => {
                  const s = statusStyles[row.Status.toLowerCase().replace(" ", "")] || statusStyles.online;
                  return (
                    <div
                      key={row.DeviceId}
                      onClick={() => navigate('/dashboard/device-details', { state: { device: row } })}
                      className="p-5 flex flex-col gap-4 active:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <span className="text-[12px] text-gray-500 font-medium">ID: {row.DeviceId}</span>
                          <span className="text-[16px] font-bold text-[#0A2A43]">{row.DeviceName}</span>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: s.bg, color: s.text }}>
                          {row.Status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 bg-[#F4F6F8] p-3 rounded-xl">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500">Location</span>
                          <span className="text-[13px] font-semibold text-[#0A2A43]">{row.LocationName}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500">Battery</span>
                          <span className={`text-[13px] font-bold ${row.Battery < 20 ? 'text-[#E74C3C]' : 'text-[#0A2A43]'}`}>{row.Battery}%</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedDeviceId(row.DeviceId); setShowDelete(true); }}
                          className="flex items-center gap-2 px-4 py-2 border border-red-100 rounded-lg text-red-500 text-[13px] font-medium"
                        >
                          <img src={deleteicon} className="w-[16px] h-[16px]" alt="delete" />
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODALS */}
      {showAddItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-[760px] max-h-[90vh] overflow-y-auto no-scrollbar">
            <Addnewdevice onClose={() => { setShowAddItem(false); fetchDevices(); }} />
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="w-full max-w-[420px] bg-white rounded-[36px] p-[24px] shadow-2xl">
            <div className="flex flex-col border border-[#B3BDC5] rounded-[24px] p-[24px] gap-[20px] items-center text-center">
              <img src={deleteimg} className="w-[64px] h-[64px]" alt="alert" />
              <div>
                <h3 className="text-[20px] font-bold text-[#E74C3C]">Remove Device?</h3>
                <p className="text-[14px] text-[#0A2A43] mt-3">
                  This action cannot be undone. You are about to remove Device ID: <b>{selectedDeviceId}</b>.
                </p>
              </div>
              <div className="flex w-full gap-[12px]">
                <button
                  className="flex-1 py-[12px] rounded-full bg-[#E74C3C] text-white text-[14px] font-bold"
                  onClick={handleDeleteDevice}
                >Delete</button>
                <button
                  className="flex-1 py-[12px] rounded-full border border-gray-300 text-gray-500 text-[14px] font-bold"
                  onClick={() => setShowDelete(false)}
                >Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteSuccess && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[120] p-4">
          <div className="relative w-full max-w-[420px] bg-white rounded-[36px] p-[24px] shadow-xl">
            <button onClick={() => setShowDeleteSuccess(false)} className="absolute top-6 right-6 w-8 h-8 rounded-full border border-[#0A2A43] flex items-center justify-center text-[#0A2A43]">✕</button>
            <div className="flex flex-col items-center gap-[20px] border border-[#B3BDC5] rounded-[24px] p-[32px] text-center">
              <img src={deletesuccess} className="w-[64px] h-[64px]" alt="success" />
              <div className="flex flex-col gap-2">
                <p className="text-[20px] font-bold text-[#2ECC71]">Successfully Deleted</p>
                <p className="text-[14px] text-[#0A2A43]">Inventory list has been updated.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackDevice;