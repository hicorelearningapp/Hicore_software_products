import React, { useState } from "react";
import puzzleIcon from "../../../../assets/EmployeerDashboard/Aishortlisting/aistars.png";
import prashanthi from "../../../../assets/EmployeerDashboard/Aishortlisting/prashanthi.png";
import aarthi from "../../../../assets/EmployeerDashboard/Aishortlisting/aarthi.png";
import locationimg from "../../../../assets/EmployeerDashboard/Aishortlisting/location.png";
import workimg from "../../../../assets/EmployeerDashboard/Aishortlisting/work.png";
import eyeicon from "../../../../assets/EmployeerDashboard/Aishortlisting/eye.png";
import saveicon from "../../../../assets/EmployeerDashboard/Aishortlisting/save.png";
import JDbasedshortlisting from "./JDbasedshortlisting";


const Shortlisting = () => {
  const [activeTab, setActiveTab] = useState("Filters");
  const [showContent, setShowContent] = useState(true);

  const tabs = ["Filters", "JD based Shortlist"];

  const candidateData = [
    {
      id: 1,
      name: "Prashanthi",
      company: "TechNova Solutions",
      role: "Senior Frontend Developer",
      location: "Bengaluru, India",
      experience: "3 years 3 months",
      status: "Actively looking for job",
      match: "92%",
      description:
        "Creative frontend developer with a strong eye for design and performance. Experienced in building scalable UIs and collaborating with cross-functional teams in agile environments.",
      skills: ["React.js", "JavaScript (ES6+)", "HTML5/CSS3", "Next.js", "Responsive Design"],
      image: prashanthi
    },
    {
      id: 2,
      name: "Aarthi",
      company: "TechNova Solutions",
      role: "Senior Frontend Developer",
      location: "Bengaluru, India",
      experience: "3 years 3 months",
      status: "Actively looking for job",
      match: "92%",
      description:
        "Creative frontend developer with a strong eye for design and performance. Experienced in building scalable UIs and collaborating with cross-functional teams in agile environments.",
      skills: ["React.js", "JavaScript (ES6+)", "HTML5/CSS3", "Next.js", "Responsive Design"],
      image: aarthi,
    },
  ];

  const renderContent = () => {
    if (activeTab === "Filters") {
      return (
        <div className="flex flex-col gap-4">
          {/* Filters Bar */}
          <div className="flex items-center justify-between gap-8 mb-6 border-b border-[#343079] pb-4">
            {/* Match */}
            <div className="flex items-center gap-2 flex-1">
              <label className="text-sm font-medium text-[#343079]">
                Match %
              </label>
              <select className="w-[140px] border border-[#C0BFD5] rounded-md p-2 text-sm text-[#1E1E2D]">
                <option>Select option</option>
                <option>0-20%</option>
                <option>20-40%</option>
                <option>40-60%</option>
                <option>80-100%</option>
                <option>60-80%</option>
              </select>
            </div>
            {/* Skill */}
            <div className="flex items-center gap-2 flex-1">
              <label className="text-sm font-medium text-[#343079]">
                Skill
              </label>
              <select className="w-[160px] border border-[#C0BFD5] rounded-md p-2 text-sm text-[#1E1E2D]">
                <option>Select option</option>
                <option>React.js</option>
                <option>HTML/CSS</option>
                <option>JavaScript</option>
                <option>Next.js</option>
              </select>
            </div>
            {/* Location */}
            <div className="flex items-center gap-2 flex-1">
              <label className="text-sm font-medium text-[#343079]">
                Location
              </label>
              <select className="w-[160px] border border-[#C0BFD5] rounded-md p-2 text-sm text-[#1E1E2D]">
                <option>Select option</option>
                <option>Remote</option>
                <option>Hyderabad</option>
                <option>Bangalore</option>
                <option>Chennai</option>
                <option>Delhi</option>
              </select>
            </div> 
            {/* Experience */}
            <div className="flex items-center gap-2 flex-1">
              <label className="text-sm font-medium text-[#343079]">
                Experience
              </label>
              <select className="w-[160px] border border-[#C0BFD5] rounded-md p-2 text-sm text-[#1E1E2D]">
                <option>Select option</option>
                <option>0 - 1</option>
                <option>1 - 3</option>
                <option>3 - 5</option>
                <option>5 - 7</option>
              </select>
            </div> 
          </div> 
          <div className="flex gap-4 items-center justify-center">
            <button className="w-[180px] h-[40px] bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-4 py-2 rounded-md font-medium whitespace-nowrap">
              Shortlist Applications
            </button>
            <button className="w-[180px] h-[40px] border border-[#343079] text-[#343079] px-4 py-2 rounded-md font-medium bg-white whitespace-nowrap">
              Export List
            </button>
          </div>
          {/* Candidate Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidateData.map((candidate) => (
              <div
                key={candidate.id}
                className="relative border border-[#C0BFD5] rounded-lg p-4 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={candidate.image}
                    alt={candidate.name}
                    className="w-[225px] h-[190px] object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-[#343079] font-poppins font-bold text-lg">
                      {candidate.name}
                    </h3>
                    <p className="text-[#AEADBE] font-poppins text-sm">
                      {candidate.company}
                    </p>
                    <p className="text-[#343079] font-poppins font-semibold text-sm mt-2 mb-2">
                      {candidate.role}
                    </p>
                    <div className="flex items-center space-x-1 text-[#343079] text-sm mt-1">
                      <img src={locationimg} alt="location" className="w-4 h-4 object-contain" />
                      <span>{candidate.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[#343079] text-sm mt-2">
                      <img src={workimg} alt="work experience" className="w-4 h-4 object-contain" />
                      <span>{candidate.experience}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[#343079] text-sm mt-2">
                      <div className="w-4 h-4 rounded-full bg-[#008000]" />
                      <span>{candidate.status}</span>
                    </div>
                  </div>
              </div>
                <div className="bg-[#008000] text-white font-poppins text-sm font-medium w-fit h-8 rounded-[80px] flex items-center gap-1 opacity-100 px-4 py-1 mb-4">
                  {candidate.match} Match
                </div>
                <p className="text-[#343079] font-poppins text-sm leading-6 mb-4">
                  {candidate.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-[#F0F7FF] text-[#3F6699] text-xs font-medium rounded-[80px] flex items-center gap-1 opacity-100 px-4 py-1"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 w-full">
                  <button className="w-1/2 flex items-center justify-center gap-2 border border-[#343079] text-[#343079] px-4 py-2 rounded-md text-sm font-medium bg-white">
                    <img src={eyeicon} alt="eye" className="w-4 h-4 object-contain" />
                    View Full Profile
                  </button>
                  <button className="w-1/2 flex items-center justify-center gap-2 bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-4 py-2 rounded-md text-sm font-medium">
                    <img src={saveicon} alt="save" className="w-4 h-4 object-contain" />
                    Save to Shortlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return <JDbasedshortlisting />;
    }
  };

  return (
    <div className="w-full h-[844px] opacity-100 rounded-tl-[8px] p-6">
      {/* Tabs Section */}
      <div className="w-full h-[37px] opacity-100 flex space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`h-[37px] px-6 py-2 font-poppins font-medium text-sm leading-6 ${
              activeTab === tab
                ? "bg-[#343079] text-white rounded-tl-[8px] rounded-tr-[8px]"
                : "text-[#C0BFD5]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Content Container */}
      <div className="w-full h-[750px] opacity-100 gap-4 rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px] p-[20px] border border-[#343079] overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Shortlisting;