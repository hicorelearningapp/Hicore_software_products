// src/.../BookingRight.jsx
import React, { useState } from "react";
/* change these paths if your project stores icons elsewhere */
import successIcon from "../../../assets/Customers/SearchLabs/Tick.png";
/* icons used in confirmation popup - update filenames if needed */
import partyIcon from "../../../assets/Customers/SearchLabs/party.png";
import locationIcon from "../../../assets/Customers/SearchLabs/location-blue.png";
import closeIcon from "../../../assets/Customers/SearchLabs/close.png";

const BookingRight = ({ lab = {}, patient = {}, order = {}, tests = [] }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  /* Default Lab */
  const defaultLab = {
    name: "Apollo Diagnostics",
    address: "MG Road, Street 49, Chennai",
    contact: "+91 95476 43210",
    email: "apollodiagnostics@email.com",
  };

  /* Default Patient */
  const defaultPatient = {
    name: "Anita Sharma",
    age: 29,
    gender: "Female",
    contact: "+91 98765 43210",
    email: "anita.sharma@email.com",
  };

  /* Default Order Summary */
  const defaultOrder = {
    invoiceNo: "LAB-INV-20453",
    bookingMode: "Home Sample Collection",
    appointmentDate: "31 Oct 2025",
    labName: "Apollo Diagnostics",
    paymentMethod: "Online (UPI)",
    timeSlot: "7:30 AM – 8:00 AM",
  };

  /* Default Tests (sample) */
  const defaultTests = [
    {
      sno: 1,
      name: "CBC\n(Complete Blood Count)",
      preparation: "Fasting Not\nRequired",
      unitPrice: 250.0,
      gst: 50.0,
    },
    {
      sno: 2,
      name: "Thyroid Profile\n(T3, T4, TSH)",
      preparation: "Fasting Not\nRequired",
      unitPrice: 700.0,
      gst: 170.0,
    },
  ];

  const labData = { ...defaultLab, ...lab };
  const p = { ...defaultPatient, ...patient };
  const o = { ...defaultOrder, ...order };
  const t = tests && tests.length ? tests : defaultTests;

  // compute totals
  const totalAmount = t.reduce((sum, item) => {
    const itemTotal = (Number(item.unitPrice) || 0) + (Number(item.gst) || 0);
    return sum + itemTotal;
  }, 0);

  // helper to format currency
  const fmt = (val) => {
    if (val === undefined || val === null || isNaN(Number(val))) return "-";
    return `₹${Number(val).toFixed(2)}`;
  };

  // payable amount for primary button (you can replace with order/payable prop)
  const payable = fmt(totalAmount || 900);

  // build a simple test summary line like "CBC & Thyroid Profile"
  const testSummary = (() => {
    if (!t || !t.length) return "your selected tests";
    const cleanNames = t.map((item) =>
      String(item.name || "")
        .split("\n")[0]
        .replace(/\(.*?\)/g, "")
        .trim()
    );
    if (cleanNames.length === 1) return cleanNames[0];
    if (cleanNames.length === 2) return `${cleanNames[0]} & ${cleanNames[1]}`;
    return `${cleanNames[0]} & more tests`;
  })();

  return (
    <div className="w-full">
      {/* Preview Order Heading */}
      <h3 className="text-lg font-semibold mb-4" style={{ color: "#115D29" }}>
        Preview Order
      </h3>

      {/* ---------------- LAB DETAILS CARD ---------------- */}
      <div
        className="rounded-md overflow-hidden mb-6"
        style={{
          border: "1px solid #E6EDE6",
          background: "#ffffff",
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-4"
          style={{
            background: "#E7EFEA",
            borderBottom: "1px solid rgba(0,0,0,0.03)",
          }}
        >
          <div className="font-semibold text-sm" style={{ color: "#115D29" }}>
            Lab Details
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Row 1 */}
          <div className="flex items-start justify-between">
            <div className="font-semibold text-sm" style={{ color: "#115D29" }}>
              {labData.name}
            </div>

            <div
              className="text-sm"
              style={{ color: "#115D29", textAlign: "right" }}
            >
              Address: {labData.address}
            </div>
          </div>

          <div className="h-4" />

          {/* Row 2 */}
          <div className="flex items-start justify-between text-sm">
            <div style={{ color: "#115D29" }}>
              <span className="font-medium">Contact:</span> {labData.contact}
            </div>

            <div style={{ color: "#115D29", textAlign: "right" }}>
              <span className="font-medium">Email:</span> {labData.email}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- PATIENT DETAILS CARD ---------------- */}
      <div
        className="rounded-md overflow-hidden mb-6"
        style={{
          border: "1px solid #E6EDE6",
          background: "#ffffff",
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-4"
          style={{
            background: "#E7EFEA",
            borderBottom: "1px solid rgba(0,0,0,0.03)",
          }}
        >
          <div className="font-semibold text-sm" style={{ color: "#115D29" }}>
            Patient Details
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Row 1: Name + Age/Gender */}
          <div className="flex items-start justify-between">
            <div className="font-semibold text-sm" style={{ color: "#115D29" }}>
              {p.name}
            </div>

            <div className="text-sm" style={{ color: "#115D29" }}>
              {p.age} / {p.gender}
            </div>
          </div>

          <div className="h-4" />

          {/* Row 2: Contact + Email */}
          <div className="flex items-start justify-between text-sm">
            <div style={{ color: "#115D29" }}>
              <span className="font-medium">Contact:</span> {p.contact}
            </div>

            <div style={{ color: "#115D29", textAlign: "right" }}>
              <span className="font-medium">Email:</span> {p.email}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- ORDER SUMMARY CARD ---------------- */}
      <div
        className="rounded-md overflow-hidden mb-6"
        style={{
          border: "1px solid #E6EDE6",
          background: "#ffffff",
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-4"
          style={{
            background: "#E7EFEA",
            borderBottom: "1px solid rgba(0,0,0,0.03)",
          }}
        >
          <div className="font-semibold text-sm" style={{ color: "#115D29" }}>
            Order Summary
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-sm" style={{ color: "#115D29" }}>
          {/* Row 1 */}
          <div className="flex justify-between mb-4">
            <div>
              Invoice No: <span className="font-semibold">{o.invoiceNo}</span>
            </div>
            <div>
              Lab Name: <span className="font-semibold">{o.labName}</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex justify-between mb-4">
            <div>
              Booking Mode:{" "}
              <span className="font-semibold">{o.bookingMode}</span>
            </div>
            <div>
              Payment Method:{" "}
              <span className="font-semibold">{o.paymentMethod}</span>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex justify-between">
            <div>
              Appointment Date:{" "}
              <span className="font-semibold">{o.appointmentDate}</span>
            </div>
            <div>
              Time Slot: <span className="font-semibold">{o.timeSlot}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- BOOKED TEST CARD ---------------- */}
      <div
        className="rounded-md overflow-hidden mb-6"
        style={{
          border: "1px solid #E6EDE6",
          background: "#ffffff",
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-4"
          style={{
            background: "#E7EFEA",
            borderBottom: "1px solid rgba(0,0,0,0.03)",
          }}
        >
          <div className="font-semibold text-sm" style={{ color: "#115D29" }}>
            Booked Test
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-sm" style={{ color: "#115D29" }}>
          {/* Top info row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              Total Tests: <span className="font-medium">{t.length}</span>
            </div>
            <div>
              Estimated Report Time:{" "}
              <span className="font-medium">24–36 hours</span>
            </div>
          </div>

          {/* Inner rounded table container */}
          <div
            className="w-full"
            style={{
              border: "1px solid #DDEDE3",
              borderRadius: 8,
              background: "#ffffff",
              overflow: "hidden",
            }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-6 gap-4 items-center px-4 py-3"
              style={{
                borderBottom: "1px solid #E6EDE6",
                background: "transparent",
              }}
            >
              <div
                className="text-sm font-semibold"
                style={{ color: "#115D29" }}
              >
                S.No
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: "#115D29" }}
              >
                Test Name
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: "#115D29" }}
              >
                Preparation
              </div>
              <div
                className="text-sm font-semibold text-right"
                style={{ color: "#115D29" }}
              >
                Unit Price
              </div>
              <div
                className="text-sm font-semibold text-right"
                style={{ color: "#115D29" }}
              >
                GST(5%)
              </div>
              <div
                className="text-sm font-semibold text-right"
                style={{ color: "#115D29" }}
              >
                Total
              </div>
            </div>

            {/* Table rows */}
            <div>
              {t.map((item, idx) => {
                const itemTotal =
                  (Number(item.unitPrice) || 0) + (Number(item.gst) || 0);
                const isLast = idx === t.length - 1;
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-6 gap-4 items-start px-4 py-5"
                    style={{
                      borderBottom: isLast ? "none" : "1px solid #EEF6EE",
                    }}
                  >
                    <div className="text-sm" style={{ color: "#115D29" }}>
                      {item.sno}
                    </div>

                    <div
                      className="text-sm"
                      style={{ color: "#115D29", whiteSpace: "pre-line" }}
                    >
                      {item.name}
                    </div>

                    <div
                      className="text-sm"
                      style={{ color: "#115D29", whiteSpace: "pre-line" }}
                    >
                      {item.preparation}
                    </div>

                    <div
                      className="text-sm text-right"
                      style={{ color: "#115D29" }}
                    >
                      {fmt(item.unitPrice)}
                    </div>

                    <div
                      className="text-sm text-right"
                      style={{ color: "#115D29" }}
                    >
                      {fmt(item.gst)}
                    </div>

                    <div
                      className="text-sm text-right font-medium"
                      style={{ color: "#115D29" }}
                    >
                      {fmt(itemTotal)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer / total row */}
            <div
              style={{
                borderTop: "1px solid #E6EDE6",
                padding: "16px 20px",
                background: "transparent",
              }}
            >
              <div className="flex justify-end items-center">
                <div
                  className="text-base font-semibold"
                  style={{ color: "#115D29" }}
                >
                  Total: <span className="font-bold">{fmt(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
          {/* end inner rounded table container */}
        </div>
      </div>

      {/* ---------------- SUCCESS / INFO BANNER ---------------- */}
      <div
        className="w-full mt-6"
        role="status"
        aria-live="polite"
        style={{
          border: "1px solid #1E8A3A",
          borderRadius: 8,
          padding: "16px 16px",
          background: "#ffffff",
        }}
      >
        <div
          className="flex items-center justify-center text-md"
          style={{ color: "#1E8A3A" }}
        >
          {/* icon */}
          <img
            src={successIcon}
            alt="success"
            style={{ width: 22, height: 22, marginRight: 12 }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />

          {/* message */}
          <div>All set! Please review your booking details carefully.</div>
        </div>
      </div>

      {/* ---------------- ACTION BUTTONS ---------------- */}
      <div
        className="w-full mt-10"
        style={{
          paddingTop: 16,
        }}
      >
        <div className="flex items-center gap-4">
          {/* Primary filled button - now opens confirmation popup */}
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="flex-1 py-2 px-4 rounded-md text-white font-medium"
            style={{
              background: "#0B6B29", // solid green
              border: "1px solid #0B6B29",
              boxShadow: "none",
            }}
            aria-label="Confirm Booking and Pay"
          >
            Confirm Booking &amp; Pay {payable}
          </button>

          {/* Secondary outlined button */}
          <button
            type="button"
            onClick={() => console.log("View Invoice clicked")}
            className="flex-1 py-2 px-4 rounded-md font-medium"
            style={{
              background: "#ffffff",
              color: "#115D29",
              border: "1px solid #DDEDE3",
            }}
            aria-label="View Invoice"
          >
            View Invoice
          </button>
        </div>
      </div>

      {/* ---------------- CONFIRMATION POPUP (shows on Confirm) ---------------- */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/40"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal card */}
          <div
            className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-xl mx-4"
            style={{ border: "1px solid #E6F0E8" }}
          >
            {/* Close button (top-right) */}
            <button
              onClick={() => setShowConfirmModal(false)}
              aria-label="Close confirmation"
              className="absolute right-4 top-4 flex items-center justify-center"
              style={{
                background: "transparent",
                border: "none",
              }}
            >
              <img
                src={closeIcon}
                alt="close"
                style={{ width: 22, height: 22 }}
              />
            </button>
            <div className="border border-gray-300 mt-5 p-10 rounded-md">
              {/* Party icon (center) */}
              <div className="flex justify-center">
                <img
                  src={partyIcon}
                  alt="celebrate"
                  style={{ width: 56, height: 56 }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Heading */}

              <h3
                className="text-center mt-4 text-lg font-semibold"
                style={{ color: "#0B6B29" }}
              >
                Appointment Confirmed!
              </h3>

              {/* Description */}
              <p
                className="text-center mt-4 text-sm"
                style={{ color: "#115D29", lineHeight: "1.6" }}
              >
                Your {testSummary} test is scheduled with{" "}
                <strong>{labData.name}</strong>
                <br />
                <strong>{o.appointmentDate}</strong>, {o.timeSlot}.
              </p>

              {/* Address box with location icon */}
              <div
                className="mt-6 rounded-md p-3"
                style={{
                  border: "1px solid #CFE6FB",
                  background: "#ffffff",
                }}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={locationIcon}
                    alt="location"
                    style={{ width: 16, height: 16, marginTop: 2 }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="text-sm text-[#2874BA]">
                    Lab Address: {labData.address}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => {
                    console.log("Add to Calendar clicked");
                  }}
                  className="
    flex-1 py-2 rounded-md text-white font-medium
    bg-[#115D29] border-2 border-[#0B6B29] hover:border-white
    shadow-md shadow-gray-500 transition-colors duration-150
  "
                >
                  Add to Calendar
                </button>

                <button
                  onClick={() => {
                    // TODO: trigger whatsapp reminder flow
                    console.log("WhatsApp reminder clicked");
                  }}
                  className="flex-1 py-2 rounded-md font-medium"
                  style={{
                    background: "#ffffff",
                    color: "#115D29",
                    border: "1px solid #115D29",
                  }}
                >
                  Get Reminder on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingRight;
