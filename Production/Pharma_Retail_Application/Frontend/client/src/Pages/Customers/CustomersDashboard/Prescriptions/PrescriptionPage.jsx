import React, { useState, useMemo, useEffect } from "react";

// ==== CARD ICONS ====
import totalIcon from "../../../../assets/Customers/Prescription/total.png";
import deliveredIcon from "../../../../assets/Customers/Prescription/delivered.png";
import processingIcon from "../../../../assets/Customers/Prescription/processing.png";
import pendingIcon from "../../../../assets/Customers/Prescription/pending.png";

// ==== UPLOAD PANEL ICONS ====
import uploadIcon from "../../../../assets/CustomerOrder/upload-file.png";
import cameraIcon from "../../../../assets/CustomerOrder/camera.png";
import tipIcon from "../../../../assets/CustomerOrder/tip.png";

// ==== CONTROL BAR ICONS ====
import iconAZ from "../../../../assets/Customers/Prescription/icon-az.png";
import iconZA from "../../../../assets/Customers/Prescription/icon-za.png";
import searchIcon from "../../../../assets/Customers/Prescription/scan.png";

// ==== ACTION ICONS ====
import refreshIcon from "../../../../assets/Customers/Prescription/refresh.png";
import downloadIcon from "../../../../assets/Customers/Prescription/download.png";
import shareIcon from "../../../../assets/Customers/Prescription/share.png";
import deleteIcon from "../../../../assets/Customers/Prescription/delete.png";

import CreateManualorder from "./createManualorder";

const BASE_URL = import.meta.env.VITE_API_BASE || "/api";

const PrescriptionPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [stats, setStats] = useState({ total: 0, delivered: 0, processing: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  
  // controlbar state
  const [sortToggle, setSortToggle] = useState(false);
  const [filters, setFilters] = useState({ delivered: false, processing: false, pending: false });
  const [searchText, setSearchText] = useState("");

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; 

  const [showManualPopup, setShowManualPopup] = useState(false);

  // Fetch Data from Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Using customer_id 1 as per your request URL
        const response = await fetch(`${BASE_URL}/prescriptions/customer/1`);
        const data = await response.json();
        
        setPrescriptions(data.Prescriptions || []);
        setStats({
          total: data.TotalPrescriptions || 0,
          delivered: data.Delivered || 0,
          processing: data.Processing || 0,
          pending: data.Pending || 0
        });
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setShowManualPopup(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openManualPopup = () => setShowManualPopup(true);
  const closeManualPopup = () => setShowManualPopup(false);

  const handleFilterChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    setCurrentPage(1);
  };

  const getStatusBadgeClasses = (status) => {
    const s = status?.toLowerCase();
    if (s === "pending") return "bg-red-100 text-red-700";
    if (s === "completed" || s === "delivered") return "bg-green-100 text-green-700";
    if (s === "processing") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  const filteredAndSorted = useMemo(() => {
    const activeFilters = Object.entries(filters)
      .filter(([, v]) => v)
      .map(([k]) => k.toLowerCase());

    let result = prescriptions.filter((p) => {
      const statusMatch = activeFilters.length === 0 || activeFilters.includes(p.Status.toLowerCase());
      const searchMatch = !searchText || 
        `${p.OrderId} ${p.DoctorName}`.toLowerCase().includes(searchText.toLowerCase());
      return statusMatch && searchMatch;
    });

    return result.sort((a, b) => {
      const idA = a.OrderId;
      const idB = b.OrderId;
      return sortToggle ? (idA < idB ? 1 : -1) : (idA > idB ? 1 : -1);
    });
  }, [prescriptions, filters, searchText, sortToggle]);

  // Logic for 5 rows per page
  const totalPages = Math.ceil(filteredAndSorted.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentTableData = filteredAndSorted.slice(startIndex, startIndex + rowsPerPage);

  const paginationItems = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i <= 3 || i > totalPages - 2 || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const goToPage = (p) => { if (p !== "...") setCurrentPage(p); };
  const goPrev = () => setCurrentPage((s) => Math.max(1, s - 1));
  const goNext = () => setCurrentPage((s) => Math.min(totalPages, s + 1));

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const cards = [
    { title: "Total Prescriptions", value: stats.total, icon: totalIcon },
    { title: "Delivered", value: stats.delivered, icon: deliveredIcon },
    { title: "Processing", value: stats.processing, icon: processingIcon },
    { title: "Pending", value: stats.pending, icon: pendingIcon },
  ];

  return (
    <div className="p-6">
      <h2 className="text-[24px] font-bold text-green-800">My Prescriptions</h2>
      <p className="text-gray-600 mt-4 mb-8">
        Easily upload, view, and manage your medical prescriptions for fast and safe ordering.
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="border border-[#B5CDBD] rounded-xl p-4 flex flex-col justify-between bg-white">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-green-800 text-[18px]">{c.title}</h3>
              <div className="p-3 rounded-lg"><img src={c.icon} alt="icon" className="w-10 h-10" /></div>
            </div>
            <div className="mt-1 text-green-900 font-medium text-[22px]">{c.value}</div>
          </div>
        ))}
      </div>

      {/* Upload Prescription Panel */}
      <div className="mt-10">
        <div className="relative border border-[#D9EAD9] rounded-lg p-10 bg-white">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[#115D29]">Upload Prescription</h3>
           {/*<button onClick={openManualPopup} className="flex items-center gap-2 bg-[#2B78C6] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#1f5f99]">
              <span className="text-lg font-bold">+</span> 
              <span className="text-sm font-medium">Create Manual Order</span>
            </button>*/}
          </div>
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-2xl bg-[#FBFBFB] rounded-sm p-8" style={{ border: "2px dashed #2F8E48", borderRadius: "8px" }}>
              <div className="text-center">
                <h4 className="text-xl font-semibold text-[#115D29]">Upload Document</h4>
                <p className="mt-6 text-sm text-[#115D29]">Take a photo or upload a file of your prescription. We'll extract medicines automatically.</p>
                <p className="mt-6 text-sm text-gray-400">File Supported: JPG, PNG, PDF, Excel</p>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <label htmlFor="upload-input" className="inline-flex items-center gap-2 bg-[#115D29] text-white px-5 py-2 rounded-md cursor-pointer shadow-sm">
                    <img src={uploadIcon} alt="" className="w-5 h-5" />
                    <span className="font-medium text-sm">Upload File</span>
                  </label>
                  <button type="button" className="inline-flex items-center gap-2 border border-[#115D29] text-[#115D29] px-5 py-2 rounded-md bg-white hover:bg-[#f7fff7]">
                    <img src={cameraIcon} alt="" className="w-5 h-5" />
                    <span className="font-medium text-sm">Take Photo</span>
                  </button>
                  <input id="upload-input" type="file" className="hidden" />
                </div>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm">
                  <img src={tipIcon} alt="" className="w-5 h-5" />
                  <span className="text-sm text-[#2B78C6]">Tip: Place document on flat surface, good lighting, avoid glare.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROL BAR */}
      <div className="w-full flex flex-col lg:flex-row items-center gap-4 bg-[#F7F9F7] p-4 rounded-xl border border-[#D4E5D9] mb-6 mt-10">
        <div className="flex items-center gap-3 border border-[#B5CDBD] rounded-xl px-4 py-2">
          <img src={iconAZ} alt="A-Z" className="w-5 h-5" />
          <div onClick={() => { setSortToggle(!sortToggle); setCurrentPage(1); }} className="w-12 h-6 bg-gray-200 rounded-full flex items-center px-1 cursor-pointer">
            <div className={`w-5 h-5 rounded-full transition-all ${sortToggle ? "translate-x-6 bg-[#115D29]" : "bg-[#115D29]"}`} />
          </div>
          <img src={iconZA} alt="Z-A" className="w-5 h-5" />
        </div>

        <div className="flex flex-wrap items-center gap-4 border border-[#B5CDBD] rounded-xl px-6 py-2 text-[#115D29]">
          <span className="text-sm font-medium">Filter by :</span>
          {['Delivered', 'Processing', 'Pending'].map((f) => (
            <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={filters[f.toLowerCase()]} onChange={() => handleFilterChange(f.toLowerCase())} className="w-4 h-4 border border-[#115D29] rounded accent-green-600" />
              {f}
            </label>
          ))}
        </div>

        <div className="flex items-center justify-between flex-1 border border-[#B5CDBD] rounded-xl px-4 py-2 w-full lg:w-auto">
          <input type="text" placeholder="Search your Doctor Name, Order ID..." className="w-full outline-none text-sm text-[#115D29] placeholder-[#9FB8A7]" value={searchText} onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }} />
          <img src={searchIcon} alt="search" className="w-6 h-6 opacity-80 cursor-pointer" />
        </div>
      </div>

      {/* PRESCRIPTIONS TABLE */}
      <div className="bg-white rounded-xl border border-[#C7DECF] overflow-hidden">
        <div className="grid grid-cols-6 text-white bg-[#115D29] text-center font-medium">
          {["Order ID", "Uploaded On", "Doctor Name", "Order Details", "Status", "Action"].map((h) => (
            <div key={h} className="p-5">{h}</div>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-[#115D29]">Loading prescriptions...</div>
        ) : (
          currentTableData.map((row, idx) => (
            <div key={row.OrderId} className={`grid grid-cols-6 items-center text-sm text-[#115D29] py-5 ${idx < currentTableData.length - 1 ? "border-b border-[#EDEDED]" : ""}`}>
              <div className="px-4 text-center">RX-{row.OrderId}</div>
              <div className="px-4 text-center">{formatDate(row.UploadedAt)}</div>
              <div className="px-4 text-center">{row.DoctorName}</div>
              <div className="px-4 text-center cursor-pointer underline">View</div>
              <div className="px-4 flex justify-center">
                <span className={`py-2 px-4 rounded-full text-xs font-medium ${getStatusBadgeClasses(row.Status)}`}>
                  {row.Status}
                </span>
              </div>
              <div className="px-4 flex justify-center gap-4 items-center">
                <img src={refreshIcon} alt="refresh" className="w-5 h-5 opacity-80 cursor-pointer" />
                <img src={downloadIcon} alt="download" className="w-5 h-5 opacity-80 cursor-pointer" />
                <img src={shareIcon} alt="share" className="w-5 h-5 opacity-80 cursor-pointer" />
                <img src={deleteIcon} alt="delete" className="w-5 h-5 opacity-80 cursor-pointer" />
              </div>
            </div>
          ))
        )}

        {!loading && currentTableData.length === 0 && (
          <div className="py-8 text-center text-sm text-gray-500">No prescriptions found.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-4 mt-6 mb-6">
        <button onClick={goPrev} disabled={currentPage === 1} className="text-sm text-[#145A2B] px-2 py-1 hover:underline disabled:opacity-30">Previous</button>
        <nav className="flex items-center gap-2">
          {paginationItems().map((p, i) => (
            <button key={i} onClick={() => goToPage(p)} className={`text-sm px-2 py-1 rounded-md ${currentPage === p ? "bg-[#145A2B] text-white" : "text-[#115D29]"}`}>
              {p}
            </button>
          ))}
        </nav>
        <button onClick={goNext} disabled={currentPage === totalPages} className="text-sm text-[#145A2B] px-2 py-1 hover:underline disabled:opacity-30">Next</button>
      </div>

      {showManualPopup && (
        <div className="fixed inset-0 z-[9999] bg-white overflow-auto scrollbar-hide" role="dialog" aria-modal="true">
          <div className="p-6">
            <CreateManualorder onClose={closeManualPopup} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionPage;