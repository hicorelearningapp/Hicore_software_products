import React, { useRef, useState } from "react";
import closeIcon from "../../../../assets/Customers/ConsultDoctors/close.png";
import upiIcon from "../../../../assets/Customers/ConsultDoctors/upi.png";
import cardIcon from "../../../../assets/Customers/ConsultDoctors/card.png";
import codIcon from "../../../../assets/Customers/ConsultDoctors/cod.png";
import netbankingIcon from "../../../../assets/Customers/ConsultDoctors/netbanking.png";
import successIcon from "../../../../assets/Customers/ConsultDoctors/success-tick.png"; // green tick icon

const BookAppointment = ({ onClose }) => {
  const dateInputRef = useRef(null);

  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    age: "",
    gender: "",
    mode: "",
    date: "",
    timeSlot: "",
    payment: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIconClick = () => {
    if (dateInputRef.current) dateInputRef.current.showPicker();
  };

  // ---------------- SUCCESS POPUP ----------------
  if (showSuccess) {
    return (
      <div
        className="fixed inset-0 bg-black/40 flex items-center w-full h-full justify-center z-[99999]"
      >
        {/* OUTER BOX */}
        <div
          style={{
            borderRadius: "8px",
            border: "1px solid #B5CDBD",
            padding: "16px",
            background: "#FFFFFF",
            position: "relative",
          }}
        >
          {/* CLOSE */}
          <img
            src={closeIcon}
            onClick={onClose}
            style={{
              width: 22,
              height: 22,
              position: "absolute",
              top: 12,
              right: 12,
              cursor: "pointer",
            }}
          />

          {/* INNER BOX */}
          <div
            style={{
              width: "364px",
              height: "268px",
              borderRadius: "8px",
              border: "1px solid #E7EFEA",
              padding: "16px",
              margin: "auto",
              marginTop: "24px",
              textAlign: "center",
              color: "#115D29",
            }}
          >
            <img
              src={successIcon}
              style={{
                width: 48,
                height: 48,
                margin: "auto",
                marginBottom: "16px",
              }}
            />

            <p style={{ fontWeight: "600", marginBottom: "12px", color: "#0B6A35" }}>
              Appointment confirmed
            </p>

            <p style={{ marginBottom: "4px" }}>
              Appointment confirmed with <b>Dr. Priya Mehta</b> for
            </p>

            <p style={{ fontWeight: 700, marginBottom: "18px" }}>
              4:30 PM today.
            </p>

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              {/* Add to Calendar BUTTON */}
              <button
                style={{
                  width: "163px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "#0B6A35",
                  color: "white",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                Add to Calendar
              </button>

              {/* WhatsApp BUTTON */}
              <button
                style={{
                  width: "163px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "white",
                  border: "1px solid #115D29",
                  color: "#115D29",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                Get Reminder on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- MAIN FORM ----------------
  return (
    <div
      className="scrollbar-hide"
      style={{
        width: "719px",
        maxHeight: "90vh",
        overflowY: "auto",
        borderRadius: "8px",
        padding: "36px",
        background: "#FFFFFF",
        position: "relative",
        border: "1px solid #E0E0E0",
        margin: "auto",
        boxShadow: "0px 4px 30px rgba(0,0,0,0.15)",
      }}
    >
      {/* TITLE + CLOSE */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <p style={{ fontSize: "20px", fontWeight: 600, color: "#115D29" }}>
          Book an Appointment
        </p>

        <img
          src={closeIcon}
          onClick={onClose}
          style={{ width: 24, height: 24, cursor: "pointer" }}
        />
      </div>

      {/* ---------------- MAIN BOX ---------------- */}
      <div
        style={{
          width: "647px",
          borderRadius: "8px",
          border: "1px solid #B5CDBD",
          padding: "16px",
        }}
      >
        {/* ---- PATIENT INFO ---- */}
        <div
          style={{
            width: "615px",
            borderRadius: "8px",
            border: "1px solid #E7EFEA",
            marginBottom: "24px",
          }}
        >
          <div style={{ ...headerStyle, color: "#115D29" }}>
            Patient Information
          </div>

          <div style={{ padding: "16px" }}>
            <input
              type="text"
              name="name"
              value={form.name}
              placeholder="Enter Patient Name"
              onChange={handleChange}
              style={{ ...inputBox, color: "#115D29" }}
            />

            <input
              type="number"
              name="mobile"
              value={form.mobile}
              placeholder="Enter Mobile Number"
              onChange={handleChange}
              style={{ ...inputBox, color: "#115D29" }}
            />

            <div style={{ display: "flex", gap: "16px" }}>
              <input
                type="number"
                name="age"
                value={form.age}
                placeholder="Enter Age"
                onChange={handleChange}
                style={{ ...inputBox, flex: 1, color: "#115D29" }}
              />

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                style={{ ...inputBox, flex: 1, color: "#115D29" }}
              >
                <option value="">Select option</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* ---- APPOINTMENT DETAILS ---- */}
        <div
          style={{
            width: "615px",
            borderRadius: "8px",
            border: "1px solid #E7EFEA",
            marginBottom: "24px",
          }}
        >
          <div style={{ ...headerStyle, color: "#115D29" }}>
            Appointment Details
          </div>

          <div style={{ padding: "16px", color: "#115D29" }}>
            <div style={{ marginBottom: "12px" }}>Choose Mode</div>

            <div style={{ display: "flex", gap: "24px", marginBottom: "20px" }}>
              {["In-Clinic Visit", "Home Visit", "Video Consultation"].map(
                (m) => (
                  <label key={m} style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="radio"
                      name="mode"
                      value={m}
                      checked={form.mode === m}
                      onChange={handleChange}
                    />
                    {m}
                  </label>
                )
              )}
            </div>

            <input
              ref={dateInputRef}
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              style={{ ...inputBox, color: "#115D29" }}
            />

            <div style={{ marginTop: "20px", marginBottom: "10px" }}>
              Select Time Slot
            </div>

            <div style={{ display: "flex", gap: "24px" }}>
              {["Morning", "Afternoon", "Evening"].map((slot) => (
                <label key={slot} style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="radio"
                    name="timeSlot"
                    value={slot}
                    checked={form.timeSlot === slot}
                    onChange={handleChange}
                  />
                  {slot}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ---- PAYMENT BOX ---- */}
        <div
          style={{
            width: "615px",
            borderRadius: "8px",
            border: "1px solid #E7EFEA",
            marginBottom: "24px",
          }}
        >
          <div style={{ ...headerStyle, color: "#115D29" }}>
            Payment Options
          </div>

          <div
            style={{
              padding: "16px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {[
              { label: "UPI/Wallet (GPay, PhonePe)", icon: upiIcon },
              { label: "Credit / Debit Card", icon: cardIcon },
              { label: "Cash on Delivery (COD)", icon: codIcon },
              { label: "Net Banking", icon: netbankingIcon },
            ].map((p) => (
              <div
                key={p.label}
                onClick={() => setForm({ ...form, payment: p.label })}
                style={{
                  border: "1px solid #B5CDBD",
                  borderRadius: "8px",
                  padding: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background:
                    form.payment === p.label ? "#E8F5E9" : "#FFFFFF",
                  cursor: "pointer",
                  color: "#115D29",
                }}
              >
                <span>{p.label}</span>
                <img src={p.icon} style={{ width: 28, height: 28 }} />
              </div>
            ))}
          </div>
        </div>

        {/* ---- CONFIRM BUTTON ---- */}
        <button
          onClick={() => setShowSuccess(true)}
          style={{
            width: "100%",
            background: "#0B6A35",
            padding: "14px",
            borderRadius: "6px",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookAppointment;


// ---------- SHARED STYLES ----------
const inputBox = {
  width: "100%",
  height: "44px",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid",
  outline: "none",
  marginBottom: "16px",
};

const headerStyle = {
  width: "615px",
  height: "52px",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
  padding: "8px 16px",
  background: "#FAF9F9",
  borderBottom: "1px solid #E7EFEA",
  display: "flex",
  alignItems: "center",
  fontWeight: 600,
};
