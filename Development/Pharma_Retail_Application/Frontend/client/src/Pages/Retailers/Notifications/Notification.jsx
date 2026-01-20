import React, { useState, useEffect } from "react";
import axios from "axios";

// Top cards icons
import totalIcon from "../../../assets/Notification/total.png";
import unreadIcon from "../../../assets/Notification/unread.png";
import ordersIcon from "../../../assets/Notification/orders.png";
import stockIcon from "../../../assets/Notification/stock.png";

// First two NEW notifications (blue border)
import lowStockNew from "../../../assets/Notification/lowstock.png";
import newOrderIcon from "../../../assets/Notification/order.png";

// Remaining old notifications (gray border)
import deliveredIcon from "../../../assets/Notification/delivery.png";
import expiryIcon from "../../../assets/Notification/expiry.png";
import restockIcon from "../../../assets/Notification/expiry.png";
import lowStockOld from "../../../assets/Notification/delivery.png";

const BASE_URL = import.meta.env.VITE_API_BASE || "/api";

const Notification = () => {
  const [data, setData] = useState({
    Total: 0,
    Unread: 0,
    Orders: 0,
    StockAlerts: 0,
    Notifications: [],
  });
  const [loading, setLoading] = useState(true);

  // Assuming retailer_id is 1
  const retailerId = 1;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/retailers/${retailerId}/notifications`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [retailerId]);

  // Helper to format Date to "Time Ago"
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now - past;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  // Helper to get the correct icon based on Notification Type
  const getIcon = (type, isNew) => {
    if (type === "Stock") return isNew ? lowStockNew : lowStockOld;
    if (type === "Order") return isNew ? newOrderIcon : deliveredIcon;
    return expiryIcon; // fallback
  };

  // Split notifications based on IsRead status
  const newNotifications = data.Notifications.filter(n => !n.IsRead);
  const oldNotifications = data.Notifications.filter(n => n.IsRead);

  const cards = [
    { title: "Total", value: data.Total, icon: totalIcon },
    { title: "Unread", value: data.Unread, icon: unreadIcon },
    { title: "Orders", value: data.Orders, icon: ordersIcon },
    { title: "Stock Alerts", value: data.StockAlerts, icon: stockIcon },
  ];

  if (loading) return <div className="px-6 py-4 text-[#115D29]">Loading Notifications...</div>;

  return (
    <div className="px-6 py-4">
      {/* Header */}
      <h2 className="text-xl font-semibold text-[#115D29]">Notifications</h2>
      <p className="text-sm text-gray-600 mt-1">
        Stay updated with alerts and updates
      </p>

      {/* Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-xl p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[#115D29] text-[17px] font-medium">
                {card.title}
              </span>
              <div className="p-2 rounded-md">
                <img src={card.icon} alt={card.title} className="w-10 h-10" />
              </div>
            </div>
            <div className="text-2xl text-[#115D29] font-semibold mt-3">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* SPACE */}
      <div className="mt-10" />

      {/* NEW NOTIFICATIONS (Unread) — BLUE BORDER */}
      <div className="space-y-4">
        {newNotifications.map((item, index) => (
          <div
            key={index}
            className="border border-[#1C6BA0] border-l-[8px] rounded-xl p-4 flex items-start justify-between"
          >
            {/* Left */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg">
                <img src={getIcon(item.Type, true)} alt="" className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-[#115D29] text-lg font-semibold">
                  {item.Title}
                </h3>
                <p className="text-[#115D29] mt-1">{item.Message}</p>
                <p className="text-[#115D29] text-sm mt-2">{formatTimeAgo(item.Date)}</p>
              </div>
            </div>

            {/* NEW BADGE */}
            <span className="bg-[#1C6BA0] text-white px-4 py-1 rounded-full text-sm">
              New
            </span>
          </div>
        ))}
      </div>

      {/* SPACE */}
      <div className="mt-6" />

      {/* OLD NOTIFICATIONS (Read) — GRAY BORDER */}
      <div className="space-y-4">
        {oldNotifications.map((item, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-xl p-4 flex items-start gap-4"
          >
            <div className="p-3 rounded-lg">
              <img src={getIcon(item.Type, false)} alt="" className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-[#115D29] text-lg font-semibold">
                {item.Title}
              </h3>
              <p className="text-[#115D29] mt-1">{item.Message}</p>
              <p className="text-gray-600 text-sm mt-2">{formatTimeAgo(item.Date)}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Fallback if no notifications */}
      {!loading && data.Notifications.length === 0 && (
        <div className="text-center py-10 text-gray-500">No notifications found.</div>
      )}
    </div>
  );
};

export default Notification;