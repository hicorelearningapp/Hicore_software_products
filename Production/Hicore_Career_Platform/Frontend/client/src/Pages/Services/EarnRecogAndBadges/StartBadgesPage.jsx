import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// ✅ Import background & images
import bgImage from "../../../assets/EarnAndBadges/header-bg-image.jpg";
import innerBadges from "../../../assets/EarnAndBadges/second-page-inner.png";

// Badge card images
import projectGuideImg from "../../../assets/EarnAndBadges/second-image-one.jpg";
import oneOnOneImg from "../../../assets/EarnAndBadges/second-image-two.jpg";
import mockInterviewImg from "../../../assets/EarnAndBadges/second-image-three.jpg";
import impactMentorImg from "../../../assets/EarnAndBadges/second-image-four.jpg";

const StartBadgesPage = () => {
  const navigate = useNavigate();

  // Progress data
  const badges = [
    {
      title: "Project Guide Champion",
      description: "Awarded for mentoring final year projects successfully.",
      criteria: "Complete 3+ projects.",
      progressText: "0/3 Projects Completed",
      progressSegments: 0,
      totalSegments: 3,
      image: projectGuideImg,
      buttonText: "Guide a Project",
      link: "/guide-final-year-projects", // ✅ Route
    },
    {
      title: "One-on-One Mentor Star",
      description:
        "Recognition for providing consistent 1:1 mentorship sessions.",
      criteria: "5+ mentee sessions.",
      progressText: "0/5 Sessions Completed",
      progressSegments: 0,
      totalSegments: 5,
      image: oneOnOneImg,
      buttonText: "Host 1:1 Mentorship",
      link: "/mentor-connect", // ✅ Route
    },
    {
      title: "Mock Interview Pro",
      description:
        "Showcasing your role in preparing students/job seekers for interviews.",
      criteria: "Host 3+ mock interviews.",
      progressText: "0/3 Sessions Completed",
      progressSegments: 0,
      totalSegments: 3,
      image: mockInterviewImg,
      buttonText: "Host a Mock Interview",
      link: "/mock-interview", 
    },
    {
      title: "Impact Mentor Badge",
      description:
        "Overall recognition for consistent guidance across all categories.",
      criteria: "Earn 3 badges to unlock.",
      progressText: "0/3 Badges Achieved",
      progressSegments: 0,
      totalSegments: 3,
      image: impactMentorImg,
      buttonText: "Guide a Mentee",
      link: "/guide-final-year-projects",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ===== Header Section ===== */}
      <div
        className="w-full bg-cover bg-center py-16 px-6 md:px-20 md:pt-10 md:pb-10 flex justify-between items-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Left Section - Back + Text */}
        <div className="max-w-2xl">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-900 font-medium hover:underline mb-6"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </button>

          <h2 className="text-xl md:text-2xl font-bold text-[#343079] mb-8">
            Your Badge Journey Starts Here
          </h2>
          <p className="text-blue-900 text-lg mb-8">
            The more you mentor, the faster you unlock badges. Your recognition
            builds trust, boosts your profile, and attracts more mentees.
          </p>
        </div>

        {/* Right Section - Badge Inner Image */}
        <div className="hidden md:block ml-10">
          <img
            src={innerBadges}
            alt="Badges Journey"
            className="rounded-xl w-[500px] md:h-80 max-w-md"
          />
        </div>
      </div>

      {/* ===== Badge Cards Section ===== */}
      <div className="bg-white rounded-md border border-gray-300 m-10">
        <div className="px-8 md:px-10 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white"
            >
              {/* Left Image */}
              <div className="md:w-70 w-full h-60 flex-shrink-0">
                <img
                  src={badge.image}
                  alt={badge.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Content */}
              <div className="flex flex-col justify-between p-4 flex-1">
                <div>
                  <h3 className="text-lg font-bold text-[#2b2b5f] mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {badge.description}
                  </p>
                  <p className="text-sm text-[#2b2b5f] font-medium mb-1">
                    Criteria:{" "}
                    <span className="font-semibold text-[#2b2b5f]">
                      {badge.criteria}
                    </span>
                  </p>

                  {/* === Progress Segments === */}
                  <div className="flex gap-2 mt-2 mb-2">
                    {Array.from({ length: badge.totalSegments }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-2 rounded-full ${
                          i < badge.progressSegments
                            ? "bg-[#2d2a5f]"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm">{badge.progressText}</p>
                </div>

                {/* Button */}
                <button
                  onClick={() => navigate(badge.link)}
                  className="bg-[#2d2a5f] text-white px-4 py-2 rounded-md mt-3 text-sm hover:bg-[#1f1c45] transition"
                >
                  {badge.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartBadgesPage;
