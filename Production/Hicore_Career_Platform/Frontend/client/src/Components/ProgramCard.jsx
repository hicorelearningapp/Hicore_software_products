import React from "react";
import { useNavigate } from "react-router-dom";
import tickicon from "../assets/tick.png";

const colorMap = {
  pink: {
    strip: "bg-[#FFE4FF]",
    border: "border-[#FFE4FF]",
  },
  yellow: {
    strip: "bg-[#F5F4C3]",
    border: "border-[#F5F4C3]",
  },
  green: {
    strip: "bg-[#E8FFDD]",
    border: "border-[#E8FFDD]",
  },
  blue: {
    strip: "bg-[#D7FFFF]",
    border: "border-[#D7FFFF]",
  },
  dblue: {
    strip: "bg-[#C8ECF5]",
    border: "border-[#C8ECF5]",
  },
  cyan: {
    strip: "bg-[#FFFFD4]",
    border: "border-[#FFFFD4]",
  },
  purple: {
    strip: "bg-[#DBD0FF]",
    border: "border-[#DBD0FF]",
  },
};

const ProgramCard = ({ program }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    let targetRoute = "";

    if (program.title === "Internship/Mini Project Program") {
      targetRoute = "/internship-project";
    }
    if (program.title === "Major/Final Year Project Accelerator") {
      targetRoute = "/major-projects";
    }
    if (program.title === "Global Job Access Program") {
      targetRoute = "/applyforjobs";
    }
    if (program.title === "Skill Upgrade Program") {
      targetRoute = "/courses";
    }
    if (program.title === "Career Launchpad Program") {
      targetRoute = "/jd-analyzer";
    }
    if (program.title === "AI Career Growth Program") {
      targetRoute = "/ai-carrer-assistant";
    }
    if (program.title === "Freshers Interview Success Program") {
      targetRoute = "/fresher-interview-success-program";
    }
    if (program.title === "HiCore Global EdConnect") {
      targetRoute = "/hicore-global-edconnect";
    }
    if (program.title === "Mentor Connect Program for mentors") {
      targetRoute = "/mentor-connect";
    }
    if (program.title === "Skill-Based Hiring Suite for Employers") {
      targetRoute = "/browse-top-talent";
    }

    // ✅ If not logged in, redirect to login and save intended route
    if (!isLoggedIn) {
      localStorage.setItem("redirectAfterLogin", targetRoute);
      navigate("/login");
    } else {
      navigate(targetRoute);
    }
  };

  const color = colorMap[program.color] || colorMap.purple;

  return (
    <div
      className={`w-full py-9 flex flex-col md:flex-row ${
        !program.isLeft ? "md:flex-row-reverse" : ""
      } items-center justify-between gap-6`}
    >
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={program.img}
          alt={program.title}
          className="w-full h-auto max-w-sm rounded-lg"
        />
      </div>

      <div
        className={`w-full md:w-2/3 h-auto bg-white border-2 ${color.border} rounded-2xl shadow-sm`}
      >
        <div
          className={`${color.strip} w-full py-4 flex items-center justify-center rounded-t-2xl`}
        >
          <h3
            className={`w-full font-poppins font-semibold text-lg sm:text-xl text-center text-[#343079] px-4`}
          >
            {program.title}
          </h3>
        </div>

        <div className="p-5 sm:p-6">
          <p className="font-poppins font-semibold text-sm leading-6 text-[#343079] w-full">
            {program.summary}
          </p>
          <div className="space-y-3 mt-8 mb-8">
            {program.points.map((point, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 flex-shrink-0">
                  <img src={tickicon} alt="icon" className="w-6 h-6" />
                </div>
                <p className="text-[#343079] text-base leading-8 font-poppins font-normal w-full">
                  {point}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleClick}
            className="w-full h-14 px-6 py-2 bg-[#282655] text-white rounded-lg border  border-[#282655] font-medium text-base cursor-pointer hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 hover:border-white"
          >
            {program.button}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
