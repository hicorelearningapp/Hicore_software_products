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
    path: "/jobseeker-dashboard/dashboard",
  },
 
  {
    label: "Learn",
    icon: learnIcon,
    subMenu: [
      { label: "Courses", path: "/jobseeker-dashboard/learn/course" },
      {
        label: "Domain Courses",
        path: "/jobseeker-dashboard/learn/domain-course",
      },
    ],
  },
  {
    label: "Certifications",
    icon: certIcon,
    subMenu: [
      {
        label: "Internship Certification",
        path: "/jobseeker-dashboard/certifications/internship",
      },
      /*{
        label: "Higher Studies",
        path: "/jobseeker-dashboard/certifications/higher-studies",
      },*/
      {
        label: "Industry Certification",
        path: "/jobseeker-dashboard/certifications/industry",
      },
    ],
  },
  {
    label: "Projects",
    icon: projectIcon,
    subMenu: [
      {
        label: "Internship Projects",
        path: "/jobseeker-dashboard/projects/inter-project",
      },
      {
        label: "Final Year Projects",
        path: "/jobseeker-dashboard/projects/final-year-project",
      },
      /*{
        label: "Freelance Projects",
        path: "/jobseeker-dashboard/projects/freelance-projects",
      },*/
    ],
  },
  {
    label: "Interview",
    icon: interviewIcon,
    subMenu: [
      {
        label: "Freshers Interview",
        path: "/jobseeker-dashboard/interview/freshers",
      },
      {
        label: "Mock Interview",
        path: "jobseeker-dashboard/interview/mock-interview",
      },
      {
        label: "Flashcards",
        path: "jobseeker-dashboard/interview/flashcard-activity",
      },
      { label: "Quiz", path: "jobseeker-dashboard/interview/quiz" },
    ],
  },
  {
    label: "Jobs",
    icon: jobsIcon,
    subMenu: [
      {
        label: "Full-time Jobs",
        path: "/jobseeker-dashboard/jobs/full-time-jobs",
      },
      {
        label: "Internships",
        path: "/jobseeker-dashboard/jobs/internships",
      },
      /*{
        label: "Part-time Jobs",
        path: "/jobseeker-dashboard/jobs/part-time-jobs",
      },
      { label: "Freelance", path: "/jobseeker-dashboard/jobs/freelance" },*/
    ],
  },
  /*{
    label: "AI Tools",
    icon: aiIcon,
    subMenu: [
      {
        label: "Career Assistant",
        path: "jobseeker-dashboard/ai-tools/career-assistant",
      },
      {
        label: "Resume Builder",
        path: "jobseeker-dashboard/resume-builder",
      },
    ],
  },*/
  {
    label: "Innovations",
    icon: innovationIcon,
    subMenu: [
      {
        label: "Submit Innovation",
        path: "jobseeker-dashboard/innovations/submit",
      },
      {
        label: "Global Projects",
        path: "jobseeker-dashboard/innovations/global-projects",
      },
    ],
  },

  /*{
    label: "Subscription",
    icon: subscriptionIcon,
    path: "jobseeker-dashboard/subscription",
  },*/
  {
    label: "Settings",
    icon: settingsIcon,
    path: "jobseeker-dashboard/settings",
  },
  { label: "About Us", icon: aboutIcon, path: "about-hicore" },
  { label: "Help", icon: helpIcon, path: "jobseeker-dashboard/help" },
  {
    label: "Logout",
    icon: logoutIcon,
    path: "jobseeker-dashboard/logout",
    danger: true,
  },
];

export default menuItems;