import React from "react";

const GREEN = "#115D29";
const BORDER = "#DDEDE3";

/**
 * Calculates quantity to display:
 * prefer qtyMax if present, otherwise qtyMin, otherwise 0
 * prices are parsed to float; gst is subtotal * 0.05
 */
function parseNumber(value) {
  const num = parseFloat(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(num) ? num : 0;
}

export default function CreateManualOrderPageRight(props) {
  const { customer, medicines, orderMeta, quickChecklist, orderId } = props;

  // compute table rows and totals
  const rows = medicines.map((m) => {
    const qty = Number(m.qtyMax || m.qtyMin || 0);
    const price = parseNumber(m.price);
    const subtotal = qty * price;
    const gst = Math.round(subtotal * 0.05 * 100) / 100; // 2 decimals
    const total = Math.round((subtotal + gst) * 100) / 100;
    return {
      id: m.id,
      name: m.name || "--",
      brand: m.brand || "",
      qty,
      price: price.toFixed(2),
      gst: gst.toFixed(2),
      total: total.toFixed(2),
    };
  });

  const grandTotal = rows.reduce((acc, r) => acc + parseFloat(r.total || 0), 0);
  const grandTotalFormatted = grandTotal.toFixed(2);

  // build notes from quickChecklist (only selected ones)
  const notes = [];
  if (quickChecklist.validLicense)
    notes.push(
      "All medicines are sold under valid license and verified prescriptions."
    );
  if (quickChecklist.gstIncluded)
    notes.push("Prices include applicable taxes (GST @5%).");
  if (quickChecklist.replacementPolicy)
    notes.push(
      "For replacement or issues, contact support within 24 hours of delivery."
    );
  if (quickChecklist.notifyCustomer)
    notes.unshift("Notify Customer via SMS/Email"); // keep notify first if set

  // Order display values (dates, modes)
  const displayOrderDate = orderMeta.orderDate || "--";
  const displayExpected = orderMeta.expectedDate || "--";
  const displayDeliveryMode =
    orderMeta.deliveryMode === "door" ? "Door Delivery" : "Pickup";
  const displayPaymentMode =
    orderMeta.paymentMode === "online"
      ? "Online (Prepaid)"
      : orderMeta.paymentMode === "card"
      ? "Credit/Debit Card"
      : "Cash on Delivery";

  const sectionCard = {
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    overflow: "hidden",
    background: "white",
    marginBottom: 18,
  };

  const headerStyle = {
    background: "#FAF9F9",
    padding: "12px 16px",
    borderBottom: "1px solid #E7EFEA",
    fontSize: 16,
    fontWeight: 700,
    color: GREEN,
  };

  const smallText = { fontSize: 14, color: GREEN };

  return (
    <div
      style={{
        width: "100%",
        color: GREEN,
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <div>
        {/* Title */}
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, color: GREEN }}>
            Preview Order
          </h2>
        </div>

        {/* RETAILER DETAILS */}
        <div style={sectionCard}>
          <div style={headerStyle}>Retailer Details</div>

          <div style={{ padding: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              {/* Left column: retailer info */}
              <div style={{ flex: 1, fontSize: 14, lineHeight: "22px" }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                  {customer.fullName || "Retailer Name"}
                </div>

                {/* Address with line breaks if present */}
                <div style={{ color: "#274E3A", marginBottom: 6 }}>
                  {customer.address
                    ? customer.address
                    : "23, Green View Apartments, Sector 14,\nGurugram, Haryana – 122001"}
                </div>

                <div style={{ marginBottom: 4 }}>
                  Contact: {customer.contact || "+91 98765 43210"}
                </div>
                <div>Email: {customer.email || "anita.sharma@email.com"}</div>
              </div>

              {/* Right column: order meta aligned right */}
              <div
                style={{
                  width: 220,
                  textAlign: "right",
                  fontSize: 14,
                  lineHeight: "22px",
                }}
              >
                <div>
                  <span style={{ fontWeight: 600 }}>Order ID:</span> {orderId}
                </div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontWeight: 600 }}>Order Date:</span>{" "}
                  <span style={{ color: "#054D22", fontWeight: 700 }}>
                    {displayOrderDate}
                  </span>
                </div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontWeight: 600 }}>Expected Delivery:</span>{" "}
                  <span style={{ color: "#054D22", fontWeight: 700 }}>
                    {displayExpected}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div style={sectionCard}>
          <div style={headerStyle}>Order Summary</div>

          <div style={{ padding: 16 }}>
            <div
              style={{
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {/* Table Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "70px 1fr 100px 120px 100px 100px",
                  padding: "10px 12px",
                  background: "#FAF9F9",
                  borderBottom: `1px solid ${BORDER}`,
                  fontWeight: 700,
                  fontSize: 14,
                  color: GREEN,
                }}
              >
                <div>S.No</div>
                <div>Medicine</div>
                <div style={{ textAlign: "center" }}>Quantity</div>
                <div style={{ textAlign: "right" }}>Unit Price</div>
                <div style={{ textAlign: "right" }}>GST(5%)</div>
                <div style={{ textAlign: "right" }}>Total</div>
              </div>

              {/* Rows */}
              {rows.length === 0 ? (
                <div style={{ padding: 12, textAlign: "center" }}>
                  No medicines added
                </div>
              ) : (
                rows.map((r, idx) => (
                  <div
                    key={r.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "70px 1fr 100px 120px 100px 100px",
                      padding: "12px",
                      fontSize: 14,
                      color: "#1f5c36",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ color: GREEN }}>{idx + 1}</div>

                    <div>
                      <div>{r.name}</div>
                      {r.brand && (
                        <div style={{ fontSize: 13, color: "#2b5f3b" }}>
                          {r.brand}
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: "center" }}>{r.qty}</div>

                    <div style={{ textAlign: "right" }}>
                      ₹{Number(r.price).toFixed(2)}
                    </div>

                    <div style={{ textAlign: "right" }}>
                      ₹{Number(r.gst).toFixed(2)}
                    </div>

                    <div style={{ textAlign: "right" }}>
                      ₹{Number(r.total).toFixed(2)}
                    </div>
                  </div>
                ))
              )}

              {/* Total line */}
              <div
                style={{
                  padding: "14px 16px",
                  textAlign: "right",
                  borderTop: `1px solid ${BORDER}`,
                  fontWeight: 700,
                  fontSize: 16,
                  color: GREEN,
                }}
              >
                Total: ₹{grandTotalFormatted}
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT & DELIVERY */}
        <div style={sectionCard}>
          <div style={headerStyle}>Payment & Delivery</div>

          <div
            style={{
              padding: 16,
              fontSize: 14,
              display: "flex",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <div>
              <strong>Payment Mode:</strong>{" "}
              <span style={{ color: "#054D22", fontWeight: 700 }}>
                {displayPaymentMode}
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <strong>Delivery Method:</strong>{" "}
              <span style={{ color: "#054D22", fontWeight: 700 }}>
                {displayDeliveryMode}
              </span>
            </div>
          </div>
        </div>

        {/* NOTES */}
        <div style={sectionCard}>
          <div style={headerStyle}>Notes</div>

          <div style={{ padding: 16, fontSize: 14 }}>
            {notes.length === 0 ? (
              <ul
                style={{
                  paddingLeft: 20,
                  lineHeight: "24px",
                  color: "#1f5c36",
                  listStyleType: "disc", // <-- IMPORTANT (shows bullet points)
                  margin: 0,
                }}
              >
                <li>
                  All medicines are sold under valid license and verified
                  prescriptions.
                </li>
                <li>Prices include applicable taxes (GST @5%).</li>
                <li>
                  For replacement or issues, contact support within 24 hours of
                  delivery.
                </li>
              </ul>
            ) : (
              <ul
                style={{
                  paddingLeft: 20,
                  lineHeight: "24px",
                  color: "#1f5c36",
                }}
              >
                {notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* DISTRIBUTOR DETAILS */}
        <div style={sectionCard}>
          <div style={headerStyle}>Distributor Details</div>

          <div style={{ padding: 16, fontSize: 14, color: "#163e2a" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <div>
                <strong style={{ color: GREEN }}>Retailer Name:</strong>{" "}
                HealthPlus
              </div>
              <div>
                <strong style={{ color: GREEN }}>License No:</strong> PH-478920
              </div>
            </div>

            {/* address on left, GSTIN on right (same row) */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <div style={{ maxWidth: "72%", color: "#163e2a" }}>
                <strong style={{ color: GREEN }}>Address:</strong> Plot 42,
                Industrial Area, Gurugram, Haryana
              </div>
              <div style={{ textAlign: "right" }}>
                <strong style={{ color: GREEN }}>GSTIN:</strong> 06ABCDE1234F1Z8
              </div>
            </div>

            <div>
              <strong style={{ color: GREEN }}>Support:</strong> +91 90000 11223
              | support@healthplus.in
            </div>
          </div>
        </div>

        {/* FOOTER MESSAGE */}
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <div style={{ fontWeight: 700, color: GREEN }}>
            Thank you for choosing HealthPlus!
          </div>
          <div style={{ marginTop: 6, color: "#3b6a4a" }}>
            Stay Healthy. Stay Safe.
          </div>
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
        <button
          style={{
            flex: 1,
            background: GREEN,
            color: "white",
            padding: "12px 0",
            borderRadius: 8,
            border: "none",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Place an order
        </button>

        <button
          style={{
            flex: 1,
            background: "white",
            color: GREEN,
            padding: "12px 0",
            borderRadius: 8,
            border: `1px solid ${GREEN}`,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Track the Order
        </button>
      </div>
    </div>
  );
}
