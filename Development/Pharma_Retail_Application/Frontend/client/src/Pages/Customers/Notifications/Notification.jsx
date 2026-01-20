import React, { useState, useEffect } from "react";

// Top cards icons
import totalIcon from "../../../assets/Notification/total.png";
import unreadIcon from "../../../assets/Notification/unread.png";
import ordersIcon from "../../../assets/Notification/orders.png";
import stockIcon from "../../../assets/Notification/stock.png";

// Icons for notification items
import lowStockNew from "../../../assets/Notification/lowstock.png";
import newOrderIcon from "../../../assets/Notification/order.png";
import deliveredIcon from "../../../assets/Notification/delivery.png";
import expiryIcon from "../../../assets/Notification/expiry.png";
import restockIcon from "../../../assets/Notification/expiry.png";
import lowStockOld from "../../../assets/Notification/delivery.png";

const BASE_URL = import.meta.env.VITE_API_BASE || "/api";

const Notification = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to calculate "time ago"
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return "Just now";
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${BASE_URL}/customers/1/notifications`, {
          headers: {
            'accept': 'application/json'
          }
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading notifications...</div>;
  if (!data) return <div className="p-6 text-center text-red-500">Failed to load data.</div>;

  const cards = [
    { title: "Total", value: data.Total, icon: totalIcon },
    { title: "Unread", value: data.Unread, icon: unreadIcon },
    { title: "Orders", value: data.Orders, icon: ordersIcon },
    { title: "Stock Alerts", value: data.StockAlerts, icon: stockIcon },
  ];

  const getIcon = (type, isRead) => {
    if (type === "Order") return isRead ? deliveredIcon : newOrderIcon;
    if (type === "Stock") return isRead ? lowStockOld : lowStockNew;
    return expiryIcon;
  };

  const newNotifications = data.Notifications.filter(n => !n.IsRead);
  const oldNotifications = data.Notifications.filter(n => n.IsRead);

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

      <div className="mt-10" />

      {/* NEW NOTIFICATIONS (BLUE BORDER) */}
      <div className="space-y-4">
        {newNotifications.map((item, index) => (
          <div
            key={item.NotificationId || index}
            className="border border-[#1C6BA0] border-l-[8px] rounded-xl p-4 flex items-start justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg">
                <img src={getIcon(item.Type, false)} alt="" className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-[#115D29] text-lg font-semibold">
                  {item.Title}
                </h3>
                <p className="text-[#115D29] mt-1">{item.Message}</p>
                <p className="text-[#115D29] text-sm mt-2">
                   {formatTimeAgo(item.Date)}
                </p>
              </div>
            </div>

            <span className="bg-[#1C6BA0] text-white px-4 py-1 rounded-full text-sm">
              New
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6" />

      {/* OLD NOTIFICATIONS (GRAY BORDER) */}
      <div className="space-y-4">
        {oldNotifications.map((item, index) => (
          <div
            key={item.NotificationId || index}
            className="border border-gray-300 rounded-xl p-4 flex items-start gap-4"
          >
            <div className="p-3 rounded-lg">
              <img src={getIcon(item.Type, true)} alt="" className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-[#115D29] text-lg font-semibold">
                {item.Title}
              </h3>
              <p className="text-[#115D29] mt-1">{item.Message}</p>
              <p className="text-gray-600 text-sm mt-2">
                {formatTimeAgo(item.Date)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {data.Notifications.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No notifications found.</p>
      )}
    </div>
  );
};

export default Notification;