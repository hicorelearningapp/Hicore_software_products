import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";

// ==== Import your icons from assets ====
import totalIcon from "../../../assets/Invoice/total.png";
import completedIcon from "../../../assets/Invoice/completed.png";
import pendingIcon from "../../../assets/Invoice/pending.png";
import cancelledIcon from "../../../assets/Invoice/cancelled.png";
import overdueIcon from "../../../assets/Invoice/overdue.png";

import iconAZ from "../../../assets/Invoice/icon-az.png";
import iconZA from "../../../assets/Invoice/icon-za.png";
import searchIcon from "../../../assets/Invoice/Scan.png";

// Import action icons
import viewIcon from "../../../assets/Invoice/View.png";
import downloadIcon from "../../../assets/Invoice/download.png";
import shareIcon from "../../../assets/Invoice/share.png";
import deleteIcon from "../../../assets/Invoice/delete.png";

const BASE_URL = import.meta.env.VITE_API_BASE || "/api";

const Invoice = () => {
  // --- Dynamic Data State ---
  const [backendData, setBackendData] = useState({
    TotalInvoices: 0,
    Completed: 0,
    Pending: 0,
    Cancelled: 0,
    Overdue: 0,
    Invoices: [],
  });
  const [loading, setLoading] = useState(true);

  // --- Local state for controls ---
  const [sortToggle, setSortToggle] = useState(false);
  const [filters, setFilters] = useState({
    pending: false,
    completed: false,
    overdue: false,
    cancelled: false,
  });
  const [searchText, setSearchText] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Set to 5 rows per page as requested

  // Fetch Data from Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Using distributor_id 1 as per your example
        const response = await axios.get(`${BASE_URL}/distributor/1/invoices`);
        setBackendData(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cardData = [
    { label: "Total Invoices", count: backendData.TotalInvoices, icon: totalIcon },
    { label: "Completed", count: backendData.Completed, icon: completedIcon },
    { label: "Pending", count: backendData.Pending, icon: pendingIcon },
    { label: "Cancelled", count: backendData.Cancelled, icon: cancelledIcon },
    { label: "Overdue", count: backendData.Overdue, icon: overdueIcon },
  ];

  const handleFilterChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    setCurrentPage(1);
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Completed": case "Paid": return "bg-green-100 text-green-800";
      case "Overdue": return "bg-red-100 text-red-800";
      case "Cancelled": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // --- Filtering and Sorting ---
  const filteredAndSortedInvoices = useMemo(() => {
    const activeStatuses = Object.entries(filters)
      .filter(([, val]) => val)
      .map(([key]) => key.toLowerCase());

    let result = backendData.Invoices.map((inv) => ({
      id: `INV-${inv.InvoiceId}`,
      customerName: inv.RetailerName,
      date: new Date(inv.InvoiceDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      amount: `₹${inv.NetAmount}`,
      payment: inv.PaymentMode,
      status: inv.PaymentStatus, // Reverted: Displays exact backend status (e.g., "Paid")
      rawId: inv.InvoiceId
    }));

    if (activeStatuses.length > 0) {
      result = result.filter((inv) => activeStatuses.includes(inv.status.toLowerCase()));
    }

    if (searchText.trim() !== "") {
      const q = searchText.toLowerCase();
      result = result.filter((inv) =>
        inv.id.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        inv.date.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      return sortToggle ? b.rawId - a.rawId : a.rawId - b.rawId;
    });

    return result;
  }, [backendData.Invoices, filters, searchText, sortToggle]);

  // --- Pagination Logic ---
  const totalItems = filteredAndSortedInvoices.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
  
  const displayedInvoices = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedInvoices.slice(start, start + rowsPerPage);
  }, [filteredAndSortedInvoices, currentPage]);

  const paginationItems = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    return [1, 2, 3, "...", totalPages];
  };

  const goToPage = (p) => { if (p !== "...") setCurrentPage(p); };
  const goPrev = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goNext = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <div className="w-full mx-auto px-6 py-4">
      <h2 className="text-xl font-semibold text-[#115D29]">InVoice</h2>
      <p className="text-sm text-gray-600 mt-3">
        Manage all your invoices - track payments, statuses, and download or share with ease.
      </p>

      {/* Status Cards */}
      <div className="flex gap-4 mt-8">
        {cardData.map((item, index) => (
          <div key={index} className="w-full md:max-w-56 h-28 border border-[#C7DECF] rounded-lg p-4 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[15px] text-[#115D29]">{item.label}</p>
              <img src={item.icon} alt="icon" className="w-10 h-10" />
            </div>
            <p className="text-xl font-semibold text-[#115D29]">{item.count}</p>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="w-full flex flex-col xl:flex-row items-center gap-4 bg-[#F7F9F7] p-4 rounded-xl border border-[#D4E5D9] mb-10 mt-8">
        <div className="flex items-center gap-3 border border-[#B5CDBD] rounded-xl px-4 py-2">
          <img src={iconAZ} alt="A-Z" className="w-5 h-5" />
          <div 
            onClick={() => setSortToggle(!sortToggle)}
            className="w-12 h-6 bg-gray-200 rounded-full flex items-center px-1 cursor-pointer"
          >
            <div className={`w-5 h-5 rounded-full transition-all ${sortToggle ? "translate-x-6 bg-[#115D29]" : "bg-[#115D29]"}`}></div>
          </div>
          <img src={iconZA} alt="Z-A" className="w-5 h-5" />
        </div>

        <div className="flex flex-wrap items-center gap-4 border border-[#B5CDBD] rounded-xl px-6 py-2 text-[#115D29]">
          <span className="text-sm font-medium">Filter by :</span>
          {["Pending", "Completed", "Overdue", "Cancelled"].map((status) => (
            <label key={status} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters[status.toLowerCase()]}
                onChange={() => handleFilterChange(status.toLowerCase())}
                className="w-4 h-4 border border-[#115D29] rounded accent-green-600"
              />
              {status}
            </label>
          ))}
        </div>

        <div className="flex items-center justify-between flex-1 border border-[#B5CDBD] rounded-xl px-4 py-2 w-full xl:w-auto">
          <input
            type="text"
            placeholder="Search by Invoice ID, Customer Name, or Date..."
            className="w-full outline-none text-sm text-[#115D29] placeholder-[#9FB8A7] bg-transparent"
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
          />
          <img src={searchIcon} alt="search" className="w-6 h-6 opacity-80" />
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl border border-[#C7DECF] overflow-hidden">
        <div className="grid grid-cols-7 text-white bg-[#115D29] text-center font-medium">
          {["Invoice ID", "Customer Name", "Date", "Amount", "Payment", "Status", "Action"].map((h) => (
            <div key={h} className="p-5">{h}</div>
          ))}
        </div>

        {loading ? (
          <div className="py-10 text-center text-[#115D29]">Loading Invoices...</div>
        ) : displayedInvoices.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">No invoices found.</div>
        ) : (
          displayedInvoices.map((invoice, index) => (
            <div key={invoice.id} className={`grid grid-cols-7 text-center items-center py-5 text-sm text-[#115D29] ${index < displayedInvoices.length - 1 ? "border-b border-[#E0E0E0]" : ""}`}>
              <div className="px-4">{invoice.id}</div>
              <div className="px-4">{invoice.customerName}</div>
              <div className="px-4">{invoice.date}</div>
              <div className="px-4">{invoice.amount}</div>
              <div className="px-4">{invoice.payment}</div>
              <div className="px-4 flex justify-center">
                <span className={`py-2 px-3 rounded-full text-sm w-24 flex justify-center ${getStatusBadgeClasses(invoice.status)}`}>
                  {invoice.status}
                </span>
              </div>
              <div className="px-4 flex justify-center gap-3 items-center">
                {[viewIcon, downloadIcon, shareIcon, deleteIcon].map((icon, i) => (
                  <img key={i} src={icon} className="w-6 h-6 opacity-80 cursor-pointer hover:opacity-100 transition-opacity" alt="action" />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-4 mt-10 mb-10">
        <button onClick={goPrev} disabled={currentPage === 1} className="text-sm text-[#145A2B] px-2 py-1 hover:underline disabled:opacity-30">Previous</button>
        <nav className="flex items-center gap-2">
          {paginationItems().map((p, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(p)}
              className={`text-sm px-3 py-1 rounded-md ${currentPage === p ? "bg-[#145A2B] text-white" : "text-[#115D29]"}`}
            >
              {p}
            </button>
          ))}
        </nav>
        <button onClick={goNext} disabled={currentPage === totalPages} className="text-sm text-[#145A2B] px-2 py-1 hover:underline disabled:opacity-30">Next</button>
      </div>
    </div>
  );
};

export default Invoice;