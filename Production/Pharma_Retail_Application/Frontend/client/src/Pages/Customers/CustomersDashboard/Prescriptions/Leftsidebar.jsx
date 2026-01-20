import React, { useState } from "react";
import searchIcon from "../../../../assets/Customers/Prescription/search.png";
import calendarIcon from "../../../../assets/Customers/Prescription/Calendar.png";

const Leftsidebar = ({
  customer,
  onCustomerChange,
  addMedicine,
  medicines,
  removeMedicine,
  orderDate,
  setOrderDate,
  expectedDate,
  setExpectedDate,
  paymentMode,
  setPaymentMode,
  deliveryMethod,
  setDeliveryMethod,
}) => {
  // Local inputs for adding a medicine (kept minimal for design)
  const [medicineName, setMedicineName] = useState("");
  const [qty, setQty] = useState("");

  const handleCustomerField = (field, value) => {
    onCustomerChange({ ...customer, [field]: value });
  };

  const handleAddMedicine = (e) => {
    e?.preventDefault();
    // keep behavior simple: require a name; quantity defaults to 1 if empty
    const name = medicineName.trim();
    if (!name) return;
    const quantity = Number(qty) > 0 ? Number(qty) : 1;
    addMedicine({ name, qty: quantity, unitPrice: 0 }); // unitPrice default 0 (you can populate later)
    setMedicineName("");
    setQty("");
  };

  return (
    <div>
      {/* CUSTOMER INFO */}
      <div className="mb-6 border border-[#D9EAD9] rounded-xl overflow-hidden">
        <div className="bg-[#E7EFEA] px-6 py-3 border-b border-[#D9EAD9]">
          <h3 className="text-lg font-semibold text-[#115D29]">
            Customer Information
          </h3>
        </div>

        <div className="p-6">
          <div className="bg-[#FBFBFB] rounded-lg">
            <div className="mb-5">
              <label className="block text-sm font-medium text-[#115D29] mb-1">
                Customer Name
              </label>
              <input
                value={customer.name}
                onChange={(e) => handleCustomerField("name", e.target.value)}
                type="text"
                placeholder="e.g., Anita Sharma"
                className="w-full border border-[#BFDAC8] rounded-lg px-4 py-2.5 text-sm placeholder:text-[#A9B9AC] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-[#115D29] mb-1">
                  Contact Number
                </label>
                <input
                  value={customer.contact}
                  onChange={(e) =>
                    handleCustomerField("contact", e.target.value)
                  }
                  type="text"
                  placeholder="+91 Enter 10 digit Number"
                  className="w-full border border-[#BFDAC8] rounded-lg px-4 py-2.5 text-sm placeholder:text-[#A9B9AC] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#115D29] mb-1">
                  Email ID
                </label>
                <input
                  value={customer.email}
                  onChange={(e) => handleCustomerField("email", e.target.value)}
                  type="email"
                  placeholder="name@email.com"
                  className="w-full border border-[#BFDAC8] rounded-lg px-4 py-2.5 text-sm placeholder:text-[#A9B9AC] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-[#115D29]">
                Address
              </label>
              <button className="text-xs text-[#2F72CC] hover:underline font-medium">
                Use GPS Location
              </button>
            </div>

            <input
              value={customer.address}
              onChange={(e) => handleCustomerField("address", e.target.value)}
              type="text"
              placeholder="Flat / Street / City / State / PIN Code"
              className="w-full border border-[#BFDAC8] rounded-lg px-4 py-2.5 text-sm placeholder:text-[#A9B9AC] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ADD MEDICINES */}
      <div className="mb-6 border border-[#D9EAD9] rounded-xl overflow-hidden">
        <div className="bg-[#E7EFEA] px-6 py-3 border-b border-[#D9EAD9]">
          <h3 className="text-lg font-semibold text-[#115D29]">
            Add Medicines to Order
          </h3>
        </div>

        <div className="p-6">
          <div className="bg-[#FBFBFB]">
            {/* Keep input UI exactly like your screenshot: Search box */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-[#115D29] mb-1">
                Add Medicine
              </label>

              <div className="relative">
                <input
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  type="text"
                  placeholder="Search Medicine"
                  className="w-full border border-[#BFDAC8] rounded-lg px-4 py-2.5 pr-10 text-sm placeholder:text-[#A9B9AC] focus:outline-none"
                />

                <img
                  src={searchIcon}
                  alt="search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
                />
              </div>
            </div>

            {/* Quantity input (keeps the same visual style) */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-[#115D29] mb-1">
                Quantity
              </label>
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                type="number"
                min="1"
                placeholder="Enter quantity in number"
                className="w-full border border-[#BFDAC8] rounded-lg px-4 py-2.5 text-sm placeholder:text-[#A9B9AC] focus:outline-none"
                onKeyDown={(e) => {
                  // allow Enter to add medicine for keyboard users
                  if (e.key === "Enter") handleAddMedicine();
                }}
              />
            </div>

            {/* + Add Another Medicine link — visual unchanged */}
            <button
              onClick={handleAddMedicine}
              className="text-sm text-[#2F72CC] mt-1 mb-5 hover:underline flex items-center gap-1"
              type="button"
            >
              <span className="text-base">+</span> Add Another Medicine
            </button>

            {/* existing medicines list with remove */}
            {medicines.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-[#115D29] mb-2">
                  Added Medicines
                </p>
                <div className="space-y-2">
                  {medicines.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between bg-white border border-[#E8F1EA] rounded-lg px-3 py-2"
                    >
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-[#4A6E5A]">
                          Qty: {m.qty} • ₹{Number(m.unitPrice || 0).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeMedicine(m.id)}
                        className="text-xs text-[#2F72CC] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm font-medium text-[#115D29] mb-3">
              Near by Retailer
            </p>

            <div className="space-y-4 text-[#115D29] text-sm">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="retailer"
                  className="mt-1"
                  onChange={() => {}}
                />
                <span>
                  Nearest Retailer - Get it today{" "}
                  <span className="text-[#4A6E5A]">
                    (Auto-assign fastest active pharmacy)
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="radio" name="retailer" className="mt-1" />
                <span>
                  App Store - Save 10%{" "}
                  <span className="text-[#4A6E5A]">
                    (Delivery in 2 days from distributor stock)
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1" />
                <span>All medicines verified and available</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT & DELIVERY DETAILS (unchanged) */}
      <div className="border border-[#D9EAD9] rounded-xl overflow-hidden">
        <div className="bg-[#E7EFEA] px-6 py-3 border-b border-[#D9EAD9]">
          <h3 className="text-lg font-semibold text-[#115D29]">
            Payment & Delivery Details
          </h3>
        </div>

        <div className="p-6">
          <div className="bg-[#FBFBFB] rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-[#115D29]">
                Delivery Address
              </label>
              <button className="text-xs text-[#2F72CC] hover:underline font-medium">
                Use GPS Location
              </button>
            </div>

            <input
              value={customer.address}
              onChange={(e) => handleCustomerField("address", e.target.value)}
              type="text"
              placeholder="Flat / Street / City / State / PIN Code"
              className="w-full border border-[#BFDAC8] rounded-lg px-4 py-2.5 mb-5 text-sm placeholder:text-[#A9B9AC] focus:outline-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#115D29] mb-1">
                  Order Date
                </label>
                <div className="relative">
                  <input
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    type="date"
                    placeholder="Select Date"
                    className="w-full border border-[#BFDAC8] rounded-lg px-4 py-2.5 pr-10 text-sm placeholder:text-[#A9B9AC] focus:outline-none"
                  />
                  <img
                    src={calendarIcon}
                    alt="calendar"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-70"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#115D29] mb-1">
                  Expected Delivery Date
                </label>
                <div className="relative">
                  <input
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    type="date"
                    placeholder="Select Date"
                    className="w-full border border-[#BFDAC8] rounded-lg px-4 py-2.5 pr-10 text-sm placeholder:text-[#A9B9AC] focus:outline-none"
                  />
                  <img
                    src={calendarIcon}
                    alt="calendar"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-70"
                  />
                </div>
              </div>
            </div>

            {/* Delivery/Payment (unchanged) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-[#115D29] mb-2">
                  Choose Delivery Mode
                </p>
                <div className="space-y-3 text-sm text-[#115D29]">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryMode"
                      checked={deliveryMethod === "Pickup"}
                      onChange={() => setDeliveryMethod("Pickup")}
                    />
                    Pickup
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryMode"
                      checked={deliveryMethod === "Door Delivery"}
                      onChange={() => setDeliveryMethod("Door Delivery")}
                    />
                    Door Delivery
                  </label>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#115D29] mb-2">
                  Choose Payment Mode
                </p>
                <div className="space-y-3 text-sm text-[#115D29]">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMode"
                      checked={paymentMode === "Online (Prepaid)"}
                      onChange={() => setPaymentMode("Online (Prepaid)")}
                    />
                    Online Payment
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMode"
                      checked={paymentMode === "Card"}
                      onChange={() => setPaymentMode("Card")}
                    />
                    Credit/ Debit Card
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMode"
                      checked={paymentMode === "COD"}
                      onChange={() => setPaymentMode("COD")}
                    />
                    Cash on Delivery
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* QUICK CHECKLIST (unchanged) */}
      <div className="mt-6 border border-[#D9EAD9] rounded-xl overflow-hidden">
        <div className="bg-[#E7EFEA] px-6 py-3 border-b border-[#D9EAD9]">
          <h3 className="text-lg font-semibold text-[#115D29]">
            Quick Checklist
          </h3>
        </div>

        <div className="p-6">
          <div className="bg-[#FBFBFB] rounded-lg p-4 text-[#115D29] text-sm space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span>Notify Retailer via SMS/Email</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span>
                All medicines are sold under valid license and verified
                prescriptions.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span>Prices include applicable taxes (GST @5%).</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leftsidebar;
