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
    const gst = Math.round((subtotal * 0.05) * 100) / 100; // 2 decimals
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
  if (quickChecklist.validLicense) notes.push("All medicines are sold under valid license and verified prescriptions.");
  if (quickChecklist.gstIncluded) notes.push("Prices include applicable taxes (GST @5%).");
  if (quickChecklist.replacementPolicy) notes.push("For replacement or issues, contact support within 24 hours of delivery.");
  if (quickChecklist.notifyCustomer) notes.unshift("Notify Customer via SMS/Email"); // keep notify first if set

  // Order display values (dates, modes)
  const displayOrderDate = orderMeta.orderDate || "--";
  const displayExpected = orderMeta.expectedDate || "--";
  const displayDeliveryMode = orderMeta.deliveryMode === "door" ? "Door Delivery" : "Pickup";
  const displayPaymentMode = orderMeta.paymentMode === "online" ? "Online (Prepaid)" : (orderMeta.paymentMode === "card" ? "Credit/Debit Card" : "Cash on Delivery");

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
          <h2 style={{ fontWeight: 700, fontSize: 18, color: GREEN }}>Preview Order</h2>
        </div>

        {/* CUSTOMER DETAILS */}
        <div style={sectionCard}>
          <div style={headerStyle}>Customer Details</div>

          <div style={{ padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 14, lineHeight: "22px" }}>
                <div style={{ fontWeight: 600 }}>{customer.fullName || "--"}</div>
                <div>{customer.address || "--"}</div>
                <div>{customer.address ? "" : ""}</div>
                <div>Contact: {customer.contact || "--"}</div>
                <div>Email: {customer.email || "--"}</div>
              </div>

              <div style={{ fontSize: 14, textAlign: "right", lineHeight: "22px" }}>
                <div><span style={{ fontWeight: 600 }}>Order ID:</span> {orderId}</div>
                <div><span style={{ fontWeight: 600 }}>Order Date:</span> {displayOrderDate}</div>
                <div><span style={{ fontWeight: 600 }}>Expected Delivery:</span> {displayExpected}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div style={sectionCard}>
          <div style={headerStyle}>Order Summary</div>

          <div style={{ padding: 16 }}>
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
              {/* Table Header */}
              <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 100px 100px 100px 100px", padding: "10px 12px", background: "#FAF9F9", borderBottom: `1px solid ${BORDER}`, fontWeight: 600, fontSize: 14 }}>
                <div>S.No</div>
                <div>Medicine</div>
                <div>Quantity</div>
                <div>Unit Price</div>
                <div>GST(5%)</div>
                <div>Total</div>
              </div>

              {/* Rows */}
              {rows.length === 0 ? (
                <div style={{ padding: 12, textAlign: "center" }}>No medicines added</div>
              ) : (
                rows.map((r, idx) => (
                  <div key={r.id} style={{ display: "grid", gridTemplateColumns: "70px 1fr 100px 100px 100px 100px", padding: "12px", fontSize: 14 }}>
                    <div>{idx + 1}</div>
                    <div>
                      <div>{r.name}</div>
                      {r.brand && <div style={{ fontSize: 13 }}>{r.brand}</div>}
                    </div>
                    <div>{r.qty}</div>
                    <div>₹{Number(r.price).toFixed(2)}</div>
                    <div>₹{Number(r.gst).toFixed(2)}</div>
                    <div>₹{Number(r.total).toFixed(2)}</div>
                  </div>
                ))
              )}

              {/* Total */}
              <div style={{ padding: "14px 16px", textAlign: "right", borderTop: `1px solid ${BORDER}`, fontWeight: 700, fontSize: 16 }}>
                Total: ₹{grandTotalFormatted}
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT & DELIVERY */}
        <div style={sectionCard}>
          <div style={headerStyle}>Payment & Delivery</div>

          <div style={{ padding: 16, fontSize: 14, display: "flex", justifyContent: "space-between" }}>
            <div><strong>Payment Mode:</strong> {displayPaymentMode}</div>
            <div><strong>Delivery Method:</strong> {displayDeliveryMode}</div>
          </div>
        </div>

        {/* NOTES (quickChecklist selections appear here) */}
        <div style={sectionCard}>
          <div style={headerStyle}>Notes</div>

          <div style={{ padding: 16, fontSize: 14 }}>
            {notes.length === 0 ? (
              <ul style={{ paddingLeft: 20, lineHeight: "24px" }}>
                <li>All medicines are sold under valid license and verified prescriptions.</li>
                <li>Prices include applicable taxes (GST @5%).</li>
                <li>For replacement or issues, contact support within 24 hours of delivery.</li>
              </ul>
            ) : (
              <ul style={{ paddingLeft: 20, lineHeight: "24px" }}>
                {notes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            )}
          </div>
        </div>

        {/* DISTRIBUTOR DETAILS (static) */}
        <div style={sectionCard}>
          <div style={headerStyle}>Distributor Details</div>

          <div style={{ padding: 16, fontSize: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div><strong>Retailer Name:</strong> HealthPlus</div>
              <div><strong>License No:</strong> PH-478920</div>
            </div>

            <div style={{ marginBottom: 8 }}><strong>Address:</strong> Plot 42, Industrial Area, Gurugram, Haryana</div>
            <div style={{ marginBottom: 8 }}><strong>GSTIN:</strong> 06ABCDE1234F1Z8</div>
            <div><strong>Support:</strong> +91 90000 11223 | support@healthplus.in</div>
          </div>
        </div>

        {/* FOOTER MESSAGE */}
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <div style={{ fontWeight: 700 }}>Thank you for choosing HealthPlus!</div>
          <div style={{ marginTop: 6 }}>Stay Healthy. Stay Safe.</div>
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
        <button style={{ flex: 1, background: GREEN, color: "white", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
          Place an order
        </button>

        <button style={{ flex: 1, background: "white", color: GREEN, padding: "12px 0", borderRadius: 8, border: `1px solid ${GREEN}`, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
