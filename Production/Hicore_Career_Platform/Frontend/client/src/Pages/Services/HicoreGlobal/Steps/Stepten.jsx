import React from 'react';

const Stepten = ({onContinue}) => {
  const cards = [
    {
      title: "Receive I-20 Form",
      description: "University will send I-20 after admission and deposit payment",
      buttonText: "I-20 Checklist"
    },
    {
      title: "Pay SEVIS Fee",
      description: "$350 fee required before visa interview",
      buttonText: "Pay SEVIS Fee"
    },
    {
      title: "Complete DS-160 Form",
      description: "Online visa application form with personal and academic details",
      buttonText: "DS-160 Guide"
    },
    {
      title: "Schedule Visa Interview",
      description: "Book appointment at nearest US consulate",
      buttonText: "Schedule Interview"
    },
    {
      title: "Attend Visa Interview",
      description: "Prepare for common questions about your study plans",
      buttonText: "Interview Prep"
    },
  ];

  return (
    <div className='w-full h-fit p-9 border-t border-r border-b border-[#C0BFD5] rounded-tr-[8px] rounded-br-[8px] flex flex-col gap-6'>
      {/* Heading */}
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-[20px] font-semibold leading-[36px] text-[#343079]">
          Step 9 : Visa Process
        </h2>
        <div className="bg-[#FFE4FF] px-4 py-2 rounded-[8px] w-fit">
          <p className="text-[16px] font-medium text-[#343079] leading-[28px]">
            Step-by-step guidance for student visa applications
          </p>
        </div>
        <div className="bg-[#D1E5FF] px-4 py-2 border border-[#EBEAF2] rounded-[8px] w-full">
          <p className="text-[20px] leading-[36px] text-[#343079]">
            F-1 Student Visa Requirements (USA)
          </p>
          <p className="text-[16px] text-[#343079] leading-[28px]">
            Timeline: 3-6 months before departure
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="w-full grid grid-cols-3 gap-6 items-stretch">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col justify-between border border-[#C0BFD5] rounded-[8px] p-4"
          >
            <div className="flex flex-col gap-6">
              {/* Step Number */}
              <div className="w-[48px] h-[48px] rounded-[4px] bg-[#343079] flex items-center justify-center px-4">
                <span className="text-white text-[24px] font-medium leading-[48px]">
                  {index + 1}
                </span>
              </div>

              {/* Card Title */}
              <h3 className="text-[20px] font-semibold leading-[36px] text-[#343079]">
                {card.title}
              </h3>

              {/* Card Description */}
              <p className="text-[16px] font-normal leading-[32px] text-[#343079]">
                {card.description}
              </p>
            </div>

            {/* Button */}
            <button className="w-full h-[44px] rounded-[8px] border border-[#343079] px-6 py-2 flex items-center justify-center mt-6">
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
             Connect with Peers
          </button>
        </div>

    </div>
  );
};

export default Stepten;
