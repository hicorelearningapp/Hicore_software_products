import profile from "../../assets/profile/profilepic.png";
import techcorp from "../../assets/profile/techcorp.png";
import resume from "../../assets/profile/techcorp.png";

const dummyProfiledata = {
  basicInfo: {
    first_name: "Karthi",
    last_name: "Kumar",
    email: "karthi@email.com",
    mobile_number: "+91 8234567891",
    location: "Chennai, India",
    professional_title: "Senior Full Stack Developer",
    professional_bio:
      "Experienced Full Stack Developer with 5+ years of expertise in building scalable web applications. Passionate about creating user-centric solutions and leading development teams to deliver high-quality products. Specialized in React, Node.js, and cloud technologies.",
    job_alerts: "Yes",
    linkedin_profile: "https://www.linkedin.com/in/kartikumar",
    portfolio_website: "https://www.kartikumar.com",
    github_profile: "https://www.github.com/kartikumar",
    profile_image: profile,
    selfintro_video: "",
  },

  jobPreference: {
    job_titles: "Front End Developer",
    work_type: "Full-time",
    current_salary: "6,00,000",
    expected_salary: "10,00,000",
    availability_start: "Immediately",
    relocate: "Yes",
    remote: "Yes",
    hybrid: "Yes",
  },

  workExperience: [
    {
      company_name: "TechCorp Inc.",
      job_title: "Senior Full Stack Developer",
      job_location: "Bangalore",
      start_year: "2022",
      end_year: "2024",
      currently_working: false,
      responsibilities:
        "Led scalable web app development and architected APIs for 100K+ users.",
      technologies: "React, Node.js, AWS, PostgreSQL",
      company_image: techcorp,
    },
    {
      company_name: "Innova Labs",
      job_title: "Frontend Developer",
      job_location: "Hyderabad",
      start_year: "2019",
      end_year: "2022",
      currently_working: false,
      responsibilities:
        "Developed reusable React components and improved app performance by 30%.",
      technologies: "React, Redux, JavaScript, HTML, CSS",
      company_image: techcorp,
    },
  ],

  education: [
    {
      education_level: "Bachelor’s Degree",
      field_of_study: "Computer Science",
      college_name: "Jawaharlal Nehru University",
      edu_start_year: "2015",
      edu_end_year: "2019",
      currently_studying: "No",
    },
    {
      education_level: "Master’s Degree",
      field_of_study: "Software Engineering",
      college_name: "Anna University",
      edu_start_year: "2020",
      edu_end_year: "2022",
      currently_studying: "No",
    },
  ],

  skillsResume: {
    resume_skills: [
      "React & TypeScript",
      "Node.js & Express",
      "Python & Django",
      "PostgreSQL & MongoDB",
      "AWS & Cloud Deployment",
    ],
    resume_file: resume,
  },

  certifications: [
    {
      certificate_name: "UI/UX Design Course",
      issuing_org: "Growth Institute",
      issue_year: "2025",
      expiry_year: "2029",
      credential_url: "https://credential.com/verify/uiux54852356632",
    },
    {
      certificate_name: "Google UX Design",
      issuing_org: "Coursera",
      issue_year: "2022",
      expiry_year: "2025",
      credential_url: "https://coursera.org/verify/ux123",
    },
  ],

  projects: [
  {
    project_name: "E-Commerce Platform",
    project_link: "https://behance.com/username/ecommerceplatform",
    technologies: "React, Node.js, Stripe, MongoDB",
    project_description:
      "A full-stack e-commerce solution with payment gateway, admin panel, and product management.",
    project_image: techcorp,

    details: {
      projectTitle: "E-Commerce Platform",
      projectType: "Personal",
      domain: "Web Development",
      startDate: "2022-03-01",
      endDate: "2022-08-01",
      teamSize: "3",
      role: "Full Stack Developer",

      summary:
        "Developed a scalable platform enabling users to browse, add to cart, and checkout seamlessly with admin analytics.",
      objective:
        "Build an e-commerce app for small businesses to manage inventory and sales online.",
      solution:
        "Used React for frontend and Node.js backend with JWT authentication, Stripe integration, and MongoDB.",
      keyFeatures:
        "Admin panel, Stripe payments, inventory tracking, role-based login.",
      outcome:
        "Deployed successfully with 500+ users and achieved 99.9% uptime.",

      frontend: "React.js, Tailwind CSS",
      backend: "Node.js, Express.js",
      database: "MongoDB",
      apis: "Stripe API, Cloudinary",
      devTools: "VS Code, Postman, GitHub",
      authentication: "JWT, bcrypt",
      hosting: "Render / Netlify",
      versionControl: "Git, GitHub",

      srsFile: "/documents/Ecommerce_SRS.pdf",
      reportFile: "/documents/Ecommerce_Report.pdf",
      codeFile: "https://github.com/yourusername/ecommerce-platform",
      demoFile: "https://youtu.be/demo-ecommerce-platform",

       projectVideo: "",

      challenges:
        "Faced token refresh issues. Solved with refresh tokens and cache.",
      learnings:
        "Mastered full-stack deployment and payment gateway integration.",
      improvements:
        "Next phase: integrate AI-based product recommendations.",

      teamMembers:
        "Priya Sharma – Frontend Developer, Arjun Patel – Backend Developer, Meera Nair – QA Engineer",
      mentor: "Dr. Kavita Ramesh (Assistant Professor, Computer Science Department)",
      institution: "ABC Institute of Technology",
    },
  },
  {
    project_name: "Task Management App",
    project_link: "https://behance.com/username/taskmanagementsystem",
    technologies: "Next.js, Socket.io, PostgreSQL",
    project_description:
      "Real-time collaborative task management with Kanban board and live updates.",
    project_image: techcorp,

    details: {
      projectTitle: "Task Management App",
      projectType: "Company Project",
      domain: "Web Development",
      startDate: "2023-02-01",
      endDate: "2023-10-01",
      teamSize: "5",
      role: "Frontend Engineer",

      summary:
        "Built a collaborative app with live updates and team analytics.",
      objective:
        "Enhance communication and productivity among distributed teams.",
      solution:
        "Used Next.js for SSR and Socket.io for real-time task synchronization.",
      keyFeatures:
        "Live updates, Kanban board, analytics dashboard, team chat.",
      outcome:
        "Improved task completion by 25% and reduced deadline misses by 40%.",

      frontend: "Next.js, Tailwind CSS",
      backend: "Node.js, Express.js",
      database: "PostgreSQL",
      apis: "Socket.io, REST APIs",
      devTools: "VS Code, GitHub, Postman",
      authentication: "JWT, OAuth (Google Sign-in)",
      hosting: "Vercel",
      versionControl: "GitHub",

      // ✅ Files and links
      srsFile: "/documents/TaskManager_SRS.pdf",
      reportFile: "/documents/TaskManager_Report.pdf",
      codeFile: "https://github.com/yourusername/task-management-app",
      demoFile: "https://youtu.be/demo-task-management",

      challenges:
        "Faced socket reconnection and state sync issues on scale.",
      learnings:
        "Learned socket handling and optimizing API response times.",
      improvements:
        "Next version: AI-based task prioritization and calendar sync.",

      // ✅ Added missing collaboration info
      teamMembers:
        "Priya Sharma – Frontend Developer, Karan Mehta – Backend Developer, Asha Singh – UX Designer, Arjun Patel – DevOps, Meera Nair – QA Engineer",
      mentor: "Mr. Sanjay Verma (Team Lead, Innova Labs)",
      institution: "Innova Labs Pvt. Ltd.",
    },
  },
],

};

export default dummyProfiledata;
