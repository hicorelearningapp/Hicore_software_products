import React, { useEffect, useState } from "react";
import OrderDetails from "./OrderDetails";
import successIcon from "../../../../assets/CustomerOrder/model-icon.png";

const OrdersList = ({ orders = null }) => {
  const [showAcceptedModal, setShowAcceptedModal] = useState(false);
  const [acceptedOrderId, setAcceptedOrderId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsOrder, setDetailsOrder] = useState(null);

  const sampleOrders =
    orders
      ? orders.map((o) => {
          const diffMs = Date.now() - new Date(o.OrderDate);
          const mins = Math.floor(diffMs / 60000);
          const hrs = Math.floor(mins / 60);
          const days = Math.floor(hrs / 24);

          let timeAgo = "Just now";
          if (mins < 1) timeAgo = "Just now";
          else if (mins < 60) timeAgo = `${mins} mins ago`;
          else if (hrs < 24) timeAgo = `${hrs} hrs ago`;
          else timeAgo = `${days} day ago`;

          return {
            id: `ORD-${o.OrderId}`,
            customer: o.CustomerName,
            timeAgo,
            time: new Date(o.OrderDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            orderDate: o.OrderDate,
            expectedDelivery: "",
            address: "",
            contact: "",
            email: "",
            medicines: o.MedicineRequested.map((m) => ({
              name: m.MedicineName,
              qty: m.Quantity,
            })),
          };
        })
      : Array.from({ length: 6 }).map((_, i) => ({
          id: `ORD-3821${i}`,
          customer: "Anita Sharma",
          timeAgo: "5 mins ago",
          time: "10:42 AM",
          orderDate: "29/10/2025",
          expectedDelivery: "5/11/2025",
          address:
            "23, Green View Apartments, Sector 14, Gurugram, Haryana – 122001",
          contact: "+91 98765 43210",
          email: "anita.sharma@email.com",
          medicines: [
            { name: "Paracetamol 500mg (10 tabs)", qty: 2 },
            { name: "Vitamin C 1000mg", qty: 1 },
            { name: "Cough Syrup", qty: 1 },
          ],
        }));

  const handleAccept = (orderId) => {
    setAcceptedOrderId(orderId);
    setShowAcceptedModal(true);
  };

  const closeAcceptedModal = () => {
    setShowAcceptedModal(false);
    setAcceptedOrderId(null);
  };

  const handleViewOrder = (order) => {
    setDetailsOrder(order);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setDetailsOrder(null);
  };

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

  return (
    <>
      <div className="mt-8 border border-gray-200 p-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#115D29]">
            New Orders
          </h3>
          <a className="text-sm text-[#115D29] hover:underline cursor-pointer">
            View All Orders →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleOrders.map((o) => (
            <div
              key={o.id}
              className="
                border border-[#E6F0E9] rounded-lg p-4 bg-white shadow-sm 
                hover:shadow-lg hover:shadow-gray-400 transition-shadow duration-200
              "
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-sm text-green-900">
                    Customer Name:{" "}
                    <span className="font-semibold text-[#115D29]">
                      {o.customer}
                    </span>
                  </div>

                  <div className="text-sm text-green-900 mt-2">
                    Order ID:{" "}
                    <span className="font-semibold text-[#115D29]">
                      {o.id}
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs text-gray-500">
                  <div>{o.timeAgo}</div>
                  <div className="mt-2">{o.time}</div>
                </div>
              </div>

              <div className="border border-[#EAF6EA] rounded-md p-3 mb-4 bg-[#FBFFFB]">
                <div className="text-sm font-semibold text-[#115D29] mb-2">
                  Medicines Requested:
                </div>

                <ol className="text-sm text-green-800 list-decimal list-inside space-y-2">
                  {o.medicines.map((m, idx) => (
                    <li key={idx} className="flex justify-between items-start">
                      <span>{m.name}</span>
                      <span className="text-sm text-[#115D29]">
                        Qty: {m.qty}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleAccept(o.id)}
                  className="
                    flex-1 bg-[#115D29] text-white py-2 cursor-pointer rounded-md shadow-sm 
                    transition-all duration-200
                    hover:shadow-md hover:shadow-green-800
                    hover:border-b-2 hover:border-b-white
                  "
                >
                  Accept
                </button>

                <button
                  type="button"
                  onClick={() => handleViewOrder(o)}
                  className="flex-1 border border-[#115D29] hover:bg-green-50 cursor-pointer text-[#115D29] py-2 rounded-md bg-white"
                >
                  View Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18"
                  stroke="#115D29"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="#115D29"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
                  Our system has updated your stock and notified the
                  customer for delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
