import React, { useState, useRef, useEffect } from "react";
import downarrow from "../../../assets/Dashboard/Inventory/down-arrow.png";
import closeicon from "../../../assets/Dashboard/Inventory/close.png";
import additem from "../../../assets/Dashboard/Inventory/additem.png";

const Addnewdevice = ({ onClose }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  // Form Fields
  const [deviceName, setDeviceName] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [idMethod, setIdMethod] = useState("manual");
  const [deviceType, setDeviceType] = useState("Scale");
  const [installDate, setInstallDate] = useState("");
  const [notes, setNotes] = useState("");

  // Link to Item States
  const [linkToItem, setLinkToItem] = useState(false);
  const [selectedItemCode, setSelectedItemCode] = useState("");
  const [itemDropdownOpen, setItemDropdownOpen] = useState(false);
  const itemRef = useRef(null);

  // Location Dropdown States
  const [location, setLocation] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const locationRef = useRef(null);

  const locationOptions = ["Warehouse A", "Warehouse B", "Warehouse C", "Retail Store A"];
  const itemOptions = ["ITM-001 (Laptop)", "ITM-002 (Monitor)", "ITM-003 (Keyboard)"];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) setLocationOpen(false);
      if (itemRef.current && !itemRef.current.contains(e.target)) setItemDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // Responsive outer padding: p-[20px] on mobile, p-[36px] on desktop
    <div className="relative w-full flex flex-col gap-[24px] md:gap-[36px] p-[20px] md:p-[36px] rounded-[24px] md:rounded-[36px] bg-white max-h-[90vh]">
      
      <h2 className="font-semibold text-[18px] md:text-[20px] leading-[32px] tracking-[1%] text-[#0A2A43]">
        Add New Device
      </h2>

      {/* Form Container: Handles internal scroll */}
      <div className="flex flex-col gap-[24px] md:gap-[36px] p-[16px] md:p-[36px] rounded-[24px] md:rounded-[36px] border border-[#E7EAEC] overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-[20px]">

          {/* Device Name */}
          <div className="flex flex-col gap-[4px]">
            <label className="text-[14px] text-[#0A2A43]">Device Name</label>
            <div className="flex items-center px-[16px] py-[10px] rounded-[80px] border border-[#8A939B]">
              <input
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="Enter Device Name"
                className="w-full bg-transparent outline-none text-[14px] text-[#0A2A43]"
              />
            </div>
          </div>

          {/* Device ID Selection */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] text-[#0A2A43]">Device ID</label>
            <div className="flex flex-wrap items-center gap-[16px]">
              <label className="flex items-center gap-[8px] text-[13px] md:text-[14px] cursor-pointer">
                <input type="radio" checked={idMethod === "auto"} onChange={() => setIdMethod("auto")} className="w-[16px] h-[16px] accent-[#0A2A43]" />
                Auto-generate
              </label>
              <label className="flex items-center gap-[8px] text-[13px] md:text-[14px] cursor-pointer">
                <input type="radio" checked={idMethod === "manual"} onChange={() => setIdMethod("manual")} className="w-[16px] h-[16px] accent-[#0A2A43]" />
                Manual Input
              </label>
            </div>
            <div className={`flex items-center px-[16px] py-[10px] rounded-[80px] border border-[#8A939B] ${idMethod === "auto" ? "bg-gray-50 opacity-60" : ""}`}>
              <input
                disabled={idMethod === "auto"}
                value={idMethod === "auto" ? "GENERATING..." : deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="Enter Device ID"
                className="w-full bg-transparent outline-none text-[14px]"
              />
            </div>
          </div>

          {/* Device Type - Flex Wrap for mobile */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] text-[#0A2A43]">Device Type</label>
            <div className="flex flex-wrap gap-[16px] md:gap-[24px]">
              {["Scale", "Sensor", "Custom"].map((type) => (
                <label key={type} className="flex items-center gap-[8px] text-[14px] cursor-pointer">
                  <input type="radio" checked={deviceType === type} onChange={() => setDeviceType(type)} className="w-[16px] h-[16px] accent-[#0A2A43]" />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Location + Install Date Row - Stack on mobile */}
          <div className="flex flex-col md:flex-row gap-[20px]">
            <Dropdown
              label="Location"
              value={location}
              open={locationOpen}
              setOpen={setLocationOpen}
              setValue={setLocation}
              options={locationOptions}
              refEl={locationRef}
            />
            <div className="flex flex-col gap-[4px] flex-1">
              <label className="text-[14px] text-[#0A2A43]">Installation Date</label>
              <div className="flex items-center px-[16px] py-[10px] rounded-[80px] border border-[#8A939B]">
                <input
                  type="date"
                  value={installDate}
                  onChange={(e) => setInstallDate(e.target.value)}
                  className="w-full bg-transparent outline-none text-[14px] text-[#0A2A43] uppercase"
                />
              </div>
            </div>
          </div>

          {/* Link to Item */}
          <div className="flex flex-col gap-[12px] relative">
            <label className="flex items-center gap-[8px] text-[14px] text-[#0A2A43] cursor-pointer w-max">
              <input type="checkbox" checked={linkToItem} onChange={(e) => { setLinkToItem(e.target.checked); if(!e.target.checked) setSelectedItemCode(""); }} className="w-[16px] h-[16px] accent-[#0A2A43]" />
              Link to Item Code
            </label>

            {linkToItem && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <Dropdown
                  label="Select Item"
                  value={selectedItemCode}
                  open={itemDropdownOpen}
                  setOpen={setItemDropdownOpen}
                  setValue={setSelectedItemCode}
                  options={itemOptions}
                  refEl={itemRef}
                />
              </div>
            )}
          </div>

          {/* Installation Notes */}
          <div className="flex flex-col gap-[4px]">
            <label className="text-[14px] text-[#0A2A43]">Installation Notes (Optional)</label>
            <div className="flex items-start px-[16px] py-[12px] rounded-[24px] border border-[#8A939B]">
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any relevant notes..."
                className="w-full bg-transparent outline-none text-[14px] placeholder-[#8A939B] resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions - Flexible for mobile */}
      <div className="w-full flex flex-col sm:flex-row justify-between gap-[12px]">
        <button
          onClick={() => setShowSuccess(true)}
          className="w-full sm:w-[50%] h-[44px] rounded-[80px] bg-[#1769FF] text-white text-[14px] font-medium transition-opacity"
        >
          Add Device
        </button>
        <button
          onClick={onClose}
          className="w-full sm:w-[50%] h-[44px] rounded-[80px] border border-[#1769FF] text-[#1769FF] text-[14px] font-medium"
        >
          Cancel
        </button>
      </div>

      {/* Success Modal Overlay - Responsive sizing */}
      {showSuccess && (
        <div className="absolute inset-0 z-[100] bg-white/95 flex items-center justify-center rounded-[24px] md:rounded-[36px] p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[390px] flex flex-col gap-[16px]">
            <div className="flex justify-end">
              <img src={closeicon} alt="close" className="w-[24px] h-[24px] cursor-pointer" onClick={() => setShowSuccess(false)} />
            </div>
            <div className="flex flex-col items-center gap-[16px] p-[24px] md:p-[32px] rounded-[16px] border border-[#B3BDC5] bg-white">
              <img src={additem} alt="success" className="w-[48px] h-[48px]" />
              <p className="text-[18px] md:text-[20px] font-semibold text-center text-[#2ECC71]">Device Added Successfully</p>
              <p className="text-[13px] md:text-[14px] text-center text-[#0A2A43] leading-relaxed">Your new device has been registered and is now available in the device list.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Reusable Dropdown Component - Fixed Z-index and width */
const Dropdown = ({ label, value, open, setOpen, setValue, options, refEl }) => (
  <div className="flex flex-col gap-[4px] flex-1 relative" ref={refEl}>
    <label className="text-[14px] text-[#0A2A43]">{label}</label>
    <div
      onClick={() => setOpen(!open)}
      className="flex items-center justify-between px-[16px] py-[10px] rounded-[80px] border border-[#8A939B] cursor-pointer bg-white"
    >
      <span className={`text-[14px] ${value ? "text-[#0A2A43]" : "text-[#8A939B]"}`}>
        {value || `Select ${label}`}
      </span>
      <img src={downarrow} alt="arrow" className={`w-[20px] h-[20px] transition-transform ${open ? "rotate-180" : ""}`} />
    </div>
    {open && (
      <div className="absolute top-[105%] left-0 right-0 z-30 rounded-[16px] border border-[#E7EAEC] bg-white shadow-xl max-h-[160px] overflow-y-auto no-scrollbar">
        {options.map((opt) => (
          <div
            key={opt}
            onClick={() => { setValue(opt); setOpen(false); }}
            className="px-[16px] py-[12px] text-[14px] text-[#0A2A43] hover:bg-[#F5F7FA] cursor-pointer border-b last:border-0 border-[#E7EAEC]/50"
          >
            {opt}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Addnewdevice;