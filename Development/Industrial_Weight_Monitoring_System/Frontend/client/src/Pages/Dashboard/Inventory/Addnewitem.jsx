import React, { useState, useRef, useEffect } from "react";
import downarrow from "../../../assets/Dashboard/Inventory/down-arrow.png";
import closeicon from "../../../assets/Dashboard/Inventory/close.png";
import additem from "../../../assets/Dashboard/Inventory/additem.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const Addnewitem = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Data lists from API
  const [itemsList, setItemsList] = useState([]);
  const [devicesList, setDevicesList] = useState([]);

  // Form State
  const [selectedItem, setSelectedItem] = useState(null); // Stores full item object
  const [selectedDevice, setSelectedDevice] = useState(null); // Stores full device object
  const [weight, setWeight] = useState("");

  // UI State
  const [itemDropdownOpen, setItemDropdownOpen] = useState(false);
  const [deviceDropdownOpen, setDeviceDropdownOpen] = useState(false);
  const itemRef = useRef(null);
  const deviceRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [itemsRes, devicesRes] = await Promise.all([
        fetch(`${API_BASE}/items`),
        fetch(`${API_BASE}/devices`)
      ]);
      
      const itemsJson = await itemsRes.json();
      const devicesJson = await devicesRes.json();

      if (itemsJson.success) setItemsList(itemsJson.data || []);
      if (devicesJson.success) setDevicesList(devicesJson.data.Devices || []);
    } catch (err) {
      console.error("Failed to fetch dropdown data", err);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (itemRef.current && !itemRef.current.contains(e.target)) setItemDropdownOpen(false);
      if (deviceRef.current && !deviceRef.current.contains(e.target)) setDeviceDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = async () => {
    if (!selectedItem || !selectedDevice || !weight) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      ItemId: Number(selectedItem.ItemId),
      DeviceId: Number(selectedDevice.DeviceId),
      Weight: Number(weight),
    };

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success || res.status === 200 || res.status === 201) {
        setShowSuccess(true);
      } else {
        alert(json.message || "Failed to link inventory");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col gap-[20px] md:gap-[36px] p-[20px] md:p-[36px] rounded-[24px] md:rounded-[36px] bg-white">
      
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-[18px] md:text-[20px] text-[#0A2A43]">
          Create Inventory Link
        </h2>
      </div>

      <div className="flex-1 flex flex-col gap-[24px] p-[16px] md:p-[36px] rounded-[24px] border border-[#E7EAEC] overflow-y-auto">
        
        {/* Item Selection Dropdown */}
        <div className="relative flex flex-col gap-[8px]" ref={itemRef}>
          <label className="text-[14px] font-medium text-[#0A2A43] ml-2">Select Item</label>
          <div
            onClick={() => setItemDropdownOpen(!itemDropdownOpen)}
            className="px-[16px] py-[12px] rounded-[80px] border border-[#8A939B] cursor-pointer flex justify-between items-center bg-white"
          >
            <span className={selectedItem ? "text-[#0A2A43]" : "text-[#8A939B]"}>
              {selectedItem ? `${selectedItem.ItemName} (ID: ${selectedItem.ItemId})` : "Choose an Item"}
            </span>
            <img src={downarrow} className={`w-[18px] transition-transform ${itemDropdownOpen && "rotate-180"}`} />
          </div>
          {itemDropdownOpen && (
            <div className="absolute top-full mt-2 w-full border rounded-[16px] bg-white z-[60] shadow-xl max-h-[200px] overflow-y-auto">
              {itemsList.map((item) => (
                <div
                  key={item.ItemId}
                  onClick={() => { setSelectedItem(item); setItemDropdownOpen(false); }}
                  className="px-5 py-3 hover:bg-[#F4F6F8] cursor-pointer border-b last:border-none"
                >
                  <p className="font-semibold text-[#0A2A43]">{item.ItemName}</p>
                  <p className="text-[12px] text-gray-500">{item.Category} — {item.Measurement}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device Selection Dropdown */}
        <div className="relative flex flex-col gap-[8px]" ref={deviceRef}>
          <label className="text-[14px] font-medium text-[#0A2A43] ml-2">Select Device</label>
          <div
            onClick={() => setDeviceDropdownOpen(!deviceDropdownOpen)}
            className="px-[16px] py-[12px] rounded-[80px] border border-[#8A939B] cursor-pointer flex justify-between items-center bg-white"
          >
            <span className={selectedDevice ? "text-[#0A2A43]" : "text-[#8A939B]"}>
              {selectedDevice ? `${selectedDevice.DeviceName} (ID: ${selectedDevice.DeviceId})` : "Choose a Device"}
            </span>
            <img src={downarrow} className={`w-[18px] transition-transform ${deviceDropdownOpen && "rotate-180"}`} />
          </div>
          {deviceDropdownOpen && (
            <div className="absolute top-full mt-2 w-full border rounded-[16px] bg-white z-[60] shadow-xl max-h-[200px] overflow-y-auto">
              {devicesList.map((dev) => (
                <div
                  key={dev.DeviceId}
                  onClick={() => { setSelectedDevice(dev); setDeviceDropdownOpen(false); }}
                  className="px-5 py-3 hover:bg-[#F4F6F8] cursor-pointer border-b last:border-none"
                >
                  <p className="font-semibold text-[#0A2A43]">{dev.DeviceName}</p>
                  <p className="text-[12px] text-gray-500">{dev.LocationName} — {dev.Status}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weight Input */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium text-[#0A2A43] ml-2">Current Weight</label>
          <input
            type="number"
            placeholder="Enter current weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="px-[16px] py-[12px] rounded-[80px] border border-[#8A939B] outline-none focus:border-[#1769FF]"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-[12px]">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-[14px] rounded-[80px] bg-[#1769FF] text-white font-semibold active:scale-95 transition-transform"
        >
          {loading ? "Linking..." : "Create Inventory"}
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-[14px] rounded-[80px] border border-[#1769FF] text-[#1769FF] font-semibold"
        >
          Cancel
        </button>
      </div>

      {showSuccess && (
        <div className="absolute inset-0 bg-white/98 z-50 flex items-center justify-center rounded-[24px] md:rounded-[36px] p-6">
          <div className="text-center flex flex-col items-center">
            <img src={additem} className="w-[64px]" alt="success" />
            <p className="text-[20px] font-semibold text-[#2ECC71] mt-6">Inventory Created!</p>
            <p className="text-[14px] text-gray-500 mt-2">The item has been successfully linked to the device.</p>
            <button
              onClick={() => { setShowSuccess(false); onClose(); }}
              className="mt-8 px-10 py-3 rounded-full bg-[#1769FF] text-white font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addnewitem;