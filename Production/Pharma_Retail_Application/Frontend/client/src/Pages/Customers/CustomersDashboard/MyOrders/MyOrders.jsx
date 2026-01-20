import React, { useMemo, useState } from "react";

// Summary card icons
import totalIcon from "../../../../assets/Customers/MyOrders/totalorders-icon.png";
import deliveredIcon from "../../../../assets/Customers/MyOrders/delivered.png";
import transitIcon from "../../../../assets/Customers/MyOrders/processing.png";
import placedIcon from "../../../../assets/Customers/MyOrders/pending.png";

// Sort / toggle / search icons
import iconAZ from "../../../../assets/DistributorPage/sort-up.png";
import iconZA from "../../../../assets/DistributorPage/sort-down.png";
import searchIcon from "../../../../assets/DistributorPage/scan.png";

// Data as per image
const initialOrders = [
  {
    po: "ORD-001",
    distributor: "Rajesh Kumar",
    contact: "+91 98765 43210",
    items: 5,
    amount: "₹850",
    orderDate: "2025-01-15",
    orderdetails: "View",
    status: "Pending",
  },
  {
    po: "ORD-002",
    distributor: "Priya Sharma",
    contact: "+91 98765 43211",
    items: 3,
    amount: "₹620",
    orderDate: "2025-01-15",
    orderdetails: "View",
    status: "Delivered",
  },
  {
    po: "ORD-003",
    distributor: "Amit Patel",
    contact: "+91 98765 43212",
    items: 8,
    amount: "₹1,240",
    orderDate: "2025-01-14",
    orderdetails: "View",
    status: "Processing",
  },
  {
    po: "ORD-004",
    distributor: "Sneha Reddy",
    contact: "+91 98765 43213",
    items: 2,
    amount: "₹340",
    orderDate: "2025-01-14",
    orderdetails: "View",
    status: "Delivered",
  },
  {
    po: "ORD-005",
    distributor: "Vikram Singh",
    contact: "+91 98765 43214",
    items: 6,
    amount: "₹980",
    orderDate: "2025-01-13",
    orderdetails: "View",
    status: "Processing",
  },
];

// Perfect alignment based on your screenshot
const FR_TEMPLATE =
  "1fr 1.7fr 1.8fr 0.7fr 0.9fr 1.3fr 1fr 1fr";

const MyOrders = () => {
  const [orders] = useState(initialOrders);
  const [sortToggle, setSortToggle] = useState(false);
  const [, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    delivered: false,
    inTransit: false,
    placed: false,
  });

  const [searchText, setSearchText] = useState("");

  const handleFilterChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    setCurrentPage(1);
  };

  const statusBadge = (status) => {
    const base = "inline-block w-28 text-center rounded-full text-sm px-2 py-1";

    if (status === "Pending")
      return <span className={`${base} bg-red-100 text-red-600`}>Pending</span>;

    if (status === "Delivered")
      return (
        <span className={`${base} bg-emerald-50 text-emerald-700`}>
          Delivered
        </span>
      );

    if (status === "Processing")
      return (
        <span className={`${base} bg-blue-50 text-blue-600`}>Processing</span>
      );
  };

  const visibleOrders = useMemo(() => {
    let list = [...orders];

    const q = searchText.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          o.po.toLowerCase().includes(q) ||
          o.distributor.toLowerCase().includes(q)
      );
    }

    const active = [];
    if (filters.delivered) active.push("Delivered");
    if (filters.inTransit) active.push("Processing");
    if (filters.placed) active.push("Pending");

    if (active.length > 0) {
      list = list.filter((o) => active.includes(o.status));
    }

    list.sort((a, b) => {
      const cmp = a.distributor.localeCompare(b.distributor);
      return sortToggle ? -cmp : cmp;
    });

    return list;
  }, [orders, searchText, filters, sortToggle]);

  return (
    <div className="px-6 py-8 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-green-700">My Orders</h1>
          <p className="text-gray-600 text-[17px] mt-3">
            Manage your orders here
          </p>
        </div>
      </div>
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-5 mt-10">
        <div className="border border-[#B5CDBD] rounded-md p-5 flex justify-between">
          <div>
            <p className="text-green-800 font-medium">Total Orders</p>
            <p className="text-xl text-green-800 font-medium mt-4">5</p>
          </div>
          <img src={totalIcon} className="w-10 h-10" />
        </div>

        <div className="border border-[#B5CDBD] rounded-md p-5 flex justify-between">
          <div>
            <p className="text-[#115D29] font-medium">Delivered</p>
            <p className="text-xl text-[#115D29] font-medium mt-4">2</p>
          </div>
          <img src={deliveredIcon} className="w-10 h-10" />
        </div>

        <div className="border border-[#B5CDBD] rounded-md p-5 flex justify-between">
          <div>
            <p className="text-[#115D29] font-medium">Processing</p>
            <p className="text-xl text-[#115D29] font-medium mt-4">2</p>
          </div>
          <img src={transitIcon} className="w-10 h-10" />
        </div>

        <div className="border border-[#B5CDBD] rounded-md p-5 flex justify-between">
          <div>
            <p className="text-[#115D29] font-medium">Pending</p>
            <p className="text-xl text-[#115D29] font-medium mt-4">1</p>
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

        {/* Filters */}
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
            Processing
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={filters.placed}
              onChange={() => handleFilterChange("placed")}
              className="w-4 h-4 border border-[#115D29] rounded accent-green-600"
            />
            Pending
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
          {/* TABLE HEADER */}
          <div
            className="text-sm font-semibold"
            style={{
              backgroundColor: "#115D29",
              color: "white",
              padding: "22px 16px",
              display: "grid",
              gridTemplateColumns: FR_TEMPLATE,
              alignItems: "center",
              fontFamily: "Roboto",
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "36px",
            }}
          >
            <div style={{ textAlign: "center" }}>Order ID</div>
            <div style={{ textAlign: "center" }}>Retailer</div>
            <div style={{ textAlign: "center" }}>Contact</div>
            <div style={{ textAlign: "center" }}>Items</div>
            <div style={{ textAlign: "center" }}>Amount</div>
            <div style={{ textAlign: "center" }}>Order Date</div>
            <div style={{ textAlign: "center" }}>Order Details</div>
            <div style={{ textAlign: "center" }}>Status</div>
          </div>

          {/* TABLE ROWS */}
          <div className="bg-white">
            {visibleOrders.map((o, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: FR_TEMPLATE,
                  alignItems: "center",
                  fontFamily: "Roboto",
                }}
                className="px-6 py-6 border-b border-gray-200 last:border-b-0 text-[14px]"
              >
                <div className=" text-center text-[#115D29]">{o.po}</div>
                <div className=" text-center text-[#115D29]">
                  {o.distributor}
                </div>
                <div className=" text-center text-[#115D29]">{o.contact}</div>
                <div className="text-center text-[#115D29]">{o.items}</div>
                <div className="text-center text-[#115D29]">{o.amount}</div>
                <div className="text-center text-[#115D29]">{o.orderDate}</div>
                <div className="text-center text-[#115D29] cursor-pointer">
                  {o.orderdetails}
                </div>
                <div className="flex justify-center">
                  {statusBadge(o.status)}
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
    </div>
  );
};

export default MyOrders;
