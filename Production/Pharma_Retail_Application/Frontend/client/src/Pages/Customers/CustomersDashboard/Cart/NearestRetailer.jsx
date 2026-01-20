import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import backIcon from "../../../../assets/Customers/Cart/back.png";
import searchIcon from "../../../../assets/DistributorPage/scan.png";
import mapImg from "../../../../assets/Customers/Cart/map.jpg";

import tickIcon from "../../../../assets/Customers/Cart/tick-green.png";
import wrongIcon from "../../../../assets/Customers/Cart/wrong-red.png";
import timeIcon from "../../../../assets/Customers/Cart/time.png";
import distanceIcon from "../../../../assets/Customers/Cart/distance.png";
import alertIcon from "../../../../assets/Customers/Cart/alert.png";
import openIcon from "../../../../assets/Customers/Cart/open-icon.png";

import SmartSplitOrder from "./SmartSplitOrder";   // ⬅ NEW

const NearestRetailer = () => {
  const navigate = useNavigate();

  const [openNow, setOpenNow] = useState(true);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showSmartPage, setShowSmartPage] = useState(false); // ⬅ NEW

  const [filters, setFilters] = useState({
    km1: false,
    km3: false,
    km5: false,
    km10: false,
  });

  const [searchText, setSearchText] = useState("");

  const handleFilterChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const retailers = [
    {
      name: "MedPlus Pharmacy",
      est: "15 mins",
      distance: "0.8 km",
      openTime: "10:00 PM",
      available: [
        { name: "Paracetamol 500mg (10 tabs)", price: 80, available: true },
        { name: "Amoxicillin 500mg (Out of Stock)", price: 90, available: false },
        { name: "Vitamin D3 Tablets (Out of Stock)", price: 100, available: false },
      ],
      alternatives: {
        shop: "Apollo Pharmacy",
        distance: "1.2 km",
        list: [
          "Paracetamol 650mg → MedPlus (2.1 km)",
          "Amoxicillin 500mg, Vitamin D3 Tablets → Apollo Pharmacy (3.0 km)",
        ],
      },
      showAlt: true,
      buttons: ["Order Available Medicines", "Split Order"],
    },

    {
      name: "Apollo Pharmacy",
      est: "30 mins",
      distance: "1.2 km",
      openTime: "11:00 PM",
      available: [
        { name: "Paracetamol 500mg (10 tabs)", price: 80, available: true },
        { name: "Amoxicillin 500mg (10 tabs)", price: 90, available: true },
        { name: "Vitamin D3 Tablets (10 tabs)", price: 100, available: true },
      ],
      showAlt: false,
      buttons: ["Order Medicines", "Edit Order"],
    },
  ];

  return (
    <div className="px-6 py-8 bg-white w-full">

      {/* -------------------- */}
      {/* FORWARD PAGE OVERLAY */}
      {/* -------------------- */}
      {showSmartPage && ( // ⬅ NEW
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <SmartSplitOrder />  {/* ⬅ NEW */}
        </div>
      )}

      {/* BACK BUTTON */}
      <div
        className="flex items-center gap-2 text-[#115D29] mb-4 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <img src={backIcon} className="w-4 h-4" />
        <span className="font-medium">Back</span>
      </div>

      {/* HEADING */}
      <h1 className="text-xl font-semibold text-green-700">Nearest Retailer</h1>
      <p className="text-gray-600 text-[15px] mt-1">
        Find nearby pharmacies with your medicines in stock
      </p>

     {/* MAIN FILTER BAR */}
<div className="w-full mt-8 border border-[#B5CDBD] rounded-[8px] bg-[#F7F9F7] px-8 py-4">
  
  <div className="flex flex-wrap items-center gap-4">

    <div
      className="flex items-center gap-3 border border-[#B5CDBD] rounded-[8px] px-4 py-2 bg-white flex-none"
      style={{ minWidth: "170px", height: "48px" }}
    >
      <span className="text-[#115D29] text-sm font-medium">Open Now</span>
      <div
        onClick={() => setOpenNow(!openNow)}
        className="w-10 h-5 bg-gray-200 rounded-full flex items-center px-[2px] cursor-pointer"
      >
        <div
          className={`w-4 h-4 rounded-full transition-all ${
            openNow ? "translate-x-5 bg-[#2874BA]" : "bg-[#9FB8A7]"
          }`}
        />
      </div>
    </div>

    {/* DISTANCE FILTERS - allow to stay a block but be flexible (won't overflow on wide screens) */}
    <div
      className="flex items-center gap-4 border border-[#B5CDBD] rounded-[8px] px-6 py-2 bg-white text-[#115D29]"
      style={{ height: "48px", minWidth: "260px" }}
    >
      <span className="text-sm font-medium">Filter by :</span>

      {[
        { key: "km1", label: "1 km" },
        { key: "km3", label: "3 km" },
        { key: "km5", label: "5 km" },
        { key: "km10", label: "10 km" },
      ].map((item) => (
        <label key={item.key} className="flex items-center gap-2 text-sm whitespace-nowrap">
          <input
            type="checkbox"
            checked={filters[item.key]}
            onChange={() => handleFilterChange(item.key)}
            className="w-4 h-4 accent-[#115D29]"
          />
          {item.label}
        </label>
      ))}
    </div>

    {/* SEARCH - flexible: grows to take remaining space on large screens,
                but has a sensible min width so it wraps nicely on small screens */}
    <div
      className="flex items-center justify-between border border-[#B5CDBD] rounded-[8px] px-4 py-2 bg-white flex-1"
      style={{ minWidth: "320px", height: "48px", maxWidth: "1000px" }}
    >
      <input
        type="text"
        placeholder="Search retailer or medicine name..."
        className="w-full outline-none text-sm text-[#115D29]"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <img src={searchIcon} className="w-6 h-6 opacity-80 cursor-pointer" />
    </div>

  </div>
</div>

      {/* MAP */}
      <div className="mt-6">
        <img
          src={mapImg}
          alt="Map"
          style={{
            height: "426px",
            borderRadius: "8px",
            padding: "8px",
          }}
          className="object-cover w-full"
        />
      </div>

      {/* DELIVERY MODE */}
      <div
        className="mt-6 flex items-center gap-9"
        style={{
          padding: "36px",
          borderRadius: "8px",
          border: "1px solid #B5CDBD",
          background:
            "linear-gradient(102.45deg, #EFF7FF 5.75%, #FFFFFF 30.68%, #EFF7FF 78.28%, #FFFFFF 88.23%)",
        }}
      >
        <span className="text-[#115D29] font-semibold text-sm">
          Choose Delivery Mode:
        </span>

        <label className="flex items-center gap-2 text-[#115D29] text-sm">
          <input type="radio" name="mode" /> Pickup
        </label>

        <label className="flex items-center gap-2 text-[#115D29] text-sm">
          <input type="radio" name="mode" /> Door Delivery
        </label>
      </div>

      {/* RETAILERS LIST */}
      <div
        className="mt-8 w-full border border-[#B5CDBD] rounded-[8px]"
        style={{ padding: "36px" }}
      >
        <p className="text-[#115D29] font-semibold mb-6 text-lg">
          {retailers.length} Retailers Found
        </p>

        {retailers.map((retailer, index) => (
          <div
            key={index}
            className="border border-[#B5CDBD] rounded-[8px] p-4 mb-8"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#115D29] font-semibold text-lg">{retailer.name}</p>

                <div className="flex gap-6 mt-2 text-sm text-[#115D29]">
                  <span className="flex items-center gap-2">
                    <img src={timeIcon} className="w-4 h-4" /> Est. Delivery:{" "}
                    {retailer.est}
                  </span>

                  <span className="flex items-center gap-2">
                    <img src={distanceIcon} className="w-4 h-4" /> Distance:{" "}
                    {retailer.distance}
                  </span>
                </div>
              </div>

              {/* FIXED BADGE SIZE */}
              <div className="flex items-center gap-2 bg-[#30B130] text-white px-3 py-1 rounded-full text-sm">
                <img src={openIcon} className="w-4 h-4" /> Open till{" "}
                {retailer.openTime}
              </div>
            </div>

            {/* AVAILABLE MEDICINES */}
            <div className="border border-[#B5CDBD] rounded-[8px] p-4 mt-4">
              <p className="text-[#115D29] font-medium mb-3 text-sm">
                {retailer.available.filter((a) => a.available).length} out of{" "}
                {retailer.available.length} medicines available:
              </p>

              <div className="space-y-2 text-sm">
                {retailer.available.map((m, i) => (
                  <p
                    key={i}
                    className={`flex justify-between items-center ${
                      m.available ? "text-[#115D29]" : "text-[#C94A4A]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <img
                        src={m.available ? tickIcon : wrongIcon}
                        className="w-4 h-4"
                      />
                      {m.name}
                    </span>
                    ₹{m.price}
                  </p>
                ))}
              </div>
            </div>

            {/* ALTERNATIVE BOX */}
            {retailer.showAlt && (
              <div className="border border-[#F5B7B7] bg-[#FFF1F1] rounded-[8px] p-4 mt-4">
                <div className="flex items-center gap-2 text-[#C94A4A] font-medium text-sm">
                  <img src={alertIcon} className="w-5 h-5" />
                  Alternative available at{" "}
                  <span className="font-semibold text-[#115D29]">
                    {retailer.alternatives.shop}
                  </span>{" "}
                  ({retailer.alternatives.distance} away)
                </div>

                <div className="mt-3 text-sm text-[#115D29] space-y-2">
                  {retailer.alternatives.list.map((l, i) => (
                    <p key={i}>
                      {i + 1}. {l}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex gap-4 mt-4">
              <button className="w-full bg-[#115D29] text-white py-3 rounded-[6px] text-sm font-semibold">
                {retailer.buttons[0]}
              </button>

              <button
                className="w-full border border-[#115D29] text-[#115D29] py-3 rounded-[6px] text-sm font-semibold bg-white"
                onClick={() => retailer.buttons[1] === "Split Order" && setShowSplitModal(true)}
              >
                {retailer.buttons[1]}
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* -------------------------------------- */}
      {/* SPLIT ORDER POPUP OVERLAY */}
      {/* -------------------------------------- */}
      {showSplitModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">

          {/* OUTER BOX */}
          <div
            className="bg-white rounded-[8px] border border-[#B5CDBD] shadow-lg animate-[fadeScale_0.2s_ease]"
            style={{
              width: "586px",
              padding: "36px",
            }}
          >
            <h2 className="text-[#115D29] font-semibold text-xl mb-4">
              Split Order
            </h2>

            <div
              className="rounded-[8px] border border-[#E7EFEA] bg-white"
              style={{
                width: "514px",
                padding: "24px",
              }}
            >
              <p className="text-[#C94A4A] font-semibold text-sm justify-center flex mb-2">
                MedPlus Pharmacy retailer has only 1 of your medicines.
              </p>

              <p className="text-[#115D29] text-sm justify-center flex mb-4">
                We’ll split your order into 2 for fastest fulfillment.
              </p>

              <div
                className="bg-[#F7F9F7] rounded-[8px] border border-[#E7EFEA] p-4"
              >
                <p className="text-[#115D29] text-sm mb-3">
                  1. Paracetamol 650mg → <span className="font-semibold">MedPlus</span> (2.1 km)
                </p>

                <p className="text-[#115D29] text-sm">
                  2. Amoxicillin 500mg, Vitamin D3 Tablets →
                  <span className="font-semibold"> Apollo Pharmacy</span> (3.0 km)
                </p>
              </div>

              {/* ------- BUTTONS -------- */}
              <div className="flex gap-4 mt-6">
                <button
                  className="w-full bg-[#115D29] text-white py-3 rounded-[6px] text-sm font-semibold"
                  onClick={() => {
                    setShowSplitModal(false);
                    setShowSmartPage(true);  // ⬅ NEW
                  }}
                >
                  Accept Smart Split Order
                </button>

                <button
                  onClick={() => setShowSplitModal(false)}
                  className="w-full border border-[#115D29] text-[#115D29] py-3 rounded-[6px] text-sm font-semibold bg-white"
                >
                  Edit Order
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes fadeScale {
              0% { opacity: 0; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default NearestRetailer;
