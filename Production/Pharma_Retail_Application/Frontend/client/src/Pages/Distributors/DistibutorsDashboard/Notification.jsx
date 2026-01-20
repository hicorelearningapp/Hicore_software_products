import React, { useState, useEffect } from "react";
import axios from "axios";

// Top cards icons
import totalIcon from "../../../assets/Notification/total.png";
import unreadIcon from "../../../assets/Notification/unread.png";
import ordersIcon from "../../../assets/Notification/orders.png";
import stockIcon from "../../../assets/Notification/stock.png";

// Icons for notification types
import lowStockNew from "../../../assets/Notification/lowstock.png";
import newOrderIcon from "../../../assets/Notification/order.png";
import deliveredIcon from "../../../assets/Notification/delivery.png";
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

  // Helper to format date to "X hours/days ago"
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now - past;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  // Helper to get correct icon based on type and status
  const getIcon = (type, isRead) => {
    if (type === "Stock") return isRead ? lowStockOld : lowStockNew;
    if (type === "Order") return newOrderIcon;
    return deliveredIcon;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const distributorId = 1; // Hardcoded ID
        const response = await axios.get(`${BASE_URL}/distributors/${distributorId}/notifications`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const cards = [
    { title: "Total", value: data.Total, icon: totalIcon },
    { title: "Unread", value: data.Unread, icon: unreadIcon },
    { title: "Orders", value: data.Orders, icon: ordersIcon },
    { title: "Stock Alerts", value: data.StockAlerts, icon: stockIcon },
  ];

  // Logic to separate New (Unread) vs Old (Read)
  const newNotifications = data.Notifications.filter((n) => !n.IsRead);
  const oldNotifications = data.Notifications.filter((n) => n.IsRead);

  if (loading) {
    return <div className="px-6 py-4">Loading notifications...</div>;
  }

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

      {/* NEW NOTIFICATIONS — BLUE BORDER */}
      <div className="space-y-4">
        {newNotifications.map((item) => (
          <div
            key={item.NotificationId}
            className="border border-[#1C6BA0] border-l-[8px] rounded-xl p-4 flex items-start justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg">
                <img src={getIcon(item.Type, item.IsRead)} alt="" className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-[#115D29] text-lg font-semibold">
                  {item.Title}
                </h3>
                <p className="text-[#115D29] mt-1">{item.Message}</p>
                <p className="text-[#115D29] text-sm mt-2">{formatTimeAgo(item.CreatedAt)}</p>
              </div>
            </div>

            <span className="bg-[#1C6BA0] text-white px-4 py-1 rounded-full text-sm">
              New
            </span>
          </div>
        ))}
      </div>

      {/* SPACE */}
      <div className="mt-6" />

      {/* OLD NOTIFICATIONS — GRAY BORDER */}
      <div className="space-y-4">
        {oldNotifications.map((item) => (
          <div
            key={item.NotificationId}
            className="border border-gray-300 rounded-xl p-4 flex items-start gap-4"
          >
            <div className="p-3 rounded-lg">
              <img src={getIcon(item.Type, item.IsRead)} alt="" className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-[#115D29] text-lg font-semibold">
                {item.Title}
              </h3>
              <p className="text-[#115D29] mt-1">{item.Message}</p>
              <p className="text-gray-600 text-sm mt-2">{formatTimeAgo(item.CreatedAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;