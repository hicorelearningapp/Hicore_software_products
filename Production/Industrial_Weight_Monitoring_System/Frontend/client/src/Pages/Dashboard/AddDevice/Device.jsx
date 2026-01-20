import React, { useState, useEffect, useMemo } from 'react';
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

// Components
import Addnewdevice from "./Addnewdevice";
import DeviceDetails from './DeviceDetails';

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

// Status mapping aligned with your API "Status": "Online" values
const statusStyles = {
  online: { bg: "#2ECC711A", text: "#2ECC71", label: "Online" },
  lowbattery: { bg: "#F3F4F5", text: "#3E4246", label: "Low Battery" },
  offline: { bg: "#E74C3C1A", text: "#E74C3C", label: "Offline" },
  unlinked: { bg: "#B3BDC533", text: "#0A2A43", label: "Unlinked" },
};

const Device = () => {
  const [deviceList, setDeviceList] = useState([]);
  const [stats, setStats] = useState({ online: 0, unlinked: 0, offline: 0, lowBattery: 0 });
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isDescending, setIsDescending] = useState(false);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [filters, setFilters] = useState({
    "Online": false,
    "Offline": false,
    "Low Battery": false,
    "Unlink": false,
  });

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/devices`);
      if (response.data.success) {
        const { data } = response.data;
        setDeviceList(data.Devices || []);
        // Updated to match the capital keys in your API response
        setStats({
          online: data.Online || 0,
          offline: data.Offline || 0,
          unlinked: data.Unlinked || 0,
          lowBattery: data.LowBattery || 0
        });
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDevice = async () => {
    try {
      await axios.delete(`${API_BASE}/devices/${selectedDeviceId}`);
      setShowDelete(false);
      setShowDeleteSuccess(true);
      fetchDevices();
    } catch (error) {
      alert("Failed to delete device.");
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const filteredAndSortedData = useMemo(() => {
    let data = [...deviceList];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(item => 
        item.DeviceName?.toLowerCase().includes(query) ||
        item.LocationName?.toLowerCase().includes(query) ||
        item.DeviceId?.toString().includes(query)
      );
    }

    const activeFilters = Object.keys(filters).filter(key => filters[key]);
    if (activeFilters.length > 0) {
      data = data.filter(item => {
        const status = item.Status?.toLowerCase().replace(/\s/g, '');
        if (filters["Online"] && status === "online") return true;
        if (filters["Offline"] && status === "offline") return true;
        if (filters["Low Battery"] && status === "lowbattery") return true;
        if (filters["Unlink"] && (status === "unlinked" || status === "unlink")) return true;
        return false;
      });
    }

    data.sort((a, b) => {
      const nameA = a.DeviceName?.toLowerCase() || "";
      const nameB = b.DeviceName?.toLowerCase() || "";
      return isDescending ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
    });

    return data;
  }, [deviceList, searchQuery, filters, isDescending]);

  const toggleFilter = (label) => {
    setFilters((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const cards = [
    { number: stats.online, label: "Devices Online", color: "#2ECC71", img: onlineicon },
    { number: stats.unlinked, label: "Unlinked", color: "#34495E", img: unlinkicon },
    { number: stats.offline, label: "Offline", color: "#E74C3C", img: offlineicon },
    { number: stats.lowBattery, label: "Low Battery", color: "#F39C12", img: lowbatteryicon }
  ];

  return (
    <div className="p-[16px] md:p-[36px]">
      <div className="flex flex-col rounded-[24px] md:rounded-[50px] p-[20px] md:p-[36px] gap-[24px] border border-[#8A939B] bg-white">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex flex-col gap-[4px]">
            <h2 className="font-bold text-[20px] md:text-[24px] text-[#0A2A43]">Device Management</h2>
            <p className="text-[14px] text-[#8A939B]">Real-time monitoring for IoT scale hardware.</p>
          </div>
          <button
            onClick={() => setShowAddDevice(true)}
            className="flex w-full md:w-auto px-6 py-3 rounded-full bg-[#1769FF] items-center justify-center text-white font-bold text-[14px] hover:bg-[#1255CC] transition-all shadow-lg shadow-blue-100"
          >
            <img src={addicon} className="w-5 h-5 mr-2" alt="add" />
            Add New Device
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px] md:gap-[24px]">
          {cards.map((item, index) => (
            <div key={index} className="flex flex-row items-center gap-[12px] p-4 rounded-[24px] sm:rounded-[80px] border border-[#E7EAEC] hover:shadow-md transition-shadow">
              <div className="p-3 rounded-full bg-[#F4F6F8]">
                <img src={item.img} className="w-6 h-6 md:w-8 md:h-8" alt={item.label} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[18px] md:text-[22px]" style={{ color: item.color }}>{item.number}</span>
                <span className="text-[11px] md:text-[13px] font-bold text-gray-400 uppercase tracking-tight">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row rounded-[24px] lg:rounded-full bg-[#F4F6F8] p-4 gap-4 items-stretch lg:items-center">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center rounded-full border border-[#E7EAEC] bg-white p-2 gap-4">
              <img src={azicon} className="w-6 ml-2" alt="A-Z" />
              <button 
                onClick={() => setIsDescending(!isDescending)}
                className={`relative w-14 h-7 rounded-full transition-colors flex items-center p-1 ${isDescending ? "bg-[#1769FF]" : "bg-gray-300"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isDescending ? "translate-x-7" : "translate-x-0"}`} />
              </button>
              <img src={zaicon} className="w-6 mr-2" alt="Z-A" />
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-white px-6 py-3 rounded-full border border-[#E7EAEC]">
              <span className="text-[12px] font-bold text-[#0A2A43] opacity-60">FILTER:</span>
              {["Online", "Offline", "Low Battery", "Unlink"].map((label, idx) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer group" onClick={() => toggleFilter(label)}>
                  <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${filters[label] ? "bg-[#1769FF] border-[#1769FF]" : "border-gray-300"}`}>
                    {filters[label] && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <span className="text-[13px] text-[#0A2A43] font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center gap-3 rounded-full px-6 py-3 border border-[#8A939B] bg-white focus-within:border-[#1769FF]">
            <img src={searchicon} alt="search" className="w-4 h-4 opacity-40" />
            <input 
              type="text" 
              placeholder="Search by ID, Name or Location..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-[14px] outline-none bg-transparent" 
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-[24px] border border-[#E7EAEC] overflow-hidden">
          {loading ? (
             <div className="p-20 text-center text-gray-400">Syncing with IoT Network...</div>
          ) : filteredAndSortedData.length === 0 ? (
            <div className="p-20 text-center text-gray-400">No devices found matching criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0A2A43] text-white text-[12px] uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6">ID</th>
                    <th className="px-4">Device Details</th>
                    <th className="px-4">Connection</th>
                    <th className="px-4">Battery</th>
                    <th className="px-4">Location</th>
                    <th className="px-4">Status</th>
                    <th className="px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7EAEC]">
                  {filteredAndSortedData.map((row) => {
                    const statusKey = row.Status?.toLowerCase().replace(/\s/g, '');
                    const s = statusStyles[statusKey] || statusStyles.online;
                    return (
                      <tr 
                        key={row.DeviceId} 
                        onClick={() => { setSelectedDevice(row); setShowDeviceDetails(true); }}
                        className="hover:bg-gray-50 cursor-pointer transition-colors group"
                      >
                        <td className="py-5 px-6 font-mono text-[13px] text-[#0A2A43]">{row.DeviceId}</td>
                        <td className="px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#0A2A43]">{row.DeviceName}</span>
                            <span className="text-[12px] text-gray-400">{row.DeviceType}</span>
                          </div>
                        </td>
                        <td className="px-4 text-[13px]">{row.ConnectionMode}</td>
                        <td className="px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-bold">{row.Battery}%</span>
                          </div>
                        </td>
                        <td className="px-4 text-[13px] font-medium">{row.LocationName}</td>
                        <td className="px-4">
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: s.bg, color: s.text }}>
                            {s.label}
                          </span>
                        </td>
                        <td className="px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => { setSelectedDeviceId(row.DeviceId); setShowDelete(true); }}
                            className="p-2 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <img src={deleteicon} className="w-5 h-5 opacity-60 group-hover:opacity-100" alt="delete" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDeviceDetails && (
        <DeviceDetails
          item={selectedDevice}
          onClose={() => setShowDeviceDetails(false)}
          onEdit={() => { setShowDeviceDetails(false); setShowAddDevice(true); }}
        />
      )}

      {showAddDevice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-[720px] bg-white rounded-[32px] p-6 shadow-2xl">
            <button onClick={() => setShowAddDevice(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black text-xl">✕</button>
            <Addnewdevice onClose={() => { setShowAddDevice(false); fetchDevices(); }} />
          </div>
        </div>
      )}

      {/* Delete Pop-up */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[110] p-4">
          <div className="w-full max-w-[400px] bg-white rounded-[24px] p-8 text-center shadow-2xl scale-up-center">
            <img src={deleteimg} className="w-16 h-16 mx-auto mb-4" alt="warning" />
            <h3 className="text-xl font-bold text-red-500">Decommission Device?</h3>
            <p className="text-gray-500 mt-2 mb-8">This will disconnect the hardware from the cloud monitoring system permanently.</p>
            <div className="flex gap-4">
              <button onClick={deleteDevice} className="flex-1 py-4 bg-red-500 text-white rounded-full font-bold">Delete</button>
              <button onClick={() => setShowDelete(false)} className="flex-1 py-4 border border-gray-300 rounded-full font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showDeleteSuccess && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[120] p-4">
          <div className="w-full max-w-[400px] bg-white rounded-[24px] p-10 text-center">
            <img src={deletesuccess} className="w-16 h-16 mx-auto mb-6" alt="success" />
            <h3 className="text-xl font-bold text-green-500 mb-6">Device Removed</h3>
            <button onClick={() => setShowDeleteSuccess(false)} className="w-full py-4 bg-[#0A2A43] text-white rounded-full font-bold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Device;