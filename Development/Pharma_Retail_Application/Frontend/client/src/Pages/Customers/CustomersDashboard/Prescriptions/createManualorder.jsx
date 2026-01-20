// src/your-path/CreateManualorder.jsx
import React, { useState } from "react";
import backIcon from "../../../../assets/Customers/Prescription/back-icon.png";

import Leftsidebar from "./Leftsidebar";
import RightSidebar from "./RightSidebar";
import OrderSuccessModal from "./OrderSuccessModal"; // make sure path is correct

const CreateManualorder = ({ onClose }) => {
  const handleBack = (e) => {
    e?.preventDefault();
    if (typeof onClose === "function") return onClose();
    if (window.history && window.history.length > 1) window.history.back();
  };

  // Shared state (lifted)
  const [customer, setCustomer] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
  });

  const [orderDate, setOrderDate] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("Online (Prepaid)");
  const [deliveryMethod, setDeliveryMethod] = useState("Door Delivery");

  const [medicines, setMedicines] = useState([]);

  // generate an order id once
  const [orderId] = useState(() => {
    const n = Math.floor(10000 + Math.random() * 90000);
    return `ORD-${n}`;
  });

  // modal visibility
  const [showSuccess, setShowSuccess] = useState(false);

  // helper to add a medicine to list
  const addMedicine = (medicine) => {
    setMedicines((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...medicine,
        qty: Number(medicine.qty) || 0,
        unitPrice: Number(medicine.unitPrice) || 0,
      },
    ]);
  };

  // helper to remove medicine
  const removeMedicine = (id) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  // place order handler: show success modal immediately (no validation)
  const handlePlaceOrder = () => {
    const payload = {
      orderId,
      customer,
      medicines,
      orderDate,
      expectedDate,
      paymentMode,
      deliveryMethod,
      total: medicines.reduce(
        (s, m) => s + Number(m.unitPrice || 0) * Number(m.qty || 0),
        0
      ),
    };

    // keep a console log for debugging (optional)
    console.log("Placing order (no validation):", payload);

    // show success modal immediately
    setShowSuccess(true);

    // If you want to auto-close modal after X seconds, uncomment below:
    // setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleTrackOrder = () => {
    const url = `/orders/${orderId}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-white px-6">
      {/* Success modal */}
      <OrderSuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
      />

      {/* Back + Title */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-[#115D29] text-sm font-medium hover:underline"
          aria-label="Back"
        >
          <span className="inline-flex w-7 h-7 rounded-full items-center justify-center">
            <img src={backIcon} alt="Back" className="w-5 h-5 object-contain" />
          </span>
          <span>Back</span>
        </button>

        <h1 className="mt-5 text-2xl font-semibold text-[#115D29]">
          Create Manual Order
        </h1>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="border border-[#D9EAD9] rounded-xl p-6 bg-white">
          <h3 className="text-lg font-semibold text-[#115D29] mb-4">
            Create an Order
          </h3>

          <Leftsidebar
            customer={customer}
            onCustomerChange={setCustomer}
            addMedicine={addMedicine}
            medicines={medicines}
            removeMedicine={removeMedicine}
            orderDate={orderDate}
            setOrderDate={setOrderDate}
            expectedDate={expectedDate}
            setExpectedDate={setExpectedDate}
            paymentMode={paymentMode}
            setPaymentMode={setPaymentMode}
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="border border-[#D9EAD9] rounded-xl p-6 bg-white">
          <h3 className="text-lg font-semibold text-[#115D29] mb-4">
            Preview Order
          </h3>

          <RightSidebar
            orderId={orderId}
            customer={customer}
            medicines={medicines}
            orderDate={orderDate}
            expectedDate={expectedDate}
            paymentMode={paymentMode}
            deliveryMethod={deliveryMethod}
            onPlaceOrder={handlePlaceOrder}
            onTrackOrder={handleTrackOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateManualorder;
