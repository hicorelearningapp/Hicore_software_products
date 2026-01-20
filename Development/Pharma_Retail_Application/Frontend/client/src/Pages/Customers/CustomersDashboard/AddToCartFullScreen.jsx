// src/.../AddToCartFullScreen.jsx
import React, { useEffect } from "react";
import backIcon from "../../../assets/Customers/SearchLabs/back.png";

// new child components (same folder)
import BookingLeft from "./BookingLeft";
import BookingRight from "./BookingRight";

const AddToCartFullScreen = ({ open, item, onClose }) => {
  if (!open) return null;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200000] overflow-y-auto p-5 bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Add to cart"
      onClick={onClose}
    >
      {/* Full white inner content */}
      <div
        className="w-full min-h-screen rounded-md bg-white p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back button */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-3 text-sm text-[#0B6B29]"
          aria-label="Back"
        >
          <div className="w-7 h-7 flex items-center justify-center bg-white rounded-full">
            <img src={backIcon} alt="back" className="w-5 h-5" />
          </div>
          <span className="font-medium">Back</span>
        </button>

        {/* Booking Summary */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold" style={{ color: "#115D29" }}>
            Booking Summary
          </h2>

          <p className="mt-4 text-sm" style={{ color: "#5C5C5C" }}>
            Review your appointment details before confirming.
          </p>
        </div>

        {/* Two equal containers (left & right) */}
        <div className="mt-8 w-full">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left */}
            <div className="flex-1 border border-gray-300 p-5 rounded-md">
              <BookingLeft item={item} />
            </div>

            {/* Right */}
            <div className="flex-1 border border-gray-300 p-5 rounded-md">
              <BookingRight item={item} />
            </div>
          </div>
        </div>

        {/* placeholder for further content */}
        <div className="mt-8">{/* additional content goes here later */}</div>
      </div>
    </div>
  );
};

export default AddToCartFullScreen;
