import courseTabIcon from "../assets/Course/Domain.png";
import certificationTabIcon from "../assets/Course/Certificate.png";
import domainTabIcon from "../assets/Course/Target.png";


import htmlIcon from "../assets/Course/html.png";
import cssIcon from "../assets/Course/css.png";
import jsIcon from "../assets/Course/js.png";
import reactIcon from "../assets/Course/react.png";
import angularIcon from "../assets/Course/angular.png";
import wpfIcon from "../assets/Course/wpf.png";
import xmlIcon from "../assets/Course/xml.png";
import kotlinIcon  from "../assets/Course/kotlin.png";
import bootsIcon from "../assets/Course/boots.png";
import jqIcon from "../assets/Course/jq.png";


import cIcon from "../assets/Course/c.png";
import cplusIcon from "../assets/Course/cplusplus.png";
import csharpIcon from "../assets/Course/csharp.png";
import mongoIcon from "../assets/Course/mongodb.png";
import mysqlIcon from "../assets/Course/mysql.png";
import nodeIcon from "../assets/Course/node.png";
import pythonIcon from "../assets/Course/python.png";
import sqlIcon from "../assets/Course/sql.png";
import psqlIcon from "../assets/Course/psql.png";
import javaIcon from "../assets/Course/java.png";
import phpIcon from "../assets/Course/php.png";
import aspIcon from "../assets/Course/asp.png";
import dsaIcon from "../assets/Course/dsa.png";
import opencvIcon from "../assets/Course/opencv.png";

import cyberIcon from "../assets/Course/cybersecurity.png";
import cloudIcon from "../assets/Course/cloud-computing.png";
import ccnaIcon from "../assets/Course/ccna.png";
import ccnpIcon from "../assets/Course/ccnp.png";

import aiIcon from "../assets/Course/ai.png";
import genaiIcon from "../assets/Course/genai.png"; 
import aifoundationIcon from "../assets/Course/aifoundation.png"; 
import agenticaiIcon from "../assets/Course/agenticai.png"; 
import researchIcon from "../assets/Course/research.png"; 
import reviewIcon from "../assets/Course/reviewpaper.png"; 

import manualIcon from "../assets/Course/manual.png";
import automationIcon from "../assets/Course/automation.png"; 

import medicalIcon from "../assets/Course/medical.png";
import semiIcon from "../assets/Course/semi.png";
import softwareIcon from "../assets/Course/software.png";
import networkIcon from "../assets/Course/network.png";  

import biotechIcon from "../assets/Course/biotech.jpg";
import softwareengineericon from "../assets/Course/softwareengineer.png";
import processengineericon from "../assets/Course/processengineer.png";
import mechanicalengineericon from "../assets/Course/mechanicalengineer.png";
import factoryicon from "../assets/Course/factory-icon.png";
import embeddedicon from "../assets/Course/embeded-icon.png";
import vlsiicon from "../assets/Course/vlsi-icon.png";
import ioticon from "../assets/Course/iot-icon.png";
import bioinformaticsIcon from "../assets/Course/bio-informatics.png";
import datascienceIcon from "../assets/Course/datascience.png";
import awsIcon from "../assets/Course/aws-ml.png";
import coreaiIcon from "../assets/Course/core_ai.png";
import mlopsIcon from "../assets/Course/ml-ops.png";
import quantumaiIcon from "../assets/Course/quantumai.png";
//service section images..

import internshipImg from "../assets/ServiceLandingpng/service_internship.png";
import finalYearImg from "../assets/ServiceLandingpng/service_major.jpg";
import freshersImg from "../assets/ServiceLandingpng/bannerimage.png";
import globalImg from "../assets/ServiceLandingpng/image.png";
import majorjobs from "../assets/ServiceLandingpng/major.png";
import minijobs from "../assets/ServiceLandingpng/mini.png";
import studImg from "../assets/ServiceLandingpng/friends.png";
//import freelanceImg from "../assets/ServiceLandingpng/service_freelance.jpg";
import mentorConnectImg from "../assets/ServiceLandingpng/service_mentor.jpg";
import resumeBuilderImg from "../assets/ServiceLandingpng/service_resume.jpg";
//import certificateImg from "../assets/ServiceLandingpng/service_certificate.jpg";
import aiAssistantImg from "../assets/ServiceLandingpng/service_career.png";
import applyjobs from "../assets/ServiceLandingpng/service_apply.jpg";
import internshiprole from "../assets/ServiceLandingpng/service_internshipopp.png";
//import videoprofile from "../assets/ServiceLandingpng/service_showcase.png";
import techquiz from "../assets/ServiceLandingpng/service_techquiz.png";
import careerassistant from "../assets/ServiceLandingpng/service_career.png";
import jobdescription from "../assets/ServiceLandingpng/service_jd.png";
import mock from "../assets/ServiceLandingpng/service_mock.png";
import mentorincome from "../assets/ServiceLandingpng/service_mentorincome.png";
import reviewproject from "../assets/ServiceLandingpng/service_reviewproject.png";
import guideproject from "../assets/ServiceLandingpng/service_guideproject.png";
import mockinterview from "../assets/ServiceLandingpng/service_mockinterview.png";
//import earnrecognition from "../assets/ServiceLandingpng/service_earn.png";
import postjobs from "../assets/ServiceLandingpng/service_postjobs.png";
import manageapplications from "../assets/ServiceLandingpng/service_manageapplication.png";
import viewcandidate from "../assets/ServiceLandingpng/service_viewcandidate.png";
import viewtop from "../assets/ServiceLandingpng/service_viewtop.png";
import aibasedjd from "../assets/ServiceLandingpng/service_AIbasedJD.png";
//import hackathon from "../assets/ServiceLandingpng/service_hackathon.png";

import {
  aiInstructors,
  biotechInstructors,
  networkInstructors,
  semiInstructors,
  researchInstructors,
} from "./instructors";


const routes = [
  { label: "Home", path: "/", dropdown: false },
  {
    label: "Courses",
    path: "/course",
    dropdown: false,
    tabs: [
      { name: "Courses", icon: courseTabIcon },
      { name: "Certifications", icon: certificationTabIcon },
      { name: "Domain Based Courses", icon: domainTabIcon },
    ],
    items: {
      Courses: {
        subTabs: ["Frontend", "Backend", "Security", "AI", "Testing", "Research"],
        data: {
          Frontend: [
            {
              id: "C001",
              label: "HTML",
              path: "/courses/html",
              icon: htmlIcon,
            },
            { id: "C002", label: "CSS", path: "/courses/css", icon: cssIcon },
            {
              id: "C003",
              label: "Javascript",
              path: "/courses/javascript",
              icon: jsIcon,
            },
            {
              id: "C004",
              label: "React",
              path: "/courses/react",
              icon: reactIcon,
            },
            {
              id: "C005",
              label: "Angular",
              path: "/courses/angular",
              icon: angularIcon,
            },
            { id: "C006", label: "WPF", path: "/courses/wpf", icon: wpfIcon },
            { id: "C007", label: "XML", path: "/courses/xml", icon: xmlIcon },
            {
              id: "C008",
              label: "Kotlin",
              path: "/courses/kotlin",
              icon: kotlinIcon,
            },
            {
              id: "C009",
              label: "Bootstrap",
              path: "/courses/bootstrap",
              icon: bootsIcon,
            },
            {
              id: "C010",
              label: "jQuery",
              path: "/courses/jquery",
              icon: jqIcon,
            },
          ],
          Backend: [
            { id: "C011", label: "C", path: "/courses/c", icon: cIcon },
            {
              id: "C012",
              label: "C++",
              path: "/courses/cplus",
              icon: cplusIcon,
            },
            {
              id: "C013",
              label: "C#",
              path: "/courses/csharp",
              icon: csharpIcon,
            },
            {
              id: "C014",
              label: "Node.js",
              path: "/courses/nodejs",
              icon: nodeIcon,
            },
            {
              id: "C015",
              label: "Python",
              path: "/courses/python",
              icon: pythonIcon,
            },
            {
              id: "C016",
              label: "Java",
              path: "/courses/java",
              icon: javaIcon,
            },
            {
              id: "C017",
              label: "MySQL",
              path: "/courses/mysql",
              icon: mysqlIcon,
            },
            {
              id: "C018",
              label: "MongoDB",
              path: "/courses/mongodb",
              icon: mongoIcon,
            },
            { id: "C019", label: "SQL", path: "/courses/sql", icon: sqlIcon },
            {
              id: "C020",
              label: "PostgreSQL",
              path: "/courses/postgre-sql",
              icon: psqlIcon,
            },
            { id: "C021", label: "PHP", path: "/courses/php", icon: phpIcon },
            { id: "C022", label: "ASP", path: "/courses/asp", icon: aspIcon },
            { id: "C023", label: "DSA", path: "/courses/dsa", icon: dsaIcon },
          ],
          Security: [
            {
              id: "C052",
              label: "Cybersecurity",
              path: "/courses/cybersecurity",
              icon: cyberIcon,
            },
          ],
          AI: {
            instructor: aiInstructors,
            courses: [
              {
                id: "C024",
                label: "Introduction to AI",
                path: "/courses/ai",
                icon: aiIcon,
              },
              {
                id: "C025",
                label: "AI Foundation (Beginner)",
                path: "/courses/ai-foundation",
                icon: aifoundationIcon,
              },
              {
                id: "C026",
                label: "Core AI (Intermediate)",
                path: "/courses/ai-core",
                icon: coreaiIcon,
              },
              {
                id: "C027",
                label: "MLOps (Advanced Engineering)",
                path: "/courses/mlops",
                icon: mlopsIcon,
              },
              {
                id: "C028",
                label: "Generative AI (Advanced)",
                path: "/courses/genai",
                icon: genaiIcon,
              },
              {
                id: "C029",
                label: "Agentic AI (Expert)",
                path: "/courses/agentic-ai",
                icon: agenticaiIcon,
              },
              {
                id: "C030",
                label: "Quantum AI",
                path: "/courses/quantum-ai",
                icon: quantumaiIcon,
              },
              {
                id: "C051",
                label: "OpenCV",
                path: "/courses/open-cv",
                icon: opencvIcon,
              },
            ],
          },

          Testing:  [
            {
              id: "C031",
              label: "Manual Testing",
              path: "/courses/manual-testing",
              icon: manualIcon,
            },
            {
              id: "C032",
              label: "Automation Testing",
              path: "/courses/automation-testing",
              icon: automationIcon,
            },
          ],

           Research: {
            instructor: researchInstructors,
            courses: [
            {
              id: "C054",
              label: "Scientific Writing I - Writing & publishing Research paper",
              path: "/courses/scientific-writing-I",
              icon: researchIcon,
            },
            {
              id: "C055",
              label: "Scientific Writing II - Writing & publishing Review paper",
              path: "/courses/scientific-writing-II",
              icon: reviewIcon,
            },
          ],
        }
        },
      },

      Certifications: {
        subTabs: ["Frontend", "Backend", "Security", "AI", "Testing"],
        data: {
          Frontend: [
            { label: "HTML", path: "/certification/html", icon: htmlIcon },
            { label: "CSS", path: "/certification/css", icon: cssIcon },
            {
              label: "Javascript",
              path: "/certification/javascript",
              icon: jsIcon,
            },
            { label: "React", path: "/certification/react", icon: reactIcon },
            {
              label: "Angular",
              path: "/certification/angular",
              icon: angularIcon,
            },
            { label: "WPF", path: "/certification/wpf", icon: wpfIcon },
            { label: "XML", path: "/certification/xml", icon: xmlIcon },
            {
              label: "Kotlin",
              path: "/certification/kotlin",
              icon: kotlinIcon,
            },
            {
              label: "Bootstrap",
              path: "/certification/bootstrap",
              icon: bootsIcon,
            },
            { label: "jQuery", path: "/certification/jquery", icon: jqIcon },
          ],
          Backend: [
            { label: "C", path: "/certification/c", icon: cIcon },
            { label: "C++", path: "/certification/cplus", icon: cplusIcon },
            { label: "C#", path: "/certification/csharp", icon: csharpIcon },
            { label: "Nodejs", path: "/certification/nodejs", icon: nodeIcon },
            {
              label: "Python",
              path: "/certification/python",
              icon: pythonIcon,
            },
            { label: "Java", path: "/certification/java", icon: javaIcon },
            { label: "MySQL", path: "/certification/mysql", icon: mysqlIcon },
            {
              label: "MongoDB",
              path: "/certification/mongodb",
              icon: mongoIcon,
            },
            // { label: "SQL", path: "/certification/sql", icon: sqlIcon },//
            {
              label: "PostgreSQl",
              path: "/certification/postgresql",
              icon: psqlIcon,
            },
            { label: "PHP", path: "/certification/php", icon: phpIcon },
            { label: "ASP", path: "/certification/asp", icon: aspIcon },
            { label: "DSA", path: "/certification/dsa", icon: dsaIcon },
          ],
          Security: [
            {
              label: "Cybersecurity",
              path: "/certification/cybersecurity",
              icon: cyberIcon,
            },
          ],
          AI: {
            instructor: aiInstructors,

            courses: [
              { label: "AI", path: "/certification/ai", icon: aiIcon },
              {
                label:
                  "AWS Certified Machine Learning Engineer – Associate (MLA-C01)",
                path: "/certification/MLA-C01",
                icon: cyberIcon,
              },
              {
                label: "AWS Certified Machine Learning – Specialty (MLS-C01)",
                path: "/certification/MLS-C01",
                icon: pythonIcon,
              },
              {
                label: "Microsoft Certified: Azure AI Fundamentals (AI-900)",
                path: "/certification/AI-900",
                icon: aiIcon,
              },
              {
                label:
                  "Microsoft Certified: Azure AI Engineer Associate (AI-102)",
                path: "/certification/AI-102",
                icon: pythonIcon,
              },
              {
                label:
                  "Google Cloud Certified – Professional Machine Learning Engineer",
                path: "/certification/Google-Cloud-Certified",
                icon: aiIcon,
              },
            ],
          },

          Testing: [
            {
              label: "Manual Testing",
              path: "/certification/manualtesting",
              icon: manualIcon,
            },
            {
              label: "Automation Testing",
              path: "/certification/automationtesting",
              icon: automationIcon,
            },
          ],
        },
      },
      "Domain Based Courses": [
        {
          label: "Medical",
          icon: medicalIcon,
          instructor: biotechInstructors,
          relatedCourses: [
            {
              id: "C033",
              label: "AI in Healthcare",
              path: "/courses/ai-healthcare",
              icon: aiIcon,
            },
            {
              id: "C034",
              label: "Data Science for Medical",
              path: "/courses/data-medical",
              icon: datascienceIcon,
            },
            {
              id: "C035",
              label: "Cybersecurity in Hospitals",
              path: "/courses/cyber-medical",
              icon: cyberIcon,
            },
          ],
        },

        {
          label: "Bio Technology",
          icon: biotechIcon,
          instructor: biotechInstructors,
          relatedCourses: [
            {
              id: "C036",
              label: "Bio Informatics",
              path: "/courses/bio-info",
              icon: bioinformaticsIcon,
            },
          ],
        },

        {
          label: "SemiConductors",
          icon: semiIcon,
          instructor: semiInstructors,
          relatedCourses: [
            {
              id: "C044",
              label: "Semi Conductor",
              path: "/domain/semiconductors",
              icon: semiIcon,
            },
            {
              id: "C044",
              label: "Software Engineer(1 month)",
              path: "/courses/softwareengineer-1month",
              icon: softwareengineericon,
            },
            {
              id: "C045",
              label: "Software Engineer(3 months)",
              path: "/courses/softwareengineer-3months",
              icon: softwareengineericon,
            },
            {
              id: "C046",
              label: "Process Engineer(1 month)",
              path: "/courses/processengineer-1month",
              icon: processengineericon,
            },
            {
              id: "C047",
              label: "Process Engineer(3 months)",
              path: "/courses-/processengineer-3months",
              icon: processengineericon,
            },
            {
              id: "C048",
              label: "Mechanical Engineer(1 month)",
              path: "/courses/mechanicalengineer-1month",
              icon: mechanicalengineericon,
            },
            {
              id: "C049",
              label: "Mechanical Engineer(3 months)",
              path: "/courses/mechanicalengineer-3months",
              icon: mechanicalengineericon,
            },
            {
              id: "C043",
              label: "Factory Automation",
              path: "/courses/factory-automation",
              icon: factoryicon,
            },
            {
              label: "Embedded Systems",
              path: "/courses/embedded",
              icon: embeddedicon,
            },
            { label: "VLSI Design", path: "/courses/vlsi", icon: vlsiicon },
            { label: "IoT Applications", path: "/courses/iot", icon: ioticon },
          ],
        },

        {
          label: "Software Engineers",
          icon: softwareIcon,
          instructor: semiInstructors,
          relatedCourses: [
            {
              id: "C037",
              label: "Data Structures",
              path: "/courses/dsa",
              icon: dsaIcon,
            },
            {
              id: "C038",
              label: "Cloud Computing",
              path: "/courses/cloud",
              icon: cloudIcon,
            },
          ],
        },

        {
          label: "Network Engineers",
          icon: networkIcon,
          instructor: networkInstructors,
          relatedCourses: [
            {
              id: "C039",
              label: "CCNA",
              path: "/courses/ccna",
              icon: ccnaIcon,
            },
            {
              id: "C040",
              label: "CCNP",
              path: "/courses/ccnp",
              icon: ccnpIcon,
            },
            {
              id: "C050",
              label: "CCNA + CCNP",
              path: "/courses/ccnaandccnp",
              icon: aiIcon,
            },
          ],
        },

        {
          label: "AI",
          icon: aiIcon,
          instructor: aiInstructors,
          relatedCourses: [
            {
              id: "C041",
              label:
                "AWS Certified Machine Learning Engineer – Associate (MLA-C01)",
              path: "/courses/MLA-C01",
              icon: awsIcon,
            },
            {
              id: "C042",
              label: "AWS Certified Machine Learning – Specialty (MLS-C01)",
              path: "/courses/MLS-C01",
              icon: awsIcon,
            },
            {
              label: "Microsoft Certified: Azure AI Fundamentals (AI-900)",
              path: "/courses/AI-900",
              icon: aiIcon,
            },
            {
              label:
                "Microsoft Certified: Azure AI Engineer Associate (AI-102)",
              path: "/courses/AI-102",
              icon: pythonIcon,
            },
            {
              id: "C053",
              label:
                "Google Cloud Certified – Professional Machine Learning Engineer",
              path: "/courses/Google-Cloud-Certified",
              icon: aiIcon,
            },
          ],
        },
      ],
    },
  },
  {
    label: "Services",
    path: "/services",
    dropdown: true,
    tabs: ["For Job Seekers", "For Students", "For Employers", "For Mentors"],
    items: {
      "For Job Seekers": {
        heading: "From first job to career switch - we've got you covered",
        cards: [
          {
            title: "Mini Project",
            description:
              "Work on real-world mini projects to build hands-on technical experience.",
            buttonText: "Start Your Mini Project",
            image: minijobs,
            path: "/mini-project",
          },
          {
            title: "Major Project",
            description:
              "Undertake a full-scale project with guidance to gain in-depth technical expertise.",
            buttonText: "Start Your Major Project",
            image: majorjobs,
            path: "/major-projects",
          },
          {
            title: "Internship Opportunities",
            description: "Gain Experience, even as a fresher.",
            buttonText: "Explore Internship Roles",
            image: internshiprole,
            path: "/internship-opportunities",
          },
          {
            title: "Resume Builder (AI Assisted)",
            description:
              "Get real-time suggestions, formatting help, and keyword optimization.",
            buttonText: "Enhance My Resume",
            image: resumeBuilderImg,
            path: "/resume-builder",
          },
          {
            title: "AI Career Assistant",
            description: "Learn what you need next based on where you are now.",
            buttonText: "Start Career AI Assistant",
            image: careerassistant,
            path: "/ai-carrer-assistant",
          },
          {
            title: "Apply for Jobs",
            description:
              "Access Jobs based on domain, location, and experience.",
            buttonText: "Find & Apply For Jobs",
            image: applyjobs,
            path: "/applyforjobs",
          },
          /*{   
           title: "Showcase Video Profile",
           description:
              "Let recruiters see your personality, not just your resume.",
           buttonText: "Upload My Video Profile",
           image: videoprofile,
           path: "/showcase-video-profile",
          },*/
          {
            title: "JD Analyzer & Interview Plan",
            description:
              "Paste a job description and get a full skill gap analysis + question set.",
            buttonText: "Analyze a Job Description",
            image: jobdescription,
            path: "/jd-analyzer",
          },
          {
            title: "Interview Preparation",
            description:
              "Prepare effectively for interviews with quizzes, tips, and practice sessions.",
            buttonText: "Start Interview Preparation",
            image: techquiz,
            path: "/interview-preparation",
          },
          {
            title: "View Profile",
            description:
              "Showcase your skills and experience to recruiters and track your progress.",
            buttonText: "View My Profile",
            image: mock,
            path: "/job-seeker-profile",
          },
        ],
      },
      "For Students": {
        heading: "Learn, build, and get noticed — even before you graduate",
        cards: [
          {
            title: "Internship Project",
            description: "Hands-on experience to apply what you learn.",
            buttonText: "Start Your Project Today",
            image: internshipImg,
            path: "/internship-project",
          },
          {
            title: "Final Year Project",
            description:
              "Guided mentorship, documentation help, and SRS/SDLC resources.",
            buttonText: "Get Project Mentorship",
            image: finalYearImg,
            path: "/final-year-project",
          },
          {
            title: "Freshers Interview Success Program",
            description:
              "Ace your first interviews with expert guidance and practical training",
            buttonText: "Start Your Interview Training",
            image: freshersImg,
            path: "/fresher-interview-success-program",
          },
          {
            title: "Internship Opportunities",
            description: "Gain Experience, even as a fresher.",
            buttonText: "Explore Internship Roles",
            image: internshiprole,
            path: "/internship-opportunities",
          },
          {
            title: "Apply for Jobs",
            description:
              "Access Jobs based on domain, location, and experience.",
            buttonText: "Find & Apply For Jobs",
            image: applyjobs,
            path: "/applyforjobs",
          },
          /*{
           title: "Globally Accepted Certifications",
           description:
              "Stand out with certifications recognized by MNCs and global recruiters.",
           buttonText: "Earn Your Certification Now",
           image: certificateImg,
           path: "/globally-accepted-certifications",
          },*/
          {
            title: "Mentor Connect",
            description: "Get guidance directly from industry professionals.",
            buttonText: "Connect with a Mentor",
            image: mentorConnectImg,
            path: "/mentor-connect",
          },
          /*{
            title: "Freelance Projects for Students",
            description: "Earn, learn, and gain real-world exposure.",
            buttonText: "Find Student Freelance Gigs",
            image: freelanceImg,
            path: "/freelance-projects-students",
          },*/
          {
            title: "AI Career Assistant",
            description:
              "Get role recommendations, personalized learning paths & roadmap.",
            buttonText: "Launch Career AI Assistant",
            image: aiAssistantImg,
            path: "/ai-carrer-assistant",
          },
          {
            title: "Resume Builder (AI Assisted)",
            description: "Auto-fill, optimize, and export job-ready resumes.",
            buttonText: "Build Your Resume",
            image: resumeBuilderImg,
            path: "/resume-builder",
          },
          {
            title: "HiCore Global EdConnect",
            description:
              "Connect with global educators, mentors, and learners to grow your career network.",
            buttonText: "Join Global EdConnect",
            image: globalImg,
            path: "/hicore-global-edconnect",
          },
          {
            title: "View Profile",
            description: "Auto-fill, optimize, and export job-ready resumes.",
            buttonText: "View Students Profile",
            image: studImg,
            path: "/student-profile",
          },
        ],
      },
      "For Employers": {
        heading:
          "Discover and hire real talent with skills that go beyond the resume",
        cards: [
          {
            title: "Post Jobs & Internships",
            description:
              "Tap into a verified pool of students and professionals.",
            buttonText: "Post a Job or Internship",
            image: postjobs,
            path: "/post-jobs",
          },
          {
            title: "View Candidate Profiles",
            description:
              "See AI-ranked, skill-tagged resumes and video intros.",
            buttonText: "Browse Candidate Profiles",
            image: viewcandidate,
            path: "/candidate-profile",
          },
          {
            title: "AI-Based JD Shortlisting",
            description:
              "Upload your JD - we'll match and rank candidates automatically.",
            buttonText: "Try AI Shortlisting",
            image: aibasedjd,
            path: "/ai-based-shortlisting",
          },
          {
            title: "Manage Applications",
            description: "Track, filter, and shortlist with ease.",
            buttonText: "View Applicants",
            image: manageapplications,
            path: "/manage-applications",
          },

          {
            title: "View Top Talent",
            description:
              "Discover standout candidates and project contributors.",
            buttonText: "See Top Talent",
            image: viewtop,
            path: "/view-top-talent",
          },
          /*{
            add: "New",
            new: "Comming Soon!",
            title: "Hackathon Partnerships",
            description:
              "Host challenges and get access to the top performers.",
            buttonText: "Partner for a Hackathon",
            image: hackathon,
            path: "",
          },*/
        ],
      },
      "For Mentors": {
        heading: "Empower the next generation and earn rewards along the way",
        cards: [
          {
            title: "Become a Mentor",
            description:
              "Share your knowledge and mentor future professionals.",
            buttonText: "Apply to Become a Mentor",
            image: mentorincome,
            path: "/become-mentor",
          },
          {
            title: "Guide Final Year Projects",
            description:
              "Help students with technical clarity and real-world insights.",
            buttonText: "Guide a Student Project",
            image: guideproject,
            path: "/guide-final-year-projects",
          },
          {
            title: "Review Student Projects",
            description: "Provide constructive feedback and ratings.",
            buttonText: "Start Reviewing Projects",
            image: reviewproject,
            path: "/student-review",
          },
          {
            title: "Host Mock Interviews",
            description:
              "Help job seekers prepare and gain feedback experience.",
            buttonText: "Host a Mock Interview",
            image: mockinterview,
            path: "/mock-interview",
          },
          /*{
            title: "Earn Recognition & Badges",
            description: "Highlight your impact and contribution.",
            buttonText: "View Mentor Badges",
            image: earnrecognition,
            path: "/earn-recognition",
          },*/
        ],
      },
    },
  },
  {
    label: "About Us",
    path: "/aboutus",
    dropdown: false,
  },
];

export default routes;
