import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";

// Summary card icons
import totalIcon from "../../../../assets/DistributorPage/total.png";
import deliveredIcon from "../../../../assets/DistributorPage/delivered.png";
import transitIcon from "../../../../assets/DistributorPage/intransit.png";
import placedIcon from "../../../../assets/DistributorPage/placed.png";

// Sort / toggle / search icons
import iconAZ from "../../../../assets/DistributorPage/sort-up.png";
import iconZA from "../../../../assets/DistributorPage/sort-down.png";
import searchIcon from "../../../../assets/DistributorPage/scan.png";

import autoPurchaseIcon from "../../../../assets/DistributorPage/auto-purchase-icon.png";

// NEW popup screens
import PlaceOrderScreen from "./PlaceOrderScreen";
import AutoPurchaseOrders from "./AutoPurchaseOrders";

const BASE_URL = import.meta.env.VITE_API_BASE || "/api";
const FR_TEMPLATE = "0.8fr 1.7fr 0.6fr 0.9fr 1fr 1fr 0.9fr 0.9fr";

const DistributorOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [summaryData, setSummaryData] = useState({
    total: 0,
    delivered: 0,
    pending: 0,
    processing: 0,
  });

  const [sortToggle, setSortToggle] = useState(false);
  const [, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    delivered: false,
    inTransit: false,
    placed: false,
  });
  const [searchText, setSearchText] = useState("");

  // Fullscreen popups
  const [showOrderScreen, setShowOrderScreen] = useState(false);
  const [showAutoPurchaseScreen, setShowAutoPurchaseScreen] = useState(false);

  // Fetch data from API
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/retailer/1/orders`);
      const data = response.data;
      setOrders(data.Orders || []);
      setSummaryData({
        total: data.TotalOrders,
        delivered: data.Delivered,
        pending: data.Pending,
        processing: data.Processing,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFilterChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    setCurrentPage(1);
  };

  const visibleOrders = useMemo(() => {
    const active = [];
    if (filters.delivered) active.push("Delivered");
    if (filters.inTransit) active.push("Pending"); // API Pending mapped to In Transit
    if (filters.placed) active.push("Processing"); // API Processing mapped to Placed

    const q = searchText.trim().toLowerCase();

    let list = orders.filter((o) => {
      if (active.length > 0 && !active.includes(o.Status)) return false;
      if (!q) return true;
      return (
        String(o.OrderId).toLowerCase().includes(q) ||
        o.DistributorName.toLowerCase().includes(q)
      );
    });

    list.sort((a, b) => {
      const cmp = a.DistributorName.localeCompare(b.DistributorName);
      return sortToggle ? -cmp : cmp;
    });

    return list;
  }, [orders, filters, searchText, sortToggle]);

  const statusBadge = (status) => {
    const base = "inline-block w-28 text-center rounded-full text-sm px-2 py-1";
    // Mapping: Processing -> Placed
    if (status === "Processing")
      return <span className={`${base} bg-blue-50 text-blue-600`}>Placed</span>;
    // Mapping: Pending -> In Transit
    if (status === "Pending")
      return (
        <span className={`${base} bg-amber-50 text-amber-700`}>In Transit</span>
      );
    if (status === "Delivered")
      return (
        <span className={`${base} bg-emerald-50 text-emerald-700`}>
          Delivered
        </span>
      );
    return <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>;
  };

  return (
    <div className="px-6 py-8 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-green-700">
            Distributor Orders
          </h1>
          <p className="text-gray-600 text-[17px] mt-3">
            Place and track purchase orders with distributors
          </p>
        </div>

        <button
          onClick={() => setShowOrderScreen(true)}
          className="flex items-center gap-2 bg-[#2874BA] hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm"
        >
          <span className="text-lg">+</span>
          Place an Order
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-5 mt-10">
        <div className="border border-[#B5CDBD] rounded-md p-5 flex justify-between items-start">
          <div>
            <p className="text-green-800 font-medium">Total Orders</p>
            <p className="text-xl text-green-800 font-medium mt-4">
              {summaryData.total}
            </p>
          </div>
          <img src={totalIcon} className="w-10 h-10" />
        </div>

        <div className="border border-[#B5CDBD] rounded-md p-5 flex justify-between items-start">
          <div>
            <p className="text-[#115D29] font-medium">Delivered</p>
            <p className="text-xl text-[#115D29] font-medium mt-4">
              {summaryData.delivered}
            </p>
          </div>
          <img src={deliveredIcon} className="w-10 h-10" />
        </div>

        <div className="border border-[#B5CDBD] rounded-md p-5 flex justify-between items-start">
          <div>
            <p className="text-[#115D29] font-medium">In Transit</p>
            <p className="text-xl text-[#115D29] font-medium mt-4">
              {summaryData.pending}
            </p>
          </div>
          <img src={transitIcon} className="w-10 h-10" />
        </div>

        <div className="border border-[#B5CDBD] rounded-md p-5 flex justify-between items-start">
          <div>
            <p className="text-[#115D29] font-medium">Placed</p>
            <p className="text-xl text-[#115D29] font-medium mt-4">
              {summaryData.processing}
            </p>
          </div>
          <img src={placedIcon} className="w-10 h-10" />
        </div>
      </div>

      {/* Filters + Sort + Search */}
      <div className="w-full flex flex-col xl:flex-row items-center gap-4 bg-[#F7F9F7] p-4 rounded-xl border border-[#D4E5D9] mb-10 mt-10">
        {/* Sort */}
        <div className="flex items-center gap-3 border border-[#B5CDBD] rounded-xl px-4 py-2">
          <img src={iconAZ} className="w-5 h-5" />

          <div
            onClick={() => {
              setSortToggle(!sortToggle);
              setCurrentPage(1);
            }}
            className="w-12 h-6 bg-gray-200 rounded-full flex items-center px-1 cursor-pointer"
          >
            <div
              className={`w-5 h-5 rounded-full transform transition-all ${
                sortToggle ? "translate-x-6 bg-green-600" : "bg-green-600"
              }`}
            />
          </div>

          <img src={iconZA} className="w-5 h-5" />
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-4 border border-[#B5CDBD] rounded-xl px-6 py-2 text-[#115D29]">
          <span className="text-sm font-medium">Filter by :</span>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={filters.delivered}
              onChange={() => handleFilterChange("delivered")}
              className="w-4 h-4 border border-[#115D29] rounded accent-green-600"
            />
            Delivered
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inTransit}
              onChange={() => handleFilterChange("inTransit")}
              className="w-4 h-4 border border-[#115D29] rounded accent-green-600"
            />
            In Transit
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={filters.placed}
              onChange={() => handleFilterChange("placed")}
              className="w-4 h-4 border border-[#115D29] rounded accent-green-600"
            />
            Placed
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
          <img src={searchIcon} className="w-6 h-6 opacity-80 cursor-pointer" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="w-full overflow-x-auto">
        <div
          className="mx-auto"
          style={{
            border: "1px solid #B5CDBD",
            borderRadius: 8,
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          {/* Header */}
          <div
            className="text-sm border rounded-md font-semibold text-center"
            style={{
              backgroundColor: "#115D29",
              color: "white",
              padding: "22px 16px",
              display: "grid",
              gridTemplateColumns: FR_TEMPLATE,
              alignItems: "center",
            }}
          >
            <div>PO Number</div>
            <div>Distributor</div>
            <div>Items</div>
            <div>Amount</div>
            <div>Order Date</div>
            <div>Expected Delivery</div>
            <div>Actions</div>
            <div>Status</div>
          </div>

          {/* Rows */}
          <div className="bg-white">
            {visibleOrders.map((o, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: FR_TEMPLATE,
                  alignItems: "center",
                }}
                className="px-6 py-6 border-b border-gray-200 last:border-b-0"
              >
                <div className="text-[#115D29] text-left pl-4">PO-{o.OrderId}</div>
                <div className="text-[#115D29] text-center">
                  {o.DistributorName}
                </div>
                <div className="text-center text-[#115D29]">{o.ItemsCount}</div>
                <div className="text-center text-[#115D29]">₹{o.Amount}</div>
                <div className="text-center text-[#115D29]">
                    {o.OrderDate?.split('T')[0]}
                </div>
                <div className="text-center text-[#115D29]">
                    {o.ExpectedDelivery?.split('T')[0]}
                </div>
                <div className="text-center p-2 text-[#115D29]">
                  <button className="text-[#115D29] text-sm">View</button>
                  <span className="mx-1 text-[#9FB8A7]">,</span>
                  <button className="text-[#115D29] text-sm">Track</button>
                </div>
                <div className="flex justify-center">
                  {statusBadge(o.Status)}
                </div>
              </div>
            ))}

            {visibleOrders.length === 0 && (
              <div className="px-6 py-12 text-center text-[#9FB8A7]">
                No orders match your filters / search.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Out-of-stock alert banner */}
      <div className="mt-6">
        <div
          className="w-full rounded-lg p-4 flex items-center justify-between border border-red-200"
          style={{ backgroundColor: "#fff7f7" }}
        >
          <div className="flex items-start gap-4">
            <p className="text-red-600 text-sm leading-6">
              5 medicines are currently out of stock. You can enable Auto
              Purchase or manually restock now.
            </p>
          </div>

          <button
            onClick={() => setShowAutoPurchaseScreen(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-3 rounded-md shadow-sm"
          >
            <img src={autoPurchaseIcon} className="w-6 h-6" />
            <span>Auto Purchase Now</span>
          </button>
        </div>
      </div>

      {/* Fullscreen popup screens */}
      {showOrderScreen && (
        <PlaceOrderScreen onClose={() => setShowOrderScreen(false)} />
      )}

      {showAutoPurchaseScreen && (
        <AutoPurchaseOrders onClose={() => setShowAutoPurchaseScreen(false)} />
      )}
    </div>
  );
};

export default DistributorOrderPage;