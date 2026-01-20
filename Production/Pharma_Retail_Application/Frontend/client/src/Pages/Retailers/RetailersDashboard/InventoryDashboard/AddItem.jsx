import React, { useState } from "react";

import closeIcon from "../../../../assets/RetailersDashboard/close.png";
import scanIcon from "../../../../assets/RetailersDashboard/scan.png";

export default function AddItem({ onClose }) {
  const [status, setStatus] = useState("");

  return (
    <div
      className="w-full bg-white p-8 rounded-xl overflow-y-auto hide-scroll"
      style={{
        maxHeight: "90vh",
        scrollbarWidth: "none",           // Firefox hide
        msOverflowStyle: "none",          // IE hide
      }}
    >
      {/* ---------- HIDE SCROLLBAR FOR CHROME ---------- */}
      <style>
        {`
          .hide-scroll::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      {/* -------- TOP TITLE + CLOSE -------- */}
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-2xl font-semibold"
          style={{ color: "#115D29" }}
        >
          Add Item
        </h1>

        <img
          src={closeIcon}
          alt="close"
          className="w-6 h-6 cursor-pointer"
          onClick={onClose}
        />
      </div>

      {/* -------- QR SCAN BOX -------- */}
      <div
        className="w-full border rounded-xl p-5 mb-6 flex justify-between items-center"
        style={{ borderColor: "#97B5A4" }}
      >
        <p className="text-sm" style={{ color: "#115D29" }}>
          Scan QR code of the medicine to add it to the inventory.
        </p>

        <button
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-white"
          style={{ backgroundColor: "#2B78C6" }}
        >
          <img src={scanIcon} className="w-4 h-4" alt="scan" />
          Scan QR Code
        </button>
      </div>

      {/* -------- OR DIVIDER -------- */}
      <div className="flex items-center justify-center my-4">
        <div
          className="flex-1"
          style={{ borderTop: "1px solid #D4E5D9" }}
        ></div>
        <span className="px-4 text-sm text-gray-500">Or</span>
        <div
          className="flex-1"
          style={{ borderTop: "1px solid #D4E5D9" }}
        ></div>
      </div>

      {/* -------- ADD MANUALLY BOX -------- */}
      <div
        className="w-full border rounded-xl p-6"
        style={{ borderColor: "#97B5A4" }}
      >
        <p
          className="text-md font-semibold mb-4"
          style={{ color: "#115D29" }}
        >
          Add Manually
        </p>

        <div className="grid grid-cols-1 gap-5">

          {/* Medicine Name */}
          <div>
            <label className="block mb-1 text-sm" style={{ color: "#115D29" }}>
              Medicine Name
            </label>
            <input
              type="text"
              placeholder="Enter Medicine Name"
              className="w-full border rounded-lg px-4 py-3 text-sm outline-none"
              style={{ borderColor: "#B5CDBD" }}
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block mb-1 text-sm" style={{ color: "#115D29" }}>
              Brand
            </label>
            <input
              type="text"
              placeholder="Enter Brand Name"
              className="w-full border rounded-lg px-4 py-3 text-sm outline-none"
              style={{ borderColor: "#B5CDBD" }}
            />
          </div>

          {/* Stock + Price */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm" style={{ color: "#115D29" }}>
                Stock
              </label>
              <input
                type="number"
                placeholder="Min no."
                className="w-full border rounded-lg px-4 py-3 text-sm outline-none"
                style={{ borderColor: "#B5CDBD" }}
              />
            </div>

            <div className="mt-6">
              <input
                type="number"
                placeholder="Max no."
                className="w-full border rounded-lg px-4 py-3 text-sm outline-none"
                style={{ borderColor: "#B5CDBD" }}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm" style={{ color: "#115D29" }}>
                Price
              </label>
              <input
                type="number"
                placeholder="₹"
                className="w-full border rounded-lg px-4 py-3 text-sm outline-none"
                style={{ borderColor: "#B5CDBD" }}
              />
            </div>
          </div>

          {/* Batch + Expiry */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm" style={{ color: "#115D29" }}>
                Batch
              </label>
              <input
                type="text"
                placeholder="Enter Batch Number"
                className="w-full border rounded-lg px-4 py-3 text-sm outline-none"
                style={{ borderColor: "#B5CDBD" }}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm" style={{ color: "#115D29" }}>
                Expiry Date
              </label>
              <input
                type="date"
                className="w-full border rounded-lg px-4 py-3 text-sm outline-none"
                style={{ borderColor: "#B5CDBD" }}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: "#115D29" }}>
              Status
            </label>

            <div className="flex gap-10">
              <label className="flex items-center gap-2 cursor-pointer text-[#115D29]">
                <input
                  type="radio"
                  name="status"
                  value="In Stock"
                  checked={status === "In Stock"}
                  onChange={(e) => setStatus(e.target.value)}
                />
                In Stock
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[#115D29]">
                <input
                  type="radio"
                  name="status"
                  value="Low Stock"
                  checked={status === "Low Stock"}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Low Stock
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[#115D29]">
                <input
                  type="radio"
                  name="status"
                  value="No Stock"
                  checked={status === "No Stock"}
                  onChange={(e) => setStatus(e.target.value)}
                />
                No Stock
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button
            className="w-full py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: "#115D29" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
