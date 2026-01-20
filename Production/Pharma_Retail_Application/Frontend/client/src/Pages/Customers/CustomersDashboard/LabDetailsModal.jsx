// src/.../LabDetailsModal.jsx
import React, { useEffect, useState } from "react";
import backIcon from "../../../assets/Customers/SearchLabs/back.png";
import locationIcon from "../../../assets/Customers/SearchLabs/location.png";
import clockIcon from "../../../assets/Customers/SearchLabs/clock.png";
import phoneIcon from "../../../assets/Customers/SearchLabs/phone.png";
import searchIcon from "../../../assets/Customers/SearchLabs/search.png";
import labLogoPlaceholder from "../../../assets/Customers/SearchLabs/icon.png";
import bloodIcon from "../../../assets/Customers/SearchLabs/blood.png";
import aiIcon from "../../../assets/Customers/SearchLabs/AI-icon.png";
import uploadIcon from "../../../assets/Customers/SearchLabs/upload.png";

// NEW: import full-screen AddToCart overlay
import AddToCartFullScreen from "./AddToCartFullScreen";

const LabDetailsModal = ({ open, lab, onClose }) => {
  if (!open || !lab) return null;

  // NEW: state to control Add-to-cart full screen popup
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItem, setCartItem] = useState(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const primaryBlue = "#2874BA";
  const greenText = "#115D29";
  const borderGreen = "#C7DACF";

  /** Static Test List – same as image **/
  const testList = [
    {
      name: "CBC (Complete Blood Count)",
      prep: "Fasting Not Required",
      price: "₹350",
    },
    {
      name: "ESR (Erythrocyte Sedimentation Rate)",
      prep: "12-Hour Fasting",
      price: "₹600",
    },
    { name: "Hemoglobin Test", prep: "Fasting Not Required", price: "₹600" },
    {
      name: "Blood Sugar (Fasting / Postprandial / Random)",
      prep: "12-Hour Fasting",
      price: "₹600",
    },
    { name: "Lipid Profile", prep: "12-Hour Fasting", price: "₹600" },
    {
      name: "Liver Function Test (LFT)",
      prep: "12-Hour Fasting",
      price: "₹600",
    },
    {
      name: "Kidney Function Test (KFT)",
      prep: "12-Hour Fasting",
      price: "₹600",
    },
    {
      name: "Thyroid Profile (T3, T4, TSH)",
      prep: "Fasting Not Required",
      price: "₹450",
    },
  ];

  // NEW: open the full-screen cart for a specific item
  const openCartFor = (item) => {
    setCartItem(item);
    setCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
      <div
        className="absolute inset-0 overflow-y-auto bg-black"
        onClick={onClose}
      >
        <div className="min-h-screen flex items-start justify-center p-4">
          <div
            className="relative w-full bg-white rounded-2xl shadow-lg"
            style={{ minHeight: "80vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              {/* Back Button */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  className="flex items-center gap-3 text-sm text-[#0B6B29]"
                  onClick={onClose}
                >
                  <div className="w-7 h-7 flex items-center justify-center">
                    <img src={backIcon} alt="back" className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Back</span>
                </button>
              </div>

              {/* Title */}
              <h3
                className="text-2xl font-semibold mb-4"
                style={{ color: greenText }}
              >
                Lab Details Page
              </h3>

              {/* Main Info Card */}
              <div
                className="rounded-xl border overflow-hidden"
                style={{
                  borderColor: "#B6D0E8",
                  background: "linear-gradient(90deg,#F7FAFD 0%,#F1F9FF 60%)",
                }}
              >
                <div className="p-6">
                  <div className="flex justify-between gap-6">
                    {/* Left Side */}
                    <div className="flex-1 pr-6">
                      <h2
                        className="text-xl font-semibold"
                        style={{ color: greenText }}
                      >
                        {lab.name}
                      </h2>

                      {/* Details */}
                      <div
                        className="mt-6 space-y-4 text-[15px]"
                        style={{ color: greenText }}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={locationIcon}
                            className="w-5 h-5"
                            alt="location"
                          />
                          <div className="text-sm">
                            <span className="opacity-90 mr-2">Address:</span>
                            <span>
                              {lab.address || "Address not available"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            src={clockIcon}
                            className="w-5 h-5"
                            alt="clock"
                          />
                          <div className="text-sm">
                            <span className="opacity-90 mr-2">Open Hours:</span>
                            <span>{lab.timings || "—"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            src={phoneIcon}
                            className="w-5 h-5"
                            alt="phone"
                          />
                          <div className="text-sm">
                            <span className="opacity-90 mr-2">Contact:</span>
                            <span>{lab.contact || "+91 98765 43210"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="mt-6 flex items-center gap-4">
                        <button
                          className="px-4 py-2 rounded-md text-white text-sm"
                          style={{ background: primaryBlue }}
                        >
                          Chat with Lab
                        </button>
                        <button
                          className="px-4 py-2 rounded-md border text-sm"
                          style={{
                            borderColor: primaryBlue,
                            color: primaryBlue,
                          }}
                        >
                          Get Directions
                        </button>
                      </div>
                    </div>

                    {/* Logo */}
                    <div className="w-[220px] flex items-center justify-center">
                      <div
                        className="w-[170px] h-[170px] bg-white rounded-md flex items-center justify-center p-4"
                        style={{ boxShadow: "0 2px 10px rgba(16,60,110,0.06)" }}
                      >
                        <img
                          src={lab.logo || labLogoPlaceholder}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{ height: 1, background: "rgba(40,116,186,0.08)" }}
                />
              </div>

              {/* Search Bar */}
              <div className="mt-6 w-full">
                <div
                  className="flex items-center w-full border rounded-xl px-4 py-3"
                  style={{ borderColor: borderGreen }}
                >
                  <input
                    type="text"
                    placeholder="Search for Tests or Labs"
                    className="flex-1 text-sm text-[#88A598] placeholder:text-[#88A598] outline-none"
                  />
                  <img src={searchIcon} className="w-5 h-5 opacity-70" />
                </div>
              </div>

              {/* ---------- OUTER CATEGORY CONTAINER ---------- */}
              <div
                className="mt-6 w-full rounded-xl p-4 space-y-4"
                style={{ border: `1px solid ${borderGreen}` }}
              >
                {/* Pills Box */}
                <div
                  className="w-full rounded-lg p-3"
                  style={{
                    border: `1px solid ${borderGreen}`,
                    background: "white",
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                    <div
                      className="px-4 py-3 rounded-lg text-white text-sm font-medium text-center"
                      style={{ background: "#0B6B29" }}
                    >
                      General Health Checkups
                    </div>

                    {[
                      "Cardiac & Cholesterol Tests",
                      "Diabetes & Metabolic Tests",
                      "Infection & Immunity Tests",
                      "Hormonal & Endocrine Tests",
                      "Child / Pediatric Tests",
                      "Women’s Health Tests",
                      "Senior Citizen Health Packages",
                      "Mental Health & Wellness Tests",
                      "Specialized Tests",
                    ].map((cat) => (
                      <div
                        key={cat}
                        className="py-3 rounded-lg text-center text-sm font-medium"
                        style={{
                          border: `1px solid ${borderGreen}`,
                          color: greenText,
                          background: "white",
                        }}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blood Icon + Text */}
                <div className="flex items-center gap-3 mt-6">
                  <img src={bloodIcon} className="w-10 h-10" />
                  <p
                    className="text-md font-medium"
                    style={{ color: greenText }}
                  >
                    Used for regular health monitoring and basic diagnosis.
                  </p>
                </div>

                {/* ----------- TEST TABLE (UPDATED SPACING & BORDERS) ----------- */}
                <div
                  className="w-full rounded-xl p-0"
                  style={{
                    border: `1px solid ${borderGreen}`,
                    background: "white",
                    overflow: "hidden",
                  }}
                >
                  <table
                    className="w-full text-sm"
                    style={{ borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr
                        className="text-left"
                        style={{
                          color: greenText,
                          borderBottom: `1px solid ${borderGreen}`,
                        }}
                      >
                        <th className="py-3 pl-4">Test Name</th>
                        <th className="py-3">Preparation</th>
                        <th className="py-3 text-right pr-8">Price</th>
                        <th className="py-3 text-right pr-12">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {testList.map((test, idx) => (
                        <tr
                          key={idx}
                          style={{ borderBottom: `1px solid ${borderGreen}` }}
                        >
                          <td className="py-4 text-[#115D29] pl-4">
                            {test.name}
                          </td>
                          <td className="py-4 text-[#115D29]">{test.prep}</td>
                          <td className="py-4 font-semibold text-[#115D29] text-right pr-8">
                            {test.price}
                          </td>
                          <td className="py-4 text-right pr-6">
                            {/* UPDATED: open full-screen cart when clicked */}
                            <button
                              className="px-4 py-2 rounded-md text-white text-sm border border-transparent hover:shadow-lg shadow-gray-500 hover:border-white transition"
                              style={{ background: "#0B6B29" }}
                              onClick={() => openCartFor(test)}
                            >
                              Add to Cart
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* ---------------- END TABLE ---------------- */}
              </div>
              {/* END OUTER CATEGORY CONTAINER */}

              {/* AI card (unchanged) */}
              <div
                className="mt-6 w-full rounded-xl p-4"
                style={{
                  border: `1px solid rgba(40,116,186,0.18)`,
                  background:
                    "linear-gradient(90deg, rgba(247,250,253,1) 0%, rgba(241,249,255,1) 60%)",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg flex items-center justify-center">
                      <img src={aiIcon} alt="AI" className="w-20 h-20" />
                    </div>

                    <div>
                      <div
                        className="text-sm  font-semibold"
                        style={{ color: "#2874BA" }}
                      >
                        AI Health Assistant
                      </div>
                      <div
                        className="text-sm mt-2 font-medium"
                        style={{ color: "#2874BA" }}
                      >
                        Need help selecting tests?
                      </div>
                      <div
                        className="text-sm mt-2"
                        style={{ color: "#2874BA" }}
                      >
                        Based on your prescription, symptoms, or doctor's
                        advice, here are recommended tests.
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm"
                      style={{ background: primaryBlue }}
                      onClick={() => console.log("Upload prescription clicked")}
                    >
                      <img src={uploadIcon} alt="upload" className="w-4 h-4" />
                      <span>Upload prescription</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* ===== end AI card ===== */}
            </div>
          </div>
        </div>
      </div>

      {/* NEW: AddToCartFullScreen overlay */}
      <AddToCartFullScreen
        open={cartOpen}
        item={cartItem}
        onClose={() => setCartOpen(false)}
      />
    </div>
  );
};

export default LabDetailsModal;
