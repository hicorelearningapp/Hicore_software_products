import React from 'react';
import partyicon from "../../../../assets/HicoreGlobal/party-popper.png";
import calendaricon from "../../../../assets/HicoreGlobal/calendar_icon.png";
import tickicon from "../../../../assets/HicoreGlobal/tick.png";
import locationicon from "../../../../assets/HicoreGlobal/location.png";

const Steptwelve = () => {
  const checklist = [
    "Book flights and accommodation",
    "Open international bank account",
    "Get international health insurance",
    "Get international phone plan",
  ];

  const cards = [
    {
      icon: calendaricon,
      title: "First Week Activities",
      bg: "#F3F3FB",
      points: [
        "Attend university orientation",
        "Complete course registration",
        "Get student ID and library access",
        "Set up local bank account",
        "Register with local authorities (if required)"
      ]
    },
    {
      icon: tickicon,
      title: "Long-term Success Tips",
      bg: "#F0F7FF",
      points: [
        "Join student organizations and clubs",
        "Build relationships with professors",
        "Utilize career services early",
        "Maintain good academic standing",
        "Explore internship opportunities"
      ]
    },
    {
      icon: locationicon,
      title: "Essential Locations to Visit",
      bg: "#E0F0FF",
      points: [
        "International Student Services Office",
        "Academic Advisor's Office",
        "Campus Health Center",
        "Career Services Center",
        "Nearest grocery stores and pharmacies"
      ]
    }
  ];

  return (
    <div className="w-full h-fit p-9 border-t border-r border-b border-[#C0BFD5] rounded-tr-[8px] rounded-br-[8px] flex flex-col gap-6">
      {/* Heading */}
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-[20px] font-semibold leading-[36px] text-[#343079]">
          Step 12 : Pre-Departure & Landing
        </h2>

        <div className="bg-[#FFE4FF] px-4 py-2 rounded-[8px] w-fit">
          <p className="text-[16px] font-medium text-[#343079] leading-[28px]">
            Final steps before and after reaching your destination
          </p>
        </div>

        <div className="w-full rounded-[8px] border border-[#EBEAF2] bg-[#E8FFDD] px-4 py-4 flex items-center justify-center gap-3">
          <img
            src={partyicon}
            alt="Party Popper"
            className="w-[38px] h-[38px]"
          />
          <p className="text-[20px] font-medium text-[#343079] leading-[36px] text-center">
            Congratulations! You're almost ready for your study abroad journey!
          </p>
        </div>
      </div>

      {/* Pre-Departure Checklist */}
      <div className="w-full rounded-[8px] border border-[#EBEAF2] px-4 py-4 flex flex-col gap-4">
        <h2 className="text-[16px] font-semibold leading-[32px] text-[#343079]">
          Pre-Departure Checklist
        </h2>

        {/* Checklist Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {checklist.map((item, index) => (
            <label
              key={index}
              className="flex items-center gap-2 text-[16px] text-[#343079] cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-[16px] h-[16px] border-[1.5px] border-[#343079] rounded"
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* Cards Section */}
      <div className="w-full flex flex-wrap gap-[24px]">
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-full md:w-[calc(33.333%-16px)] border border-[#C0BFD5] rounded-[8px] flex flex-col gap-4 p-6"
            style={{ backgroundColor: card.bg }}
          >
            <img src={card.icon} alt={card.title} className="w-[40px] h-[40px]" />
            <h3 className="text-[16px] font-bold text-[#343079] leading-[32px]">
              {card.title}
            </h3>
            <ul className="list-disc pl-5 text-[16px] text-[#343079] leading-[32px]">
              {card.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
        {/* Continue Button */}
        <div className="w-full flex justify-end">
          <button 
           className="bg-[#282655] mt-15 text-white px-6 py-2  rounded-[8px]">
             Start New Journey
          </button>
        </div>

    </div>
  );
};

export default Steptwelve;
