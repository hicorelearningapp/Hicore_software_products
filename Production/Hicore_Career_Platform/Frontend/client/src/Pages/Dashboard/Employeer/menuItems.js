// ✅ Centralized Menu Config (menuItems.js)

// Import all icons
import dashboardIcon from "../../../assets/EmployeerDashboard/Dashboard.png";
import jobIcon from "../../../assets/EmployeerDashboard/JobID.png";
import applicationIcon from "../../../assets/EmployeerDashboard/Profiles.png";
import talentIcon from "../../../assets/EmployeerDashboard/star.png";
//import hackathanIcon from "../../../assets/EmployeerDashboard/puzzle.png";
import aiIcon from "../../../assets/EmployeerDashboard/Aistars.png";
import insightIcon from "../../../assets/EmployeerDashboard/Growth.png";
import savedIcon from "../../../assets/EmployeerDashboard/Save.png";
import subscriptionIcon from "../../../assets/EmployeerDashboard/Subscription.png";
import settingsIcon from "../../../assets/EmployeerDashboard/Settings.png";
import aboutIcon from "../../../assets/EmployeerDashboard/Aboutus.png";
import helpIcon from "../../../assets/EmployeerDashboard/Help.png";
import logoutIcon from "../../../assets/EmployeerDashboard/Logout.png";

const menuItems = [
  {
    label: "Dashboard",
    icon: dashboardIcon,
    path: "dashboard",
  },
  {
    label: "Job Posts",
    icon: jobIcon,
    path: "/employer-dashboard/job-posts",
  },
  {
    label: "Applications",
    icon: applicationIcon,
    path: "/employer-dashboard/applications",
  },
  {
    label: "Top talent",
    icon: talentIcon,
    path: "/employer-dashboard/top-talent",
  },
  /*{
    label: "Hackathan Hub",
    icon: hackathanIcon,
    path: "/employer-dashboard/hackathon-hub",
  },*/
  {
    label: "Ai Shortlisting",
    icon: aiIcon,
    path: "/employer-dashboard/ai-shortlisting",
  },
  /*{
    label: "Insights & Analytics",
    icon: insightIcon,
    path: "/employer-dashboard/insights",
  },*/
  {
    label: "Saved Talent",
    icon: savedIcon,
    path: "/employer-dashboard/save",
  },

  /*{
    label: "Subscription",
    icon: subscriptionIcon,
    path: "employer-dashboard/subscription",
  },*/
  {
    label: "Settings",
    icon: settingsIcon,
    path: "employer-dashboard/settings",
  },
  { label: "About Us", icon: aboutIcon, path: "about-hicore" },
  { label: "Help", icon: helpIcon, path: "employer-dashboard/help" },
  {
    label: "Logout",
    icon: logoutIcon,
    path: "employer-dashboard/logout",
    danger: true,
  },
];

export default menuItems;
