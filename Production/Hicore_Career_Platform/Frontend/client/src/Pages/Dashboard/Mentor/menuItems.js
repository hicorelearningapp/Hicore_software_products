// ✅ Centralized Menu Config (menuItems.js)

// Import all icons
import dashboardIcon from "../../../assets/StudentDashboard/Dashboard.png";
import menteeIcon from "../../../assets/MentoDashboardLayout/User.png";
import projectIcon from "../../../assets/MentoDashboardLayout/Projects.png";
import sessionIcon from "../../../assets/MentoDashboardLayout/Mentor.png";
import achievementIcon from "../../../assets/MentoDashboardLayout/Badge.png";
import earningsIcon from "../../../assets/MentoDashboardLayout/Profit.png";
import performanceIcon from "../../../assets/MentoDashboardLayout/Growth.png";
import settingsIcon from "../../../assets/StudentDashboard/Settings.png";
import aboutIcon from "../../../assets/StudentDashboard/Aboutus.png";
import helpIcon from "../../../assets/StudentDashboard/Help.png";
import logoutIcon from "../../../assets/StudentDashboard/LOgout.png";
import subscriptionIcon from "../../../assets/StudentDashboard/Subscription.png";

const menuItems = [
  {
    label: "Dashboard",
    icon: dashboardIcon,
    path: "/mentor-dashboard/dashboard",
  },
  {
    label: "Mentees",
    icon: menteeIcon,
    path: "/mentor-dashboard/mentees",
  },
  {
    label: "Projects",
    icon: projectIcon,
    path: "/mentor-dashboard/projects",
  },
  {
    label: "Sessions",
    icon: sessionIcon,
    path: "/mentor-dashboard/sessions",
  },
  /*{
    label: "Achievements",
    icon: achievementIcon,
    path: "/mentor-dashboard/achievements",
  },
  {
    label: "Earnings",
    icon: earningsIcon,
    path: "/mentor-dashboard/earnings",
  },
  {
    label: "Performance",
    icon: performanceIcon,
    path: "/mentor-dashboard/performance",
  },

  {
    label: "Subscription",
    icon: subscriptionIcon,
    path: "mentor-dashboard/subscription",
  },*/
  {
    label: "Settings",
    icon: settingsIcon,
    path: "mentor-dashboard/settings",
  },
  { label: "About Us", icon: aboutIcon, path: "about-hicore" },
  { label: "Help", icon: helpIcon, path: "mentor-dashboard/help" },
  {
    label: "Logout",
    icon: logoutIcon,
    path: "mentor-dashboard/logout",
    danger: true,
  },
];

export default menuItems;
