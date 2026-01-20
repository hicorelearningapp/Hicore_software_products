// PlaceOrderScreen.jsx
import React, { useEffect, useRef, useState } from "react";

// icons from your assets folder
import backIcon from "../../../../assets/DistributorPage/CircleArrow.png";
import searchIcon from "../../../../assets/DistributorPage/Search.png";
import dropdownIcon from "../../../../assets/DistributorPage/down-icon.png";
import removeIcon from "../../../../assets/DistributorPage/Drop-icon.png";
import bestPriceIcon from "../../../../assets/DistributorPage/right.png";
import calendarIcon from "../../../../assets/DistributorPage/Calendar.png";
import locationIcon from "../../../../assets/DistributorPage/Location.png";

import successIcon from "../../../../assets/DistributorPage/Party.png";
import closeIcon from "../../../../assets/DistributorPage/Drop-icon.png";

const convertDMYtoISO = (dmY) => {
  if (!dmY) return "";
  const parts = dmY.trim().split("/");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    if (d && m && y) {
      const dd = d.padStart(2, "0");
      const mm = m.padStart(2, "0");
      return `${y}-${mm}-${dd}`;
    }
  }
  return "";
};

const formatISOtoDMY = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y}`;
};

// parse user-typed value into ISO (accepts DD/MM/YYYY, YYYY-MM-DD, or Date-parsable)
const parseInputToISO = (val) => {
  if (!val) return "";
  const s = val.trim();
  // dd/mm/yyyy
  const dmyMatch = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const [, dd, mm, yyyy] = dmyMatch;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  // yyyy-mm-dd
  const isoMatch = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (isoMatch) {
    const [, yyyy, mm, dd] = isoMatch;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  // fallback: try Date parse
  const parsed = new Date(s);
  if (!isNaN(parsed.getTime())) {
    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, "0");
    const dd = String(parsed.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return "";
};

const PlaceOrderScreen = ({ onClose }) => {
  const [deliveryMode, setDeliveryMode] = useState("door");
  const [paymentMode, setPaymentMode] = useState("online");
  const [notify, setNotify] = useState(false);

  // initial preview dates converted into ISO so inputs are in sync with previous preview
  const [orderDateISO, setOrderDateISO] = useState(() =>
    convertDMYtoISO("29/10/2025")
  );
  const [expectedDateISO, setExpectedDateISO] = useState(() =>
    convertDMYtoISO("5/11/2025")
  );

  // visible text inputs (allow typing). initialize from ISO formatted DMY
  const [orderDisplay, setOrderDisplay] = useState(() =>
    formatISOtoDMY(convertDMYtoISO("29/10/2025"))
  );
  const [expectedDisplay, setExpectedDisplay] = useState(() =>
    formatISOtoDMY(convertDMYtoISO("5/11/2025"))
  );

  const [locationText] = useState("Google address");

  // controls the success popup
  const [showSuccess, setShowSuccess] = useState(false);

  // refs to native date inputs (hidden) so icon can open native picker
  const orderDateNativeRef = useRef(null);
  const expectedDateNativeRef = useRef(null);

  // When native date changes, sync both ISO and visible display
  const onOrderNativeChange = (e) => {
    setOrderDateISO(e.target.value || "");
    setOrderDisplay(e.target.value ? formatISOtoDMY(e.target.value) : "");
  };
  const onExpectedNativeChange = (e) => {
    setExpectedDateISO(e.target.value || "");
    setExpectedDisplay(e.target.value ? formatISOtoDMY(e.target.value) : "");
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Radio & Checkbox components unchanged visually
  const Radio = ({ id, name, checked, onChange, label }) => (
    <label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer select-none"
      onClick={() => onChange()}
    >
      <span
        className={
          "w-5 h-5 rounded-full flex items-center justify-center border " +
          (checked
            ? "border-green-600 bg-green-600"
            : "border-[#C7DECF] bg-white")
        }
      >
        {checked ? (
          <span className="w-2 h-2 rounded-full bg-white block" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-transparent block" />
        )}
      </span>
      <span className="text-[#115D29] text-sm">{label}</span>
      <input
        id={id}
        name={name}
        type="radio"
        checked={checked}
        onChange={() => onChange()}
        className="sr-only"
      />
    </label>
  );

  const Checkbox = ({ checked, onChange, label }) => (
    <label
      className="flex items-center gap-2 cursor-pointer select-none"
      onClick={() => onChange(!checked)}
    >
      <span
        className={
          "w-5 h-5 rounded-sm flex items-center justify-center border " +
          (checked
            ? "bg-green-600 border-green-600"
            : "bg-white border-[#C7DECF]")
        }
      >
        {checked ? (
          <svg
            width="10"
            height="8"
            viewBox="0 0 12 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 5L4.2 8L11 1" stroke="#ffffff" strokeWidth="2" />
          </svg>
        ) : null}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-[#115D29] text-sm">{label}</span>
    </label>
  );

  // When user leaves (blur) the text box, parse and normalize
  const handleOrderDisplayBlur = () => {
    const iso = parseInputToISO(orderDisplay);
    if (iso) {
      setOrderDateISO(iso);
      setOrderDisplay(formatISOtoDMY(iso));
    } else {
      // if invalid, keep whatever they typed but do not set ISO
      // alternatively we could clear
    }
  };

  const handleExpectedDisplayBlur = () => {
    const iso = parseInputToISO(expectedDisplay);
    if (iso) {
      setExpectedDateISO(iso);
      setExpectedDisplay(formatISOtoDMY(iso));
    }
  };

  // clicking calendar icon opens native picker (showPicker if available)
  const openOrderNativePicker = () => {
    const el = orderDateNativeRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      el.showPicker();
    } else {
      el.focus();
      el.click();
    }
  };
  const openExpectedNativePicker = () => {
    const el = expectedDateNativeRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      el.showPicker();
    } else {
      el.focus();
      el.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto p-6 scrollbar-hide">
      {/* BACK */}
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-[#115D29] text-lg"
      >
        <img src={backIcon} alt="back" className="w-5 h-5" />
        Back
      </button>

      <h1 className="text-2xl font-semibold text-[#115D29] mt-4">
        Place an Order
      </h1>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div className="border border-[#B5CDBD] rounded-lg p-6 bg-white">
          <h2 className="text-[#115D29] text-lg font-semibold mb-6">
            Place Order
          </h2>

          <label className="text-[#115D29] text-sm font-semibold">
            Choose Pharma Company (Multi - Select)
          </label>
          <div className="mt-2 w-full border border-[#C7DECF] rounded-md px-4 py-3 flex items-center justify-between text-[#9FB8A7]">
            <span>Select Distributor</span>
            <img src={dropdownIcon} className="w-6 h-6" />
          </div>

          <div className="flex gap-3 flex-wrap mt-3">
            {[
              "Pharma Company Name 1",
              "Pharma Company Name 2",
              "Pharma Company Name 3",
            ].map((d) => (
              <div
                key={d}
                className="px-3 py-1 border border-[#C7DECF] rounded-full text-[#115D29] text-sm flex items-center gap-2 bg-[#F0EFEF]"
              >
                <span>{d}</span>
                <button
                  type="button"
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                >
                  <img
                    src={removeIcon}
                    alt="remove"
                    className="w-[15px] h-[15px]"
                  />
                </button>
              </div>
            ))}
          </div>

          <label className="text-[#115D29] text-sm font-semibold mt-6 block">
            Add Medicine
          </label>
          <div className="mt-2 w-full border border-[#C7DECF] rounded-md px-3 py-2 flex items-center gap-3">
            <input
              type="text"
              placeholder="Search Medicine"
              className="outline-none flex-1 text-[#115D29]"
            />
            <img src={searchIcon} alt="search" className="w-5 h-5 opacity-80" />
          </div>

          <label className="text-[#115D29] text-sm font-semibold mt-6 block">
            Quantity
          </label>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div className="border border-[#C7DECF] rounded-md px-4 py-3 flex items-center justify-between">
              <span className="text-[#9FB8A7]">Select Min</span>
              <img src={dropdownIcon} alt="dropdown" className="w-4 h-4" />
            </div>
            <div className="border border-[#C7DECF] rounded-md px-4 py-3 flex items-center justify-between">
              <span className="text-[#9FB8A7]">Select Max</span>
              <img src={dropdownIcon} alt="dropdown" className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button className="text-[#115D29] text-sm flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-lg">
                +
              </span>
              Add Another Medicine
            </button>

            <button className="text-[#2874BA] text-sm flex items-center gap-2">
              <span>Check Best Price</span>
              <img src={bestPriceIcon} alt="best price" className="w-4 h-4" />
            </button>
          </div>

          {/* Dates row */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Order Date */}
            <div>
              <label className="text-[#115D29] text-sm font-semibold mb-2 block">
                Order Date
              </label>
              <div className="relative">
                <div className="border border-[#C7DECF] rounded-md px-3 py-3 flex items-center justify-between">
                  <input
                    type="text"
                    value={orderDisplay}
                    onChange={(e) => setOrderDisplay(e.target.value)}
                    onBlur={handleOrderDisplayBlur}
                    placeholder="DD/MM/YYYY"
                    className="outline-none bg-transparent text-[#115D29] w-full"
                    aria-label="Order date"
                  />
                  <img
                    src={calendarIcon}
                    alt="calendar"
                    className="w-5 h-5 cursor-pointer"
                    onClick={openOrderNativePicker}
                  />
                </div>

                {/* native date input hidden (used to show native picker and sync) */}
                <input
                  ref={orderDateNativeRef}
                  type="date"
                  value={orderDateISO}
                  onChange={onOrderNativeChange}
                  className="absolute top-0 left-0 opacity-0 w-0 h-0 pointer-events-none"
                  aria-hidden
                />
              </div>
            </div>

            {/* Expected Delivery Date */}
            <div>
              <label className="text-[#115D29] text-sm font-semibold mb-2 block">
                Expected Delivery Date
              </label>
              <div className="relative">
                <div className="border border-[#C7DECF] rounded-md px-3 py-3 flex items-center justify-between">
                  <input
                    type="text"
                    value={expectedDisplay}
                    onChange={(e) => setExpectedDisplay(e.target.value)}
                    onBlur={handleExpectedDisplayBlur}
                    placeholder="DD/MM/YYYY"
                    className="outline-none bg-transparent text-[#115D29] w-full"
                    aria-label="Expected delivery date"
                  />
                  <img
                    src={calendarIcon}
                    alt="calendar"
                    className="w-5 h-5 cursor-pointer"
                    onClick={openExpectedNativePicker}
                  />
                </div>

                <input
                  ref={expectedDateNativeRef}
                  type="date"
                  value={expectedDateISO}
                  onChange={onExpectedNativeChange}
                  className="absolute top-0 left-0 opacity-0 w-0 h-0 pointer-events-none"
                  aria-hidden
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-[#115D29] text-sm font-semibold block mb-2">
              Choose Location
            </label>
            <div className="border border-[#C7DECF] rounded-md px-3 py-3 flex items-center justify-between">
              <input
                type="text"
                placeholder="Select Distributor"
                className="outline-none flex-1 text-[#115D29]"
              />
              <img src={locationIcon} alt="location" className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-[#115D29] text-sm font-semibold block mb-3">
              Choose Delivery Mode
            </label>
            <div className="flex items-center gap-6">
              <Radio
                id="dm-pickup"
                name="delivery"
                checked={deliveryMode === "pickup"}
                onChange={() => setDeliveryMode("pickup")}
                label="Pickup"
              />
              <Radio
                id="dm-door"
                name="delivery"
                checked={deliveryMode === "door"}
                onChange={() => setDeliveryMode("door")}
                label="Door Delivery"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-[#115D29] text-sm font-semibold block mb-3">
              Choose Payment Mode
            </label>
            <div className="flex items-center gap-6 flex-wrap">
              <Radio
                id="pm-online"
                name="payment"
                checked={paymentMode === "online"}
                onChange={() => setPaymentMode("online")}
                label="Online Payment"
              />
              <Radio
                id="pm-card"
                name="payment"
                checked={paymentMode === "card"}
                onChange={() => setPaymentMode("card")}
                label="Credit/ Debit Card"
              />
              <Radio
                id="pm-cod"
                name="payment"
                checked={paymentMode === "cod"}
                onChange={() => setPaymentMode("cod")}
                label="Cash on Delivery"
              />
            </div>
          </div>

          <div className="mt-6">
            <Checkbox
              checked={notify}
              onChange={(v) => setNotify(v)}
              label="Notify Pharma Company via SMS/Email"
            />
          </div>
        </div>

        {/* RIGHT SIDE — PREVIEW */}
        <div className="border border-[#B5CDBD] rounded-lg p-6 bg-white">
          <h2 className="text-[#115D29] text-lg font-semibold mb-4">
            Preview Order
          </h2>

          <div className="border border-gray-200 h-auto p-4 rounded-lg shadow-md">
            <div className="mb-4">
              <p className="text-sm text-[#115D29]">
                Pharma Company Name1:{" "}
                <strong className="font-semibold">MediSupply Co.</strong>
              </p>
              <p className="text-sm text-[#115D29] mt-3">
                Pharma Company Name:{" "}
                <strong className="font-semibold">Apollo Pharmacy</strong>
              </p>
            </div>

            <div className="border border-[#E6EFE6] rounded-md overflow-hidden">
              <div className="bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[#115D29] bg-[#F0EFEF]">
                      <th className="text-left px-6 py-5">Medicine Name</th>
                      <th className="text-center px-6 py-5">Quantity</th>
                      <th className="text-center px-6 py-5">Price</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#115D29]">
                    <tr>
                      <td colSpan={3} className="px-6 pt-4 pb-2 font-semibold">
                        Pharma Company Name 1
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3">Paracetamol 500mg</td>
                      <td className="px-6 py-3 text-center">50</td>
                      <td className="px-6 py-3 text-center">₹550</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3">Amoxicilin 250mg</td>
                      <td className="px-6 py-3 text-center">20</td>
                      <td className="px-6 py-3 text-center">₹600</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-6 pt-4 pb-2 font-semibold">
                        Pharma Company Name 2
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3">Cetrizine 10mg</td>
                      <td className="px-6 py-3 text-center">30</td>
                      <td className="px-6 py-3 text-center">₹300</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3">Paracetamol 500mg</td>
                      <td className="px-6 py-3 text-center">15</td>
                      <td className="px-6 py-3 text-center">₹500</td>
                    </tr>
                    <tr className="bg-[#F0EFEF]">
                      <td className="px-6 py-4 font-semibold">Total</td>
                      <td className="px-6 py-4 text-center font-semibold">
                        105
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">
                        ₹1950
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-white border mt-4 border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-md text-[#115D29]">
                <div>
                  <p className="mb-3">
                    Order Date:{" "}
                    <span className="font-semibold">
                      {orderDateISO ? formatISOtoDMY(orderDateISO) : ""}
                    </span>
                  </p>
                  <p className="mb-3">
                    Delivery Mode:{" "}
                    <span className="font-semibold">
                      {deliveryMode === "door" ? "Door Delivery" : "Pickup"}
                    </span>
                  </p>
                  <p className="mb-0">
                    Location:{" "}
                    <span className="font-semibold">{locationText}</span>
                  </p>
                </div>

                <div>
                  <p className="mb-3">
                    Expected Delivery:{" "}
                    <span className="font-semibold">
                      {expectedDateISO ? formatISOtoDMY(expectedDateISO) : ""}
                    </span>
                  </p>
                  <p className="mb-2">
                    Payment Mode:{" "}
                    <span className="font-semibold">
                      {paymentMode === "online"
                        ? "Online Payment"
                        : paymentMode === "card"
                        ? "Credit/ Debit Card"
                        : "Cash on Delivery"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <button
          onClick={() => setShowSuccess(true)}
          className="w-full bg-[#115D29] text-white py-4 rounded-lg text-sm font-medium"
        >
          Place an order Now
        </button>
        <button className="w-full border border-[#115D29] text-[#115D29] py-4 rounded-lg text-sm font-medium bg-white">
          Track the Order
        </button>
      </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowSuccess(false)}
          />
          <div className="relative z-10 w-full max-w-md mx-4">
            <div className="bg-white rounded-lg p-9 pl-5 pr-5 pb-5 text-center shadow-lg relative">
              <button
                aria-label="Close success"
                onClick={() => setShowSuccess(false)}
                className="absolute top-2 right-4 w-6 h-6 flex items-center justify-center rounded-full"
              >
                <img src={closeIcon} alt="close" className="w-5 h-5" />
              </button>

              <div className="border border-gray-300 rounded-md p-4">
                <div className="mb-3">
                  <img
                    src={successIcon}
                    alt="success"
                    className="mx-auto w-15 h-15"
                  />
                </div>

                <h3 className="text-lg font-semibold text-[#115D29] mb-3">
                  Order Placed Successfully!
                </h3>

                <p className="text-sm text-[#115D29] leading-[32px]">
                  Our system has updated your stock and notified the distributor
                  for delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrderScreen;
