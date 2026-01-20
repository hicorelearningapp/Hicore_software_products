import React, { useState } from "react";

// Colors
const GREEN = "#115D29";
const BORDER = "#C7DECF";

import rejectedIcon from "../../../../assets/CustomerOrder/rejected.png";
import closeIcon from "../../../../assets/CustomerOrder/close-icon.png";

export default function ValidReasonPopup({ onConfirm, onCancel }) {
  const [selected, setSelected] = useState("");
  const [otherText, setOtherText] = useState("");
  const [showRejectedPopup, setShowRejectedPopup] = useState(false);
  const [showMain, setShowMain] = useState(true);
  const [reasonToSend, setReasonToSend] = useState("");

  const reasons = [
    { key: "Out of Stock", desc: "Item(s) unavailable at the moment." },
    {
      key: "Invalid Prescription",
      desc: "Uploaded prescription is unclear or expired.",
    },
    {
      key: "Prescription Missing",
      desc: "Required prescription not uploaded.",
    },
    {
      key: "Quantity Not Available",
      desc: "Requested quantity exceeds current stock.",
    },
    {
      key: "Medicine Discontinued",
      desc: "Product no longer supplied by distributor.",
    },
    {
      key: "Delivery Unavailable",
      desc: "Delivery service not active in the customer’s area.",
    },
    {
      key: "Regulatory Restriction",
      desc: "Product requires special authorization.",
    },
  ];

  const handleConfirm = () => {
    const reason = selected ? selected : otherText.trim();
    if (!reason) return;

    setReasonToSend(reason);
    setShowMain(false);
    setShowRejectedPopup(true);
  };

  const handleRejectedClose = () => {
    setShowRejectedPopup(false);
    if (onConfirm && reasonToSend) onConfirm(reasonToSend);
    if (onCancel) onCancel();
    // reset
    setSelected("");
    setOtherText("");
    setReasonToSend("");
    setShowMain(true);
  };

  const handleCancel = () => {
    setSelected("");
    setOtherText("");
    setShowRejectedPopup(false);
    setShowMain(true);
    setReasonToSend("");
    if (onCancel) onCancel();
  };

  return (
    <>
      {/* MAIN POPUP */}
      {showMain && (
        <div
          style={{
            width: "100%",
            maxWidth: 620,
            margin: "0 auto",
            background: "white",
            borderRadius: 16,
            border: `1px solid ${BORDER}`,
            padding: 28,
            boxShadow: "0px 6px 16px rgba(0,0,0,0.08)",
            position: "relative",
            zIndex: 2000,
          }}
        >
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: GREEN,
              marginBottom: 22,
            }}
          >
            Select the valid reason:
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {reasons.map((item) => (
              <label
                key={item.key}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="validReason"
                  value={item.key}
                  checked={selected === item.key}
                  onChange={() => setSelected(item.key)}
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: GREEN,
                    marginTop: 3,
                  }}
                />

                <div style={{ fontSize: 14, color: GREEN, lineHeight: "20px" }}>
                  <span style={{ fontWeight: 500 }}>{item.key}</span>
                  {" – "}
                  <span style={{ fontWeight: 400 }}>{item.desc}</span>
                </div>
              </label>
            ))}

            <div style={{ marginTop: 6 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: GREEN,
                  marginBottom: 8,
                }}
              >
                Others
              </div>

              <textarea
                placeholder="Type the reason here..."
                value={otherText}
                onChange={(e) => {
                  setOtherText(e.target.value);
                  setSelected("");
                }}
                style={{
                  width: "100%",
                  height: 90,
                  borderRadius: 8,
                  border: `1px solid ${BORDER}`,
                  padding: "12px 14px",
                  outline: "none",
                  fontSize: 14,
                  color: GREEN,
                  background: "white",
                  resize: "none",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 28 }}>
            <button
              onClick={handleConfirm}
              style={{
                flex: 1,
                background: GREEN,
                color: "white",
                fontWeight: 600,
                padding: "12px 0",
                borderRadius: 8,
                border: "none",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Confirm
            </button>

            <button
              onClick={handleCancel}
              style={{
                flex: 1,
                background: "white",
                color: GREEN,
                border: `2px solid ${GREEN}`,
                fontWeight: 600,
                padding: "12px 0",
                borderRadius: 8,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* REJECTED POPUP (DESIGN MATCH FROM IMAGE) */}
      {showRejectedPopup && (
        <>
          {/* backdrop */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.12)",
              zIndex: 9998,
            }}
          />

          {/* Outer white rounded card (large) */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(460px, 92%)",
              maxWidth: 760,
              borderRadius: 14,
              background: "white",
              border: "1px solid #F2F2F2",
              padding: 28,
              boxShadow: "0px 10px 28px rgba(0,0,0,0.06)",
              zIndex: 9999,
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* Close button floating at top-right (outside inner card) */}
            <button
              onClick={handleRejectedClose}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 1,
                right: 12,
                width: 40,
                height: 40,
                padding: 0,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10000,
              }}
            >
              <img
                src={closeIcon}
                alt="close"
                style={{ width: 20, height: 20 }}
              />
            </button>

            {/* Inner pale-green bordered card */}
            <div
              style={{
                margin: "8px auto 0",
                maxWidth: 520,
                borderRadius: 12,
                border: `1px solid ${BORDER}`,
                padding: "46px 40px 36px",
                background: "white",
                textAlign: "center",
              }}
            >
              {/* Centered big red icon */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                <img
                  src={rejectedIcon}
                  alt="rejected"
                  style={{ width: 72, height: 72 }}
                />
              </div>

              {/* Title */}
              <h2
                style={{
                  color: "#D83434",
                  fontSize: 32,
                  margin: "6px 0 16px",
                  fontWeight: 700,
                }}
              >
                Order Rejected
              </h2>

              {/* Message -> larger green text, centered with comfortable line spacing */}
              <p
                style={{
                  color: GREEN,
                  fontSize: 18,
                  margin: 0,
                  lineHeight: "36px",
                  maxWidth: 480,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                The customer will be notified the
                <br />
                provided valid reason for rejection to
                <br />
                maintain service transparency.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
