import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import closeicon from "../../../assets/Dashboard/TrackDevice/close.png";
import backarrow from "../../../assets/Dashboard/TrackDevice/arrowcircle.png";
import EditDevice from "./EditDevice";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/* ===== CHART CONFIGURATION ===== */
// We keep the labels, but allow Y-axis to scale based on device capacity
const FIXED_WEIGHT_X = ["12 AM", "2 AM", "4 AM", "6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM"];
const FIXED_CONSUMPTION_X = ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM"];

const DeviceDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  
  // Get ID from navigation state or fallback
  const deviceId = state?.device?.DeviceId || 1;

  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);

  const [deviceInfo, setDeviceInfo] = useState(null);
  const [rawWeight, setRawWeight] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  /* ===== API DATA FETCHING ===== */
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [deviceRes, weightRes, activityRes] = await Promise.all([
        axios.get(`${API_BASE}/devices/${deviceId}`),
        axios.get(`${API_BASE}/device/${deviceId}/weight-tracking`),
        axios.get(`${API_BASE}/device/${deviceId}/activity-tracking`),
      ]);

      if (deviceRes.data?.success) setDeviceInfo(deviceRes.data.data);
      if (weightRes.data?.success) setRawWeight(weightRes.data.data);
      if (activityRes.data?.success) setActivityLog(activityRes.data.data);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [deviceId]);

  /* ===== DATA MAPPING FOR CHARTS ===== */
  // Maps API Weight entries to the 2-hour interval slots
  const weightHistory = useMemo(() => {
    return FIXED_WEIGHT_X.map((time, index) => {
      // Find a reading that roughly corresponds to this time slot or use index mapping
      const entry = rawWeight[index]; 
      return {
        time,
        weight: entry ? entry.Weight : 0,
      };
    });
  }, [rawWeight]);

  // Maps API Weight to consumption bars
  const consumptionData = useMemo(() => {
    return FIXED_CONSUMPTION_X.map((time, index) => {
      const entry = rawWeight[index];
      return {
        time,
        value: entry ? entry.Weight : 0
      };
    });
  }, [rawWeight]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen font-semibold text-[#0A2A43] bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1769FF] border-t-transparent rounded-full animate-spin"></div>
          <p>Syncing Device Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px] md:gap-[24px] rounded-[20px] md:rounded-[36px] p-[16px] md:p-[36px] bg-white shadow-sm max-w-full overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center gap-[6px]">
        <button onClick={() => navigate(-1)} className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] flex items-center justify-center rounded-full hover:bg-[#F4F6F8] transition-all">
          <img src={backarrow} alt="Back" className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]" />
        </button>
        <h2 className="text-[18px] md:text-[20px] font-semibold text-[#0A2A43]">Device Details</h2>
      </div>

      {/* Device Info Card */}
      <div className="flex flex-col gap-[16px] md:gap-[20px] p-[16px] md:p-[24px] rounded-[24px] border border-[#E7EAEC]">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <h2 className="font-semibold text-[15px] md:text-[16px] text-[#1769FF]">Device Name: {deviceInfo?.DeviceName}</h2>
          <span className={`font-semibold text-[12px] md:text-[14px] px-[12px] py-[2px] rounded-full text-white uppercase ${deviceInfo?.Status === 'Online' ? 'bg-[#2ECC71]' : 'bg-[#E74C3C]'}`}>
            {deviceInfo?.Status}
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-[12px] gap-x-4 p-[16px] md:p-[20px] rounded-[20px] border border-[#E7EAEC] text-[13px] md:text-[14px] text-[#0A2A43]">
          <p>Device ID: <span className="font-semibold">{deviceInfo?.DeviceId}</span></p>
          <p>Device Type: <span className="font-semibold">{deviceInfo?.DeviceType}</span></p>
          <p className="sm:text-right">Location: <span className="font-semibold">{deviceInfo?.LocationName}</span></p>
          <p>Capacity: <span className="font-semibold">{deviceInfo?.Capacity} g</span></p>
          <p>Connection: <span className="font-semibold">{deviceInfo?.ConnectionMode}</span></p>
          <p className="sm:text-right">Last Updated: <span className="font-semibold">{new Date(deviceInfo?.UpdatedAt).toLocaleDateString()}</span></p>
        </div>

        <div className="rounded-[20px] border border-[#E7EAEC] overflow-hidden">
          <div className="flex justify-between items-center bg-[#F4F6F8] px-[16px] md:px-[20px] py-[10px]">
            <h2 className="font-semibold text-[13px] md:text-[14px] text-[#0A2A43]">Live Monitoring</h2>
            <h2 className={`font-semibold text-[13px] md:text-[14px] ${deviceInfo?.Battery < 20 ? 'text-[#E74C3C]' : 'text-[#2ECC71]'}`}>Battery: {deviceInfo?.Battery}%</h2>
          </div>
          <div className="p-[16px] md:p-[20px] grid grid-cols-1 sm:grid-cols-2 gap-[12px] md:gap-[16px] text-[13px] md:text-[14px] text-[#0A2A43]">
            <p>Current Weight: <span className="font-semibold text-[#1769FF]">{rawWeight[0]?.Weight || 0} g</span></p>
            <p className="sm:text-right">Last Recorded: <span className="font-semibold">{rawWeight[0] ? new Date(rawWeight[0].DateTime).toLocaleTimeString() : "N/A"}</span></p>
          </div>
        </div>
      </div>

      {/* Weight Variation Chart & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
        <div className="flex flex-col rounded-[24px] p-[16px] md:p-[24px] border border-[#E7EAEC] h-[350px] md:h-[400px]">
          <h2 className="font-semibold text-[15px] md:text-[16px] text-[#0A2A43] mb-[20px]">Weight Variation</h2>
          <div className="flex-1 w-full overflow-hidden">
            <ResponsiveContainer width="99%" height="100%">
              <LineChart data={weightHistory}>
                <CartesianGrid stroke="#F4F6F8" vertical={true} strokeDasharray="0" />
                <XAxis 
                  dataKey="time" 
                  tick={{fontSize: 10, fill: '#1769FF'}} 
                  axisLine={{ stroke: '#1769FF', strokeWidth: 1 }} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{fontSize: 10, fill: '#1769FF'}} 
                  tickFormatter={(v) => `${v}g`} 
                  axisLine={{ stroke: '#1769FF', strokeWidth: 1 }} 
                  tickLine={false} 
                />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#2ECC71" strokeWidth={3} dot={{ fill: "#2ECC71", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Log Section */}
        <div className="h-[350px] md:h-[400px] flex flex-col rounded-[24px] md:rounded-[36px] p-[16px] md:p-[20px] border border-[#E7EAEC] gap-[16px]">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-[15px] md:text-[16px] text-[#0A2A43]">Activity Log</h2>
            <button onClick={() => setShowAllActivity(true)} className="text-[13px] text-[#1769FF] hover:underline font-medium">View All</button>
          </div>
          <div className="overflow-auto border border-[#E7EAEC] rounded-xl flex-1">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F4F6F8] sticky top-0 text-[#0A2A43] z-10">
                <tr>
                  <th className="p-[12px] font-semibold">Time</th>
                  <th className="p-[12px] font-semibold">Event</th>
                </tr>
              </thead>
              <tbody>
                {activityLog.length > 0 ? activityLog.slice(0, 10).map((log, i) => (
                  <tr key={i} className="border-b border-[#F4F6F8] text-[13px] md:text-[14px] hover:bg-gray-50 transition-colors">
                    <td className="p-[12px] whitespace-nowrap font-medium">{new Date(log.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="p-[12px] text-gray-600">{log.Event}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="2" className="p-8 text-center text-gray-400">No activity recorded</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Consumption Trend Bar Chart */}
      <div className="flex flex-col rounded-[24px] p-[16px] md:p-[24px] border border-[#E7EAEC]">
        <h2 className="font-semibold text-[15px] md:text-[16px] text-[#0A2A43] mb-[20px]">Consumption Trend</h2>
        <div className="w-full h-[250px] md:h-[300px]">
          <ResponsiveContainer width="99%" height="100%">
            <BarChart data={consumptionData}>
              <CartesianGrid stroke="#F4F6F8" vertical={false} />
              <XAxis dataKey="time" axisLine={{ stroke: '#1769FF', strokeWidth: 1 }} tick={{ fontSize: 10, fill: '#1769FF' }} />
              <YAxis axisLine={{ stroke: '#1769FF', strokeWidth: 1 }} tick={{ fontSize: 10, fill: '#1769FF' }} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                {consumptionData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
                ))}
              </Bar>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#005AFF" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#DFEAFF" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-[12px] md:gap-[16px] mt-[10px]">
        <button onClick={() => setShowEdit(true)} className="w-full sm:flex-1 py-[12px] md:py-[14px] bg-[#1769FF] text-white rounded-full font-bold text-[15px] md:text-[16px] hover:bg-blue-600 transition-all shadow-md">
          Edit Device
        </button>
        <button onClick={() => navigate(-1)} className="w-full sm:flex-1 py-[12px] md:py-[14px] border border-[#1769FF] text-[#1769FF] rounded-full font-bold text-[15px] md:text-[16px] hover:bg-blue-50 transition-all">
          Back to List
        </button>
      </div>

      {/* Activity Modal */}
      {showAllActivity && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[700px] max-h-[80vh] rounded-[24px] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#E7EAEC] flex justify-between items-center bg-white">
              <h2 className="text-[20px] font-bold text-[#0A2A43]">Full Activity History</h2>
              <button onClick={() => setShowAllActivity(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <img src={closeicon} className="w-5 h-5" alt="Close" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full text-left text-[14px]">
                <thead className="bg-[#F4F6F8] text-[#0A2A43] sticky top-0">
                  <tr>
                    <th className="p-4 rounded-tl-lg">Date & Time</th>
                    <th className="p-4 rounded-tr-lg">Event Description</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLog.map((log, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-4 font-medium">{new Date(log.DateTime).toLocaleString()}</td>
                      <td className="p-4 text-gray-600">{log.Event}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Component Portal */}
      {showEdit && <EditDevice device={deviceInfo} onClose={() => { setShowEdit(false); fetchAllData(); }} />}
    </div>
  );
};

export default DeviceDetails;