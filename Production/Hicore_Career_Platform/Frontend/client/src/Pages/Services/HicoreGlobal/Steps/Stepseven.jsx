import React from 'react';

const Stepseven = ({onContinue}) => {
  const cards = [
    {
      title: "MIT - Computer Science",
      description: "Application Deadline: January 15, 2026",
      tag1: "Documents: 85% Complete",
      tag2: "Status: In Progress",
      buttonText: "Continue Application"
    },
    {
      title: "University of Toronto - CS",
      description: "Application Deadline: February 1, 2026",
      tag1: "Documents: 45% Complete",
      tag2: "Status: Draft",
      buttonText: "Start Application"
    },
    {
      title: "TU Munich - CS",
      description: "Application Deadline: March 15, 2026",
      tag1: "Documents: 0% Complete",
      tag2: "Status: Not Started",
      buttonText: "Start Application"
    },
  ];

  return (
    <div className='w-full h-fit p-9 border-t border-r border-b border-[#C0BFD5] rounded-tr-[8px] rounded-br-[8px] flex flex-col gap-6'>
      {/* Heading */}
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-[20px] font-semibold leading-[36px] text-[#343079]">
          Step 7 : Application Management
        </h2>
        <div className="bg-[#FFE4FF] px-4 py-2 rounded-[8px] w-fit">
          <p className="text-[16px] font-medium text-[#343079] leading-[28px]">
            Track and submit your university applications
          </p>
        </div>
      </div>

      {/* Cards Container */}
      <div className="w-full grid grid-cols-3 gap-6 items-stretch">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="flex flex-col justify-between border border-[#C0BFD5] rounded-[8px] p-4"
          >
            <div className="flex flex-col gap-9">
              {/* Card Heading */}
              <h3 className="text-[20px] font-semibold leading-[36px] text-[#343079]">
                {card.title}
              </h3>

              {/* Card Description */}
              <p className="text-[16px] font-normal leading-[32px] text-[#343079]">
                {card.description}
              </p>

              {/* Tags */}
              <div className="flex flex-col gap-3">
                <div className="w-fit rounded-full px-4 py-2 bg-[#E8FFDD]">
                  <span className="text-[16px] font-normal leading-[32px] text-[#343079]">
                    {card.tag1}
                  </span>
                </div>
                <div className="w-fit rounded-full px-4 py-2 bg-[#FFFAEF]">
                  <span className="text-[16px] font-normal leading-[32px] text-[#343079]">
                    {card.tag2}
                  </span>
                </div>
              </div>
            </div>

            {/* Button */}
            <button className="w-full h-[44px] rounded-[8px] border border-[#282655] px-6 mb-2 mt-8 py-2 flex items-center justify-center">
              <span className="text-[16px] font-medium leading-[28px] text-[#343079]">
                {card.buttonText}
              </span>
            </button>
          </div>
        ))}
      </div>
        {/* Continue Button */}
        <div className="w-full flex justify-end">
          <button onClick={onContinue}
           className="bg-[#282655] mt-15 text-white px-6 py-2  rounded-[8px] cursor-pointer transition-all duration-300 hover:bg-[#8682D3] hover:border-white">
             Get Expert Advice
          </button>
        </div>
    </div>
  );
};

export default Stepseven;
