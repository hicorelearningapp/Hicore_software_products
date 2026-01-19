// src/data/finalYearProjectData.js
import targeticon from "../../../../assets/GuideFinalyearproject/target.png";
import learnicon from "../../../../assets/GuideFinalyearproject/learn.png";
import skillicon from "../../../../assets/GuideFinalyearproject/skill.png";
import badgeicon from "../../../../assets/GuideFinalyearproject/badge.png";

import businessmanImage from "../../../../assets/GuideFinalyearproject/businessman.png";
import financialImage from "../../../../assets/GuideFinalyearproject/financial.png";
import excellenceImage from "../../../../assets/GuideFinalyearproject/excellence.png";
import unlockImage from "../../../../assets/GuideFinalyearproject/unlock.png";

import learnstepIcon from "../../../../assets/GuideFinalyearproject/learnstep.png";
import editIcon from "../../../../assets/GuideFinalyearproject/edit.png";
import circleIcon from "../../../../assets/GuideFinalyearproject/circle-tick.png";
import mentorIcon from "../../../../assets/GuideFinalyearproject/mentor.png";

export const benefitCards = [
  {
    icon: targeticon,
    title: "Shape Careers",
    description:
      "Help students transform ideas into impactful projects that prepare them for real-world opportunities.",
    bg: "#F3F3FB",
  },
  {
    icon: learnicon,
    title: "Build Credibility",
    description:
      "Strengthen your profile and gain recognition as a trusted mentor and industry expert.",
    bg: "#FFFAEF",
  },
  {
    icon: skillicon,
    title: "Enhance Skills",
    description:
      "Sharpen your leadership, problem-solving, and technical expertise by guiding diverse projects.",
    bg: "#F0F7FF",
  },
  {
    icon: badgeicon,
    title: "Earn Rewards/Recognition",
    description:
      "Collect mentorship points, unlock badges, and showcase certificates to highlight your contribution.",
    bg: "#E8FFDD",
  },
];

export const features = [
  {
    title: "Showcase Your Expertise",
    desc: "Demonstrate your technical and domain knowledge by guiding projects that align with your strengths.",
    img: businessmanImage,
  },
  {
    title: "Gain Professional Visibility",
    desc: "Be featured in the Top Mentor Spotlight, boosting your visibility across the platform and among employers.",
    img: financialImage,
  },
  {
    title: "Strengthen Your Portfolio",
    desc: "Every guided project is added to your mentor journey, showcasing your impact and experience.",
    img: excellenceImage,
  },
  {
    title: "Unlock Career Opportunities",
    desc: "Recognition as a mentor may lead to invitations for speaking engagements, collaborations, or hiring opportunities.",
    img: unlockImage,
  },
];

export const steps = [
  {
    step: "Step 1",
    icon: learnstepIcon,
    title: "Choose Project Domain",
    desc: "Helps students match with mentors based on expertise.",
  },
  {
    step: "Step 2",
    icon: editIcon,
    title: "Define Project Type & Duration, Group Size",
    desc: "Sets clear expectations for commitment",
  },
  {
    step: "Step 3",
    icon: circleIcon,
    title: "Review & Publish",
    desc: "Your listing becomes visible to final-year students who can request guidance.",
  },
  {
    step: "Step 4",
    icon: mentorIcon,
    title: "Accept & Guide Students",
    desc: "Accept suitable mentees or teams. Start guiding them through project milestones.",
  },
];
