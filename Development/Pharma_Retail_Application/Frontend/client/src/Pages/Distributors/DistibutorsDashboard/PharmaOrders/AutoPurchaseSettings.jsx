// AutoPurchaseSettings.jsx
import React, { useState } from "react";

// assets (paths you provided)
import successIcon from "../../../../assets/DistributorPage/success.png";
import closeIcon from "../../../../assets/DistributorPage/close.png";

/** Success popup (small centered card) */
function SuccessPopup({ onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative z-10 bg-white rounded-xl shadow-lg text-center"
        style={{ width: 340, padding: 30 }}
        role="dialog"
        aria-modal="true"
      >
        <img
          src={closeIcon}
          alt="close"
          onClick={onClose}
          className="absolute top-3 right-3 w-5 h-5 cursor-pointer"
        />
        <img
          src={successIcon}
          alt="success"
          className="mx-auto mb-4"
          style={{ width: 48, height: 48 }}
        />
        <p className="text-[#115D29] text-lg font-semibold">Saved Changes</p>
        <p className="text-[#115D29] text-base mt-1">Successfully!</p>
      </div>
    </div>
  );
}

/**
 * AutoPurchaseSettings
 *
 * Layout:
 * - Top: title + optional close button
 * - Inner card:
 *    Toggle row
 *    Limit per item (one row: min left, max right)
 *    Below: two columns: left = Preferred Source, right = Checklist
 * - Footer: Save / Cancel
 */
export default function AutoPurchaseSettings({ onClose }) {
  const [enabled, setEnabled] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const handleSave = () => setShowPopup(true);

  // small shared input style object to match the green rounded pill look in the mock
  const inputStyle = {
    border: "1px solid #D9E4DD",
    borderRadius: 8,
    padding: "8px 12px",
    height: 40,
  };

  return (
    <>
      {showPopup && <SuccessPopup onClose={() => setShowPopup(false)} />}

      {/* Outer wrapper — hide native scrollbars while card stays centered */}
      <div
        className="w-full flex justify-center items-start"
        style={{
          
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          overflow: "hidden",
        }}
      >
        <div
          className=" max-w-5xl rounded-xl border bg-white"
          style={{ borderColor: "#D9E4DD", padding: 24 }}
        >
          <div className="flex items-start justify-between">
            <h2 className="text-[#115D29] font-semibold text-base">
              Auto Purchase Settings
            </h2>
          </div>

          {/* Inner card */}
          <div
            className="w-full rounded-xl border bg-white mt-6"
            style={{ borderColor: "#D9E4DD", padding: 24 }}
          >
            {/* Toggle Row */}
            <div className="flex items-center  mb-8">
              <div className="text-sm pr-3 text-[#115D29] font-medium">
                Enable Auto Purchase Automatically
              </div>

              <div
                onClick={() => setEnabled(!enabled)}
                role="button"
                aria-pressed={enabled}
                className={`w-14 h-7 rounded-full flex items-center px-1 cursor-pointer transition ${
                  enabled ? "bg-[#2F80ED]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow transition-transform transform ${
                    enabled ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </div>
            </div>

            {/* LIMIT per item row (first) */}
            <div className="mb-8">
              <h3 className="text-[#115D29] font-semibold mb-4 text-sm">
                Limit per item
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="flex items-center gap-1">
                  <label className="text-[#115D29] text-sm min-w-[110px]">
                    Set min limit
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Min No."
                    style={inputStyle}
                    className="text-sm placeholder:text-[#9FB8A7] w-full"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <label className="text-[#115D29] text-sm min-w-[110px]">
                    Set max limit
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Max No."
                    style={inputStyle}
                    className="text-sm placeholder:text-[#9FB8A7] w-full"
                  />
                </div>
              </div>
            </div>

            {/* BELOW: two-column row: left = Preferred Source, right = Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left column: Preferred Source */}
              <div>
                <h3 className="text-[#115D29] font-semibold mb-4 text-sm">
                  Preferred Source
                </h3>

                <div className="space-y-6">
                  {["Pharma Company", "Distributor", "Best Price"].map(
                    (item, idx) => (
                      <label
                        key={idx}
                        className="flex items-center gap-3 mb-4 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-[#115D29] border-[#D9E4DD]"
                          style={{ borderRadius: 6 }}
                        />
                        <span className="text-[#115D29] text-sm">{item}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Right column: Checklist */}
              <div>
                <h3 className="text-[#115D29] font-semibold mb-4 text-sm">
                  Checklist
                </h3>

                <div className="space-y-6">
                  {[
                    "Send alert before purchase",
                    "Require approval for order above ₹5,000",
                    "Auto-generate invoice after delivery confirmation",
                  ].map((item, idx) => (
                    <label
                      key={idx}
                      className="flex items-start gap-3 mb-4 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 mt-1 accent-[#115D29] border-[#D9E4DD]"
                        style={{ borderRadius: 6 }}
                      />
                      <span className="text-[#115D29] text-sm leading-6">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center gap-6 mt-8">
              <button
                onClick={handleSave}
                className="rounded-md  text-white w-full text-sm font-medium"
                style={{
                  height: 48,
                  background: "#115D29",
                }}
              >
                Save Changes
              </button>

              <button
                onClick={() => {
                  if (onClose) onClose();
                }}
                className="rounded-md border w-full text-[#115D29] text-sm font-medium"
                style={{
                  height: 48,
                  borderColor: "#115D29",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
