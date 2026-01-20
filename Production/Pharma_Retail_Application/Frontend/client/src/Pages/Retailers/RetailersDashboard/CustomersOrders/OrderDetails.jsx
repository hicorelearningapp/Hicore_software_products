import React, { useEffect, useState } from "react";

// icons
import calendarIcon from "../../../../assets/CustomerOrder/Calendar.png";
import locationIcon from "../../../../assets/CustomerOrder/Location.png";
import medsIcon from "../../../../assets/CustomerOrder/Medicines.png";
import prescriptionIcon from "../../../../assets/CustomerOrder/arrow.png";
import closeIcon from "../../../../assets/CustomerOrder/close-icon.png";

import deliveryIcon from "../../../../assets/CustomerOrder/truck.png";
import paymentIcon from "../../../../assets/CustomerOrder/Money.png";
import aiIcon from "../../../../assets/CustomerOrder/AIIdea.png";

// components
import InvoiceBody from "./InvoiceBody";
import ValidReasonPopup from "./ValidReasonPopup";   // <-- ADDED

const OrderDetails = ({ order, onClose }) => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [showRejectPopup, setShowRejectPopup] = useState(false);  // <-- ADDED

  // ESC key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (showInvoice) setShowInvoice(false);
        else if (showRejectPopup) setShowRejectPopup(false);       // <-- ADDED
        else if (typeof onClose === "function") onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, showInvoice, showRejectPopup]);

  if (!order) return null;

  const hideScrollbarStyles = `
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
  `;

  const openInvoice = (e) => {
    e.stopPropagation();
    setShowInvoice(true);
  };
  const closeInvoice = () => setShowInvoice(false);

  const openRejectPopup = () => setShowRejectPopup(true);     // <-- ADDED
  const closeRejectPopup = () => setShowRejectPopup(false);   // <-- ADDED

  const handleRejectConfirm = (reason) => {
    console.log("Rejected Reason:", reason);
    closeRejectPopup();
  };

  return (
    <>
      <style>{hideScrollbarStyles}</style>

      {/* Order modal backdrop */}
      <div
        className="fixed inset-0 z-[1000] bg-black opacity-60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Order modal wrapper */}
      <div
        className="fixed inset-0 z-[1100] flex items-start justify-center px-4 py-2 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-3xl mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Close */}
            <div className="flex justify-end mb-2">
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center text-[#115D29]"
              >
                <img src={closeIcon} alt="close" className="w-5 h-5" />
              </button>
            </div>

            {/* Inner content */}
            <div className="rounded-lg border border-[#E6EFE6] p-5 bg-white">
              {/* HEADER */}
              <div className="bg-[#EAF4F4] rounded-md p-4 mb-8 flex justify-between items-center">
                <div>
                  <div className="text-sm text-[#115D29]">
                    Customer Name:{" "}
                    <span className="font-semibold">{order.customer}</span>
                  </div>
                  <div className="text-sm text-[#115D29] mt-3">
                    Order ID: <span className="font-semibold">{order.id}</span>
                  </div>
                </div>

                <div className="text-right text-sm text-gray-600">
                  <div>{order.time}</div>
                  <div className="mt-2">{order.timeAgo}</div>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 text-[#115D29]">
                  <img src={calendarIcon} alt="calendar" className="w-6 h-6" />
                  <span className="text-md">
                    Order Date:{" "}
                    <span className="font-semibold">{order.orderDate}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[#115D29]">
                  <img src={deliveryIcon} alt="truck" className="w-6 h-6" />
                  <span className="text-md">
                    Expected Delivery:{" "}
                    <span className="font-semibold">
                      {order.expectedDelivery}
                    </span>
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-[#115D29] font-semibold mb-3">
                  <img src={locationIcon} alt="location" className="w-5 h-5" />
                  Delivery Address:
                </div>

                <div className="text-md text-green-900 mb-3">
                  {order.address}
                </div>
                <div className="text-md text-green-900">Contact: {order.contact}</div>
                <div className="text-md mt-2 text-green-900">Email: {order.email}</div>
              </div>

              {/* Medicines */}
              <div className="mb-9">
                <div className="flex items-center gap-2 text-[#115D29] font-semibold mb-4">
                  <img src={medsIcon} alt="meds" className="w-5 h-5" />
                  Medicines Requested:
                </div>

                <ol className="text-md text-green-800 list-decimal list-inside space-y-3">
                  {order.medicines.map((m, idx) => (
                    <li key={idx} className="flex justify-between">
                      {m.name}
                      <span className="text-sm text-[#115D29]">Qty: {m.qty}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Prescription */}
              <div className="pt-2 mb-6">
                <a className="text-sm text-[#2B78C6] hover:underline inline-flex items-center gap-2 cursor-pointer">
                  <img src={prescriptionIcon} alt="prescription" className="w-4 h-4" />
                  View Uploaded Prescription
                </a>
              </div>

              {/* Delivery & Payment blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Delivery */}
                <div className="border border-[#E8F2EA] rounded-lg p-4 bg-white">
                  <div className="text-sm font-semibold text-[#115D29] mb-3">
                    Delivery Preference:
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#F0FBF0]">
                      <img src={deliveryIcon} className="w-9 h-9" />
                    </div>
                    <div>
                      <div className="text-md text-[#2F8E48] font-medium">
                        Home Delivery
                      </div>
                      <div className="text-sm text-gray-500">
                        via Partner Delivery Service
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="border border-[#E8F2EA] rounded-lg p-4 bg-white">
                  <div className="text-sm font-semibold text-[#115D29] mb-3">
                    Payment Status:
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#FBF8F0]">
                      <img src={paymentIcon} className="w-9 h-9" />
                    </div>
                    <div>
                      <div className="text-md text-[#2F8E48] font-medium">
                        Prepaid Amount: <span className="font-semibold">₹250</span>
                      </div>
                      <div className="text-xs text-gray-500">Online</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insight */}
              <div className="rounded-lg bg-[#FFF8E6] border border-[#F2E8C8] p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#AF840D]">
                  <img src={aiIcon} className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-md font-semibold text-[#AF7F1A]">AI Insight</div>
                  <div className="text-md text-[#8B5C1A] mt-2">
                    “This order includes high-demand stock — check inventory before approval.”
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-8 gap-4">
              <button
                onClick={openInvoice}
                className="flex-1 bg-[#115D29] text-white font-semibold py-3 rounded-lg border border-[#115D29]"
              >
                Accept & Generate Invoice
              </button>

              <button
                type="button"
                onClick={openRejectPopup}         // <-- ADDED
                className="flex-1 bg-white text-[#115D29] font-semibold py-3 rounded-lg border border-[#115D29]"
              >
                Reject Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- REJECT REASON POPUP ---------------- */}
      {showRejectPopup && (
        <>
          <div
            className="fixed inset-0 z-[1500] bg-black opacity-60"
            onClick={closeRejectPopup}
          />

          <div className="fixed inset-0 z-[1600] flex items-center justify-center px-4 py-12">
            <div
              className="w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <ValidReasonPopup
                onConfirm={handleRejectConfirm}
                onCancel={closeRejectPopup}
              />
            </div>
          </div>
        </>
      )}

      {/* ---------------- INVOICE POPUP ---------------- */}
      {showInvoice && (
        <>
          <div
            className="fixed inset-0 z-[1700] bg-black opacity-80"
            onClick={closeInvoice}
          />

          <div className="fixed inset-0 z-[1800] flex items-start justify-center px-4  overflow-y-auto">
            <div
              className="relative w-full max-w-4xl bg-white rounded-xl shadow-lg p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-2">
                <button onClick={closeInvoice} className="w-9 h-9 flex items-center justify-center">
                  <img src={closeIcon} className="w-5 h-5" />
                </button>
              </div>
              <InvoiceBody />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderDetails;
