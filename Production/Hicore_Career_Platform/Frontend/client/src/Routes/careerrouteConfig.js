import frontEndImg from "../assets/CareerGoal/frontend-icon.png";
import fullStackImg from "../assets/CareerGoal/fullstack-icon.png";
import backendImg from "../assets/CareerGoal/backend-icon.png";
import aiImg from "../assets/CareerGoal/ai-icon.png";
import mobileImg from "../assets/CareerGoal/mobile-app.png";
import dataAnalystImg from "../assets/CareerGoal/data-analyst.png";
import cyberImg from "../assets/CareerGoal/security.png";
import devOpsImg from "../assets/CareerGoal/dev.png";
import softwareTestImg from "../assets/CareerGoal/testing.png";

import oneMonth from "../assets/CarrerChoose/1month.png";
import threeMonth from "../assets/CarrerChoose/3month.png";
import sixMonth from "../assets/CarrerChoose/6month.png";

const careerRouteConfig = [
  {
    id: "CR01",
    title: "Front-End Developer",
    image: frontEndImg,
    description: "Design and build user interfaces with modern web technologies.",
    plans: {
      oneMonth: {
        id: "frontend-1month",
        title: "Frontend Developer – 1 Month",
        img: oneMonth,
        desc: "Quick-learning – Build basic UI development essentials.",
        courseId: "FRONTEND-DEVELOPER-1M-COURSE-0379DAB4",
        path: "/find-my-courses/FRONTEND-DEVELOPER-1M-COURSE-0379DAB4",
      },
      threeMonth: {
        id: "frontend-3month",
        title: "Frontend Developer – 3 Months",
        img: threeMonth,
        desc: "HTML, CSS, JavaScript & React basics.",
        courseId: "FRONTEND-DEVELOPER-3M-COURSE-4DECE474",
        route: "/find-my-courses/FRONTEND-DEVELOPER-3M-COURSE-4DECE474",
      },
      sixMonth: {
        id: "frontend-6month",
        title: "Frontend Developer – 6 Months",
        img: sixMonth,
        desc: "Projects, React, APIs, UI/UX.",
        courseId: "FRONTEND-DEVELOPER-6M-COURSE-52EE3742",
        route: "/find-my-courses/FRONTEND-DEVELOPER-6M-COURSE-52EE3742",
      },
    },
  },

  {
    id: "CR02",
    title: "Full Stack Developer",
    image: fullStackImg,
    description: "Master both front-end and back-end technologies.",
    plans: {
      oneMonth: {
        id: "fullstack-1month",
        title: "Full Stack Developer – 1 Month",
        img: oneMonth,
        courseId: "FULLSTACK-DEVELOPER-1M-COURSE-04D475F6",
        route: "/find-my-courses/FULLSTACK-DEVELOPER-1M-COURSE-04D475F6",
      },
      threeMonth: {
        id: "fullstack-3month",
        title: "Full Stack Developer – 3 Months",
        img: threeMonth,
        courseId: "FULLSTACK-DEVELOPER-3M-COURSE-61D4633C",
        route: "/find-my-courses/FULLSTACK-DEVELOPER-3M-COURSE-61D4633C",
      },
      sixMonth: {
        id: "fullstack-6month",
        title: "Full Stack Developer – 6 Months",
        img: sixMonth,
        courseId: "FULLSTACK-DEVELOPER-6M-COURSE-753A31B3",
        route: "/find-my-courses/FULLSTACK-DEVELOPER-6M-COURSE-753A31B3",
      },
    },
  },

  {
    id: "CR03",
    title: "Backend Developer",
    image: backendImg,
    description: "Build robust server-side applications and APIs.",
    plans: {
      oneMonth: {
        id: "backend-1month",
        title: "Backend Developer – 1 Month",
        img: oneMonth,
        courseId: "C011",
        route: "/courses/C011",
      },
      threeMonth: {
        id: "backend-3month",
        title: "Backend Developer – 3 Months",
        img: threeMonth,
        courseId: "C015",
        route: "/courses/C015",
      },
      sixMonth: {
        id: "backend-6month",
        title: "Backend Developer – 6 Months",
        img: sixMonth,
        courseId: "C015",
        route: "/courses/C015",
      },
    },
  },

  {
    id: "CR04",
    title: "AI / Data Science",
    image: aiImg,
    description: "Develop intelligent systems and analyze complex data.",
    plans: {
      oneMonth: {
        id: "ai-1month",
        title: "AI / DS – 1 Month",
        img: oneMonth,
        courseId: "C024",
        route: "/courses/C024",
      },
      threeMonth: {
        id: "ai-3month",
        title: "AI / DS – 3 Months",
        img: threeMonth,
        courseId: "C026",
        route: "/courses/C026",
      },
      sixMonth: {
        id: "ai-6month",
        title: "AI / DS – 6 Months",
        img: sixMonth,
        courseId: "C027",
        route: "/courses/C027",
      },
    },
  },

  {
    id: "CR05",
    title: "Mobile App Developer",
    image: mobileImg,
    description: "Create engaging mobile apps for iOS and Android.",
    plans: {
      oneMonth: {
        id: "mobile-1month",
        title: "Mobile Developer – 1 Month",
        img: oneMonth,
        courseId: "C008",
        route: "/courses/C008",
      },
      threeMonth: {
        id: "mobile-3month",
        title: "Mobile Developer – 3 Months",
        img: threeMonth,
        courseId: "C008",
        route: "/courses/C008",
      },
      sixMonth: {
        id: "mobile-6month",
        title: "Mobile Developer – 6 Months",
        img: sixMonth,
        courseId: "C008",
        route: "/courses/C008",
      },
    },
  },

  {
    id: "CR06",
    title: "Data Analyst",
    image: dataAnalystImg,
    description: "Transform data into actionable business insights.",
    plans: {
      oneMonth: {
        id: "da-1month",
        title: "Data Analyst – 1 Month",
        img: oneMonth,
        courseId: "C019",
        route: "/courses/C019",
      },
      threeMonth: {
        id: "da-3month",
        title: "Data Analyst – 3 Months",
        img: threeMonth,
        courseId: "C019",
        route: "/courses/C019",
      },
      sixMonth: {
        id: "da-6month",
        title: "Data Analyst – 6 Months",
        img: sixMonth,
        courseId: "C019",
        route: "/courses/C019",
      },
    },
  },

  {
    id: "CR07",
    title: "Cybersecurity Expert",
    image: cyberImg,
    description: "Protect systems and networks from threats.",
    plans: {
      oneMonth: {
        id: "cyber-1month",
        title: "Cybersecurity – 1 Month",
        img: oneMonth,
        courseId: "C039",
        route: "/courses/C039",
      },
      threeMonth: {
        id: "cyber-3month",
        title: "Cybersecurity – 3 Months",
        img: threeMonth,
        courseId: "C039",
        route: "/courses/C039",
      },
      sixMonth: {
        id: "cyber-6month",
        title: "Cybersecurity – 6 Months",
        img: sixMonth,
        courseId: "C039",
        route: "/courses/C039",
      },
    },
  },

  {
    id: "CR08",
    title: "DevOps Engineer",
    image: devOpsImg,
    description: "Streamline deployment and infrastructure management.",
    plans: {
      oneMonth: {
        id: "devops-1month",
        title: "DevOps – 1 Month",
        img: oneMonth,
        courseId: "C015",
        route: "/courses/C015",
      },
      threeMonth: {
        id: "devops-3month",
        title: "DevOps – 3 Months",
        img: threeMonth,
        courseId: "C015",
        route: "/courses/C015",
      },
      sixMonth: {
        id: "devops-6month",
        title: "DevOps – 6 Months",
        img: sixMonth,
        courseId: "C015",
        route: "/courses/C015",
      },
    },
  },

  {
    id: "CR09",
    title: "Software Testing",
    image: softwareTestImg,
    description: "Ensure software quality and performance through testing.",
    plans: {
      oneMonth: {
        id: "testing-1month",
        title: "Software Testing – 1 Month",
        img: oneMonth,
        courseId: "C031",
        route: "/courses/C031",
      },
      threeMonth: {
        id: "testing-3month",
        title: "Software Testing – 3 Months",
        img: threeMonth,
        courseId: "C031",
        route: "/courses/C031",
      },
      sixMonth: {
        id: "testing-6month",
        title: "Software Testing – 6 Months",
        img: sixMonth,
        courseId: "C032",
        route: "/courses/C032",
      },
    },
  },
];

export default careerRouteConfig;
