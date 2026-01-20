import React, { useState, useEffect } from "react";
import axios from "axios";
import deleteicon from "../../../assets/Dashboard/Home/Delete.png";
import deleteimg from "../../../assets/Dashboard/Inventory/deleteimg.png";
import deletesuccess from "../../../assets/Dashboard/Inventory/deletesuccess.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const statusStyles = {
  InStock: { bg: "#2ECC711A", text: "#2ECC71", label: "In Stock" },
  OverStock: { bg: "#1769FF1A", text: "#1769FF", label: "Overstock" },
  LowStock: { bg: "#F1C40F1A", text: "#F1C40F", label: "Low" },
  Critical: { bg: "#E74C3C1A", text: "#E74C3C", label: "Critical" },
  OutOfStock: { bg: "#E74C3C1A", text: "#E74C3C", label: "Out of Stock" },
};

const LiveInventorytable = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showDelete, setShowDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Fetch Data from the correct endpoint: /inventory/info
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/inventory/info`);
      if (response.data.success) {
        // The API returns data directly as an array in response.data.data
        setInventoryList(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/inventory/${selectedId}`);
      setShowDelete(false);
      setShowDeleteSuccess(true);
      fetchInventory(); 
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="flex flex-col gap-[20px] p-[16px] md:p-[20px] border border-[#E7EAEC] rounded-[24px] md:rounded-[36px] bg-white">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-[16px] py-[8px]">
        <h2 className="font-semibold text-[18px] md:text-[16px] text-[#0A2A43]">Live Inventory Table</h2>
        
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="relative w-full sm:w-[200px]">
            <select className="appearance-none w-full rounded-[80px] px-[16px] py-[10px] border border-[#8A939B] bg-white text-[#0A2A43] pr-10 outline-none text-[14px]">
              <option>All Warehouses</option>
              <option>Location-A</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <svg className="h-4 w-4 text-[#0A2A43]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div onClick={fetchInventory} className="text-[14px] font-medium text-[#1769FF] cursor-pointer hover:underline whitespace-nowrap">Refresh</div>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block rounded-[28px] overflow-hidden border border-[#E7EAEC]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F4F6F8] text-center font-semibold text-[#0A2A43] text-[12px] uppercase tracking-wider">
              <th className="py-[16px] px-[8px]">ID</th>
              <th className="py-[16px] px-[8px]">Item Name</th>
              <th className="py-[16px] px-[8px]">Category</th>
              <th className="py-[16px] px-[8px]">Location</th>
              <th className="py-[16px] px-[8px]">Device</th>
              <th className="py-[16px] px-[8px]">Stock</th>
              <th className="py-[16px] px-[8px]">Unit Weight</th>
              <th className="py-[16px] px-[8px]">Status</th>
              <th className="py-[16px] px-[8px]">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr><td colSpan="9" className="py-20 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1769FF]"></div></td></tr>
            ) : inventoryList.length === 0 ? (
              <tr><td colSpan="9" className="py-20 text-center text-gray-400">No items in inventory.</td></tr>
            ) : (
              inventoryList.map((item) => {
                const s = statusStyles[item.Status] || statusStyles.InStock;
                return (
                  <tr key={item.InventoryId} className="text-center border-t border-[#E7EAEC] text-[14px] hover:bg-gray-50 transition-colors">
                    <td className="py-[20px] text-[#0A2A43]">{item.ItemId}</td>
                    <td className="py-[20px] font-bold text-[#0A2A43]">{item.ItemName}</td>
                    <td className="py-[20px] text-gray-600">{item.Category}</td>
                    <td className="py-[20px] font-medium">{item.LocationName}</td>
                    <td className="py-[20px] text-[#1769FF] font-medium">{item.DeviceName}</td>
                    <td className="py-[20px] font-bold text-[15px]">{item.Stock}</td>
                    <td className="py-[20px] text-gray-500">{item.PerUnitWeight}g</td>
                    <td>
                      <span className="rounded-[80px] px-[12px] py-[4px] text-[11px] font-bold uppercase" style={{ background: s.bg, color: s.text }}>
                        {s.label}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => { setSelectedId(item.InventoryId); setShowDelete(true); }} className="hover:scale-110 transition-transform">
                        <img src={deleteicon} className="w-[20px] h-[20px] mx-auto" alt="delete" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="flex flex-col gap-[16px] lg:hidden">
        {inventoryList.map((item) => {
          const s = statusStyles[item.Status] || statusStyles.InStock;
          return (
            <div key={item.InventoryId} className="border border-[#E7EAEC] rounded-[24px] p-[20px] bg-white shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#1769FF] uppercase">{item.Category}</span>
                  <h3 className="font-bold text-[18px] text-[#0A2A43]">{item.ItemName}</h3>
                </div>
                <button onClick={() => { setSelectedId(item.InventoryId); setShowDelete(true); }} className="p-2 bg-red-50 rounded-full">
                  <img src={deleteicon} className="w-[18px] h-[18px]" alt="delete" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[13px] mb-4">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[11px]">Location</span>
                  <span className="font-medium">{item.LocationName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[11px]">Device</span>
                  <span className="font-medium text-[#1769FF]">{item.DeviceName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[11px]">Stock</span>
                  <span className="font-bold text-[16px]">{item.Stock}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[11px]">Unit Weight</span>
                  <span className="font-medium">{item.PerUnitWeight}g</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase" style={{ background: s.bg, color: s.text }}>
                  {s.label}
                </span>
                <span className="text-[11px] text-gray-400 font-mono">ID: {item.ItemId}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <div className="w-full max-w-[420px] bg-white rounded-[32px] p-[24px]">
             <div className="flex flex-col border border-[#E7EAEC] rounded-[24px] p-[24px] gap-[20px] text-center">
                <img src={deleteimg} className="w-[56px] h-[56px] mx-auto" alt="warning" />
                <div>
                    <h2 className="text-[20px] font-bold text-[#E74C3C]">Remove Item?</h2>
                    <p className="text-[14px] text-gray-500 mt-2">Are you sure you want to delete this item? This will remove all associated stock data.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex-1 py-3 rounded-full border border-gray-200 font-bold text-gray-600" onClick={() => setShowDelete(false)}>Cancel</button>
                    <button className="flex-1 py-3 rounded-full bg-[#E74C3C] text-white font-bold" onClick={handleDelete}>Delete</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showDeleteSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-6">
          <div className="w-full max-w-[380px] bg-white rounded-[32px] p-[32px] text-center shadow-2xl">
            <img src={deletesuccess} className="w-[64px] h-[64px] mx-auto mb-4" alt="success" />
            <h3 className="text-[22px] font-bold text-[#2ECC71]">Successful!</h3>
            <p className="text-gray-500 mt-2">Item has been removed from your live inventory.</p>
            <button onClick={() => setShowDeleteSuccess(false)} className="mt-8 w-full py-4 bg-[#0A2A43] text-white rounded-full font-bold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveInventorytable;