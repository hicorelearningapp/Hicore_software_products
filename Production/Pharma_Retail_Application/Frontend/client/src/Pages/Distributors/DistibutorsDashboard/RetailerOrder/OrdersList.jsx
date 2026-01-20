import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderDetails from "./OrderDetails";
import successIcon from "../../../../assets/CustomerOrder/model-icon.png";

// Backend call link
const BASE_URL = import.meta.env.VITE_API_BASE || "/api";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAcceptedModal, setShowAcceptedModal] = useState(false);
  const [acceptedOrderId, setAcceptedOrderId] = useState(null);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsOrder, setDetailsOrder] = useState(null);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Using distributor_id 1 as per your example
        const response = await axios.get(`${BASE_URL}/distributor/1/orders`);
        if (response.data && response.data.NewOrders) {
          setOrders(response.data.NewOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Accept flow
  const handleAccept = (orderId) => {
    setAcceptedOrderId(orderId);
    setShowAcceptedModal(true);
  };

  const closeAcceptedModal = () => {
    setShowAcceptedModal(false);
    setAcceptedOrderId(null);
  };

  // Details flow
  const handleViewOrder = (order) => {
    setDetailsOrder(order);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setDetailsOrder(null);
  };

  // close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (showDetailsModal) closeDetailsModal();
        if (showAcceptedModal) closeAcceptedModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showDetailsModal, showAcceptedModal]);

  // prevent background scroll
  useEffect(() => {
    if (showAcceptedModal || showDetailsModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAcceptedModal, showDetailsModal]);

  if (loading) {
    return <div className="mt-8 p-10 text-center text-[#115D29]">Loading orders...</div>;
  }

  return (
    <>
      <div className="mt-8 border border-gray-200 p-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#115D29]">New Orders</h3>
          <a className="text-sm text-[#115D29] hover:underline cursor-pointer">
            View All Orders →
          </a>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((o) => (
            <div
              key={o.OrderId}
              className="border border-[#E6F0E9] rounded-lg p-4 bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg"
            >
              {/* TOP INFO STRIP */}
              <div className="rounded-md bg-[#EAF6F6] p-4 mb-4 border border-[#E6F0E9]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* left column */}
                  <div className="text-sm text-[#115D29] leading-relaxed">
                    <div>
                      <span className="text-[#115D29]">Retailer Name: </span>
                      <span className="font-semibold">{o.RetailerName}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-[#115D29]">Order ID: </span>
                      <span className="font-semibold">ORD-{o.OrderId}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-[#115D29]">Contact: </span>
                      <span className="font-semibold">{o.RetailerPhone}</span>
                    </div>
                  </div>

                  {/* right column */}
                  <div className="text-sm text-[#115D29] leading-relaxed space-y-2">
                    <div>
                      <span className="text-[#115D29]">GSTIN: </span>
                      <span className="font-semibold">{o.GSTNumber}</span>
                    </div>
                    <div>
                      <span className="text-[#115D29]">License Number: </span>
                      <span className="font-semibold">{o.LicenseNumber}</span>
                    </div>
                    <div>
                      <span className="text-[#115D29]">Email: </span>
                      <span className="font-semibold truncate block max-w-[150px]">
                        {o.RetailerEmail}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medicines box */}
              <div className="border border-[#EAF6EA] rounded-md p-4 mb-4 bg-[#FBFFFB]">
                <div className="text-sm font-semibold text-[#115D29] mb-3">
                  Medicines Requested:
                </div>

                <ol className="text-sm text-[#115D29] list-decimal list-inside space-y-3">
                  {o.MedicineRequested && o.MedicineRequested.slice(0, 3).map((m, idx) => (
                    <li key={idx} className="flex justify-between items-start">
                      <div className="truncate max-w-[200px]">{m.MedicineName}</div>
                      <div className="text-sm font-medium text-[#115D29]">
                        Qty: {m.Quantity}
                      </div>
                    </li>
                  ))}
                  {o.MedicineRequested?.length > 3 && (
                    <p className="text-xs text-gray-500 mt-1">
                      + {o.MedicineRequested.length - 3} more items
                    </p>
                  )}
                </ol>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleAccept(o.OrderId)}
                  className="flex-1 bg-[#115D29] text-white py-2 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  Accept
                </button>

                <button
                  type="button"
                  onClick={() => handleViewOrder(o)}
                  className="flex-1 border border-[#115D29] text-[#115D29] py-2 rounded-lg bg-white hover:bg-green-50 transition"
                >
                  View Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accepted modal */}
      {showAcceptedModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={closeAcceptedModal}
          />

          <div className="relative z-10 w-full max-w-sm">
            <button
              type="button"
              onClick={closeAcceptedModal}
              aria-label="Close"
              className="absolute -top-5 right-0 z-20 bg-white border border-green-900 rounded-full w-8 h-8 flex items-center justify-center text-[#115D29] shadow-sm"
              style={{ transform: "translate(50%,-50%)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="#115D29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6L18 18" stroke="#115D29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="bg-white rounded-xl border border-[#E6EFE6] shadow-lg p-6">
              <div className="rounded-md border border-gray-300 p-6 flex flex-col items-center gap-4">
                <div className="w-20 h-20 flex items-center justify-center">
                  <img
                    src={successIcon}
                    alt="Order Accepted"
                    className="w-15 h-15 object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#2C8A2E]">
                  Order Accepted!
                </h3>
                <p className="text-sm text-center text-[#2F8E48] max-w-xs leading-relaxed">
                  Our system has updated your stock and notified the customer for delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILS modal */}
      {showDetailsModal && detailsOrder && (
        <OrderDetails
          order={detailsOrder}
          onClose={closeDetailsModal}
          mode="modal"
        />
      )}
    </>
  );
};

export default OrdersList;