import edsparkIcon from "../../../assets/Freelance/company-logo.png";
import notionIcon from "../../../assets/Freelance/company-logo.png";
import finedgeIcon from "../../../assets/Freelance/company-logo.png";
import bytecraftIcon from "../../../assets/Freelance/company-logo.png";
import tickIcon from "../../../assets/Freelance/tick-green.png";

const gigs = [
  {
    id: 1,
    title: "UI Redesign for EdTech App",
    company: "EdSpark Solutions",
    posted: "Posted 2 days ago • Over 100 applicants",
    duration: "2 weeks",
    pay: "₹4,000–₹6,000",
    location: "Remote (India-wide)",
    eligibility: "Beginner - Intermediate",
    applyBefore: "03/08/2025",
    website: "www.edsparksolutions.com",
    logo: edsparkIcon,
    skills: {
      allSkills: ["Figma", "UI Design", "Responsive Design"],
      matchedSkills: ["Figma", "UI Design"],
    },
    companyInfo: {
      about: "TechNova Labs is a fast-growing product innovation company that builds cutting-edge SaaS platforms and AI-driven applications...",
      overview: "We're looking for a passionate and detail-oriented UI designer to revamp the user interface of our mobile-first EdTech application...",
      whoCanApply: [
        "have strong eye for clean design and usability.",
        "is familiar with UI/UX principles and mobile-first design.",
        "has a portfolio showcasing past UI work (student projects welcome).",
        "Bonus: Knowledge of accessibility and responsive design",
      ],
      responsibilities: [
        "Analyze the current UI and suggest improvements.",
        "Redesign 5–7 mobile app screens using Figma (or similar tool).",
        "Create clean, responsive, and minimal UI layouts.",
        "Ensure design consistency with modern EdTech UI trends.",
        "Collaborate with the developer (async) to clarify design specs.",
      ],
      deliverables: [
        "High-fidelity mockups for all redesigned screens.",
        "Design prototype/interactive flow (optional).",
        "Style guide (typography, colors, buttons, icons).",
        "Handoff documentation or Figma link.",
      ],
      notes: [
        "All communications will be handled via email or Discord.",
        "Must complete within 14 days of onboarding.",
        "Great opportunity to add a live EdTech case study to your portfolio.",
      ],
      perks: ["Certificate", "Letter of recommendation", "Flexible work hours"],
    },
    icons: { tick: tickIcon },
  },

  {
    id: 2,
    title: "Landing Page Development for Startup",
    company: "LaunchMate",
    posted: "Posted 1 day ago • 60 applicants",
    duration: "1 week",
    pay: "₹3,000–₹4,500",
    location: "Remote",
    eligibility: "Beginner",
    applyBefore: "04/08/2025",
    website: "www.launchmate.io",
    logo: notionIcon,
    skills: {
      allSkills: ["HTML", "CSS", "JavaScript", "React"],
      matchedSkills: ["HTML", "CSS", "React"],
    },
    companyInfo: {
      about: "LaunchMate helps early-stage startups build MVPs and marketing tools through a community of freelance developers.",
      overview: "We need a developer to build a modern, responsive landing page for our client onboarding campaign.",
      whoCanApply: [
        "Knows HTML/CSS well and can build responsive layouts.",
        "Experience with React is a plus.",
        "Can deliver within 7 days.",
      ],
      responsibilities: [
        "Create a mobile-friendly landing page using our provided mockups.",
        "Ensure compatibility across devices and browsers.",
        "Integrate simple animation for CTA buttons and sections.",
      ],
      deliverables: [
        "Clean, responsive landing page code (HTML/CSS/JS/React).",
        "Deployment on Netlify or Vercel.",
      ],
      notes: [
        "Content and wireframes will be provided.",
        "Frequent updates required during development via Discord.",
      ],
      perks: ["Letter of recommendation", "Exposure on our network"],
    },
    icons: { tick: tickIcon },
  },

  {
    id: 3,
    title: "Content Writing for Tech Blog",
    company: "DevWrite",
    posted: "Posted 4 hours ago • 40 applicants",
    duration: "10 days",
    pay: "₹2,000–₹3,000",
    location: "Remote (Flexible hours)",
    eligibility: "Beginner",
    applyBefore: "05/08/2025",
    website: "www.devwrite.blog",
    logo: finedgeIcon,
    skills: {
      allSkills: ["Content Writing", "SEO", "Technical Writing"],
      matchedSkills: ["Content Writing"],
    },
    companyInfo: {
      about: "DevWrite is a growing tech-focused publication that makes programming topics easier to understand for developers of all levels.",
      overview: "We’re hiring enthusiastic writers who can explain tech concepts (like APIs, Git, JavaScript, etc.) in a simple and engaging way.",
      whoCanApply: [
        "Strong writing skills in English.",
        "Basic understanding of web development or software engineering.",
        "Can deliver 3–4 short blog posts in 10 days.",
      ],
      responsibilities: [
        "Write original blog posts (600–800 words) based on provided topics.",
        "Optimize articles for SEO and readability.",
        "Submit drafts for review and revise based on feedback.",
      ],
      deliverables: [
        "3–4 blog posts in Word or Google Docs format.",
        "Each post must include title, headers, and relevant links.",
      ],
      notes: [
        "You can pick your own schedule.",
        "Good writers may be hired for ongoing freelance work.",
      ],
      perks: ["Certificate", "Portfolio publication"],
    },
    icons: { tick: tickIcon },
  },

  {
    id: 4,
    title: "Logo Animation",
    company: "ByteCraft Studios",
    posted: "Posted 2 days ago",
    duration: "1 week",
    pay: "₹2K–3K",
    location: "Remote (World-wide)",
    logo: bytecraftIcon,
    website: "www.bytecraftstudios.com",
    // No detailed info available – keep minimal entry
  },
];

export default gigs;
