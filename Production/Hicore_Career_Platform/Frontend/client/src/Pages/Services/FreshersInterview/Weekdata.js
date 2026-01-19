import banner1 from "../../../assets/FreshersInterview/weekonebanner.png";
import banner2 from "../../../assets/FreshersInterview/weektwobanner.png";
import banner3 from "../../../assets/FreshersInterview/weekthreebanner.png";
import banner4 from "../../../assets/FreshersInterview/weekfourbanner.png";
import banner5 from "../../../assets/FreshersInterview/weekfivebanner.png";
import banner6 from "../../../assets/FreshersInterview/weeksixsevenbanner.png";
import banner8 from "../../../assets/FreshersInterview/weekeightbanner.png";

import number from "../../../assets/FreshersInterview/numberw1.png";
import puzzle from "../../../assets/FreshersInterview/puzzlew1.png";
import odd from "../../../assets/FreshersInterview/oddw1.png";
import percent from "../../../assets/FreshersInterview/percentw1.png";
import profit from "../../../assets/FreshersInterview/profitw1.png";
import time from "../../../assets/FreshersInterview/timew1.png";
import logic from "../../../assets/FreshersInterview/logicw1.png";
import syllogism from "../../../assets/FreshersInterview/syllogismw1.png";
import relation from "../../../assets/FreshersInterview/relationw1.png";
import io from "../../../assets/FreshersInterview/iow2.png";
import variable from "../../../assets/FreshersInterview/variablew2.png";
import datatype from "../../../assets/FreshersInterview/datatypew2.png";
import condition from "../../../assets/FreshersInterview/conditionw2.png";
import loop from "../../../assets/FreshersInterview/loopw2.png";
import functions from "../../../assets/FreshersInterview/functionw2.png";
import array from "../../../assets/FreshersInterview/arraysw2.png";
import program from "../../../assets/FreshersInterview/programw2.png";
import stack from "../../../assets/FreshersInterview/stackw3.png";
import queue from "../../../assets/FreshersInterview/queuew3.png";
import list from "../../../assets/FreshersInterview/listw3.png";
import search from "../../../assets/FreshersInterview/searchw3.png";
import human from "../../../assets/FreshersInterview/humanw3.png";
import code from "../../../assets/FreshersInterview/codew3.png";
import datatypes from "../../../assets/FreshersInterview/datatypew4.png";
import sql from "../../../assets/FreshersInterview/sqlw4.png";
import oops from "../../../assets/FreshersInterview/javaw4.png";
import os from "../../../assets/FreshersInterview/osw4.png";
import project from "../../../assets/FreshersInterview/projectsw5.png";
import projectplan from "../../../assets/FreshersInterview/projectplanw5.png";
import codes from "../../../assets/FreshersInterview/codew5.png";
import upload from "../../../assets/FreshersInterview/uploadw5.png";
import work from "../../../assets/FreshersInterview/workw67.png";
import assignment from "../../../assets/FreshersInterview/assignmentw67.png";
import fullstack from "../../../assets/FreshersInterview/fullstackw67.png";
import present from "../../../assets/FreshersInterview/presentw67.png";
import mentor from "../../../assets/FreshersInterview/mentorw67.png";
import resume from "../../../assets/FreshersInterview/resumew8.png";
import linkedin from "../../../assets/FreshersInterview/linkedinw8.png";
import github from "../../../assets/FreshersInterview/githubw8.png";
import interview from "../../../assets/FreshersInterview/intervieww8.png";
import certificate from "../../../assets/FreshersInterview/certificatew8.png";

export const weekData = {
  week1: {
    heading: "Week 1: Aptitude & Logical Reasoning",
    subheading: "Master Logical Thinking with Interactive Challenges",
    paragraph: "Master the foundations of aptitude and logic through number patterns, puzzles, and reasoning.",
    banner: banner1,
    weekName: "Week 1",
    nextWeek: "week2",
    cards: [
      {
        icon: number,
        topicId: "numberSeries",
        title: "Number Series",
        description: "Spot the pattern and predict the next number.",
        bgColor: "#FFFAEF",
        
      },
      {
        icon: puzzle,
        topicId: "puzzle",
        title: "Puzzles",
        description: "Challenge your brain with logic-based problems.",
        bgColor: "#E8FFDD",
      },
      {
        icon: odd,
        topicId: "odd-one",
        title: "Odd one out",
        description: "Identify the element that breaks the rule.",
        bgColor: "#F0F7FF",
      },
      {
        icon: percent,
        topicId: "percentage",
        title: "Percentages",
        description: "Quick tricks to solve real-world math in seconds.",
        bgColor: "#F3F3FB",
      },
      {
        icon: profit,
        topicId: "profitloss",
        title: "Profit & Loss",
        description: "Master everyday money math for smarter decisions.",
        bgColor: "#FFE4FF",
      },
      {
        icon: time,
        topicId: "time",
        title: "Time & Distance",
        description: "Solve speed and distance puzzles with logic.",
        bgColor: "#FFFFD4",
      },
      {
        icon: logic,
        title: "logical-reasoning",
        description: "Train your brain to connect ideas and conclusions.",
        bgColor: "#FFDFDF",
      },
      {
        icon: syllogism,
        topicId: "syllogism",
        title: "Syllogisms",
        description: "Practice statements that lead to valid deductions.",
        bgColor: "#FDFFED",
      },
      {
        icon: relation,
        topicId: "relation",
        title: "Blood relations",
        description: "Decode family puzzles using logical trees.",
        bgColor: "#D7FFFF",
      },
    ],
    previousWeek: null,
    nextWeek: "week2",
  },
  week2: {
    heading: "Week 2: Programming Fundamentals (C / Python / Java)",
    subheading: "Code Your First Building Blocks",
    paragraph: "Learn input/output, variables, loops, and functions in your chosen language.",
    banner: banner2,
    weekName: "Week 2",
    previousWeek: "week1",
    nextWeek: "week3",
    cards: [
      {
        icon: io,
        topicId: "inputoutput",
        title: "Input/output operations",
        description: "Learn how programs interact with users.",
        bgColor: "#FFFAEF",
      },
      {
        icon: variable,
        topicId: "variables",
        title: "Variables",
        description: "Store and manage data like a pro.",
        bgColor: "#E8FFDD",
      },
      {
        icon: datatype,
        topicId: "data-types",
        title: "Data Types",
        description: "Understand different data formats and uses.",
        bgColor: "#F0F7FF",
      },
      {
        icon: condition,
        topicId: "conditions",
        title: "Conditions",
        description: "Make decisions using if-else and switch logic.",
        bgColor: "#F3F3FB",
      },
      {
        icon: loop,
        topicId: "loops",
        title: "Loops",
        description: "Repeat actions efficiently with for, while, and do-while.",
        bgColor: "#FFE4FF",
      },
      {
        icon: functions,
        topicId: "functions",
        title: "Functions",
        description: "Organize code into reusable logic blocks.",
        bgColor: "#FFFFD4",
      },
      {
        icon: array,
        topicId: "arrays-strings",
        title: "Arrays and strings",
        description: "Handle multiple values and characters smoothly.",
        bgColor: "#FFDFDF",
      },
      {
        icon: program,
        topicId: "simple-programs",
        title: "Simple programs",
        description: "Practice with classic logic builders like palindrome, factorial, Fibonacci.",
        bgColor: "#FDFFED",
      },
    ],
  },
    week3: {
    heading: "Week 3: Data Structures & Algorithms",
    subheading: "Think Efficiently, Code Smart",
    paragraph: "Understand core structures and algorithms used in top coding interviews.",
    banner: banner3,
    weekName: "Week 3",
    previousWeek: "week2",
    nextWeek: "week4",
    cards: [
      {
        icon: stack,
        topicId: "stack",
        title: "Stack",
        description: "LIFO structure for function calls and expression evaluation.",
        bgColor: "#FFFAEF",
      },
      {
        icon: queue,
        topicId: "queue",
        title: "Queue",
        description: "FIFO system used in scheduling and task management.",
        bgColor: "#E8FFDD",
      },
      {
        icon: list,
        topicId: "linked-list",
        title: "Linked List",
        description: "Dynamically store and access elements in memory.",
        bgColor: "#F0F7FF",
      },
      {
        icon: search,
        topicId: "sorting",
        title: "Searching & Sorting ",
        description: "Master Binary Search, Merge Sort, and Quick Sort.",
        bgColor: "#F3F3FB",
      },
      {
        icon: human,
        topicId: "recursion",
        title: "Recursion and problem-solving strategies",
        description: "Solve complex problems by breaking them into smaller ones.",
        bgColor: "#FFE4FF",
      },
      {
        icon: code,
        topicId: "coding",
        title: "Coding problems with difficulty levels",
        description: "Practice easy to hard challenges and analyze solutions.",
        bgColor: "#FFFFD4",
      }
    ],
  },
  week4: {
    heading: "Week 4: DBMS, OOPs, OS & Networking",
    subheading: "Dive into Core CS Concepts",
    paragraph: "Grasp the tech that powers software - from databases to operating systems.",
    banner: banner4,
    weekName: "Week 4",
    previousWeek: "week3",
    nextWeek: "week5",
    cards: [
      {
        icon: datatypes,
        topicId: "datatypes",
        title: "Database basics",
        description: "Learn about tables, queries, and relationships.",
        bgColor: "#FFFAEF",
      },
      {
        icon: sql,
        topicId: "sql",
        title: "SQL Practice",
        description: "SELECT, INSERT, DELETE, UPDATE",
        bgColor: "#E8FFDD",
      },
      {
        icon: oops,
        topicId: "oops",
        title: "OOPs",
        description: "Apply principles like Class, Object, Inheritance and Polymorphism",
        bgColor: "#F0F7FF",
      },
      {
        icon: os,
        topicId: "operating-system",
        title: "Operating Systems",
        description: "Explore process management, threads, and scheduling.",
        bgColor: "#F3F3FB",
      }
    ],
  },
  week5: {
    heading: "Week 5: Mini Project (Individual)",
    subheading: "Apply Your Skills in a Real Project",
    paragraph: "Choose a project, plan, build, and showcase your work independently.",
    banner: banner5,
    weekName: "Week 5",
    previousWeek: "week4",
    nextWeek: "week6_7",
    cards: [
      {
        icon: project,
        topicId: "project",
        title: "Project selection from a list of ideas",
        description: "Pick from curated, practical ideas.",
        bgColor: "#FFFAEF",
      },
      {
        icon: projectplan,
        topicId: "project-plan",
        title: "Project planning",
        description: "Define goals, timelines, and requirements",
        bgColor: "#E8FFDD",
      },
      {
        icon: codes,
        topicId: "code-using-techstack",
        title: "Basic development using chosen tech stack",
        description: "Code using your chosen tech stack.",
        bgColor: "#F0F7FF",
      },
      {
        icon: upload,
        topicId: "upload-document",
        title: "GitHub upload and README documentation",
        description: "Upload project to GitHub with a polished README.",
        bgColor: "#F3F3FB",
      }
    ],
  },
   week6_7: {
    heading: "Weeks 6–7: Major Project (Team or Individual)",
    subheading: "Build and Collaborate Like a Pro",
    paragraph: "Simulate real-world development and present a complete tech solution.",
    banner: banner6,
    weekName: "Week 6-7",
    previousWeek: "week5",
    nextWeek: "week8",
    cards: [
      {
        icon: work,
        topicId: "project-simulation",
        title: "Real-world project simulation",
        description: "Work on a project like a real job.",
        bgColor: "#FFFAEF",
      },
      {
        icon: assignment,
        topicId: "srs-document-creation",
        title: "SRS document creation",
        description: "Create a functional and technical roadmap.",
        bgColor: "#E8FFDD",
      },
      {
        icon: fullstack,
        topicId: "fullstack-solutions",
        title: "Backend & frontend integration",
        description: "Build full-stack solutions across platforms Web/Mobile.",
        bgColor: "#F0F7FF",
      },
      {
        icon: present,
        topicId: "record-presentaion",
        title: "Demo recording + presentation file",
        description: "Record your walkthrough and prepare to present.",
        bgColor: "#F3F3FB",
      },
      {
        icon: mentor,
        topicId: "mentor-evaluation",
        title: "Mentor evaluation using rubric",
        description: "Mentor evaluation using rubric",
        bgColor: "#FFE4FF",
      }
    ],
  },
    week8: {
    heading: "Week 8: Career Readiness & Mock Interviews",
    subheading: "Get Interview-Ready, the Smart Way",
    paragraph: "Perfect your resume, online presence, and ace technical + HR interviews.",
    banner: banner8,
    weekName: "Week 8",
    previousWeek: "week6_7",
    cards: [
      {
        icon: resume,
        topicId: "resume-writing",
        title: "Resume writing & AI-based review",
        description: "Build or refine your resume using AI tools.",
        bgColor: "#FFFAEF",
      },
      {
        icon: linkedin,
        topicId: "linkedIn-profile",
        title: "LinkedIn profile optimization",
        description: "Stand out to recruiters with a strong profile.",
        bgColor: "#E8FFDD",
      },
      {
        icon: github,
        topicId: "github-portfolio",
        title: "GitHub portfolio cleanup",
        description: "Clean up and organize your code projects.",
        bgColor: "#F0F7FF",
      },
      {
        icon: interview,
        topicId: "mock-interview",
        title: "Mock technical & HR interview",
        description: "Practice tech and HR rounds with feedback (Live or recorded).",
        bgColor: "#F3F3FB",
      },
      {
        icon: certificate,
        topicId: "final-certificate",
        title: "Final HiCore Certificate + Feedback",
        description: "Receive final certification and career insights.",
        bgColor: "#FFE4FF",
      }
    ]
  }
};
