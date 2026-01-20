import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import restart from "../../../assets/Dashboard/TrackDevice/Restart.png";
import deleteicon from "../../../assets/Dashboard/TrackDevice/Delete.png";
import calendar from "../../../assets/Dashboard/TrackDevice/Calendar.png";
import chevronDown from "../../../assets/Dashboard/TrackDevice/Chevron down.png";
import closeicon from "../../../assets/Dashboard/TrackDevice/close.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const EditDevice = ({ device, onClose, onRefresh }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const dateInputRef = useRef(null);

  // Initialize form state with existing device data
  const [formData, setFormData] = useState({
    DeviceName: device?.DeviceName || "",
    DeviceType: device?.DeviceType || "",
    ConnectionMode: device?.ConnectionMode || "Cable",
    Capacity: device?.Capacity || 0,
    Weight: device?.Weight || 0,
    LastReading: device?.LastReading || 0,
    Battery: device?.Battery || 0,
    Status: device?.Status || "Online",
    InventoryId: device?.InventoryId || 0,
    Notes: device?.Notes || "",
    LocationName: device?.LocationName || "",
    Latitude: device?.Latitude || 0,
    Longitude: device?.Longitude || 0,
  });

  const handleInputChange = (e) => {
    const { id, name, value, type, checked } = e.target;
    const fieldName = name || id;
    
    setFormData((prev) => ({
      ...prev,
      [fieldName]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${API_BASE}/devices/${device.DeviceId}`,
        formData
      );

      if (response.data.success) {
        setIsSaved(true);
        // Optional: Trigger a refresh in the parent component
        if (onRefresh) onRefresh(); 
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update device. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarClick = () => {
    if (dateInputRef.current) dateInputRef.current.showPicker();
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm">
      {!isSaved ? (
        <div className="w-full max-w-[850px] max-h-[95vh] flex flex-col rounded-[24px] md:rounded-[36px] bg-white p-[20px] md:p-[36px] gap-[20px] md:gap-[24px] animate-in fade-in zoom-in duration-200 shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="flex justify-between items-center shrink-0">
            <h2 className="font-semibold text-[20px] md:text-[24px] text-[#0A2A43]">
              Edit Device Details
            </h2>
            <button onClick={onClose} className="text-[#8A939B] hover:text-[#0A2A43] p-2 hover:bg-gray-100 rounded-full">
              <img src={closeicon} className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" alt="Close" />
            </button>
          </div>

          {/* Scrollable Form */}
          <div className="flex flex-col rounded-[20px] md:rounded-[36px] p-[16px] md:p-[36px] gap-[20px] md:gap-[24px] border border-[#E7EAEC] overflow-y-auto custom-scrollbar">
            
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-[10px]">
              <button className="flex items-center justify-center gap-[8px] rounded-[80px] px-[20px] py-[10px] bg-[#F4F6F8] hover:bg-[#ECEFF1] transition">
                <img src={restart} alt="Restart" className="w-[18px] h-[18px]" />
                <span className="font-semibold text-[13px] text-[#0A2A43]">Restart Device</span>
              </button>
              <button className="flex items-center justify-center gap-[8px] rounded-[80px] px-[20px] py-[10px] bg-red-50 hover:bg-red-100 transition">
                <img src={deleteicon} alt="Delete" className="w-[18px] h-[18px]" />
                <span className="font-semibold text-[13px] text-red-600">Delete Device</span>
              </button>
            </div>

            {/* Device Name */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[13px] text-[#4F5E71]">Device Name</label>
              <input
                name="DeviceName"
                type="text"
                value={formData.DeviceName}
                onChange={handleInputChange}
                className="w-full rounded-[80px] px-[20px] py-[12px] border border-[#8A939B] text-[14px] outline-none focus:border-[#1A73E8]"
              />
            </div>

            {/* Device Type Selection */}
            <div className="flex flex-col gap-[8px]">
              <span className="text-[13px] text-[#4F5E71]">Device Type</span>
              <div className="flex flex-wrap gap-[15px] sm:gap-[40px]">
                {["Scale", "Tools", "Sensor"].map((type) => (
                  <label key={type} className="flex items-center gap-[8px] cursor-pointer">
                    <input
                      type="radio"
                      name="DeviceType"
                      value={type}
                      checked={formData.DeviceType === type}
                      onChange={handleInputChange}
                      className="w-4 h-4 accent-[#0A2A43]"
                    />
                    <span className="text-[13px] md:text-[14px]">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location & Capacity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] md:gap-[20px]">
              <div className="flex flex-col gap-[8px]">
                <label className="text-[13px] text-[#4F5E71]">Location</label>
                <div className="relative">
                  <select 
                    name="LocationName"
                    value={formData.LocationName}
                    onChange={handleInputChange}
                    className="w-full appearance-none rounded-[80px] px-[20px] py-[12px] border border-[#8A939B] text-[14px] bg-white outline-none"
                  >
                    <option value="Location-A">Location-A</option>
                    <option value="Location-B">Location-B</option>
                  </select>
                  <img src={chevronDown} className="absolute right-5 top-1/2 -translate-y-1/2 w-3 pointer-events-none" alt="" />
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="text-[13px] text-[#4F5E71]">Capacity (kg)</label>
                <input
                  name="Capacity"
                  type="number"
                  value={formData.Capacity}
                  onChange={handleInputChange}
                  className="w-full rounded-[80px] px-[20px] py-[12px] border border-[#8A939B] text-[14px] outline-none"
                />
              </div>
            </div>

            {/* Inventory Link */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-[12px]">
              <div className="flex items-center gap-[12px] shrink-0">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#0A2A43]" />
                <span className="text-[13px]">Link to Inventory ID</span>
              </div>
              <input 
                name="InventoryId"
                type="number" 
                value={formData.InventoryId}
                onChange={handleInputChange}
                className="w-full rounded-[80px] px-[20px] py-[12px] border border-[#8A939B] text-[14px] outline-none" 
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[13px] text-[#4F5E71]">Installation Notes</label>
              <textarea
                name="Notes"
                rows="2"
                value={formData.Notes}
                onChange={handleInputChange}
                className="w-full rounded-[24px] px-[20px] py-[12px] border border-[#8A939B] text-[14px] outline-none resize-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row gap-[12px] md:gap-[16px] shrink-0">
            <button
              onClick={handleSaveChanges}
              disabled={loading}
              className={`w-full sm:flex-1 py-[12px] md:py-[14px] bg-[#1A73E8] text-white font-semibold rounded-[80px] transition active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#1557b0]'}`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={onClose}
              className="w-full sm:flex-1 py-[12px] md:py-[14px] border border-[#1A73E8] text-[#1A73E8] font-semibold rounded-[80px] hover:bg-blue-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Success Overlay */
        <div className="w-[90%] max-w-[400px] bg-white rounded-[24px] p-[16px] flex flex-col gap-[8px] animate-in zoom-in">
          <div className="flex justify-end">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <img src={closeicon} className="w-[18px] h-[18px]" alt="Close"/>
            </button>
          </div>
          <div className="flex flex-col items-center p-[24px] gap-[16px] border border-[#B3BDC5] rounded-[20px]">
            <div className="w-[56px] h-[56px] bg-green-100 rounded-full flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2ECC71" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-[20px] text-[#2ECC71]">Settings Saved</h3>
              <p className="text-[14px] text-[#0A2A43] opacity-80">Device updated successfully.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDevice;