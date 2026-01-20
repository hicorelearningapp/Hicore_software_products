import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";

// ==== Import your icons from assets ====
import totalIcon from "../../../../assets/Invoice/total.png";
import completedIcon from "../../../../assets/Invoice/completed.png";
import pendingIcon from "../../../../assets/Invoice/pending.png";
import cancelledIcon from "../../../../assets/Invoice/cancelled.png";
import overdueIcon from "../../../../assets/Invoice/overdue.png";

import iconAZ from "../../../../assets/Invoice/icon-az.png";
import iconZA from "../../../../assets/Invoice/icon-za.png";
import searchIcon from "../../../../assets/Invoice/Scan.png";

// Import action icons
import viewIcon from "../../../../assets/Invoice/View.png";
import downloadIcon from "../../../../assets/Invoice/download.png";
import shareIcon from "../../../../assets/Invoice/share.png";
import deleteIcon from "../../../../assets/Invoice/delete.png";

const BASE_URL = import.meta.env.VITE_API_BASE || "/api";

const Invoice = () => {
  // --- API State ---
  const [apiData, setApiData] = useState({
    TotalInvoices: 0,
    Completed: 0,
    Pending: 0,
    Cancelled: 0,
    Overdue: 0,
    TotalAmount: 0,
    Invoices: [],
  });
  const [loading, setLoading] = useState(true);

  // --- Local state for the control bar ---
  const [sortToggle, setSortToggle] = useState(false);
  const [filters, setFilters] = useState({
    pending: false,
    completed: false,
    overdue: false,
    cancelled: false,
  });
  const [searchText, setSearchText] = useState("");

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Showing exactly 5 items per page as requested

  const retailerId = 1;

  // --- Fetch Data ---
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/retailer/${retailerId}/invoices`);
        setApiData(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [retailerId]);

  const handleFilterChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  // --- Helper function to get status badge styling ---
  const getStatusBadgeClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const cardData = [
    { label: "Total Invoices", count: apiData.TotalInvoices, icon: totalIcon },
    { label: "Completed", count: apiData.Completed, icon: completedIcon },
    { label: "Pending", count: apiData.Pending, icon: pendingIcon },
    { label: "Cancelled", count: apiData.Cancelled, icon: cancelledIcon },
    { label: "Overdue", count: apiData.Overdue, icon: overdueIcon },
  ];

  // Logic to filter and sort the full list
  const filteredAndSortedInvoices = useMemo(() => {
    const activeStatuses = Object.entries(filters)
      .filter(([, val]) => val)
      .map(([key]) => key.toLowerCase());

    const filtered = apiData.Invoices.filter((inv) => {
      const currentStatus = inv.PaymentStatus?.toLowerCase();
      if (activeStatuses.length > 0) {
        const filterMatch = activeStatuses.includes(currentStatus) || 
                           (activeStatuses.includes("completed") && currentStatus === "paid");
        if (!filterMatch) return false;
      }
      if (searchText && searchText.trim() !== "") {
        const q = searchText.trim().toLowerCase();
        const haystack = `${inv.InvoiceId} ${inv.CustomerName} ${inv.InvoiceDate}`;
        if (!haystack.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    return filtered.sort((a, b) => {
      if (a.InvoiceId < b.InvoiceId) return sortToggle ? 1 : -1;
      if (a.InvoiceId > b.InvoiceId) return sortToggle ? -1 : 1;
      return 0;
    });
  }, [apiData.Invoices, filters, searchText, sortToggle]);

  // --- CALCULATE PAGINATION DATA ---
  const totalPages = Math.ceil(filteredAndSortedInvoices.length / itemsPerPage) || 1;

  const displayedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedInvoices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedInvoices, currentPage]);

  const paginationItems = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    // Show first 3, dots, and last 2
    if (currentPage < 4) return [1, 2, 3, "...", totalPages - 1, totalPages];
    // Show first 1, dots, current, dots, last 1
    if (currentPage >= 4 && currentPage < totalPages - 2) return [1, "...", currentPage, "...", totalPages];
    // Show first 2, dots, last 3
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  };

  const goToPage = (p) => {
    if (p === "...") return;
    setCurrentPage(p);
  };

  const goPrev = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goNext = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <div className="w-full mx-auto px-6 py-4">
      <h2 className="text-xl font-semibold text-[#115D29]">InVoice</h2>
      <p className="text-sm text-gray-600 mt-3">
        Manage all your invoices - track payments, statuses, and download or share with ease.
      </p>

      <div className="flex gap-4 mt-8">
        {cardData.map((item, index) => (
          <div key={index} className="w-full md:max-w-56 h-28 border border-[#C7DECF] rounded-lg p-4 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[15px] text-[#115D29]">{item.label}</p>
              <div className="w-10 h-10 flex items-center justify-center rounded-md">
                <img src={item.icon} alt="icon" className="w-10 h-10" />
              </div>
            </div>
            <p className="text-xl font-semibold text-[#115D29]">{loading ? "..." : item.count}</p>
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col xl:flex-row items-center gap-4 bg-[#F7F9F7] p-4 rounded-xl border border-[#D4E5D9] mb-10 mt-8">
        <div className="flex items-center gap-3 border border-[#B5CDBD] rounded-xl px-4 py-2">
          <img src={iconAZ} alt="A-Z" className="w-5 h-5" />
          <div onClick={() => { setSortToggle(!sortToggle); setCurrentPage(1); }} className="w-12 h-6 bg-gray-200 rounded-full flex items-center px-1 cursor-pointer">
            <div className={`w-5 h-5 rounded-full transition-all ${sortToggle ? "translate-x-6 bg-[#115D29]" : "bg-[#115D29]"}`}></div>
          </div>
          <img src={iconZA} alt="Z-A" className="w-5 h-5" />
        </div>

        <div className="flex flex-wrap items-center gap-4 border border-[#B5CDBD] rounded-xl px-6 py-2 text-[#115D29]">
          <span className="text-sm font-medium">Filter by :</span>
          {["pending", "completed", "overdue", "cancelled"].map((status) => (
            <label key={status} className="flex items-center gap-2 text-sm cursor-pointer capitalize">
              <input type="checkbox" checked={filters[status]} onChange={() => handleFilterChange(status)} className="w-4 h-4 border border-[#115D29] rounded accent-green-600" />
              {status}
            </label>
          ))}
        </div>

        <div className="flex items-center justify-between flex-1 border border-[#B5CDBD] rounded-xl px-4 py-2 w-full xl:w-auto">
          <input type="text" placeholder="Search by Invoice ID, Customer Name, or Date..." className="w-full outline-none text-sm text-[#115D29] placeholder-[#9FB8A7] bg-transparent" value={searchText} onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }} />
          <img src={searchIcon} alt="search" className="w-6 h-6 opacity-80" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#C7DECF] overflow-hidden">
        <div className="grid grid-cols-7 text-white bg-[#115D29] text-center font-medium">
          {["Invoice ID", "Customer Name", "Date", "Amount", "Payment", "Status", "Action"].map((header) => (
            <div key={header} className="p-5">{header}</div>
          ))}
        </div>

        {loading ? (
          <div className="py-10 text-center text-[#115D29]">Loading Invoices...</div>
        ) : (
          displayedInvoices.map((invoice, index) => (
            <div key={invoice.InvoiceId} className={`grid grid-cols-7 text-center items-center py-5 text-sm text-[#115D29] ${index < displayedInvoices.length - 1 ? "border-b border-[#E0E0E0]" : ""}`}>
              <div className="px-4">INV-{invoice.InvoiceId}</div>
              <div className="px-4">{invoice.CustomerName}</div>
              <div className="px-4">{formatDate(invoice.InvoiceDate)}</div>
              <div className="px-4 text-[#115D29]">₹{invoice.TotalAmount?.toLocaleString()}</div>
              <div className="px-4">{invoice.PaymentMode}</div>
              <div className="px-4 flex justify-center">
                <span className={`py-2 px-3 rounded-full text-sm w-24 flex justify-center ${getStatusBadgeClasses(invoice.PaymentStatus)}`}>
                  {invoice.PaymentStatus}
                </span>
              </div>
              <div className="px-4 flex justify-center gap-3 items-center">
                <img src={viewIcon} alt="View" className="w-6 h-6 opacity-80 cursor-pointer hover:opacity-100" />
                <img src={downloadIcon} alt="Download" className="w-6 h-6 opacity-80 cursor-pointer hover:opacity-100" />
                <img src={shareIcon} alt="Share" className="w-6 h-6 opacity-80 cursor-pointer hover:opacity-100" />
                <img src={deleteIcon} alt="Delete" className="w-6 h-6 opacity-80 cursor-pointer hover:opacity-100" />
              </div>
            </div>
          ))
        )}
        {!loading && displayedInvoices.length === 0 && (
          <div className="py-8 text-center text-sm text-gray-500">No invoices found.</div>
        )}
      </div>

      <div className="flex items-center justify-end gap-4 mt-10 mb-10">
        <button onClick={goPrev} disabled={currentPage === 1} className={`text-sm px-2 py-1 ${currentPage === 1 ? "text-gray-400" : "text-[#145A2B] hover:underline"}`}>
          Previous
        </button>
        <nav aria-label="Page navigation" className="flex items-center gap-2">
          {paginationItems().map((p, idx) => (
            p === "..." ? (
              <span key={`dots-${idx}`} className="text-sm text-[#115D29]">…</span>
            ) : (
              <button key={p} onClick={() => goToPage(p)} className={`text-sm px-2 py-1 rounded-md ${currentPage === p ? "bg-[#145A2B] text-white" : "text-[#115D29]"}`}>
                {p}
              </button>
            )
          ))}
        </nav>
        <button onClick={goNext} disabled={currentPage === totalPages} className={`text-sm px-2 py-1 ${currentPage === totalPages ? "text-gray-400" : "text-[#145A2B] hover:underline"}`}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Invoice;