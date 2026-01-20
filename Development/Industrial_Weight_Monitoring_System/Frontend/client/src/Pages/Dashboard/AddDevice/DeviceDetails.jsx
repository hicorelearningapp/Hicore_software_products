import React, { useState } from "react";
import EditDevice from "./Editdevice";

const DeviceDetails = ({ item, onClose }) => {
  const [showEdit, setShowEdit] = useState(false);

  if (!item) return null;

  // Standardize status for styling logic
  const statusKey = item.Status?.toLowerCase();

  const statusBadge =
    statusKey === "online"
      ? "bg-[#2ECC71]"
      : statusKey === "offline"
      ? "bg-[#E74C3C]"
      : statusKey === "low battery" || statusKey === "lowbattery"
      ? "bg-[#F1C40F]"
      : "bg-[#8A939B]";

  return (
    <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center p-[16px] md:p-[36px]">
      <div className="w-full max-w-[640px] bg-white rounded-[32px] p-[24px] md:p-[32px] shadow-2xl animate-scaleIn overflow-y-auto max-h-[95vh]">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-[20px]">
          <h2 className="text-[20px] font-bold text-[#0A2A43]">
            Device Specifications
          </h2>
          <span className="text-[12px] font-mono text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
            ID: {item.DeviceId}
          </span>
        </div>

        {/* MAIN CARD */}
        <div className="border border-[#E7EAEC] rounded-[24px] p-[20px] flex flex-col gap-[16px]">

          {/* TITLE ROW */}
          <div className="flex justify-between items-center">
            <p className="text-[18px] font-bold text-[#1769FF]">
              {item.DeviceName}
            </p>
            <span
              className={`px-[14px] py-[6px] rounded-full text-white text-[11px] uppercase tracking-wider font-bold ${statusBadge}`}
            >
              {item.Status || "Unknown"}
            </span>
          </div>

          {/* INFO GRID */}
          <div className="border border-[#E7EAEC] rounded-[16px] p-[16px] grid grid-cols-1 sm:grid-cols-2 gap-y-[14px] text-[14px] bg-gray-50/50">
            <InfoItem label="Device Type" value={item.DeviceType} />
            <InfoItem label="Capacity" value={`${item.Capacity}g`} />
            <InfoItem label="Location" value={item.LocationName} />
            <InfoItem label="Connection" value={item.ConnectionMode} />
            <InfoItem label="Created At" value={new Date(item.CreatedAt).toLocaleDateString()} />
            <InfoItem label="Last Update" value={new Date(item.UpdatedAt).toLocaleTimeString()} />
            
            <div className="col-span-1 sm:col-span-2 pt-2 border-t border-gray-200 mt-2">
              <p className="text-gray-500 text-[12px] uppercase font-bold mb-1">Description</p>
              <p className="font-medium text-[#0A2A43] italic">
                "{item.Notes || "No notes available for this device."}"
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-[12px] mt-[24px]">
          <button
            onClick={() => setShowEdit(true)}
            className="flex-1 h-[52px] rounded-full bg-[#1769FF] text-white font-bold text-[15px] hover:bg-[#1255CC] transition-colors shadow-lg shadow-blue-100"
          >
            Modify Configuration
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-[52px] rounded-full border border-gray-300 text-gray-600 font-bold text-[15px] hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>

        {/* EDIT OVERLAY */}
        {showEdit && (
          <EditDevice
            item={item}
            onClose={() => setShowEdit(false)}
            onSave={() => {
              setShowEdit(false);
              onClose(); // Close details too after a save to refresh parent list
            }}
          />
        )}
      </div>
    </div>
  );
};

// Reusable component for the data points
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-[12px] uppercase font-bold tracking-tight">{label}</p>
    <p className="font-bold text-[#0A2A43]">{value || "N/A"}</p>
  </div>
);

export default DeviceDetails;