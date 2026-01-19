import rolesImg from "../../../assets/AICareerPage/img1.png";
import gapImg from "../../../assets/AICareerPage/img2.jpg";
import img3 from "../../../assets/AICareerPage/img3.png";
import img4 from "../../../assets/AICareerPage/img4.png";

export const careerFeatures = [
  {
    title: "Smart Role Suggestions",
    description: "Discover job roles that perfectly match your profile and aspirations.",
    buttonText: "Explore My Role Matches",
    image: rolesImg,
    imgLeft: true,
    route: "/ai-career-assistant/role-suggestions",
  },
  {
    title: "Skill Gap Analysis",
    description: "Instantly see what you’re missing – and how to bridge the gap.",
    buttonText: "Show My Skill Gaps",
    image: gapImg,
    imgLeft: false,
    route: "/ai-career-assistant/skill-gap-analysis",
  },
  {
    title: "AI_Powered Learning Roadmap",
    description: "Receive a step-by-step plan with recommended courses, projects and certifications.",
    buttonText: "View My Learning Roadmap",
    image: img3,
    imgLeft: true,
    route: "/ai-career-assistant/learning-roadmap",
  },
  {
    title: "Interview Readiness Tips",
    description: "Get mock interview prompts tailored to your dream role",
    buttonText: "Start My Mock Interview",
    image: img4,
    imgLeft: false,
    route: "/ai-career-assistant/mock-interview",
  },
];
