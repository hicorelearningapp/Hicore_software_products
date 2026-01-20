// src/your-path/RightSidebar.jsx
import React from "react";

const RightSidebar = ({
  orderId,
  customer,
  medicines,
  orderDate,
  expectedDate,
  paymentMode,
  deliveryMethod,
  onPlaceOrder,
  onTrackOrder,
}) => {
  const total = medicines.reduce(
    (sum, m) => sum + Number(m.unitPrice || 0) * Number(m.qty || 0),
    0
  );

  return (
    <div className="bg-white">
      {/* CUSTOMER DETAILS */}
      <div className="border border-[#D9EAD9] rounded-xl bg-white overflow-hidden mb-6">
        <div className="bg-[#E7EFEA] px-6 py-3 border-b border-[#D9EAD9]">
          <h3 className="text-lg font-semibold text-[#115D29]">
            Customer Details
          </h3>
        </div>

        <div className="p-6 text-[#115D29] text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="space-y-3">
              <p className="font-semibold">{customer.name || "—"}</p>

              <p>{customer.address ? customer.address : "—"}</p>

              <p>
                Contact:{" "}
                <span className="font-medium">{customer.contact || "—"}</span>
              </p>

              <p>
                Email:{" "}
                <span className="font-medium">{customer.email || "—"}</span>
              </p>
            </div>

            <div className="space-y-4 mt-6 md:mt-0 md:text-right">
              <p>
                Order ID: <span className="font-semibold">{orderId}</span>
              </p>

              <p>
                Order Date:{" "}
                <span className="font-semibold">{orderDate || "—"}</span>
              </p>

              <p>
                Expected Delivery:{" "}
                <span className="font-semibold">{expectedDate || "—"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ORDER SUMMARY */}
      <div className="border border-[#D9EAD9] rounded-xl bg-white overflow-hidden mb-6">
        <div className="bg-[#E7EFEA] px-6 py-3 border-b border-[#D9EAD9]">
          <h3 className="text-lg font-semibold text-[#115D29]">
            Order Summary
          </h3>
        </div>

        <div className="p-6 text-[#115D29] text-sm">
          <div className="border border-[#D9EAD9] rounded-xl overflow-hidden">
            <div className="grid grid-cols-5 font-semibold bg-[#FBFBFB] px-4 py-3 border-b border-[#D9EAD9]">
              <p>S.No</p>
              <p>Medicine</p>
              <p>Quantity</p>
              <p>Unit Price</p>
              <p>Total</p>
            </div>

            <div className="px-4 py-4 space-y-6">
              {medicines.length === 0 && (
                <p className="text-sm text-[#6b8a72]">
                  No medicines added yet.
                </p>
              )}

              {medicines.map((m, idx) => {
                const lineTotal = Number(m.unitPrice || 0) * Number(m.qty || 0);
                return (
                  <div className="grid grid-cols-5" key={m.id}>
                    <p>{idx + 1}</p>
                    <p>{m.name}</p>
                    <p>{m.qty}</p>
                    <p>₹{Number(m.unitPrice || 0).toFixed(2)}</p>
                    <p>₹{lineTotal.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[#D9EAD9] px-4 py-4 flex justify-end">
              <p className="font-semibold text-lg">
                Total: <span className="font-bold">₹{total.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT & DELIVERY */}
      <div className="border border-[#D9EAD9] rounded-xl bg-white overflow-hidden mb-6">
        <div className="bg-[#E7EFEA] px-6 py-3 border-b border-[#D9EAD9]">
          <h3 className="text-lg font-semibold text-[#115D29]">
            Payment & Delivery
          </h3>
        </div>

        <div className="p-6 text-[#115D29] text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <p className="text-sm">
                Payment Mode:{" "}
                <span className="font-semibold">{paymentMode || "—"}</span>
              </p>
            </div>

            <div className="md:text-right">
              <p className="text-sm">
                Delivery Method:{" "}
                <span className="font-semibold">{deliveryMethod || "—"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NOTES */}
      <div className="border border-[#D9EAD9] rounded-xl bg-white overflow-hidden mb-8">
        <div className="bg-[#E7EFEA] px-6 py-3 border-b border-[#D9EAD9]">
          <h3 className="text-lg font-semibold text-[#115D29]">Notes</h3>
        </div>

        <div className="p-6 text-[#115D29] text-sm">
          <ul className="list-disc pl-5 space-y-4">
            <li>
              All medicines are sold under valid license and verified
              prescriptions.
            </li>
            <li>Prices include applicable taxes (GST @5%).</li>
          </ul>
        </div>
      </div>

      {/* STICKY BOTTOM BUTTONS */}
      <div className="bg-white pt-2">
        <div className="max-w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={onPlaceOrder}
              className="w-full bg-[#155C2A] hover:bg-[#0f4a21] text-white font-semibold py-3 rounded-lg"
            >
              Place an order
            </button>
            <button
              onClick={onTrackOrder}
              className="w-full border border-[#155C2A] text-[#155C2A] font-semibold py-3 rounded-lg hover:bg-[#F3F9F5]"
            >
              Track the Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
