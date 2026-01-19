import dashboardIcon from "../../../assets/StudentDashboard/Dashboard.png";
import careerIcon from "../../../assets/StudentDashboard/MYCareer.png";
import learnIcon from "../../../assets/StudentDashboard/Learn.png";
import certIcon from "../../../assets/StudentDashboard/Certification.png";
import projectIcon from "../../../assets/StudentDashboard/Projects.png";
import interviewIcon from "../../../assets/StudentDashboard/INterview.png";
import jobsIcon from "../../../assets/StudentDashboard/Jobs.png";
import aiIcon from "../../../assets/StudentDashboard/AITools.png";
import innovationIcon from "../../../assets/StudentDashboard/Innovation.png";
import settingsIcon from "../../../assets/StudentDashboard/Settings.png";
import aboutIcon from "../../../assets/StudentDashboard/Aboutus.png";
import helpIcon from "../../../assets/StudentDashboard/Help.png";
import logoutIcon from "../../../assets/StudentDashboard/LOgout.png";
import subscriptionIcon from "../../../assets/StudentDashboard/Subscription.png";

const menuItems = [
  {
    label: "Dashboard",
    icon: dashboardIcon,
    path: "/student-dashboard/dashboard",
  },

  {
    label: "Learn",
    icon: learnIcon,
    subMenu: [
      { label: "Courses", path: "/student-dashboard/learn/courses" },
      {
        label: "Domain Courses",
        path: "/student-dashboard/learn/domain-courses",
      },
    ],
  },
  {
    label: "Certifications",
    icon: certIcon,
    subMenu: [
      {
        label: "Internship Certification",
        path: "/student-dashboard/certifications/internship",
      },
      {
        label: "Higher Studies",
        path: "/student-dashboard/certifications/higher-studies",
      },
      {
        label: "Industry Certification",
        path: "/student-dashboard/certifications/industry",
      },
    ],
  },
  {
    label: "Projects",
    icon: projectIcon,
    subMenu: [
       {
        label: "Mini Projects",
        path: "/student-dashboard/projects/mini-project",
      },
      {
        label: "Internship Projects",
        path: "/student-dashboard/projects/inter-project",
      },
      {
        label: "Final Year Projects",
        path: "/student-dashboard/projects/final-year-project",
      },
      /*{
        label: "Freelance Projects",
        path: "/student-dashboard/projects/freelance-projects",
      },*/
    ],
  },
  {
    label: "Interview",
    icon: interviewIcon,
    subMenu: [
      {
        label: "Freshers Interview",
        path: "/student-dashboard/interview/freshers",
      },
      { label: "Mock Interview", path: "student-dashboard/interview/mock-interview" },
      { label: "Flashcards", path: "student-dashboard/interview/flashcard-activity" },
      { label: "Quiz", path: "student-dashboard/interview/quiz" },
    ],
  },
  {
    label: "Jobs",
    icon: jobsIcon,
    subMenu: [
      {
        label: "Full-time Jobs",
        path: "/student-dashboard/jobs/full-time-jobs",
      },
      {
        label: "Internship",
        path: "/student-dashboard/jobs/internship",
      },
      /*{ label: "Freelance", path: "/student-dashboard/jobs/freelance" },*/
    ],
  },
  {
    label: "AI Tools",
    icon: aiIcon,
    subMenu: [
      {
        label: "Career Assistant",
        path: "student-dashboard/ai-tools/career-assistant",
      },
      {
        label: "Resume Builder",
        path: "student-dashboard/resume-builder",
      },
    ],
  },
  {
    label: "Innovations",
    icon: innovationIcon,
    subMenu: [
      {
        label: "Submit Innovation",
        path: "student-dashboard/innovations/submit",
      },
      {
        label: "Global Projects",
        path: "student-dashboard/innovations/global-projects",
      },
    ],
  },

  /*{
    label: "Subscription",
    icon: subscriptionIcon,
    path: "student-dashboard/subscription",
  },*/
  {
    label: "Settings",
    icon: settingsIcon,
    path: "student-dashboard/settings",
  },
  { label: "About Us", icon: aboutIcon, path: "about-hicore" },
  { label: "Help", icon: helpIcon, path: "student-dashboard/help" },
  {
    label: "Logout",
    icon: logoutIcon,
    path: "student-dashboard/logout",
    danger: true,
  },
];

export default menuItems;