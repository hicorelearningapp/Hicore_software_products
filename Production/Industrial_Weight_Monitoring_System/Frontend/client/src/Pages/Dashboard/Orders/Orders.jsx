import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Assets
import addicon from "../../../assets/Dashboard/Inventory/add-icon.png";
import deliveredicon from "../../../assets/Dashboard/Orders/Delivered.png";
import pendingicon from "../../../assets/Dashboard/Orders/Pending.png";
import cancelledicon from "../../../assets/Dashboard/Orders/Cancelled.png";
import intransiticon from "../../../assets/Dashboard/Orders/intransit.png";
import azicon from "../../../assets/Dashboard/Inventory/A-Z.png";
import zaicon from "../../../assets/Dashboard/Inventory/Z-A.png";
import searchicon from "../../../assets/Dashboard/Inventory/Search.png";
import deleteicon from "../../../assets/Dashboard/Home/Delete.png";
import deleteimg from "../../../assets/Dashboard/Inventory/deleteimg.png";
import deletesuccess from "../../../assets/Dashboard/Inventory/deletesuccess.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const statusStyles = {
  Delivered: { bg: "#2ECC711A", text: "#2ECC71" },
  Pending: { bg: "#F1C40F1A", text: "#F1C40F" },
  InTransit: { bg: "#F3F4F5", text: "#3E4246" },
  Cancelled: { bg: "#E74C3C1A", text: "#E74C3C" },
};

const Orders = () => {
  const navigate = useNavigate();
  
  // State for Data
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ Delivered: 0, Pending: 0, Cancelled: 0, InTransit: 0 });
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [isAscending, setIsAscending] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [filters, setFilters] = useState({
    Delivered: false,
    Pending: false,
    Cancelled: false,
    InTransit: false,
  });

  /* --- API CALLS --- */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/orders`);
      const result = await response.json();
      if (result.success) {
        setOrders(result.data.Orders);
        setStats({
          Delivered: result.data.Delivered,
          Pending: result.data.Pending,
          Cancelled: result.data.Cancelled,
          InTransit: result.data.InTransit,
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async () => {
    try {
      const response = await fetch(`${API_BASE}/orders/${selectedOrderId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setShowDelete(false);
        setShowDeleteSuccess(true);
        fetchOrders();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* --- SEARCH & FILTER LOGIC --- */
  const filteredOrders = useMemo(() => {
    let data = [...orders];
    const activeFilters = Object.keys(filters).filter(key => filters[key]);
    if (activeFilters.length > 0) {
      data = data.filter(order => activeFilters.includes(order.Status));
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(order => 
        order.OrderId.toString().toLowerCase().includes(term) || 
        order.ItemName.toLowerCase().includes(term) || 
        order.Vendor.toLowerCase().includes(term)
      );
    }
    data.sort((a, b) => {
      return isAscending 
        ? a.ItemName.localeCompare(b.ItemName) 
        : b.ItemName.localeCompare(a.ItemName);
    });
    return data;
  }, [orders, filters, searchTerm, isAscending]);

  const cards = [
    { number: stats.Delivered, label: "Delivered", color: "#2ECC71", img: deliveredicon, key: "Delivered" },
    { number: stats.Pending, label: "Pending", color: "#F1C40F", img: pendingicon, key: "Pending" },
    { number: stats.Cancelled, label: "Cancelled", color: "#E74C3C", img: cancelledicon, key: "Cancelled" },
    { number: stats.InTransit, label: "In Transit", color: "#3E4246", img: intransiticon, key: "InTransit" },
  ];

  const toggleFilter = (label) => {
    setFilters((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="p-[16px] md:p-[36px]">
      <div className="flex flex-col rounded-[30px] md:rounded-[80px] p-[20px] md:p-[48px] gap-[24px] border border-[#8A939B]">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-[4px]">
            <h2 className="font-semibold text-[20px] md:text-[24px] leading-tight text-[#0A2A43]">Orders</h2>
            <p className="text-[14px] md:text-[16px] text-[#0A2A43] opacity-80">Track every order from request to delivery.</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/place-order")}
            className="flex h-[40px] px-[20px] rounded-[80px] gap-[8px] bg-[#1769FF] items-center text-white font-semibold text-[14px] hover:bg-blue-700 transition-all w-full sm:w-auto justify-center"
          >
            <img src={addicon} className="w-[18px] h-[18px]" alt="add" />
            Place an Order
          </button>
        </div>

        {/* STAT CARDS - Improved Grid for Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px] md:gap-[16px]">
          {cards.map((item, index) => (
            <div key={index} className="flex flex-row items-center gap-[10px] md:gap-[12px] p-[10px] md:p-[12px] rounded-[20px] md:rounded-[80px] border border-[#E7EAEC] bg-white">
              <div className="flex p-[8px] md:p-[10px] rounded-full bg-[#F4F6F8]">
                <img src={item.img} className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]" alt={item.label} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[16px] md:text-[18px]" style={{ color: item.color }}>{item.number}</span>
                <span className="text-[10px] md:text-[12px] font-medium uppercase tracking-tight md:tracking-wide" style={{ color: item.color }}>{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* FILTERS & SEARCH - Stack on Mobile */}
        <div className="flex flex-col xl:flex-row rounded-[24px] md:rounded-[80px] bg-[#F4F6F8] px-[12px] md:px-[32px] py-[12px] md:py-[16px] gap-[12px] md:gap-[16px] items-stretch xl:items-center">
          <div className="flex flex-row justify-between sm:justify-start items-center gap-4">
              <div className="flex flex-row rounded-[80px] border border-[#E7EAEC] bg-white p-[6px] gap-[12px] items-center shrink-0">
                <img src={azicon} className="w-[18px]" alt="A-Z" />
                <button
                  onClick={() => setIsAscending(!isAscending)}
                  className={`relative w-[44px] h-[24px] rounded-[80px] p-[2px] flex items-center transition-colors ${isAscending ? "justify-start bg-gray-300" : "justify-end bg-[#1769FF]"}`}
                >
                  <div className="w-[20px] h-[20px] rounded-full bg-white shadow-sm" />
                </button>
                <img src={zaicon} className="w-[18px]" alt="Z-A" />
              </div>
          </div>

          {/* CUSTOM SCROLLABLE FILTERS */}
          <div className="flex overflow-x-auto w-full xl:w-auto px-[12px] py-[10px] gap-[16px] rounded-[20px] md:rounded-[80px] border border-[#E7EAEC] bg-white items-center no-scrollbar">
            <span className="text-[13px] font-bold text-[#0A2A43] whitespace-nowrap">Filter:</span>
            {Object.keys(filters).map((label, idx) => (
              <div key={idx} className="flex items-center gap-[8px] cursor-pointer shrink-0"
                   onClick={() => toggleFilter(label)}>
                <div className={`w-[18px] h-[18px] rounded-[4px] border-[1.5px] transition-all flex items-center justify-center 
                  ${filters[label] ? "bg-[#0A2A43] border-[#0A2A43]" : "border-[#B3BDC5] bg-white"}`}
                >
                  {filters[label] && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className={`text-[13px] whitespace-nowrap ${filters[label] ? "text-[#0A2A43] font-semibold" : "text-[#8A939B]"}`}>
                  {label === "InTransit" ? "In Transit" : label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-1 items-center gap-[8px] rounded-[80px] px-[16px] py-[10px] border border-[#8A939B] bg-white">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-[14px] outline-none bg-transparent" 
            />
            <img src={searchicon} alt="search" className="w-[18px] h-[18px] opacity-50" />
          </div>
        </div>

        {/* DATA TABLE - Added Shadow and Indicator for scroll */}
        <div className="relative overflow-hidden rounded-[20px] border border-[#8A939B]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead className="bg-[#0A2A43] text-white text-[12px] md:text-[13px] uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-4 text-left">Order ID</th>
                  <th className="px-4 text-center">Item Code</th>
                  <th className="px-4 text-center">Item Name</th>
                  <th className="px-4 text-center">Vendor</th>
                  <th className="px-4 text-center">Qty</th>
                  <th className="px-4 text-center">Status</th>
                  <th className="px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                   <tr><td colSpan={7} className="py-10 text-center text-gray-400">Loading orders...</td></tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((row, index) => (
                    <tr key={index} className="text-[13px] md:text-[14px] hover:bg-blue-50/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-[#1769FF]">{row.OrderId}</td>
                      <td className="px-4 text-center text-gray-600">{row.ItemCode}</td>
                      <td className="px-4 text-center font-semibold text-[#0A2A43]">{row.ItemName}</td>
                      <td className="px-4 text-center text-gray-600">{row.Vendor}</td>
                      <td className="px-4 text-center">{row.Quantity}</td>
                      <td className="px-4 text-center">
                        <span
                          className="px-2 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap"
                          style={{ background: statusStyles[row.Status]?.bg, color: statusStyles[row.Status]?.text }}
                        >
                          {row.Status === "InTransit" ? "In Transit" : row.Status}
                        </span>
                      </td>
                      <td className="px-4">
                        <button
                          onClick={() => { setSelectedOrderId(row.OrderId); setShowDelete(true); }}
                          className="flex mx-auto p-2 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <img src={deleteicon} className="w-4 h-4 md:w-5 md:h-5" alt="delete" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={7} className="py-[48px] text-center text-[14px] text-[#8A939B]">No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile Scroll Hint (Only visible on small screens when horizontal scroll is possible) */}
          <div className="md:hidden text-center py-2 bg-gray-50 text-[10px] text-gray-400 border-t italic">
            Swipe left/right to view more details
          </div>
        </div>

        {/* AI SUGGESTIONS SECTION - Stacked for Mobile */}
        <div className='flex flex-col lg:flex-row px-[20px] md:px-[48px] py-[24px] bg-[#1769FF0D] rounded-[30px] md:rounded-[80px] border border-[#1769FF] gap-6'>
           <div className='flex-1 flex flex-col gap-[16px]'>
             <label className='font-semibold text-[18px] md:text-[20px] text-[#1769FF]'>AI Suggestions</label>
             <div className='flex flex-col sm:flex-row sm:items-center gap-[12px]'>
               <label className='font-semibold text-[15px] md:text-[16px] text-[#0A2A43] shrink-0'>Sanitizer Bottles:</label>
               <div className='flex flex-wrap gap-[6px] md:gap-[8px]'>
                 {["INV-0015", "60 units", "3 days", "ABC Co"].map((tag, i) => (
                   <div key={i} className='rounded-[80px] px-[12px] py-[4px] bg-[#DCE9FF] text-[11px] md:text-[13px] text-[#0E3F99] whitespace-nowrap'>{tag}</div>
                 ))}
               </div>
             </div>
           </div>
           <div className='flex flex-row lg:flex-col gap-[12px] items-center justify-between lg:justify-center border-t lg:border-t-0 pt-4 lg:pt-0'>
             <div className='text-[13px] md:text-[14px] font-semibold text-[#2ECC71]'>AI Score: High</div>
             <button onClick={() => navigate("/dashboard/order-now")} className='rounded-[80px] px-[20px] md:px-[24px] py-[8px] bg-[#1769FF] text-white font-semibold text-[14px]'>Order Now</button>
           </div>
        </div>
      </div>

      {/* DELETE MODAL - Responsive Width */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-6">
          <div className="w-full max-w-[360px] bg-white rounded-[24px] p-[24px] shadow-2xl">
            <div className="flex flex-col items-center text-center gap-4">
              <img src={deleteimg} className="w-14 h-14" alt="alert" />
              <div>
                <h3 className="text-lg font-bold text-[#E74C3C]">Cancel Order?</h3>
                <p className="text-xs text-gray-500 mt-1">Order ID: {selectedOrderId}</p>
              </div>
              <div className="flex w-full flex-col gap-2 mt-2">
                <button className="w-full py-3 rounded-full bg-[#E74C3C] text-white font-bold text-sm" onClick={deleteOrder}>Yes, Cancel</button>
                <button className="w-full py-3 rounded-full border border-gray-300 font-bold text-sm" onClick={() => setShowDelete(false)}>Keep Order</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showDeleteSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[120] p-6">
          <div className="relative w-full max-w-[340px] bg-white rounded-[24px] p-[32px] text-center shadow-2xl">
            <img src={deletesuccess} className="w-14 h-14 mx-auto mb-4" alt="success" />
            <h3 className="text-lg font-bold text-[#2ECC71]">Success!</h3>
            <p className="text-gray-500 text-sm mt-2">The order has been removed.</p>
            <button onClick={() => setShowDeleteSuccess(false)} className="mt-6 w-full py-3 bg-[#0A2A43] text-white rounded-full font-bold text-sm">Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;