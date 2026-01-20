import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

// Icons
import addicon from "../../../assets/Dashboard/Inventory/add-icon.png";
import step4icon from "../../../assets/Dashboard/Home/step4.png";
import lowstockicon from "../../../assets/Dashboard/Home/low-stock.png";
import criticalicon from "../../../assets/Dashboard/Home/critical.png";
import azicon from "../../../assets/Dashboard/Inventory/A-Z.png";
import zaicon from "../../../assets/Dashboard/Inventory/Z-A.png";
import searchicon from "../../../assets/Dashboard/Inventory/Search.png";
import deleteicon from "../../../assets/Dashboard/Home/Delete.png";
import deleteimg from "../../../assets/Dashboard/Inventory/deleteimg.png";
import deletesuccess from "../../../assets/Dashboard/Inventory/deletesuccess.png";
import linkicon from "../../../assets/Dashboard/Inventory/link.png";

import Addnewitem from "./Addnewitem";
import ItemDetails from './ItemDetails';

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const statusStyles = {
  instock: { bg: "#2ECC711A", text: "#2ECC71" },
  overstock: { bg: "#3498DB1A", text: "#3498DB" }, 
  low: { bg: "#F1C40F1A", text: "#F1C40F" },
  critical: { bg: "#E74C3C1A", text: "#E74C3C" },
  default: { bg: "#8A939B1A", text: "#8A939B" }
};

const Inventory = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [stats, setStats] = useState({ total: 0, low: 0, critical: 0, linked: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDescending, setIsDescending] = useState(false);
  
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showItemDetails, setShowItemDetails] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [filters, setFilters] = useState({
    "Low Stock": false,
    "Critical": false,
    "In Stock": false,
  });

  const fetchInventory = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      // Using the /inventory/info endpoint as requested
      const response = await axios.get(`${API_BASE}/inventory/info`);
      if (response.data.success) {
        const data = response.data.data || [];
        setInventoryList(data);
        
        // Calculate stats locally based on the returned data
        setStats({
          total: data.length,
          low: data.filter(i => i.Status === "Low").length,
          critical: data.filter(i => i.Status === "Critical").length,
          linked: data.filter(i => i.DeviceId).length
        });
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
    const interval = setInterval(() => fetchInventory(true), 3000); // 10s refresh
    return () => clearInterval(interval);
  }, [fetchInventory]);

  const deleteItem = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(`${API_BASE}/inventory/${selectedInventoryId}`);
      if (response.data.success || response.status === 200) {
        setShowDelete(false);
        setShowDeleteSuccess(true);
        fetchInventory(true); 
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let data = [...inventoryList];
    if (searchQuery) {
      data = data.filter(item => 
        item.ItemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.Category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.DeviceName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const activeFilters = Object.keys(filters).filter(key => filters[key]);
    if (activeFilters.length > 0) {
      data = data.filter(item => {
        const status = item.Status?.toLowerCase().replace(/\s/g, '');
        if (filters["In Stock"] && (status === "instock" || status === "overstock")) return true;
        if (filters["Low Stock"] && status === "low") return true;
        if (filters["Critical"] && status === "critical") return true;
        return false;
      });
    }

    data.sort((a, b) => {
      const nameA = a.ItemName?.toLowerCase() || "";
      const nameB = b.ItemName?.toLowerCase() || "";
      return isDescending ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
    });
    return data;
  }, [inventoryList, searchQuery, filters, isDescending]);

  const cards = [
    { number: stats.total, label: "Total Items", color: "#2ECC71", img: step4icon },
    { number: stats.low, label: "Low Stock", color: "#F1C40F", img: lowstockicon },
    { number: stats.critical, label: "Critical", color: "#E74C3C", img: criticalicon },
    { number: stats.linked, label: "Linked Devices", color: "#1769FF", img: linkicon }
  ];

  return (
    <div className="p-[16px] md:p-[36px]">
      <div className="flex flex-col rounded-[32px] md:rounded-[80px] p-[20px] md:p-[36px] gap-[24px] border border-[#8A939B] bg-white">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-[16px]">
          <div>
            <h2 className="font-semibold text-[20px] text-[#0A2A43]">Inventory Management</h2>
            <p className="text-[14px] text-[#0A2A43]">View, manage, and link new items seamlessly.</p>
          </div>
          <button
            onClick={() => setShowAddItem(true)}
            className="flex px-[24px] py-[10px] rounded-[80px] gap-[8px] bg-[#1769FF] text-white font-semibold text-[14px] hover:scale-105 transition-transform"
          >
            <img src={addicon} className="w-[20px] h-[20px]" alt="add" />
            Link New Item
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px] md:gap-[24px]">
          {cards.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-center gap-[12px] p-[16px] rounded-[24px] sm:rounded-[80px] border border-[#E7EAEC]">
              <div className="p-[10px] rounded-full bg-[#F4F6F8] shadow-inner">
                <img src={item.img} className="w-[24px] h-[24px]" alt={item.label} />
              </div>
              <div>
                <span className="font-bold text-[18px] block" style={{ color: item.color }}>{item.number}</span>
                <span className="text-[12px] font-medium text-gray-400 uppercase">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters/Search */}
        <div className="flex flex-col lg:flex-row rounded-[24px] md:rounded-[80px] bg-[#F4F6F8] p-[12px] gap-[12px] items-center">
          <div className="flex items-center gap-[12px] bg-white px-4 py-2 rounded-full border border-[#E7EAEC]">
             <img src={azicon} className="w-4" alt="az" />
             <button 
                onClick={() => setIsDescending(!isDescending)}
                className={`w-10 h-5 rounded-full relative transition-colors ${isDescending ? 'bg-[#1769FF]' : 'bg-gray-300'}`}
             >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isDescending ? 'right-1' : 'left-1'}`} />
             </button>
             <img src={zaicon} className="w-4" alt="za" />
          </div>

          <div className="flex flex-1 items-center gap-[8px] rounded-full px-[20px] py-[10px] border border-[#8A939B] bg-white w-full">
            <input 
              type="text" 
              placeholder="Search by Item Name, Category, or Device..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-[14px] outline-none" 
            />
            <img src={searchicon} alt="search" className="w-[20px] h-[20px] opacity-40" />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block w-full overflow-hidden border border-[#8A939B] rounded-[28px]">
          <table className="w-full text-center">
            <thead className="bg-[#0A2A43] text-white text-[13px] uppercase">
              <tr>
                <th className="py-4">Item ID</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Device Name</th>
                <th>Location</th>
                <th>Unit Weight</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredAndSortedData.map((row) => {
                const statusKey = row.Status?.toLowerCase().replace(/\s/g, '');
                const s = statusStyles[statusKey] || statusStyles.default;
                return (
                  <tr 
                    key={row.InventoryId} 
                    className="text-[14px] border-t border-[#E7EAEC] hover:bg-gray-50 cursor-pointer"
                    onClick={() => { setSelectedRow(row); setShowItemDetails(true); }}
                  >
                    <td className="py-5 text-[#0A2A43]">{row.ItemId}</td>
                    <td className="font-bold text-[#0A2A43]">{row.ItemName}</td>
                    <td>{row.Category}</td>
                    <td className="text-[#1769FF] font-medium">{row.DeviceName}</td>
                    <td>{row.LocationName}</td>
                    <td>{row.PerUnitWeight}g</td>
                    <td className="font-bold">{row.Stock}</td>
                    <td>
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: s.bg, color: s.text }}>
                        {row.Status}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => { setSelectedInventoryId(row.InventoryId); setShowDelete(true); }}
                        className="p-2 hover:bg-red-50 rounded-full"
                      >
                        <img src={deleteicon} className="w-5 h-5" alt="delete" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

       {/* MODALS - Updated with responsive max-widths and paddings */}
      {showAddItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-[720px] max-h-[90vh] overflow-y-auto bg-white rounded-[32px] p-[20px] md:p-[24px] shadow-2xl">
            <button onClick={() => setShowAddItem(false)} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#F4F6F8]  flex items-center justify-center font-bold z-10">✕</button>
            <Addnewitem onClose={() => { 
              setShowAddItem(false); 
              fetchInventory(true); 
            }} />
          </div>
        </div>
      )}

      {/* Item Details Overlay */}
      {showItemDetails && (
        <ItemDetails
          inventoryId={selectedRow.InventoryId}
          onClose={() => setShowItemDetails(false)}
        />
      )}

      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white p-8 rounded-[32px] max-w-[400px] text-center shadow-2xl">
            <img src={deleteimg} className="w-16 mx-auto mb-4" alt="delete" />
            <h3 className="text-[20px] font-bold text-[#E74C3C]">Confirm Removal?</h3>
            <p className="text-gray-500 my-4 text-[14px]">Deleting this item will remove all associated stock data and device links.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)} className="flex-1 py-3 border rounded-full font-bold">Cancel</button>
              <button 
                onClick={deleteItem} 
                className="flex-1 py-3 bg-[#E74C3C] text-white rounded-full font-bold"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showDeleteSuccess && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[120]">
          <div className="bg-white p-8 rounded-[32px] text-center shadow-2xl">
            <img src={deletesuccess} className="w-16 mx-auto mb-4" alt="success" />
            <h3 className="text-[20px] font-bold text-[#2ECC71]">Deleted Successfully!</h3>
            <button onClick={() => setShowDeleteSuccess(false)} className="mt-6 px-10 py-2 bg-[#0A2A43] text-white rounded-full">Done</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;