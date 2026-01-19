import React, { useState, useEffect } from "react";
import interviewbanner from "../../../assets/FreshersInterview/InterviewBanner.png";
import bannerImage from "../../../assets/FreshersInterview/bannerimage.png";
import bookicon from "../../../assets/FreshersInterview/book.png";
import { FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Import local data
import {
  features as featuresData,
  achievementCard as achievementCardData,
  highlightsCard as highlightsCardData,
  timelineData as timelineDataData
} from "./FreshersInterviewdata";

// Card Component
const Card = ({ icon, title, points }) => (
  <div className="w-full max-w-[597px] h-auto p-[24px] sm:p-[36px] flex flex-col sm:flex-row gap-[20px] rounded-[16px] border border-[#E1E0EB] bg-white">
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center gap-4 mb-2">
        <img src={icon} alt={title} className="w-[36px] h-[36px]" />
        <div className="text-[#343079] font-poppins font-semibold text-[22px] sm:text-[28px]">{title}</div>
      </div>
      <ul className="flex flex-col gap-4 list-disc list-inside text-[#343079] font-poppins text-[16px] sm:text-[18px] leading-[24px] sm:leading-[28px]">
        {points.map((pt, i) => <li key={i}>{pt}</li>)}
      </ul>
    </div>
  </div>
);

const FreshersInterview = () => {
  const [features, setFeatures] = useState([]);
  const [achievementCard, setAchievementCard] = useState(null);
  const [highlightsCard, setHighlightsCard] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const handleProtectedNavigate = (path) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) navigate("/login", { state: { from: path } });
    else navigate(path);
  };

  // Load Local Data
  useEffect(() => {
    setFeatures(featuresData);
    setAchievementCard(achievementCardData);
    setHighlightsCard(highlightsCardData);
    setTimelineData(timelineDataData);
  }, []);

  if (!features.length || !achievementCard || !highlightsCard || !timelineData.length) {
    return <div className="text-center py-16 text-[#343079] font-poppins text-lg">Loading program data...</div>;
  }

  return (
    <div className="w-full h-full bg-white opacity-100 rotate-0">

      {/* Banner */}
      <div
        className="w-full h-auto px-[20px] sm:px-[64px] py-[36px] flex flex-col lg:flex-row gap-[36px] bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${interviewbanner})` }}
      >
        <div className="w-full h-full flex flex-col gap-[22px]">
          <div className="flex flex-col gap-[14px]">
            <h2 className="text-[22px] sm:text-[24px] font-bold leading-[32px] font-[Poppins] text-[#343079]">
              Freshers Interview Success Program
            </h2>

            <p className="text-[16px] sm:text-[18px] font-normal leading-[28px] sm:leading-[36px] font-[Poppins] text-[#343079]">
              A complete 8-week, mentor-led program to help freshers crack interviews.
            </p>

            <div className="flex flex-col gap-[14px] text-[#343079] text-[14px] sm:text-[16px] leading-[24px] font-[Poppins]">
              <p>Duration: <span className="font-semibold">8 Weeks</span></p>
              <p>Mode: <span className="font-semibold">Online / Hybrid / College Integrated</span></p>
              <p>Level: <span className="font-semibold">Beginner to Intermediate</span></p>
              <p>Ideal For: <span className="font-semibold">Students & Fresh Graduates</span></p>
            </div>
          </div>

          <button
            onClick={() => handleProtectedNavigate("/fresher-interview-success-program/week1")}
            className="w-full bg-[#282655] cursor-pointer text-white text-[16px] font-medium font-[Poppins] leading-[28px] px-[24px] py-[8px] rounded-[8px]"
          >
            Enroll Now
          </button>
        </div>

        <div className="w-full h-full flex items-end justify-end">
          <img src={bannerImage} alt="Interview" className="w-full max-w-[642px] h-auto sm:h-[360px] mb-6 rounded-[16px]" />
        </div>
      </div>

      {/* Features */}
      <div className="w-full h-fit p-[20px] sm:p-[60px]">
        <div className="w-full h-fit p-[24px] rounded-[16px] border border-[#E1E0EB] flex flex-col items-center gap-[36px]">
          <h2 className="w-full text-[#343079] text-[22px] sm:text-[28px] font-normal text-center">
            Top Features of the Program
          </h2>

          <div className="w-full flex flex-wrap justify-center gap-[20px] sm:gap-[36px]">
            {features.map((item, index) => (
              <div
                key={index}
                className="w-full max-w-[204px] h-[232px] p-[24px] rounded-[8px] border border-[#65629E] bg-[#F9F9FC]"
              >
                <img src={item.icon} alt="" className="w-[48px] h-[48px]" />
                <p className="text-[#343079] text-[16px] sm:text-[18px] leading-[28px] mt-3">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="w-full h-full flex flex-col lg:flex-row justify-center gap-[24px] px-[20px] sm:px-0">
        <Card {...achievementCard} />
        <Card {...highlightsCard} />
      </div>

      {/* Timeline */}
      <div id="program-timeline" className="w-full h-fit p-[20px] sm:p-[60px]">
        <div className="w-full h-fit p-[24px] rounded-[16px] border border-[#E1E0EB] flex flex-col gap-[36px]">
          <div className="flex items-center gap-[20px]">
            <img src={bookicon} className="w-[36px] h-[36px]" />
            <div className="text-[#343079] font-poppins font-semibold text-[24px] sm:text-[28px]">Program Timeline</div>
          </div>

          <div className="w-full flex flex-col gap-[24px]">
            {timelineData.map((item, index) => (
              <div key={index} className="w-full rounded-[8px] border border-[#C0BFD5]">
                <div
                  className="w-full h-[64px] px-[16px] flex items-center justify-between cursor-pointer"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <div className="text-[#343079] font-poppins text-[16px] sm:text-[18px]">{item.title}</div>

                  <FaChevronDown
                    className={`text-[#343079] transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                  />
                </div>

                {openIndex === index && (
                  <div className="px-[16px] py-[8px]">
                    <ul className="list-disc pl-[20px] text-[#343079] font-poppins text-[16px]">
                      {item.points.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="w-full h-fit pt-[10px] pr-[20px] pb-[20px] pl-[20px] sm:pt-[36px] sm:pr-[60px] sm:pb-[60px] sm:pl-[60px]">
        <div className="w-full h-fit p-[24px] rounded-[16px] border border-[#E1E0EB] flex flex-col items-center gap-[36px]">
          <div className="inline-flex flex-col sm:flex-wrap gap-[24px] sm:gap-[36px] items-center">
            <div>
              <h2 className="w-full max-w-[720px] mb-2 text-[24px] sm:text-[32px] leading-[36px] sm:leading-[48px] font-semibold text-center text-[#343079] font-poppins">
                Build the Confidence to Crack Any Interview
              </h2>
              <p className="w-full max-w-[720px] text-[16px] leading-[28px] sm:leading-[32px] font-normal text-center text-[#343079] font-['Poppins']">
                From common questions to role-specific challenges, get interview-ready the smart way.
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-[16px]">
            {/* ✅ Protected Enroll Button */}
            <button
              onClick={() => handleProtectedNavigate("/fresher-interview-success-program/week1")}
              className="w-full sm:w-[305px] cursor-pointer flex items-center justify-center gap-[5px] px-[24px] py-[8px] hover:bg-[#403B93] border border-[#282655] bg-[#282655] text-white text-[16px] leading-[28px] font-medium font-['Poppins'] rounded-[8px] transition duration-200 ease-out hover:border-[#403B93]"
            >
              Enroll Now
            </button>

            {/* View Timeline Button */}
            <button
              onClick={() => {
                const timeline = document.getElementById("program-timeline");
                if (timeline) timeline.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-[305px] cursor-pointer flex items-center justify-center gap-[5px] px-[24px] py-[8px] hover:bg-[#EBEAF2] border border-[#282655] text-[#282655] text-[16px] leading-[28px] font-medium font-['Poppins'] rounded-[8px] transition duration-300 ease-out"
            >
              View Program Timeline
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FreshersInterview;
