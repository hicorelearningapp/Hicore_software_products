// AutoPurchaseOrders.jsx
import React, { useState } from "react";

import backIcon from "../../../../assets/DistributorPage/back.png";
import aiIcon from "../../../../assets/DistributorPage/ai-insight.png";

import PlaceOrderScreen from "./PlaceOrderScreen";
import AutoPurchaseSettings from "./AutoPurchaseSettings";

// ✅ SUCCESS POPUP ADDED
import AutoPurchaseSuccess from "./AutoPurchaseSuccess";

export default function AutoPurchaseOrders({ onClose }) {
  const [showPlaceOrder, setShowPlaceOrder] = useState(false);
  const [showAutoSettings, setShowAutoSettings] = useState(false);

  // ✅ SUCCESS POPUP STATE
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-white z-[9999] overflow-y-auto scrollbar-hide">
        <div className="w-full min-h-screen px-6 py-4">
          {/* Back Button */}
          <div
            className="flex items-center gap-2 cursor-pointer mb-4"
            onClick={onClose}
          >
            <img src={backIcon} alt="back" className="w-5" />
            <span className="text-[#115D29] font-medium text-sm">Back</span>
          </div>

          {/* Title */}
          <h1 className="text-xl font-semibold text-[#115D29] mb-4">
            Auto Purchase Orders
          </h1>

          {/* Top Info Box */}
          <div
            className="w-full flex items-center justify-between rounded-lg border mb-6"
            style={{
              background: "#2874BA0D",
              borderColor: "#2874BA",
              padding: "16px",
            }}
          >
            <p className="text-[#2874BA] text-sm">
              5 medicines are currently out of stock. You can enable Auto
              Purchase or manually restock now.
            </p>

            <button
              onClick={() => setShowAutoSettings(true)}
              style={{
                width: "106px",
                height: "44px",
                borderRadius: "8px",
                padding: "4px 16px",
                background: "#2874BA",
                color: "white",
              }}
              className="text-sm font-medium"
            >
              Enable Now
            </button>
          </div>

          {/* OUTER BOX */}
          <div
            style={{
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #E7EFEA",
              padding: "24px",
            }}
            className="bg-white mb-6"
          >
            <h2 className="text-[#115D29] font-semibold mb-5">
              Out-of-Stock Medicines
            </h2>

            <p className="text-gray-600 text-sm mb-10">
              Select the items you want to auto-purchase.
            </p>

            {/* INNER BOX */}
            <div
              style={{
                width: "100%",
                borderRadius: "8px",
                border: "1px solid #B5CDBD",
                overflow: "hidden",
              }}
            >
              {/* HEADER */}
              <div
                style={{
                  background: "#115D29",
                  borderBottom: "1px solid #F0EFEF",
                  padding: "20px 36px",
                  display: "grid",
                  gridTemplateColumns: "80px 1.4fr 1fr 1fr 1fr 260px",
                  alignItems: "center",
                  color: "white",
                  height: "76px",
                  textAlign: "center",
                }}
              >
                <div></div>
                <div>Medicine Name</div>
                <div>Last Ordered From</div>
                <div>Available Stock</div>
                <div>Preferred Distributor</div>
                <div>Auto Purchase</div>
              </div>

              {/* ROWS */}
              {[
                {
                  name: "Azithromycin 250mg",
                  from: "Distributor A",
                  stock: 0,
                  pref: "Distributor A",
                },
                {
                  name: "Cough Syrup",
                  from: "Distributor B",
                  stock: 0,
                  pref: "Distributor B",
                },
                {
                  name: "Cough Syrup",
                  from: "Distributor B",
                  stock: 0,
                  pref: "Distributor B",
                },
                {
                  name: "Vitamin C 1000mg",
                  from: "Distributor C",
                  stock: 2,
                  pref: "Distributor B",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: "20px 36px",
                    display: "grid",
                    gridTemplateColumns: "80px 1.4fr 1fr 1fr 1fr 260px",
                    alignItems: "center",
                    height: "84px",
                    borderBottom: "1px solid #E7EFEA",
                    background: "#FFFFFF",
                    textAlign: "center",
                  }}
                >
                  {/* Checkbox */}
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      className="accent-[#115D29] w-4 h-4"
                    />
                  </div>

                  <div className="text-[#115D29]">{item.name}</div>
                  <div className="text-[#115D29]">{item.from}</div>
                  <div className="text-[#115D29]">{item.stock}</div>
                  <div className="text-[#115D29]">{item.pref}</div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowSuccess(true)} // ✅ SHOW POPUP HERE
                      style={{
                        width: "244.8px",
                        height: "44px",
                        borderRadius: "8px",
                        padding: "4px 16px",
                        background: "#30B130",
                        color: "#FFFFFF",
                      }}
                      className="text-sm font-medium"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight Box */}
          <div
            className="w-full flex items-center justify-between rounded-lg border mt-6"
            style={{
              background: "#AF840D0D",
              borderColor: "#AF840D",
              padding: "16px",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  background: "#AF840D",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src={aiIcon} alt="ai" className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-semibold text-[#AF840D] text-lg">
                  AI Insight
                </h3>

                <p className="text-[#AF840D] text-sm mt-1">
                  You can reduce stockouts by enabling{" "}
                  <span className="font-semibold">Predictive Reordering</span>.
                  Based on your sales history, we can reorder medicines before
                  they run out.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPlaceOrder(true)}
              style={{
                width: "205px",
                height: "44px",
                borderRadius: "8px",
                padding: "4px 16px",
                background: "#AF840D",
                color: "white",
              }}
              className="text-sm font-medium"
            >
              Update Stock
            </button>
          </div>
        </div>
      </div>

      {/* AUTO PURCHASE SETTINGS POPUP */}
      {showAutoSettings && (
        <div className="fixed inset-0 z-[11050] flex items-center justify-center backdrop-blur-sm">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowAutoSettings(false)}
          />

          {/* JUST CALL THE SCREEN — NO SIZE, NO BG, NO FORCED BOX */}
          <div className="relative overflow-hidden scrollbar-hide">
            <AutoPurchaseSettings onClose={() => setShowAutoSettings(false)} />
          </div>
        </div>
      )}

      {/* PLACE ORDER SCREEN POPUP */}
      {showPlaceOrder && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowPlaceOrder(false)}
          />
          <div className="relative w-full max-w-[1200px] h-[92vh] overflow-auto">
            <PlaceOrderScreen onClose={() => setShowPlaceOrder(false)} />
          </div>
        </div>
      )}

      {/* ✅ SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 z-[12000] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowSuccess(false)}
          />
          <AutoPurchaseSuccess onClose={() => setShowSuccess(false)} />
        </div>
      )}
    </>
  );
}
