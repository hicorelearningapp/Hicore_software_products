import React, { useEffect, useState } from "react";

// icons
import calendarIcon from "../../../../assets/CustomerOrder/Calendar.png";
import locationIcon from "../../../../assets/CustomerOrder/Location.png";
import medsIcon from "../../../../assets/CustomerOrder/Medicines.png";
import closeIcon from "../../../../assets/CustomerOrder/close-icon.png";

import deliveryIcon from "../../../../assets/CustomerOrder/truck.png";
import paymentIcon from "../../../../assets/CustomerOrder/Money.png";
import aiIcon from "../../../../assets/CustomerOrder/AIIdea.png";

// components
import InvoiceBody from "./InvoiceBody";
import ValidReasonPopup from "./ValidReasonPopup"; 

// Backend call link
const BASE_URL = import.meta.env.VITE_API_BASE;

const OrderDetails = ({ order, onClose }) => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [showRejectPopup, setShowRejectPopup] = useState(false);

  // ESC key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (showInvoice) setShowInvoice(false);
        else if (showRejectPopup) setShowRejectPopup(false);
        else if (typeof onClose === "function") onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, showInvoice, showRejectPopup]);

  if (!order) return null;

  // MAPPING BACKEND DATA TO UI MODEL
  // Pulls dynamic data from backend keys like RetailerName, OrderId, etc.
  const o = {
    customer: order.RetailerName || "Anita Sharma",
    id: order.OrderId ? `ORD-${order.OrderId}` : "ORD-38216",
    // Formatting the OrderDate from backend (e.g. 2025-12-26T...)
    orderDate: order.OrderDate 
      ? new Date(order.OrderDate).toLocaleDateString('en-GB') 
      : "29/10/2025",
    expectedDelivery: order.expectedDelivery || "5/11/2025",
    address: order.address || "23, Green View Apartments, Sector 14, Gurugram, Haryana – 122001",
    contact: order.RetailerPhone || "+91 98765 43210",
    email: order.RetailerEmail || "anita.sharma@email.com",
    gstin: order.GSTNumber || "345456fafa626",
    licenseNumber: order.LicenseNumber || "5454sd65448",
    // Mapping backend 'MedicineRequested' array to local model
    medicines: order.MedicineRequested 
      ? order.MedicineRequested.map(m => ({ name: m.MedicineName, qty: m.Quantity }))
      : [
          { name: "Paracetamol 500mg (10 tabs)", qty: 50 },
          { name: "Vitamin C 1000mg", qty: 30 },
          { name: "Cough Syrup", qty: 50 },
        ],
    subtotal: order.subtotal || 10250,
    tax: order.tax || 0,
    prepaidAmount: order.prepaidAmount || 5250,
  };

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

  const openRejectPopup = () => setShowRejectPopup(true);
  const closeRejectPopup = () => setShowRejectPopup(false);

  const handleRejectConfirm = (reason) => {
    console.log("Rejected Reason for Order ID:", o.id, reason);
    closeRejectPopup();
  };

  // format currency helper
  const fmt = (val) =>
    typeof val === "number"
      ? val.toLocaleString("en-IN", { maximumFractionDigits: 0 })
      : val;

  return (
    <>
      <style>{hideScrollbarStyles}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[1000] bg-black opacity-80"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal wrapper */}
      <div
        className="fixed inset-0 z-[1100] flex items-start justify-center px-4 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-2xl mx-auto my-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Title + Close */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-[#115D29]">
                Order Details
              </h2>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center text-[#115D29]"
              >
                <img src={closeIcon} alt="close" className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="rounded-lg border border-[#E6EFE6] p-4 mb-6 bg-white">
                <div className="text-lg font-semibold text-[#115D29] mb-3">
                  Retailer Information
                </div>

                {/* light blue info strip */}
                <div className="rounded-md bg-[#EAF4F4] p-4 border border-[#E6F0F2]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="text-sm text-[#115D29]">
                      <div>
                        Retailer Name:{" "}
                        <span className="font-semibold">{o.customer}</span>
                      </div>
                      <div className="mt-3">
                        Order ID: <span className="font-semibold">{o.id}</span>
                      </div>
                      <div className="mt-3">
                        Contact:{" "}
                        <span className="font-semibold">{o.contact}</span>
                      </div>
                    </div>

                    <div className="text-sm text-[#115D29]">
                      <div>
                        GSTIN: <span className="font-semibold">{o.gstin}</span>
                      </div>
                      <div className="mt-3">
                        License Number:{" "}
                        <span className="font-semibold">{o.licenseNumber}</span>
                      </div>
                      <div className="mt-3">
                        Email: <span className="font-semibold">{o.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary container */}
              <div className="rounded-lg border border-[#E6EFE6] p-4 mb-6 bg-white">
                <div className="text-lg font-semibold text-[#115D29] mb-4">
                  Order Summary
                </div>

                <div className="flex items-center justify-between gap-6 mb-6">
                  <div className="flex items-center gap-3 text-[#115D29]">
                    <img
                      src={calendarIcon}
                      alt="calendar"
                      className="w-6 h-6"
                    />
                    <div className="text-sm">
                      <span className="font-medium">Order Date: </span>
                      <span className="font-semibold ml-1">{o.orderDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[#115D29]">
                    <img src={deliveryIcon} alt="truck" className="w-6 h-6" />
                    <div className="text-sm">
                      <span className="font-medium">Expected Delivery: </span>
                      <span className="font-semibold ml-1">
                        {o.expectedDelivery}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-sm font-semibold text-[#115D29] mb-2 flex items-center gap-2">
                  <img src={locationIcon} alt="location" className="w-4 h-4" />
                  Delivery Address:
                </div>
                <div className="text-sm text-green-900 mb-4">{o.address}</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Delivery card */}
                  <div className="border border-[#E8F2EA] rounded-lg p-4 bg-white">
                    <div className="text-sm font-semibold text-[#115D29] mb-3">
                      Delivery Preference:
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#F0FBF0]">
                        <img src={deliveryIcon} className="w-6 h-6" />
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

                  {/* Payment card */}
                  <div className="border border-[#E8F2EA] rounded-lg p-4 bg-white">
                    <div className="text-sm font-semibold text-[#115D29] mb-3">
                      Payment Status:
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#FBF8F0]">
                        <img src={paymentIcon} className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-md text-[#2F8E48] font-medium">
                          Prepaid Amount:{" "}
                          <span className="font-semibold">
                            ₹{fmt(o.prepaidAmount)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Online</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medicines */}
              <div className="rounded-lg border border-[#E6EFE6] p-4 mb-6 bg-white">
                <div className="flex items-center gap-2 text-[#115D29] font-semibold mb-4">
                  <img src={medsIcon} alt="meds" className="w-5 h-5" />
                  Medicines Requested:
                </div>

                <ol className="text-sm text-[#115D29] list-decimal list-inside space-y-3">
                  {o.medicines.map((m, idx) => (
                    <li key={idx} className="flex justify-between">
                      <div>{m.name}</div>
                      <div className="text-sm font-medium text-[#115D29]">
                        Qty: {m.qty}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* AI Insight */}
              <div className="rounded-lg bg-[#FFF8E6] border border-[#F2E8C8] p-4 flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#F7E6B9]">
                  <img src={aiIcon} className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-md font-semibold text-[#AF7F1A]">
                    AI Insight
                  </div>
                  <div className="text-sm text-[#8B5C1A] mt-2">
                    “This order includes high-demand stock — check inventory
                    before approval.”
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-6 gap-4">
              <button
                onClick={openInvoice}
                className="flex-1 bg-[#115D29] text-white font-semibold py-3 rounded-lg border border-[#115D29]"
              >
                Accept & Generate Invoice
              </button>

              <button
                type="button"
                onClick={openRejectPopup}
                className="flex-1 bg-white text-[#115D29] font-semibold py-3 rounded-lg border border-[#115D29]"
              >
                Reject Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* REJECT POPUP */}
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

      {/* INVOICE POPUP */}
      {showInvoice && (
        <>
          <div
            className="fixed inset-0 z-[1700] bg-black opacity-80"
            onClick={closeInvoice}
          />

          <div className="fixed inset-0 z-[1800] flex items-start justify-center px-4 overflow-y-auto">
            <div
              className="relative w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-2">
                <button
                  onClick={closeInvoice}
                  className="w-9 h-9 flex items-center justify-center"
                >
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