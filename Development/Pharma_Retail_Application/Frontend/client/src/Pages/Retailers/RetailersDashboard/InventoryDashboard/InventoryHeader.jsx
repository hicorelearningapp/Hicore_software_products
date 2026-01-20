import React, { useState, useMemo } from "react";

import addItemIcon from "../../../../assets/RetailersDashboard/addItem.png";
import aiIcon from "../../../../assets/RetailersDashboard/aiRestock.png";
import iconTotal from "../../../../assets/RetailersDashboard/total.png";
import iconInStock from "../../../../assets/RetailersDashboard/instock.png";
import iconLow from "../../../../assets/RetailersDashboard/low.png";
import iconNo from "../../../../assets/RetailersDashboard/nostock.png";
import iconAZ from "../../../../assets/RetailersDashboard/az.png";
import iconZA from "../../../../assets/RetailersDashboard/za.png";
import searchIcon from "../../../../assets/RetailersDashboard/search.png";

import AddItemModal from "./AddItemModal";

export default function InventoryHeader() {
  const [sortToggle, setSortToggle] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const ITEMS_PER_PAGE = 5;

  const [filters, setFilters] = useState({
    inStock: false,
    lowStock: false,
    noStock: false,
  });

  const handleFilterChange = (key) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const stats = [
    { title: "Total Items", value: "1500", icon: iconTotal, bg: "#628EB7" },
    { title: "In Stock Items", value: "1489", icon: iconInStock, bg: "#69CE3A" },
    { title: "Low Stock Items", value: "8", icon: iconLow, bg: "#AF840D" },
    { title: "No Stock Items", value: "3", icon: iconNo, bg: "#DF5C5C" },
  ];

  const tableData = [
    {
      name: "Paracetamol 500mg",
      brand: "Dolo",
      stock: 150,
      price: "₹5.50",
      batch: "BT001",
      expiry: "2025-12-15",
      status: "In Stock",
      statusColor: "#D7F4D8",
      textColor: "#2F7A36",
    },
    {
      name: "Amoxicillin 250mg",
      brand: "Novamox",
      stock: 8,
      price: "₹12.00",
      batch: "BT002",
      expiry: "2025-08-20",
      status: "Low Stock",
      statusColor: "#FAEED0",
      textColor: "#AF840D",
    },
    {
      name: "Cetrizine 10mg",
      brand: "Alerid",
      stock: 220,
      price: "₹3.20",
      batch: "BT003",
      expiry: "2026-01-10",
      status: "In Stock",
      statusColor: "#D7F4D8",
      textColor: "#2F7A36",
    },
    {
      name: "Azithromycin 500mg",
      brand: "Azee",
      stock: 45,
      price: "₹18.50",
      batch: "BT004",
      expiry: "2025-09-05",
      status: "In Stock",
      statusColor: "#D7F4D8",
      textColor: "#2F7A36",
    },
    {
      name: "Omeprazole 20mg",
      brand: "Omez",
      stock: 0,
      price: "₹6.80",
      batch: "BT005",
      expiry: "2025-07-15",
      status: "No Stock",
      statusColor: "#F8D6D6",
      textColor: "#D12B2B",
    },
  ];

  // ----------------- LOGIC -----------------
  const processedData = useMemo(() => {
    let data = [...tableData];

    data.sort((a, b) =>
      sortToggle ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

    const activeFilters = [];
    if (filters.inStock) activeFilters.push("In Stock");
    if (filters.lowStock) activeFilters.push("Low Stock");
    if (filters.noStock) activeFilters.push("No Stock");

    if (activeFilters.length > 0) {
      data = data.filter((item) => activeFilters.includes(item.status));
    }

    if (searchText.trim() !== "") {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return data;
  }, [sortToggle, filters, searchText]);

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);

  const paginatedData = processedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const generatePageNumbers = () => {
    if (totalPages <= 5) return [...Array(totalPages)].map((_, i) => i + 1);

    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];

    if (currentPage >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  // ----------------- UI -----------------
  return (
    <div
      className="w-full px-4 sm:px-6 py-6"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      {/* Make inputs/selectable items override */}
      <style>{`
        input, textarea, button, select, [contenteditable="true"] {
          user-select: text !important;
          -webkit-user-select: text !important;
        }
      `}</style>

      {/* AddItem POPUP modal */}
      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} />}

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-9 gap-4">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#115D29" }}>
            Inventory Management
          </h1>
          <p className="text-sm mt-1" style={{ color: "#115D29" }}>
            Inventory Management
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            className="flex items-center gap-2 bg-[#2B78C6] text-white px-4 py-2 rounded-lg"
            onClick={() => setShowAddModal(true)}
          >
            <img src={addItemIcon} className="w-4 h-4" alt="add" />
            Add Item
          </button>

          <button className="flex items-center gap-2 bg-[#DF4C4C] text-white px-4 py-2 rounded-lg">
            <img src={aiIcon} className="w-4 h-4" alt="ai" />
            Auto Restock Using AI
          </button>
        </div>
      </div>

      {/* STAT cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s, index) => (
          <div
            key={index}
            className="relative w-full h-[120px] border border-[#B5CDBD] rounded-lg p-4"
          >
            <p className="absolute top-4 left-4" style={{ color: "#115D29", fontSize: 16 }}>
              {s.title}
            </p>

            <p className="absolute left-4 bottom-3 font-semibold" style={{ color: "#115D29", fontSize: 20 }}>
              {s.value}
            </p>

            <div
              className="absolute top-3 right-3 w-[40px] h-[40px] p-2 rounded-md flex items-center justify-center"
              style={{ backgroundColor: s.bg }}
            >
              <img src={s.icon} className="w-5 h-5" alt="" />
            </div>
          </div>
        ))}
      </div>

      {/* SORT FILTER SEARCH */}
      <div className="w-full flex flex-col xl:flex-row items-center gap-4 bg-[#F7F9F7] p-4 rounded-xl border border-[#D4E5D9] mb-10">

        {/* Sort */}
        <div className="flex items-center gap-3 border border-[#B5CDBD] rounded-xl px-4 py-2">
          <img src={iconAZ} alt="A-Z" className="w-5 h-5" />

          <div
            onClick={() => {
              setSortToggle(!sortToggle);
              setCurrentPage(1);
            }}
            className="w-12 h-6 bg-gray-200 rounded-full flex items-center px-1 cursor-pointer"
          >
            <div
              className={`w-5 h-5 rounded-full transition-all ${
                sortToggle ? "translate-x-6 bg-green-600" : "bg-green-600"
              }`}
            ></div>
          </div>

          <img src={iconZA} alt="Z-A" className="w-5 h-5" />
        </div>

        {/* Filter */}
        <div className="flex flex-wrap items-center gap-4 border border-[#B5CDBD] rounded-xl px-6 py-2 text-[#115D29]">
          <span className="text-sm font-medium">Filter by :</span>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={() => handleFilterChange("inStock")}
              className="w-4 h-4 border border-[#115D29] rounded accent-green-600"
            />
            In Stock
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={filters.lowStock}
              onChange={() => handleFilterChange("lowStock")}
              className="w-4 h-4 border border-[#115D29] rounded accent-green-600"
            />
            Low Stock
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={filters.noStock}
              onChange={() => handleFilterChange("noStock")}
              className="w-4 h-4 border border-[#115D29] rounded accent-green-600"
            />
            No Stock
          </label>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between flex-1 border border-[#B5CDBD] rounded-xl px-4 py-2 w-full xl:w-auto">
          <input
            type="text"
            placeholder="Search your medicines by name or scan barcode..."
            className="w-full outline-none text-sm text-[#115D29] placeholder-[#9FB8A7]"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
          <img src={searchIcon} alt="search" className="w-6 h-6 opacity-80 cursor-pointer" />
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[900px] mx-auto" style={{ border: "1px solid #B5CDBD", borderRadius: "8px" }}>

          <div
            className="grid grid-cols-7 text-sm font-semibold text-center"
            style={{ backgroundColor: "#115D29", color: "white", padding: "20px 16px", borderBottom: "1px solid #B5CDBD" }}
          >
            <p>Medicine Name</p>
            <p>Brand</p>
            <p>Stock</p>
            <p>Price</p>
            <p>Batch</p>
            <p>Expiry Date</p>
            <p>Status</p>
          </div>

          {paginatedData.length === 0 ? (
            <div className="w-full text-center py-6 text-[#115D29] font-medium">No medicines found</div>
          ) : (
            paginatedData.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-7 text-sm border-b border-[#B5CDBD]"
                style={{ padding: "20px 16px", background: "#FFFFFF" }}
              >
                <p className="flex items-center text-left">{row.name}</p>
                <p className="flex items-center justify-center">{row.brand}</p>
                <p className="flex items-center justify-center">{row.stock}</p>
                <p className="flex items-center justify-center">{row.price}</p>
                <p className="flex items-center justify-center">{row.batch}</p>
                <p className="flex items-center justify-center">{row.expiry}</p>

                <p className="flex justify-center items-center">
                  <span
                    className="rounded-full text-xs flex items-center justify-center"
                    style={{
                      width: "155px",
                      height: "40px",
                      backgroundColor: row.statusColor,
                      color: row.textColor,
                    }}
                  >
                    {row.status}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="w-full flex flex-wrap justify-end items-center gap-4 mt-5">
        <button className="text-sm" onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
          Previous
        </button>

        {generatePageNumbers().map((num, idx) => (
          <button
            key={idx}
            className={`text-sm ${num === currentPage ? "px-3 py-1 rounded-md bg-[#115D29] text-white" : ""}`}
            onClick={() => typeof num === "number" && setCurrentPage(num)}
            disabled={num === "..."}
          >
            {num}
          </button>
        ))}

        <button className="text-sm" onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
