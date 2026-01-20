import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import backIcon from "../../../../assets/Customers/Cart/back.png";
import tickIcon from "../../../../assets/Customers/Cart/tick-green.png";
import wrongIcon from "../../../../assets/Customers/Cart/wrong-red.png";
import truckIcon from "../../../../assets/Customers/Cart/truck.png";

import successIcon from "../../../../assets/Customers/Cart/party.png";   
import closeIcon from "../../../../assets/Customers/Cart/close.png";  

const SmartSplitOrder = () => {
  const navigate = useNavigate();

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  return (
    <div
      className="bg-white mx-auto mt-6 rounded-[8px] border border-[#B5CDBD]"
      style={{
        width: "1440px",
        height: "896px",
        padding: "36px",
      }}
    >
      {/* SUCCESS MODAL OVERLAY */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div
            className="bg-white rounded-[12px] border border-[#E7EFEA] relative"
            style={{
              width: "520px",
              padding: "32px",
            }}
          >
            {/* CLOSE BUTTON */}
            <img
              src={closeIcon}
              className="absolute top-4 right-4 w-5 h-5 cursor-pointer"
              onClick={() => setShowSuccessModal(false)}
            />

            {/* ICON */}
            <div className="flex justify-center">
              <img src={successIcon} className="w-12 h-12 mb-2" />
            </div>

            {/* HEADING */}
            <h2 className="text-center text-[#115D29] font-semibold text-xl mb-2">
              Orders Created Successfully!
            </h2>

            <p className="text-center text-[#115D29] text-sm mb-6">
              Your medicines are being sourced from:
            </p>

            {/* CONTENT BOX */}
            <div
              className="rounded-[8px] border border-[#E7EFEA] bg-[#F7F9F7] p-4 space-y-3"
              style={{ width: "100%" }}
            >
              {/* 1 */}
              <div className="flex items-start gap-3 text-[#115D29] text-sm">
                <img src={tickIcon} className="w-4 h-4 mt-[2px]" />
                <span>
                  Retailer: <b>MedPlus Gurugram (2 items), Apollo Pharmacy (1 item)</b>
                </span>
              </div>

              {/* 2 */}
              <div className="flex items-start gap-3 text-[#115D29] text-sm">
                <img src={tickIcon} className="w-4 h-4 mt-[2px]" />
                <span>
                  Invoice #: <b>INV-67824</b> (Auto Generated)
                </span>
              </div>

              {/* 3 */}
              <div className="flex items-start gap-3 text-[#115D29] text-sm">
                <img src={tickIcon} className="w-4 h-4 mt-[2px]" />
                <span>
                  You can track the order from your <b>My Orders</b> section.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BACK BUTTON */}
      <div
        className="flex items-center gap-2 text-[#115D29] mb-6 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <img src={backIcon} className="w-4 h-4" />
        <span className="font-medium text-sm">Back</span>
      </div>

      <div className="flex gap-9">
        {/* LEFT SECTION */}
        <div
          className="rounded-[8px] border border-[#B5CDBD] bg-white"
          style={{ width: "666px", height: "760px", padding: "16px" }}
        >
          <h2 className="text-[#115D29] font-semibold text-xl mb-4">
            Smart Split Order
          </h2>

          {/* RETAILER 1 BOX */}
          <div
            className="rounded-[8px] border border-[#E7EFEA] bg-white mb-6"
            style={{ width: "634px", height: "332px", padding: "16px" }}
          >
            <div className="flex justify-between text-sm text-[#115D29] mb-2">
              <span>
                Retailer 1: <span className="font-semibold">MedPlus</span>
              </span>
              <span>Distance: <span className="font-semibold">0.8 km</span></span>
            </div>

            <div className="text-sm text-[#115D29] mb-3">
              Delivery: <span className="font-semibold">Today, 3–5 PM</span>
            </div>

            <div className="text-sm text-[#115D29] mb-4">
              Total Amount: <span className="font-semibold">₹80</span>
            </div>

            <p className="font-medium text-[#115D29] text-sm mb-2">
              Medicines Available:
            </p>

            {/* MEDICINES LIST */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center text-[#115D29]">
                <span className="flex items-center gap-2">
                  <img src={tickIcon} className="w-4 h-4" />
                  Paracetamol 500mg (10 tabs)
                </span>
                ₹80
              </div>

              <div className="flex justify-between items-center text-[#C94A4A]">
                <span className="flex items-center gap-2">
                  <img src={wrongIcon} className="w-4 h-4" />
                  Amoxicillin 500mg (Out of Stock)
                </span>
                ₹90
              </div>

              <div className="flex justify-between items-center text-[#C94A4A]">
                <span className="flex items-center gap-2">
                  <img src={wrongIcon} className="w-4 h-4" />
                  Vitamin D3 Tablets (Out of Stock)
                </span>
                ₹100
              </div>
            </div>

            <button className="mt-4 w-full bg-[#30B130] text-white py-3 rounded-[6px] text-sm font-semibold">
              Order Available Medicines
            </button>
          </div>

          {/* RETAILER 2 BOX */}
          <div
            className="rounded-[8px] border border-[#E7EFEA] bg-white"
            style={{ width: "634px", height: "332px", padding: "16px" }}
          >
            <div className="flex justify-between text-sm text-[#115D29] mb-2">
              <span>
                Retailer 2:{" "}
                <span className="font-semibold">Apollo Pharmacy – Sector 14</span>
              </span>
              <span>Distance: <span className="font-semibold">1.2 km</span></span>
            </div>

            <div className="text-sm text-[#115D29] mb-3">
              Delivery: <span className="font-semibold">Today, 6–8 PM</span>
            </div>

            <div className="text-sm text-[#115D29] mb-4">
              Total Amount: <span className="font-semibold">₹190</span>
            </div>

            <p className="font-medium text-[#115D29] text-sm mb-2">
              Medicines Available:
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center text-[#C94A4A]">
                <span className="flex items-center gap-2">
                  <img src={wrongIcon} className="w-4 h-4" />
                  Paracetamol 500mg (Out of Stock)
                </span>
                ₹80
              </div>

              <div className="flex justify-between items-center text-[#115D29]">
                <span className="flex items-center gap-2">
                  <img src={tickIcon} className="w-4 h-4" />
                  Amoxicillin 500mg
                </span>
                ₹90
              </div>

              <div className="flex justify-between items-center text-[#115D29]">
                <span className="flex items-center gap-2">
                  <img src={tickIcon} className="w-4 h-4" />
                  Vitamin D3 Tablets
                </span>
                ₹100
              </div>
            </div>

            <button className="mt-4 w-full bg-[#30B130] text-white py-3 rounded-[6px] text-sm font-semibold">
              Order Available Medicines
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div
          className="rounded-[8px] border border-[#B5CDBD] bg-white flex flex-col"
          style={{ width: "666px", height: "760px", padding: "16px" }}
        >
          <h2 className="text-[#115D29] font-semibold text-lg mb-4">
            Order Summary
          </h2>

          {/* SUMMARY BOX */}
          <div
            className="rounded-[8px] border border-[#E7EFEA] bg-white mb-4"
            style={{ width: "634px", padding: "16px" }}
          >
            <div className="flex justify-between text-sm text-[#115D29] mb-2">
              <span>Split 1: MedPlus (2 medicines)</span>
              <span>₹80</span>
            </div>

            <div className="flex justify-between text-sm text-[#115D29] mb-4">
              <span>Split 2: Apollo Pharmacy (1 medicine)</span>
              <span>₹190</span>
            </div>

            <div
              style={{
                height: "1px",
                background: "#E7EFEA",
                margin: "8px 0 12px 0",
              }}
            />

            <div className="flex justify-between text-lg font-semibold text-[#115D29]">
              <span>Total</span>
              <span>₹220</span>
            </div>
          </div>

          {/* DELIVERY NOTE */}
          <div
            className="rounded-[6px] border border-[#A9C4B5] bg-[#EFF6F0] px-4 py-2 text-sm text-[#2874BA] flex items-center gap-2"
            style={{ width: "634px" }}
          >
            <img src={truckIcon} alt="truck" className="w-4 h-4" />
            <span>Combined delivery: within 24 hrs</span>
          </div>

          <div style={{ flexGrow: 1 }} />

          {/* CONFIRM BUTTON */}
          <div className="flex gap-4 mt-4" style={{ width: "634px" }}>
            <button
              className="w-full bg-[#115D29] text-white py-3 rounded-[6px] font-semibold"
              onClick={() => setShowSuccessModal(true)}
            >
              Confirm Split Order
            </button>

            <button className="w-full border border-[#115D29] text-[#115D29] py-3 rounded-[6px] font-semibold bg-white">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSplitOrder;
