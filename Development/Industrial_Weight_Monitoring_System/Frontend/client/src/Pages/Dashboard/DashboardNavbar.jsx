import React, { useState, useEffect } from "react";
import dashboardicon from "../../assets/Dashboard/Navbar/Dashboard.png";
import Inventoryicon from "../../assets/Dashboard/Navbar/Inventory.png";
import Addicon from "../../assets/Dashboard/Navbar/Add.png";
import Trackingicon from "../../assets/Dashboard/Navbar/Tracking.png";
import Ordersicon from "../../assets/Dashboard/Navbar/Orders.png";
import settingsicon from "../../assets/Dashboard/Navbar/Settings.png";
import notificationicon from "../../assets/Dashboard/Navbar/Notification.png";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

/* EXISTING COMPONENTS */
import Settings from "./Settings/Settings";
import Notification from "./Notification/Notification";

const DashboardNavbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const centerMenu = [
    { name: "Dashboard", icon: dashboardicon, path: "/dashboard" },
    { name: "Inventory", icon: Inventoryicon, path: "/dashboard/inventory" },
    { name: "Add Device", icon: Addicon, path: "/dashboard/add-device" },
    { name: "Add New Item", icon: Addicon, path: "/dashboard/add-newitem" },
    { name: "Tracking", icon: Trackingicon, path: "/dashboard/track-device" },
    { name: "Orders", icon: Ordersicon, path: "/dashboard/orders" },
  ];

  const utilityMenu = [
    { name: "Settings", icon: settingsicon },
    { name: "Notifications", icon: notificationicon },
  ];

  /* LOCK BODY SCROLL */
  useEffect(() => {
    if (openSettings || openNotification) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [openSettings, openNotification]);

  const isActiveTab = (path) => {
    if (!path) return false;
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col pt-[36px] gap-[36px]">

      {/* ================= NAVBAR ================= */}
      <div className="flex flex-row px-[36px] py-[16px] justify-between items-center rounded-[80px] bg-[#F4F6F8] relative z-30">

        {/* LOGO */}
        <button
          onClick={() => navigate("/")}
          className="rounded-[80px] px-[16px] py-[4px] text-[#1769FF] text-[16px] font-semibold"
        >
          Hicore Invue
        </button>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex flex-row gap-[20px] items-center">
          {centerMenu.map((item) => {
            const isActive = isActiveTab(item.path);
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-[8px] px-[16px] py-[6px] rounded-[80px] font-semibold text-[14px]
                  ${
                    isActive
                      ? "bg-[#0A2A43] text-white"
                      : "text-[#0A2A43] hover:bg-white hover:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.1)]"
                  }`}
              >
                <img
                  src={item.icon}
                  className={`w-[20px] h-[20px] ${isActive ? "brightness-0 invert" : ""}`}
                  alt={item.name}
                />
                {item.name}
              </button>
            );
          })}
        </div>

        {/* RIGHT ICONS */}
        <div className="hidden md:flex gap-[14px] items-center">
          {utilityMenu.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if (item.name === "Settings") {
                  setOpenSettings(true);
                  setOpenNotification(false);
                } else if (item.name === "Notifications") {
                  setOpenNotification(true);
                  setOpenSettings(false);
                }
              }}
              className="p-[8px] rounded-full hover:bg-white hover:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]"
            >
              <img src={item.icon} className="w-[20px] h-[20px]" alt={item.name} />
            </button>
          ))}
        </div>

        {/* MOBILE MENU ICON */}
        <button className="md:hidden" onClick={() => setOpenMenu(!openMenu)}>
          {openMenu ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {openMenu && (
        <div className="md:hidden flex flex-col gap-[16px] px-[20px] py-[16px] rounded-[24px] bg-[#F4F6F8] shadow-lg z-40">
          {[...centerMenu, ...utilityMenu].map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if (item.name === "Settings") {
                  setOpenSettings(true);
                  setOpenNotification(false);
                } else if (item.name === "Notifications") {
                  setOpenNotification(true);
                  setOpenSettings(false);
                } else {
                  navigate(item.path);
                }
                setOpenMenu(false);
              }}
              className="flex items-center gap-[12px] px-[16px] py-[10px] rounded-[80px] bg-white text-[#0A2A43] font-semibold"
            >
              <img src={item.icon} className="w-[20px] h-[20px]" alt={item.name} />
              {item.name}
            </button>
          ))}
        </div>
      )}

      {/* ================= BACKDROP ================= */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          openSettings || openNotification
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          setOpenSettings(false);
          setOpenNotification(false);
        }}
      />

      {/* ================= SETTINGS DRAWER ================= */}
      <div
        className={`fixed right-[24px] top-[120px] h-[calc(100vh-160px)]
        w-full max-w-[800px] z-[101]
        transform transition-all duration-300 ease-out
        ${
          openSettings
            ? "translate-x-0 opacity-100"
            : "translate-x-[110%] opacity-0 pointer-events-none"
        }`}
      >
        <Settings onClose={() => setOpenSettings(false)} />
      </div>

      {/* ================= NOTIFICATION DRAWER ================= */}
      <div
        className={`fixed right-[24px] top-[120px] h-[calc(100vh-160px)]
        w-full max-w-[450px] z-[102]
        transform transition-all duration-300 ease-out
        ${
          openNotification
            ? "translate-x-0 opacity-100"
            : "translate-x-[110%] opacity-0 pointer-events-none"
        }`}
      >
        <Notification onClose={() => setOpenNotification(false)} />
      </div>
    </div>
  );
};

export default DashboardNavbar;
