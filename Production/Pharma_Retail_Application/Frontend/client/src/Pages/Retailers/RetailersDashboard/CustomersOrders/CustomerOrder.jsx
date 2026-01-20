import React, { useEffect, useState } from "react";

// stats icons
import iconTotal from "../../../../assets/CustomerOrder/total-orders.png";
import iconAccepted from "../../../../assets/CustomerOrder/accepted.png";
import iconProcessing from "../../../../assets/CustomerOrder/processing.png";
import iconPending from "../../../../assets/CustomerOrder/pending.png";

// prescription icons
import uploadIcon from "../../../../assets/CustomerOrder/upload-file.png";
import cameraIcon from "../../../../assets/CustomerOrder/camera.png";
import tipIcon from "../../../../assets/CustomerOrder/tip.png";

// Orders list component
import OrdersList from "./OrdersList";

// Fullscreen popup layout
import CreateManualOrderLayout from "./CreateManualOrderLayout";

const BASE_URL = import.meta.env.VITE_API_BASE || "/api";

const CustomerOrder = () => {
  const [showManualPopup, setShowManualPopup] = useState(false);

  // 🔹 API DATA STATE
  const [stats, setStats] = useState({
    TotalOrders: 0,
    Delivered: 0,
    Processing: 0,
    Pending: 0,
  });

  const [orders, setOrders] = useState(null);

  // 🔹 BACKEND CONNECTION (SINGLE ENDPOINT)
  useEffect(() => {
    fetch(`${BASE_URL}/orders/retailer/1`)
      .then((res) => res.json())
      .then((data) => {
        setStats({
          TotalOrders: data.TotalOrders,
          Delivered: data.Delivered,
          Processing: data.Processing,
          Pending: data.Pending,
        });
        setOrders(data.NewOrders);
      })
      .catch(() => {
        setOrders(null);
      });
  }, []);

  // 🔹 SAME CARDS, ONLY VALUES COME FROM API
  const cards = [
    { title: "Total Orders", value: stats.TotalOrders, icon: iconTotal },
    { title: "Accepted", value: stats.Delivered, icon: iconAccepted },
    { title: "On Processing", value: stats.Processing, icon: iconProcessing },
    { title: "Pending", value: stats.Pending, icon: iconPending },
  ];

  const openManualOrderPopup = () => setShowManualPopup(true);
  const closeManualPopup = () => setShowManualPopup(false);

  return (
    <div
      className="w-full px-6 py-6"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      <style>{`
        input, textarea, button, a, label, select, [contenteditable="true"] {
          user-select: text !important;
        }
      `}</style>

      {/* Header */}
      <h2 className="text-xl font-semibold text-[#115D29]">
        Customer Orders
      </h2>
      <p className="text-md text-gray-600 mt-3">
        Manage orders from B2C customers
      </p>

      {/* Stat Cards (DESIGN UNCHANGED) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {cards.map((item, index) => (
          <div
            key={index}
            className="relative border border-[#B5CDBD] rounded-lg p-5 h-[120px] bg-white"
          >
            <p className="text-[#115D29] text-[16px]">{item.title}</p>
            <p className="mt-4 text-[20px] font-semibold text-[#115D29]">
              {item.value}
            </p>
            <div className="absolute top-3 right-3">
              <img src={item.icon} alt="" className="w-10 h-10" />
            </div>
          </div>
        ))}
      </div>

      {/* Upload Prescription Panel — UNCHANGED */}
      <div className="mt-8">
        <div className="relative border border-[#D9EAD9] rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[#115D29]">
              Place an Order
            </h3>

            <button
              type="button"
              onClick={openManualOrderPopup}
              aria-label="Create manual order"
              className="flex items-center gap-2 bg-[#2B78C6] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#1f5f99]"
            >
              <span className="text-lg font-bold">+</span>
              <span className="text-sm font-medium">
                Create Manual Order
              </span>
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <div
              className="w-full max-w-2xl bg-[#FBFBFB] rounded-sm p-8"
              style={{
                border: "2px dashed #2F8E48",
                borderRadius: "8px",
              }}
            >
              <div className="text-center">
                <h4 className="text-xl font-semibold text-[#115D29]">
                  Upload Prescription
                </h4>

                <p className="mt-6 text-sm text-[#115D29]">
                  Take a photo or upload a file of your prescription. We'll
                  attract medicines automatically.
                </p>

                <p className="mt-6 text-sm text-gray-400">
                  File Supported: JPG, PNG, PDF, Excel
                </p>

                <div className="mt-8 flex items-center justify-center gap-4">
                  <label
                    htmlFor="upload-input"
                    className="inline-flex items-center gap-2 bg-[#115D29] text-white px-5 py-2 rounded-md cursor-pointer shadow-sm"
                  >
                    <img src={uploadIcon} alt="" className="w-5 h-5" />
                    <span className="font-medium text-sm">
                      Upload File
                    </span>
                  </label>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 border border-[#115D29] text-[#115D29] px-5 py-2 rounded-md bg-white hover:bg-[#f7fff7]"
                  >
                    <img src={cameraIcon} alt="" className="w-5 h-5" />
                    <span className="font-medium text-sm">
                      Take Photo
                    </span>
                  </button>

                  <input
                    id="upload-input"
                    type="file"
                    className="hidden"
                  />
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm">
                  <img src={tipIcon} alt="" className="w-5 h-5" />
                  <span className="text-sm text-[#2B78C6]">
                    Tip: Place prescription on flat surface, good lighting,
                    avoid glare.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <OrdersList orders={orders} />

      {showManualPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-[9999] overflow-auto">
          <CreateManualOrderLayout onClose={closeManualPopup} />
        </div>
      )}
    </div>
  );
};

export default CustomerOrder;
