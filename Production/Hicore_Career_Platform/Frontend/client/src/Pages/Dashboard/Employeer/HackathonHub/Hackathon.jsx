import React, { useState } from "react";
import puzzleIcon from "../../../../assets/EmployeerDashboard/HackathonHub/puzzle.png";
import calendarIcon from "../../../../assets/EmployeerDashboard/HackathonHub/calendar.png";
import teamsIcon from "../../../../assets/EmployeerDashboard/HackathonHub/employer.png";
import orgIcon from "../../../../assets/EmployeerDashboard/HackathonHub/community.png";
import partyicon from "../../../../assets/EmployeerDashboard/HackathonHub/party-popper.png";

const Hackathon = () => {
  const [activeTab, setActiveTab] = useState("Ongoing");
  const [showContent, setShowContent] = useState(false);

  const tabs = ["Ongoing", "Upcoming", "Past"];

  // Dummy datasets
  const ongoingHackathons = [
    {
      id: 1,
      title: "AI for Healthcare Challenge",
      subtitle: "Predictive Diagnosis using ML",
      date: "Aug 10 – Aug 20",
      teams: "120 Teams",
      organizer: "ABC Tech Solutions",
      daysLeft: "5 days left",
    },
    {
      id: 2,
      title: "AI for Healthcare Challenge",
      subtitle: "Predictive Diagnosis using ML",
      date: "Aug 10 – Aug 20",
      teams: "120 Teams",
      organizer: "ABC Tech Solutions",
      daysLeft: "5 days left",
    },
    {
      id: 3,
      title: "AI for Healthcare Challenge",
      subtitle: "Predictive Diagnosis using ML",
      date: "Aug 10 – Aug 20",
      teams: "120 Teams",
      organizer: "ABC Tech Solutions",
      daysLeft: "5 days left",
    },
  ];

  const upcomingHackathons = [
    {
      id: 1,
      title: "FinTech Innovation Jam",
      subtitle: "Secure Payment Solutions",
      date: "Sep 05 – Sep 12",
      teams: "200+ Expected",
      slots: "Sponsor Slots Available",
      registration: "Registration Open",
    },
    {
      id: 2,
      title: "FinTech Innovation Jam",
      subtitle: "Secure Payment Solutions",
      date: "Sep 05 – Sep 12",
      teams: "200+ Expected",
      slots: "Sponsor Slots Available",
      registration: "Registration Open",
    },
    {
      id: 3,
      title: "FinTech Innovation Jam",
      subtitle: "Secure Payment Solutions",
      date: "Sep 05 – Sep 12",
      teams: "200+ Expected",
      slots: "Sponsor Slots Available",
      registration: "Registration Open",
    },
  ];

  const pastHackathons = [
    {
      id: 1,
      title: "Green Energy Hack",
      subtitle: "IoT for Smart Grids",
      date: "Jul 01 – Jul 07",
      submission: "95 Submissions",
      application: "Closed",
      winner: "EcoPower",
    },
    {
      id: 2,
      title: "Green Energy Hack",
      subtitle: "IoT for Smart Grids",
      date: "Jul 01 – Jul 07",
      submission: "95 Submissions",
      application: "Closed",
      winner: "EcoPower",
    },
    {
      id: 3,
      title: "Green Energy Hack",
      subtitle: "IoT for Smart Grids",
      date: "Jul 01 – Jul 07",
      submission: "95 Submissions",
      application: "Closed",
      winner: "EcoPower",
    },
  ];

  // Pick dataset based on activeTab
  const getData = () => {
    if (activeTab === "Ongoing") return ongoingHackathons;
    if (activeTab === "Upcoming") return upcomingHackathons;
    return pastHackathons;
  };

  const renderHackathonCards = () => {
    const data = getData();
    
    if (activeTab === "Ongoing") {
      return data.map((hackathon) => (
        <div
          key={hackathon.id}
          className="relative border border-[#C0BFD5]  rounded-bl-[8px] rounded-br-[8px] rounded-tl-[8px] p-4 pt-[40px] flex flex-col justify-between mb-4 opacity-100"
        >
          {/* Days left badge */}
          <div className="absolute top-0 right-0 flex items-center justify-center 
                    w-[105px] h-[40px] bg-[#FBA300] opacity-100 
                    text-[#343079] font-poppins text-[14px] font-medium 
                    rounded-tl-[80px] rounded-bl-[80px] px-4 py-2">
            {hackathon.daysLeft}
          </div>

          {/* Title + Subtitle */}
          <div className="mb-3">
            <h3 className="text-[#343079] font-poppins font-bold text-[16px]">
              {hackathon.title}
            </h3>
            <p className="text-[#83828F] font-poppins font-regular text-[16px]">
              {hackathon.subtitle}
            </p>
          </div>

          {/* Info Section */}
          <div className="text-[#343079] text-sm space-y-2 mb-4">
            <div className="flex items-center space-x-2">
              <img src={calendarIcon} alt="date" className="w-4 h-4 object-contain" />
              <span>{hackathon.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <img src={teamsIcon} alt="teams" className="w-4 h-4 object-contain" />
              <span>{hackathon.teams}</span>
            </div>
            <div className="flex items-center space-x-2">
              <img src={orgIcon} alt="org" className="w-4 h-4 object-contain" />
              <span>{hackathon.organizer}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 w-full">
            <button className="w-1/2 bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-4 py-2 rounded-md text-sm font-medium">
              Partner
            </button>
            <button className="w-1/2 border border-[#343079] text-[#343079] px-4 py-2 rounded-md text-sm font-medium bg-white">
              Partner
            </button>
          </div>
        </div>
      ));
    } else if (activeTab === "Upcoming") {
      return data.map((hackathon) => (
        <div
          key={hackathon.id}
          className="relative border border-[#C0BFD5] rounded-bl-[8px] rounded-br-[8px] rounded-tl-[8px] p-4 pt-[40px] flex flex-col justify-between mb-4 opacity-100"
        >
          {/* Registration Open badge */}
          <div className="absolute top-0 right-0 flex items-center justify-center 
                    w-fit h-[40px] bg-[#008000] opacity-100 
                    text-white font-poppins text-[14px] font-medium 
                    rounded-tl-[80px] rounded-bl-[80px] px-4 py-2">
            {hackathon.registration}
          </div>

          {/* Title + Subtitle */}
          <div className="mb-3">
            <h3 className="text-[#343079] font-poppins font-bold text-[16px]">
              {hackathon.title}
            </h3>
            <p className="text-[#83828F] font-poppins font-regular text-[16px]">
              {hackathon.subtitle}
            </p>
          </div>

          {/* Info Section */}
          <div className="text-[#343079] text-sm space-y-2 mb-4">
            <div className="flex items-center space-x-2">
              <img src={calendarIcon} alt="date" className="w-4 h-4 object-contain" />
              <span>{hackathon.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <img src={teamsIcon} alt="teams" className="w-4 h-4 object-contain" />
              <span>{hackathon.teams}</span>
            </div>
            <div className="flex items-center space-x-2">
              <img src={orgIcon} alt="slots" className="w-4 h-4 object-contain" />
              <span>{hackathon.slots}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 w-full">
            <button className="w-1/2 bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-4 py-2 rounded-md text-sm font-medium">
              Sponser
            </button>
            <button className="w-1/2 border border-[#343079] text-[#343079] px-4 py-2 rounded-md text-sm font-medium bg-white">
              View Details
            </button>
          </div>
        </div>
      ));
    } else if (activeTab === "Past") {
      return data.map((hackathon) => (
        <div
          key={hackathon.id}
          className="relative border border-[#C0BFD5] rounded-bl-[8px] rounded-br-[8px] rounded-tl-[8px] p-4 pt-[40px] flex flex-col justify-between mb-4 opacity-100"
        >
          {/* Closed badge */}
          <div className="absolute top-0 right-0 flex items-center justify-center 
                    w-[80px] h-[40px] bg-[#FF0000] opacity-100 
                    text-white font-poppins text-[14px] font-medium 
                    rounded-tl-[80px] rounded-bl-[80px] px-4 py-2">
            {hackathon.application}
          </div>

          {/* Title + Subtitle */}
          <div className="mb-3">
            <h3 className="text-[#343079] font-poppins font-bold text-[16px]">
              {hackathon.title}
            </h3>
            <p className="text-[#83828F] font-poppins font-regular text-[16px]">
              {hackathon.subtitle}
            </p>
          </div>

          {/* Info Section */}
          <div className="text-[#343079] text-sm space-y-2 mb-4">
            <div className="flex items-center space-x-2">
              <img src={calendarIcon} alt="date" className="w-4 h-4 object-contain" />
              <span>{hackathon.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <img src={teamsIcon} alt="submissions" className="w-4 h-4 object-contain" />
              <span>{hackathon.submission}</span>
            </div>
          </div>

          {/* Winner Section */}
          <div className="w-full bg-[#E5F5E0] p-2 rounded-md mb-4 flex items-center">
            <img src={partyicon} alt="party" className="w-[36px] h-[36px]" />
            <span className="text-[#343079] font-poppins text-sm font-medium ml-2">Winner: {hackathon.winner}</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 w-full">
            <button className="w-1/2 bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-4 py-2 rounded-md text-sm font-medium">
              View Results
            </button>
            <button className="w-1/2 border border-[#343079] text-[#343079] px-4 py-2 rounded-md text-sm font-medium bg-white">
              View Project
            </button>
          </div>
        </div>
      ));
    }
  };

  return (
    <div className="w-full h-[844px] opacity-100 rounded-tl-[8px] p-6">
      {/* Tabs Section */}
      <div className="w-full h-[37px] opacity-100 flex space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setShowContent(true); // Always show content on tab click
            }}
            className={`h-[37px] px-6 py-2 font-poppins font-medium text-sm leading-[100%] ${
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
        {!showContent ? (
          <div className="flex flex-col items-center justify-center h-[600px] text-center">
            <div className="flex items-center justify-center">
              <img
                src={puzzleIcon}
                alt="Empty State"
                className="w-[100px] h-[100px] object-cover opacity-100"
              />
            </div>
            <p className="w-full h-8 text-center text-[#A4A2B3] font-poppins font-bold text-[16px] leading-8">
              No hackathons partnered yet.
            </p>
            <p className="w-full h-8 text-center text-[#A4A2B3] font-poppins font-normal text-[16px] leading-8">
              Collaborate with top talent by hosting or sponsoring a challenge
            </p>
            <button
              onClick={() => setShowContent(true)}
              className="bg-[#343079] text-white px-6 py-2 rounded-md mt-4"
            >
              Explore Hackathons
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderHackathonCards()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hackathon;