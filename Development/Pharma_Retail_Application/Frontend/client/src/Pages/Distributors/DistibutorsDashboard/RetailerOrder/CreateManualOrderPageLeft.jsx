import React from "react";
import searchIcon from "../../../../assets/CustomerOrder/search-bar.png";
import calendarIcon from "../../../../assets/CustomerOrder/Calendar.png";
import aiIcon from "../../../../assets/CustomerOrder/AIIdea.png";

const GREEN = "#115D29";
const INPUT_BORDER = "#DDEDE3";

export default function CreateManualOrderPageLeft(props) {
  const {
    customer,
    updateCustomer,
    medicines,
    addMedicine,
    deleteMedicine,
    updateMedicine,
    orderMeta,
    updateOrderMeta,
    quickChecklist,
    updateQuickChecklist,
  } = props;

  const sectionCard = {
    border: `1px solid ${INPUT_BORDER}`,
    borderRadius: 8,
    marginBottom: 18,
    background: "white",
  };

  const sectionHeader = {
    background: "#F6FBF6",
    borderRadius: "8px 8px 0 0",
    padding: "12px 14px",
    borderBottom: `1px solid ${INPUT_BORDER}`,
    fontSize: 16,
    fontWeight: 700,
    color: GREEN,
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: `1px solid ${INPUT_BORDER}`,
  };

  return (
    <div
      className="w-full"
      style={{
        background: "transparent",
        color: GREEN,
        fontFamily: "Inter, sans-serif",
        paddingBottom: 30,
        accentColor: GREEN,
      }}
    >
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        {/* PAGE TITLE */}
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: GREEN }}>
            Create an Order
          </h2>
        </div>

        {/* ===== RETAILER INFO ===== */}
        <div style={sectionCard}>
          <div style={sectionHeader}>Retailer Information</div>

          <div style={{ padding: "14px 16px" }}>
            {/* Retailer Name */}
            <div style={{ marginBottom: 12 }}>
              <label
                style={{ fontSize: 13, marginBottom: 6, display: "block" }}
              >
                Retailer Name
              </label>
              <input
                value={customer.fullName}
                onChange={(e) => updateCustomer("fullName", e.target.value)}
                placeholder="e.g., Anita Sharma"
                style={inputStyle}
              />
            </div>

            {/* Retailer Code + GSTIN (two columns) */}
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{ fontSize: 13, marginBottom: 6, display: "block" }}
                >
                  Retailer Code
                </label>
                <input
                  value={customer.code || ""}
                  onChange={(e) => updateCustomer("code", e.target.value)}
                  placeholder="Enter the code"
                  style={inputStyle}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label
                  style={{ fontSize: 13, marginBottom: 6, display: "block" }}
                >
                  GSTIN
                </label>
                <input
                  value={customer.gstin || ""}
                  onChange={(e) => updateCustomer("gstin", e.target.value)}
                  placeholder="Enter the Number"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Contact + Email */}
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{ fontSize: 13, marginBottom: 6, display: "block" }}
                >
                  Contact Number
                </label>
                <input
                  value={customer.contact}
                  onChange={(e) => updateCustomer("contact", e.target.value)}
                  placeholder="+91 Enter 10 digit Number"
                  style={inputStyle}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label
                  style={{ fontSize: 13, marginBottom: 6, display: "block" }}
                >
                  Email ID
                </label>
                <input
                  value={customer.email}
                  onChange={(e) => updateCustomer("email", e.target.value)}
                  placeholder="name@email.com"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Address row with GPS link */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label style={{ fontSize: 13 }}>Address</label>
                <button
                  style={{
                    color: "#1B6FA6",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Use GPS Location
                </button>
              </div>
              <input
                value={customer.address}
                onChange={(e) => updateCustomer("address", e.target.value)}
                placeholder="Flat / Street / City / State / PIN Code"
                style={{ ...inputStyle, marginTop: 6 }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            border: "1px solid #C7DDF2",
            background: "#F4F9FF",
            borderRadius: 10,
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 18,
          }}
        >
          {/* ROW 1 — ICON + HEADING */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* ICON */}
            <div
              style={{
                width: 40,
                height: 40,
                background: "#2275ceff",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={aiIcon} alt="ai" style={{ width: 20, height: 20 }} />
            </div>

            {/* HEADING */}
            <span style={{ fontWeight: 700, color: "#1A5A99", fontSize: 14 }}>
              AI Assistant Tip
            </span>
          </div>

          {/* ROW 2 — PARAGRAPH LEFT, BUTTON RIGHT */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            {/* PARAGRAPH */}
            <span
              style={{
                color: "#294B68",
                fontSize: 13,
                lineHeight: "19px",
                flex: 1,
              }}
            >
              “Based on past data, this retailer usually orders Paracetamol,
              Dolo 650mg, and Vitamin C. Would you like to auto-fill these
              items?”
            </span>

            {/* BUTTON */}
            <button
              onClick={() => props.autoFill && props.autoFill()}
              style={{
                background: "#1D6FD2",
                color: "white",
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Auto-Fill Items
            </button>
          </div>
        </div>

        {/* ===== MEDICINE DETAILS (renamed + restyled) ===== */}
        <div style={sectionCard}>
          <div style={{ ...sectionHeader, background: "#F6FBF6" }}>
            Add Medicines to Order
          </div>

          <div style={{ padding: "14px 16px" }}>
            {medicines.map((m, idx) => (
              <div
                key={m.id}
                style={{
                  marginBottom: 18,
                  borderBottom:
                    idx === medicines.length - 1
                      ? "none"
                      : `1px dashed ${INPUT_BORDER}`,
                  paddingBottom: 14,
                }}
              >
                {/* top row: delete button */}
                {medicines.length > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: 8,
                    }}
                  >
                    <button
                      onClick={() => deleteMedicine(m.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: GREEN,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}

                {/* Add Medicine input */}
                <div style={{ marginBottom: 10 }}>
                  <label
                    style={{ fontSize: 13, marginBottom: 6, display: "block" }}
                  >
                    Add Medicine
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      value={m.name}
                      onChange={(e) =>
                        updateMedicine(m.id, "name", e.target.value)
                      }
                      placeholder="Search Medicine"
                      style={{
                        ...inputStyle,
                        padding: "12px 42px 12px 14px",
                      }}
                    />
                    <img
                      src={searchIcon}
                      alt="search"
                      style={{
                        width: 18,
                        height: 18,
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  </div>
                </div>

                {/* Brand */}
                <div style={{ marginBottom: 10 }}>
                  <label
                    style={{ fontSize: 13, marginBottom: 6, display: "block" }}
                  >
                    Brand Name
                  </label>
                  <input
                    value={m.brand}
                    onChange={(e) =>
                      updateMedicine(m.id, "brand", e.target.value)
                    }
                    placeholder="Enter Brand Name"
                    style={inputStyle}
                  />
                </div>

                {/* Quantity row */}
                <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        fontSize: 13,
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Quantity
                    </label>
                    <select
                      value={m.qtyMin}
                      onChange={(e) =>
                        updateMedicine(m.id, "qtyMin", e.target.value)
                      }
                      style={inputStyle}
                    >
                      <option value="">Select Min</option>
                      <option>1</option>
                      <option>2</option>
                      <option>5</option>
                      <option>10</option>
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        fontSize: 13,
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      &nbsp;
                    </label>
                    <select
                      value={m.qtyMax}
                      onChange={(e) =>
                        updateMedicine(m.id, "qtyMax", e.target.value)
                      }
                      style={inputStyle}
                    >
                      <option value="">Select Max</option>
                      <option>1</option>
                      <option>2</option>
                      <option>5</option>
                      <option>10</option>
                    </select>
                  </div>
                </div>

                {/* Price + Expiry row */}
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        fontSize: 13,
                        marginBottom: 6,
                        display: "block",
                      }}
                    >
                      Price
                    </label>

                    <div style={{ position: "relative", width: "100%" }}>
                      {/* ₹ Icon inside input */}
                      <span
                        style={{
                          position: "absolute",
                          left: 14,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: 16,
                          fontWeight: 600,
                          color: GREEN,
                          pointerEvents: "none",
                        }}
                      >
                        ₹
                      </span>

                      {/* Input */}
                      <input
                        value={m.price}
                        onChange={(e) =>
                          updateMedicine(m.id, "price", e.target.value)
                        }
                        placeholder="0"
                        style={{
                          width: "100%",
                          padding: "12px 14px 12px 34px", // space for ₹
                          borderRadius: 8,
                          border: `1px solid ${INPUT_BORDER}`,
                          color: GREEN,
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        fontSize: 13,
                        marginBottom: 6,
                        display: "block",
                      }}
                    >
                      Expiry Date
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        value={m.expiry}
                        onChange={(e) =>
                          updateMedicine(m.id, "expiry", e.target.value)
                        }
                        placeholder="Select Date"
                        style={{
                          ...inputStyle,
                          padding: "12px 42px 12px 14px",
                        }}
                      />
                      <img
                        src={calendarIcon}
                        alt="cal"
                        style={{
                          width: 18,
                          height: 18,
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addMedicine}
              style={{
                background: "transparent",
                border: "none",
                color: GREEN,
                fontWeight: 600,
                cursor: "pointer",
                marginTop: 6,
              }}
            >
              + Add Another Medicine
            </button>

            <div style={{ marginTop: 12 }}>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={quickChecklist.allMedicinesVerified || false}
                  onChange={(e) =>
                    updateQuickChecklist(
                      "allMedicinesVerified",
                      e.target.checked
                    )
                  }
                />
                All medicines verified and available
              </label>
            </div>
          </div>
        </div>

        {/* ===== PAYMENT & DELIVERY ===== */}
        <div style={sectionCard}>
          <div style={sectionHeader}>Payment & Delivery Details</div>

          <div style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label style={{ fontSize: 13 }}>Delivery Address</label>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#1B6FA6",
                  cursor: "pointer",
                }}
              >
                Use GPS Location
              </button>
            </div>

            <input
              value={customer.deliveryAddress}
              onChange={(e) =>
                updateCustomer("deliveryAddress", e.target.value)
              }
              placeholder="Flat / Street / City / State / PIN Code"
              style={{ ...inputStyle, marginTop: 6, marginBottom: 12 }}
            />

            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{ fontSize: 13, marginBottom: 6, display: "block" }}
                >
                  Order Date
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="orderDateInput"
                    value={orderMeta.orderDate}
                    onChange={(e) =>
                      updateOrderMeta("orderDate", e.target.value)
                    }
                    placeholder="Select Date"
                    style={{ ...inputStyle, padding: "12px 42px 12px 14px" }}
                  />
                  <img
                    src={calendarIcon}
                    onClick={() =>
                      document.getElementById("orderDateInput")?.showPicker?.()
                    }
                    style={{
                      width: 18,
                      height: 18,
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <label
                  style={{ fontSize: 13, marginBottom: 6, display: "block" }}
                >
                  Expected Delivery Date
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="expectedDateInput"
                    value={orderMeta.expectedDate}
                    onChange={(e) =>
                      updateOrderMeta("expectedDate", e.target.value)
                    }
                    placeholder="Select Date"
                    style={{ ...inputStyle, padding: "12px 42px 12px 14px" }}
                  />
                  <img
                    src={calendarIcon}
                    onClick={() =>
                      document
                        .getElementById("expectedDateInput")
                        ?.showPicker?.()
                    }
                    style={{
                      width: 18,
                      height: 18,
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Mode + Payment Mode */}
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{ fontSize: 13, marginBottom: 8, display: "block" }}
                >
                  Choose Delivery Mode
                </label>

                <label
                  style={{
                    display: "flex",
                    gap: 8,
                    fontSize: 13,
                    alignItems: "center",
                  }}
                >
                  <input
                    type="radio"
                    name="deliveryMode"
                    value="pickup"
                    checked={orderMeta.deliveryMode === "pickup"}
                    onChange={(e) =>
                      updateOrderMeta("deliveryMode", e.target.value)
                    }
                  />
                  Pickup
                </label>

                <label
                  style={{
                    display: "flex",
                    gap: 8,
                    fontSize: 13,
                    alignItems: "center",
                  }}
                >
                  <input
                    type="radio"
                    name="deliveryMode"
                    value="door"
                    checked={orderMeta.deliveryMode === "door"}
                    onChange={(e) =>
                      updateOrderMeta("deliveryMode", e.target.value)
                    }
                  />
                  Door Delivery
                </label>
              </div>

              <div style={{ flex: 1 }}>
                <label
                  style={{ fontSize: 13, marginBottom: 8, display: "block" }}
                >
                  Choose Payment Mode
                </label>

                <label
                  style={{
                    display: "flex",
                    gap: 8,
                    fontSize: 13,
                    alignItems: "center",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMode"
                    value="online"
                    checked={orderMeta.paymentMode === "online"}
                    onChange={(e) =>
                      updateOrderMeta("paymentMode", e.target.value)
                    }
                  />
                  Online Payment
                </label>

                <label
                  style={{
                    display: "flex",
                    gap: 8,
                    fontSize: 13,
                    alignItems: "center",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMode"
                    value="card"
                    checked={orderMeta.paymentMode === "card"}
                    onChange={(e) =>
                      updateOrderMeta("paymentMode", e.target.value)
                    }
                  />
                  Credit/ Debit Card
                </label>

                <label
                  style={{
                    display: "flex",
                    gap: 8,
                    fontSize: 13,
                    alignItems: "center",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMode"
                    value="cod"
                    checked={orderMeta.paymentMode === "cod"}
                    onChange={(e) =>
                      updateOrderMeta("paymentMode", e.target.value)
                    }
                  />
                  Cash on Delivery
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ===== QUICK CHECKLIST ===== */}
        <div style={sectionCard}>
          <div style={sectionHeader}>Quick Checklist</div>

          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <label style={{ display: "flex", gap: 10 }}>
              <input
                type="checkbox"
                checked={quickChecklist.notifyCustomer}
                onChange={(e) =>
                  updateQuickChecklist("notifyCustomer", e.target.checked)
                }
              />
              Notify Retailer via SMS/Email
            </label>

            <label style={{ display: "flex", gap: 10 }}>
              <input
                type="checkbox"
                checked={quickChecklist.validLicense}
                onChange={(e) =>
                  updateQuickChecklist("validLicense", e.target.checked)
                }
              />
              All medicines are sold under valid license and verified
              prescriptions.
            </label>

            <label style={{ display: "flex", gap: 10 }}>
              <input
                type="checkbox"
                checked={quickChecklist.gstIncluded}
                onChange={(e) =>
                  updateQuickChecklist("gstIncluded", e.target.checked)
                }
              />
              Prices include applicable taxes (GST @5%).
            </label>

            <label style={{ display: "flex", gap: 10 }}>
              <input
                type="checkbox"
                checked={quickChecklist.replacementPolicy}
                onChange={(e) =>
                  updateQuickChecklist("replacementPolicy", e.target.checked)
                }
              />
              For replacement or issues, contact support within 24 hours of
              delivery.
            </label>
          </div>
        </div>

        {/* ===== DISTRIBUTOR DETAILS ===== */}
        <div style={sectionCard}>
          <div style={sectionHeader}>Distributor Details</div>

          <div style={{ padding: "14px 16px", color: "#0b2b1a" }}>
            {/* Row 1 — Name & License */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <div>
                <strong style={{ color: GREEN }}>Distributor Name:</strong>{" "}
                HealthPlus
              </div>
              <div>
                <strong style={{ color: GREEN }}>License No:</strong> PH-478920
              </div>
            </div>

            {/* Row 2 — Address & GSTIN on right */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <div style={{ maxWidth: "60%" }}>
                <strong style={{ color: GREEN }}>Address:</strong> Plot 42,
                Industrial Area, Gurugram, Haryana
              </div>

              <div>
                <strong style={{ color: GREEN }}>GSTIN:</strong> 06ABCDE1234F1Z8
              </div>
            </div>

            {/* Support Row */}
            <div>
              <strong style={{ color: GREEN }}>Support:</strong> +91 90000 11223
              | support@healthplus.in
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ textAlign: "center", marginTop: 6 }}>
          <div style={{ color: GREEN, fontWeight: 700 }}>
            Thank you for choosing HealthPlus!
          </div>
          <div style={{ color: "#294B36", marginTop: 6 }}>
            Stay Healthy, Stay Safe.
          </div>
        </div>
      </div>
    </div>
  );
}
