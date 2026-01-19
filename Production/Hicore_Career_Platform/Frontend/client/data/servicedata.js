import internshipImg from "../src/assets/ServiceLandingpng/service_internship.png";
import finalYearImg from "../src/assets/ServiceLandingpng/service_major.jpg";
import freelanceImg from "../src/assets/ServiceLandingpng/service_freelance.jpg";
import mentorConnectImg from "../src/assets/ServiceLandingpng/service_mentor.jpg";
import resumeBuilderImg from "../src/assets/ServiceLandingpng/service_resume.jpg";
import certificateImg from "../src/assets/ServiceLandingpng/service_certificate.jpg";
import aiAssistantImg from "../src/assets/ServiceLandingpng/service_career.png";
import applyjobs from "../src/assets/ServiceLandingpng/service_apply.jpg";
import internshiprole from "../src/assets/ServiceLandingpng/service_internshipopp.png";
import videoprofile from "../src/assets/ServiceLandingpng/service_showcase.png";
import techquiz from "../src/assets/ServiceLandingpng/service_techquiz.png";
import careerassistant from "../src/assets/ServiceLandingpng/service_career.png";
import jobdescription from "../src/assets/ServiceLandingpng/service_jd.png";
import mock from "../src/assets/ServiceLandingpng/service_mock.png";
import mentorincome from "../src/assets/ServiceLandingpng/service_mentorincome.png";
import reviewproject from "../src/assets/ServiceLandingpng/service_reviewproject.png";
import guideproject from "../src/assets/ServiceLandingpng/service_guideproject.png";
import mockinterview from "../src/assets/ServiceLandingpng/service_mockinterview.png";
import earnrecognition from "../src/assets/ServiceLandingpng/service_earn.png";
import postjobs from "../src/assets/ServiceLandingpng/service_postjobs.png";
import manageapplications from "../src/assets/ServiceLandingpng/service_manageapplication.png";
import viewcandidate from "../src/assets/ServiceLandingpng/service_viewcandidate.png";
import viewtop from "../src/assets/ServiceLandingpng/service_viewtop.png";
import aibasedjd from "../src/assets/ServiceLandingpng/service_AIbasedJD.png";
import hackathon from "../src/assets/ServiceLandingpng/service_hackathon.png";


export const servicesData = {
  "For Students": {
    heading: "Learn, build, and get noticed — even before you graduate",
    cards: [
      {
        title: "Internship & Mini Project Programs",
        description: "Hands-on experience to apply what you learn.",
        buttonText: "Start Your Project Today",
        image: internshipImg,
        path: "/internship-project",
      },
      {
        title: "Major / Final Year Project Support",
        description: "Guided mentorship, documentation help, and SRS/SDLC resources.",
        buttonText: "Get Project Mentorship",
        image: finalYearImg,
        path: "/major-projects",
      },
      {
        title: "Freelance Projects for Students",
        description: "Earn, learn, and gain real-world exposure.",
        buttonText: "Find Student Freelance Gigs",
        image: freelanceImg,
        path: "",
      },
      {
        title: "Mentor Connect",
        description: "Get guidance directly from industry professionals.",
        buttonText: "Connect with a Mentor",
        image: mentorConnectImg,
        path: "",
      },
      {
        title: "Resume Builder (AI Assisted)",
        description: "Auto-fill, optimize, and export job-ready resumes.",
        buttonText: "Build Your Resume",
        image: resumeBuilderImg,
        path: "/resume-builder",
      },
      {
        title: "Globally Accepted Certifications",
        description: "Stand out with certifications recognized by MNCs and global recruiters.",
        buttonText: "Earn Your Certification Now",
        image: certificateImg,
        path: "",
      },
      {
        title: "AI Career Assistant",
        description: "Get role recommendations, personalized learning paths & roadmap.",
        buttonText: "Launch Career AI Assistant",
        image: aiAssistantImg,
        path: "",
      }
    ],
  },

  "For Job Seekers": {
    heading: "From first job to career switch - we've got you covered",
    cards: [
      {
        title: "Apply for Jobs",
        description: "Access Jobs based on domain, location, and experience",
        buttonText: "Find & Apply For Jobs",
        image: applyjobs,
        path: "/applyforjobs",
      },
      {
        title: "Internship Opportunities",
        description: "Gain Experience, even as a fresher.",
        buttonText: "Explore Internship Roles",
        image: internshiprole,
        path: "/internship-opportunities",
      },
      {
        title: "Showcase Video Profile",
        description: "Let recruiters see you personality, not just your resume.",
        buttonText: "Upload My Video Profile",
        image: videoprofile,
        path: "",
      },
      {
        title: "Resume Builder(AI Assisted)",
        description: "Get real-time suggestions, formatting help, and keuword optimization.",
        buttonText: "Enhance my Resume",
        image: resumeBuilderImg,
        path: "/resume-builder",
      },
      {
        title: "Tech Quizzes & Flash Card Activities",
        description: "Stay sharp and interview ready.",
        buttonText: "Take a Tech Quiz",
        image: techquiz,
        path: "/tech-quizzes",
      },
      {
        title: "AI Career Assistant",
        description: "Learn what you need next based on where you are now.",
        buttonText: "Start Career AI Assistant",
        image: careerassistant,
        path: "",
      },
      {
        title: "JD Analyzer & Interview Plan",
        description: "Paste a job description and get a full skill gap analysis + question set.",
        buttonText: "Analyze a Job Description",
        image: jobdescription,
        path: "",
      },
      {
        title: "Mock Interviews",
        description: "Practice with mentors and AI bots to build confidence.",
        buttonText: "Schedule a Mock Interview",
        image: mock,
        path: "generate-interview",
      }
    ],
  },
  "For Mentors": {
    heading: "Empower the next generation and earn rewards along the way",
    cards: [
      {
        title: "Become a Mentor & Generate Income",
        description: "Share your knowledge and mentor future professionals.",
        buttonText: "Apply to Become a Mentor",
        image: mentorincome,
        path: "",
      },
      {
        title: "Review Student Projects",
        description: "Provide constructive feedback and ratings.",
        buttonText: "Start Reviewing Projects",
        image: reviewproject,
        path: "",
      },
      {
        title: "Guide Final Year Projects",
        description: "Help students with technical clarity and real-world insights.",
        buttonText: "Guide a Student Project",
        image: guideproject,
        path: "/major-projects",
      },
      {
        title: "Host Mock Interviews",
        description: "Help job seekers prepare and gain feedback experience.",
        buttonText: "Host a Mock Interview",
        image: mockinterview,
        path: "",
      },
      {
        title: "Earn Recognition & Badges",
        description: "Highlight your impact and contribution.",
        buttonText: "View Mentor Badges",
        image: earnrecognition,
        path: "",
      }
    ],
  },
  "For Employers": {
    heading: "Discover and hire real talent with skills that go beyond the resume",
    cards: [
      {
        title: "Post Jobs & Internships",
        description: "Tap into a verified pool of students and professionals.",
        buttonText: "Post a job of internship",
        image: postjobs,
        path: "",
      },
      {
        title: "Manage applications",
        description: "Track, filter and shortlist with ease.",
        buttonText: "View Applicants",
        image: manageapplications,
        path: "",
      },
      {
        title: "View Candidate Profiles",
        description: "See AI_ranked, dkill-tagged resumes and video intros.",
        buttonText: "Browse Candidate Profiles",
        image: viewcandidate,
        path: "",
      },
      {
        title: "View Top Talent",
        description: "Discover standout candidates and project contributors.",
        buttonText: "See Top Talent",
        image: viewtop,
        path: "",
      },
      {
        title: "AI-Based JD Shortlisting",
        description: "Upload your JD - we'll match and rank candidates automatically.",
        buttonText: "See Top Talent",
        image: aibasedjd,
        path: "",
      },
      {
        title: "Hackathon Partnerships",
        description: "Host Challenges and get access to the top performers.",
        buttonText: "Partner for a Hackathon",
        image: hackathon,
        path: "",
      },
    ],
  },
};
