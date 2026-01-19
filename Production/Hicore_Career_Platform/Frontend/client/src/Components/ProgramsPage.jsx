import React from "react";
import ProgramCard from "./ProgramCard";

// Image imports
import img0 from '../assets/program0.png';
import img1 from "../assets/program_1.png";
import img2 from "../assets/program_2.png";
import img3 from "../assets/program_3.png";
import img4 from "../assets/program_4.png";
import img5 from "../assets/program_5.png";
import img6 from "../assets/program_6.png";
import img7 from "../assets/program_7.png";
import img8 from "../assets/program_8.png";
import img9 from "../assets/GlobalEd.png";

// Program Data (same as before)
const Programs = [
  {
    title: "Freshers Interview Success Program",
    summary:
      "Crack Your First Interview with Confidence - in Just 8 Weeks",
    points: [
      "Job-Focused Weekly Curriculum",
      "Career Project + Global Certificate",
      "AI-Powered Tools for Career Success",
    ],
    button: "Join Now",
    color: "pink",
    img: img0,
    isLeft: true,
  },
  {
    title: "Internship/Mini Project Program",
    summary:
      "Get started with real-world coding through guided mini projects, templates, and mentor support.",
    points: [
      "Learn by building — no more theory-only learning",
      "Includes SRS, UML, GitHub practice, and feedback",
      "Perfect for resume-building and early experience",
    ],
    button: "Start Your First Mini Project",
    color: "pink",
    img: img1,
    isLeft: false,
  },
  {
    title: "Major/Final Year Project Accelerator",
    summary:
      "Build a full-scale SDLC project with expert mentorship and industry-relevant ideas.",
    points: [
      "Choose from AI/ML, Web, App, Cybersecurity & more",
      "Download complete docs + submit projects",
      "Get project certification + mentor evaluation",
    ],
    button: "Build Your Final Year Project with Us",
    color: "yellow",
    img: img2,
    isLeft: true,
  },
  {
    title: "Skill Upgrade Program",
    summary:
      "Level up with AI-personalized learning paths and industry-ready certifications",
    points: [
      "Learn in-demand tech stacks and soft skills",
      "AI tracks your gap and adjusts your roadmap",
      "Finish courses and earn badges",
    ],
    button: "Get Your Personalized Learning Path",
    color: "cyan",
    img: img3,
    isLeft: false,
  },
  {
    title: "Career Launchpad Program",
    summary:
      "Go from confusion to clarity — build your resume, analyze JDs, and prepare with AI.",
    points: [
      "Resume Builder + JD Analyzer + Interview Plan",
      "Mock interviews and job fit scoring",
      "Tailored to entry, mid, and career-switchers",
    ],
    button: "Launch Your Career Today",
    color: "green",
    img: img4,
    isLeft: true,
  },
  {
    title: "AI Career Growth Program",
    summary:
      "Unlock your next role with an AI-generated career roadmap tailored to your goals.",
    points: [
      "Role-based path suggestions (e.g., Data Analyst)",
      "Skill gap detection",
      "Suggested certifications and projects",
    ],
    button: "Generate My AI Career Roadmap",
    color: "blue",
    img: img5,
    isLeft: false,
  },
  {
    title: "Global Job Access Program",
    summary:
      "Prepare for jobs in the US, Canada, and top tech companies with global resources.",
    points: [
      "Resume optimization for global ATS",
      "Partnered listings from verified firms",
      "Support for remote roles & visa guidance",
    ],
    button: "Apply for Global Roles Now",
    color: "dblue",
    img: img6,
    isLeft: true,
  },
  {
    title: "HiCore Global EdConnect",
    summary:
      "Your guided journey to global education with expert tools and support.",
    points: [
      "Discover programs and universities tailored to your goals",
      "Get real-time advice through chat and video sessions",
      "Access funding options suited to your profile.",
    ],
    button: "Book a Session",
    color: "pink",
    img: img9,
    isLeft: false,
  },
  {
    title: "Mentor Connect Program for mentors",
    summary:
      "Guide, evaluate, and support learners while growing your teaching portfolio",
    points: [
      "Match with students based on domain",
      "Conduct project reviews and mock interviews",
      "Earn recognition and referral income",
    ],
    button: "Become a Mentor",
    color: "purple",
    img: img7,
    isLeft: true,
  },
  {
    title: "Skill-Based Hiring Suite for Employers",
    summary:
      "Go beyond resumes — match roles with hands-on project experience and real skills.",
    points: [
      "JD Analyzer → Skill Fit Matching",
      "View candidate project demo videos",
      "Smart shortlist tools for faster hiring",
    ],
    button: "Find Project-Ready Talent",
    color: "pink",
    img: img8,
    isLeft: false,
  },
];

const ProgramsPage = () => {
  return (
    <section className="w-full px-4 sm:px-6 py-12 max-w-7xl mx-auto">
      <h2 className="w-full font-poppins font-bold text-2xl md:text-3xl text-center text-[#403B93] mt-6">
        Our Programs That Turn Skills Into Careers
      </h2>
      <div className="flex items-center justify-center mt-4 mb-10">
        <div className="w-2 h-2 bg-[#343079] rotate-45" />
        {/* The horizontal rule is now responsive and will not overflow */}
        <div className="w-full max-w-3xl h-0 border-t-[1.5px] border-[#403B93]" />
        <div className="w-2 h-2 bg-[#343079] rotate-45" />
      </div>

      {/* The main container for the program cards has the fixed margin removed for proper centering on all screens */}
      <div className="w-full">
        {Programs.map((program, index) => (
          <ProgramCard key={index} program={program} />
        ))}
      </div>
    </section>
  );
};

export default ProgramsPage;
