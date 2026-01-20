import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import EditItem from "./EditItem";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const ItemDetails = ({ inventoryId, onClose }) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const fetchItemDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/inventory/info/${inventoryId}`);
      if (response.data.success) {
        setItem(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    } finally {
      setLoading(false);
    }
  }, [inventoryId]);

  useEffect(() => {
    if (inventoryId) {
      fetchItemDetails();
    }
  }, [inventoryId, fetchItemDetails]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <p className="animate-pulse font-medium text-gray-500">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) return null;

  const normalizedStatus = item.Status?.toLowerCase().replace(/\s/g, '');
  const statusColors = {
    overstock: "bg-[#3498DB]",
    instock: "bg-[#2ECC71]",
    low: "bg-[#F1C40F]",
    critical: "bg-[#E74C3C]",
    default: "bg-gray-400"
  };

  const statusColor = statusColors[normalizedStatus] || statusColors.default;

  return (
    <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center p-[16px]">
      <div className="w-full max-w-[620px] max-h-[90vh] overflow-y-auto flex flex-col gap-[24px] p-[20px] sm:p-[36px] bg-white rounded-[24px] sm:rounded-[32px] shadow-2xl animate-scaleIn">

        <div className="flex justify-between items-center">
          <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#0A2A43]">
            Item Details
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-xl">✕</button>
        </div>

        {/* Item Info Card */}
        <div className="flex flex-col border border-[#E7EAEC] rounded-[16px] p-[16px] gap-[16px]">
          <div className="flex justify-between items-start">
            <p className="text-[18px] font-bold text-[#1769FF]">
              {item.ItemName}
            </p>
            <span className="text-[12px] font-mono text-gray-400">ID: #{item.ItemId}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-[12px] text-[14px]">
            <p className="text-gray-500">Category: <span className="font-semibold text-[#0A2A43]">{item.Category}</span></p>
            <p className="text-gray-500">Location: <span className="font-semibold text-[#0A2A43]">{item.LocationName || "N/A"}</span></p>
            <p className="text-gray-500">Unit Weight: <span className="font-semibold text-[#0A2A43]">{item.PerUnitWeight}g</span></p>
          </div>

          <div className="pt-2 border-t border-gray-50">
            <p className="text-[13px] text-gray-500 uppercase font-bold mb-1">Description</p>
            <p className="text-[14px] text-[#0A2A43] leading-relaxed">
              {item.Description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Stock Summary */}
        <div className="flex flex-col border border-[#E7EAEC] rounded-[16px] overflow-hidden">
          <div className="flex justify-between items-center bg-[#F8FAFB] px-[16px] py-[12px] border-b border-[#E7EAEC]">
            <p className="font-bold text-[12px] text-[#0A2A43] tracking-widest">STOCK SUMMARY</p>
            <span className={`px-[12px] py-[4px] rounded-full text-white text-[11px] font-bold uppercase ${statusColor}`}>
              {item.Status}
            </span>
          </div>

          <div className="p-[16px] grid grid-cols-1 sm:grid-cols-2 gap-[20px] text-[14px]">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-[12px]">Current Stock</span>
              <span className="font-bold text-[18px] text-[#0A2A43]">{item.Stock} <small className="text-[12px] font-normal">Units</small></span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-[12px]">Linked Device</span>
              <span className="font-semibold text-[#1769FF]">{item.DeviceName || "Not Linked"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-[12px]">Avg. Consumption</span>
              <span className="font-semibold">{item.Consumption} units/day</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-[12px]">Forecasted Depletion</span>
              <span className="font-semibold text-[#E74C3C]">In {item.StockOut} Days</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-[12px]">
          <button
            onClick={() => setShowEdit(true)}
            className="w-full sm:flex-1 h-[48px] rounded-full bg-[#1769FF] text-white font-bold text-[14px] hover:bg-[#1255CC] transition-colors"
          >
            Edit Item Details
          </button>
          <button
            onClick={onClose}
            className="w-full sm:flex-1 h-[48px] rounded-full border border-[#8A939B] text-[#0A2A43] font-bold text-[14px] hover:bg-gray-50"
          >
            Close
          </button>
        </div>
        
        {showEdit && (
          <EditItem
            item={item}
            onClose={() => setShowEdit(false)}
            onSave={() => {
              setShowEdit(false);
              fetchItemDetails(); // Refresh details after edit
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ItemDetails;