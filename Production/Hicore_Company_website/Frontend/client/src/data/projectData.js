import projectImage1 from "../assets/project-one-image.png";
import projectImage2 from "../assets/project-two-image.png";
import projectImage3 from "../assets/project-three-image.png";
import projectImage4 from "../assets/project-four-image.png";
import projectImage5 from "../assets/project-five-image.jpg";
import projectImage6 from "../assets/project-six-image.png";
import projectImage7 from "../assets/project-seven-image.png";
import projectImage8 from "../assets/project-image-eight.png";
import projectImage9 from "../assets/Exam-image.jpg";
import projectImage10 from "../assets/project-image-ten.png";
import projectImage11 from "../assets/medical.jpg";
import projectImage12 from "../assets/project-image-twelve.jpeg";

const baseProjectData = [
  {
    id: 1,
    title: "HiCore Career Project Platform",
    description:
      "Experience a powerful career launchpad where students build real-world skills, job seekers find roles that fit, employers hire top talent, and mentors grow future leaders.",
    features: [
      "Internship/Mini Project Program (3rd Year Students).",
      "Major/Final Year Project Accelerator.",
      "Skill Upgrade Program.",
      "Career Launchpad Program.",
      "Al Career Growth Program.",
      "Global Job Access Program.",
      "Mentor Connect Program for mentors.",
      "Skill-Based Hiring Suite for Employers.",
    ],
    image: projectImage6,
    links:[ {url:"https://career-project-nvan.vercel.app/",}]
  },
  {
    id: 2,
    title: "HiCore Exam App",
    description:
      "Experience a complete online/offline exam management system that supports MCQ, descriptive, coding, and adaptive tests with AI proctoring, instant results, detailed analytics, and seamless ERP/LMS integration—scalable for everything from internal tests to certifications.",
    features: [
      "Complete online/offline exam management system.",
      "Supports MCQ, descriptive, coding, and adaptive tests.",
      "AI-proctored exams with cheating prevention.",
      "Auto-evaluation & instant results",
      "Analytics dashboard for student performance.",
      "Flexible integration with college ERP/LMS.",
      "Scalable for internal tests, semester exams, and certifications.",
    ],
    image: projectImage9,
    links:[ {url:"https://exam-ai-one.vercel.app/",}]
  },
  {
    id: 3,
    title: "PDF Convertor",
    description:
      "Convert files, clean up content, summarize lengthy docs, and manage everything in one place - designed for the modern multitasker in education, business, and beyond.",
    features: [
      "All-in-One PDF Solution.",
      "Al That Saves You Time.",
      "Seamless Document Conversion.",
      "Privacy-First & Secure.",
      "Templates & Smart Suggestions.",
      "Built for Collaboration.",
      "Made for Everyone.",
    ],
    image: projectImage7,
    links: [{url:"https://pdfnew-five.vercel.app/",}]
  },
  {
    id: 4,
    title: "Pharma Retail App",
    description: "Affordable Care, Right at Your Door",
    features: [
      "Wide range of medicines & healthcare products",
      "Fast home delivery with order tracking",
      "Easy prescription upload & verification",
      "Secure online payments and digital invoices",
      "Reminders for medicine refills",
    ],
    image: projectImage11,
   links: [
    { url: "https://medical-nu-olive.vercel.app/", label: "Customer" },
    { url: "https://pharmacy-wine-eta.vercel.app/", label: "Retailer and Distributor" }
  ]
  },
  {
    id: 5,
    title: "Industrial Weight Monitoring System",
    description:
      "The Industrial Weight Monitoring System is a smart inventory management solution that continuously tracks the weight of small components such as bolts, screws, and other industrial parts. It ensures accurate stock monitoring and provides alerts when stock levels are low.This system helps industries maintain accurate inventory records, reducing the chances of stockouts and improving operational efficiency.",
    features: [
      "Real-time weight monitoring: Continuously tracks the weight of stored items",
      "Low-stock alerts: Sends notifications when stock levels drop below a threshold.",
      "Bluetooth connectivity: Wirelessly transmits data to the system for live monitoring.",
      "Inventory estimation: Calculates the approximate number of items remaining based on weight.",
      "Seamless integration: Compatible with existing inventory management systems.",
      "User-friendly dashboard: Provides real-time reports on stock status.",
    ],
    image: projectImage5,
    links: [{url:"https://stock-inventory-ten.vercel.app/",}]
  },
  
  {
    id: 6,
    title: "University BOT",
    description:
      "An AI-powered academic assistant built to automate, assist, and personalize the university experience — from syllabus to viva, projects to placements..",
    features: [
      "Syllabus-to-Viva Automation",
      "AI-Powered Syllabus Generation",
      "Smart Academic Insights",
      "Context-Aware AI Assistance",
      "Research & University Support",
    ],
    image: projectImage8,
    links:[{url: "https://hico-bot.vercel.app/",}]
  },
  {
    id: 7,
    title: "Research Paper Application",
    description:
      "An AI-powered platform designed for students, researchers, and professionals to streamline research writing.",
    features: [
      "AI writing assistance for abstracts & summaries.",
      "Plagiarism detection & originality check.",
      "Citation manager (IEEE, APA, MLA, etc.).",
      "Smart recommendations for related papers.",
      "Real-time collaboration for co-authors.",
      "Cloud-based storage & version control.",
    ],
    image: projectImage10,
    links: [{url:"https://app-blue-five-90.vercel.app/",}]
  },
  {
    id: 8,
    title: "E-Learning Platform",
    description:
      "An AI-driven online education platform designed to empower learners, educators, and institutions with personalized and interactive learning experiences.",
    features: [
      "AI-powered course recommendations for personalized learning paths.",
      "Interactive modules with videos, quizzes, and real-time feedback.Automatic text cleanup.",
      "24/7 virtual tutor for instant doubt resolution and guidance.",
      "Progress tracking and analytics to monitor performance.",
      "Multi-language support with AI translation and subtitles.",
      "Instructor tools for easy course creation and evaluation.",
      "Collaborative spaces for peer interaction and group learning.",
    ],
    image: projectImage12,
    links: [{url:"https://police-beryl.vercel.app/",}]
  },
  {
    id: 9,
    title: "Object Detection for Supermarkets",
    description:
      "The Object Detection System for Supermarkets is an AI-based solution designed to monitor stock levels and detect mising items on shelves in real-time.",
    features: [
      "Real-time monitoring: Continuously tracks stock levels using cameras.",
      "AI-powered object detection:Identifies missing products with precision.",
      "Instant restock alerts:Notifies store managers about low-stock itmes.",
      "Automatic Inventory updates:Integrates with store management systems.",
      "Reduces manual labor: Minimizes the need for physical stock checks.",
    ],
    image: projectImage4,
  },
  {
    id: 10,
    title: "Mobile Security App",
    description:
      "The Mobile Security App is a next-generation security solution designed to protect smartphones from theft, unauthorized access, and data breaches.",
    features: [
      "Remote phone locking: Securely lock the device from any location.",
      "Real-time GPS tracking: Locate lost or stolen phones with precision.",
      "Intruder alert: Captures images of unauthorized access attempts.",
      "Biometric & PIN authentication: Ensures only authorized access.",
      "Data wipe feature: Deletes sensitive information remotely for security.",
      "Alarm activation: Emits a loud alarm to deter theft attempts.",
    ],
    image: projectImage2,
  },
  {
    id: 11,
    title: "Barcode Scanner App",
    description:
      "The Barcode Scanner App is a high-performance scanning application designed to read and decode various barcode formats, including QR codes, UPC, EAN, and Data Matrix. It is widely used in industries such as retail, logistics, inventory management, and warehousing.",
    features: [
      "Multi-format support: Reads QR codes, UPC, EAN, Data Matrix, and more.",
      "High-speed scanning: Advanced recognition algorithms ensure fast and accurate scanning.",
      "Batch scanning: Scan multiple barcodes at once for efficiency.",
      "Cloud integration: Stores scanned data securely for real-time access.",
      "Inventory system compatibility: Seamless integration with inventory databases.",
      "User-friendly interface: Designed for easy navigation and usability.",
    ],
    image: projectImage1,
  },

  {
    id: 12,
    title: "Leaf Detection System",
    description:
      "The Leaf Detection System is an advanced AI-powered appliaction that analyzes plant health by detecting diseases,deficiencies, and abnormalities in leaves.",
    features: [
      "AI-powered leaf analysis: Uses deep learning to detect plant diseases.",
      "Real-time diagnosis: Instant identification of issues using mobile images.",
      "Multi-crop support:Works with various plant species.",
      "Disease prevention suggestions: Provides treatment and preventive measures.",
      "Integration with smart farming tools: Can be linked with automated monitoring systems.",
      "Cloud-based data storage: Saves analysis results for future reference.",
    ],
    image: projectImage3,
  },
];

// Auto-assign colors based on odd/even id
export const projectData = baseProjectData.map((project) => ({
  ...project,
  bgColor: project.id % 2 !== 0 ? "bg-[#E09F2B]" : "bg-[#230970]",
  textColor: project.id % 2 !== 0 ? "text-[#230970]" : "text-white",
}));
