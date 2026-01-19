import React from "react";

// Local icons
import briefcaseIcon from "../../../../assets/Employer/PostJobs/experience.png";
import salaryIcon from "../../../../assets/Employer/PostJobs/Salary.png";
import jobIdIcon from "../../../../assets/Employer/PostJobs/jobid.png";
import calendarIcon from "../../../../assets/Employer/PostJobs/calendar.png";
import globeIcon from "../../../../assets/Employer/PostJobs/Global.png";
import locationIcon from "../../../../assets/Employer/PostJobs/location.png";

import logoIcon from "../../../../assets/Employer/PostJobs/logoIcon.png";
import tickIcon from "../../../../assets/Employer/PostJobs/tickIcon.png";

import aiIcon from "../../../../assets/Employer/PostJobs/aiIcon.png";
import pencilIcon from "../../../../assets/Employer/PostJobs/pencilIcon.png";

const skills = [
  "React.js",
  "JavaScript (ES6+)",
  "Remote",
  "RESTful API integration",
  "CSS3",
  "Webpack",
  "Babel",
  "Git",
  "Responsive Design",
  "React Testing Library",
  "Jest",
  "HTML5",
  "Figma",
  "Accessibility Standards",
];

const LayoutEditor = ({ onAiClick, expanded }) => {
  return (
    <div className="p-6 w-full bg-white rounded-2xl shadow-md border-[1px] border-[#E1E0EB]">
      {/* AI Suggestion Box */}
      <div
        className="flex items-center justify-between px-5 py-3 mb-6 select-none cursor-pointer"
        onClick={onAiClick}
        title="Click to expand AI Assistance"
      >
        <div className="flex items-center gap-3">
          <img src={aiIcon} alt="AI Icon" className="w-10 h-10" />
          <span className="text-xl font-semibold text-[#2D2C8D] select-text">
            AI suggestion
          </span>
        </div>

        {/* Conditionally show pencil icon or Save text */}
        {expanded ? (
          <span className="text-indigo-700 font-semibold cursor-pointer select-none">
            Save
          </span>
        ) : (
          <img src={pencilIcon} alt="Edit" className="w-5 h-5 cursor-pointer" />
        )}
      </div>

      {/* ... rest of your unchanged code ... */}
      {/* Job Header */}
      <div className="flex items-start mb-6">
        <img src={logoIcon} alt="logo" className="w-14 h-14 mr-4" />
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold text-[#2A2D7B] leading-tight mb-1">
            Title: Frontend Developer (React.js)
          </h3>
          <p className="text-indigo-700 font-semibold mb-1 cursor-pointer hover:underline">
            TechNova Labs
          </p>
          <div className="text-sm text-[#2A2D7B]">
            Posted 2 days ago • Over 100 applicants
          </div>
        </div>
      </div>

      {/* Job Meta Info */}
      <div className="text-sm text-[#2A2D7B] mb-6 space-y-2">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-1">
            <img src={briefcaseIcon} alt="" className="w-4 h-4" /> 2–4 yrs
          </div>
          <div className="flex items-center gap-1">
            <img src={salaryIcon} alt="" className="w-4 h-4" /> INR 8 – 12 LPA
          </div>
          <div className="flex items-center gap-1">
            <img src={jobIdIcon} alt="" className="w-4 h-4" /> Job ID: 125924601
          </div>
          <div className="flex items-center gap-1">
            <img src={calendarIcon} alt="" className="w-4 h-4" /> Apply Before: 03/08/2025
          </div>
        </div>
        <div className="flex items-center gap-1">
          <img src={globeIcon} alt="" className="w-4 h-4" /> www.technovalabs.com
        </div>
        <div className="flex items-center gap-1">
          <img src={locationIcon} alt="" className="w-4 h-4" /> Bangalore, India (Hybrid)
        </div>
      </div>

      <hr className="border-[#2A2D7B] mb-8" />

      {/* Skills Set */}
      <h4 className="font-semibold text-[#2A2D7B] mb-4 text-lg">Skills Set</h4>
      <div className="flex flex-wrap gap-3 mb-8">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm select-none"
          >
            <img src={tickIcon} alt="tick" className="w-4 h-4" /> {skill}
          </span>
        ))}
      </div>

      {/* About Company */}
      <h4 className="font-semibold text-[#2A2D7B] mb-1">About TechNova Labs</h4>
      <p className="text-[#2A2D7B] mb-6">
        TechNova Labs is a fast-growing product innovation company that builds
        cutting-edge SaaS platforms and AI-driven applications for global
        clients. We focus on scalable tech, clean architecture, and pixel-perfect
        UI experiences.
      </p>

      {/* Job Overview */}
      <h4 className="font-semibold text-[#2A2D7B] mb-1">Job Overview</h4>
      <p className="text-[#2A2D7B] mb-6">
        We are looking for a skilled and passionate{" "}
        <strong>Frontend Developer (React.js)</strong> to join our dynamic
        engineering team. You will be responsible for building modern,
        performant, and responsive user interfaces for web applications that
        serve thousands of users daily.
      </p>

      {/* Key Responsibilities */}
      <h4 className="font-semibold text-[#2A2D7B] mb-3">Key Responsibilities</h4>
      <ul className="list-disc list-inside text-[#2A2D7B] mb-6 space-y-1">
        <li>
          Develop scalable and maintainable frontend components using React.js
          and modern JavaScript (ES6+)
        </li>
        <li>
          Collaborate with backend developers, designers, and product managers
          to deliver end-to-end features
        </li>
        <li>
          Translate Figma or design mockups into responsive, accessible
          interfaces
        </li>
        <li>
          Optimize components for performance, SEO, and cross-browser
          compatibility
        </li>
        <li>
          Maintain code quality via unit testing, code reviews, and best
          practices
        </li>
        <li>Integrate RESTful APIs and third-party libraries/services</li>
        <li>Participate in Agile ceremonies (standups, planning, retrospectives)</li>
      </ul>

      {/* Must-Have Skills */}
      <h4 className="font-semibold text-[#2A2D7B] mb-3">Must-Have Skills</h4>
      <ul className="list-disc list-inside text-[#2A2D7B] mb-6 space-y-1">
        <li>2–4 years of frontend development experience</li>
        <li>
          Strong proficiency in <strong>React.js</strong>, Redux or Context API
        </li>
        <li>
          Solid knowledge of <strong>HTML5</strong>, <strong>CSS3</strong>, and{" "}
          <strong>JavaScript (ES6+)</strong>
        </li>
        <li>Familiar with Webpack, Babel, and build pipelines</li>
        <li>Hands-on with Git, npm/yarn, and version control workflows</li>
        <li>Good understanding of responsive design and accessibility standards</li>
        <li>Experience with API integration and state management</li>
      </ul>

      {/* Good to Have */}
      <h4 className="font-semibold text-[#2A2D7B] mb-3">Good to Have</h4>
      <ul className="list-disc list-inside text-[#2A2D7B] mb-6 space-y-1">
        <li>Experience with TypeScript</li>
        <li>
          Familiarity with testing frameworks like Jest or React Testing Library
        </li>
        <li>Exposure to UI/UX principles or tools like Figma</li>
        <li>Knowledge of CI/CD pipelines and modern DevOps practices</li>
      </ul>

      {/* What We Offer */}
      <h4 className="font-semibold text-[#2A2D7B] mb-3">What We Offer</h4>
      <ul className="list-disc list-inside text-[#2A2D7B] mb-8 space-y-1">
        <li>Hybrid work culture (3 days onsite, 2 remote)</li>
        <li>Dynamic and inclusive team environment</li>
        <li>Health insurance and wellness benefits</li>
        <li>Career development opportunities and learning budgets</li>
        <li>Flexible leave policy</li>
      </ul>

      
    </div>
  );
};

export default LayoutEditor;
