import React from "react";
import img1 from "../../../../assets/HicoreGlobal/chat.png";
import img2 from "../../../../assets/HicoreGlobal/video.png";
import img3 from "../../../../assets/HicoreGlobal/profile.png";

const consultationData = [
  {
    title: "Chat with Counselors",
    description:
      "24/7 text-based support for quick questions",
    button: "Start Chat",
    image: img1,
  },
  {
    title: "Video Consultation",
    description:
      "One-on-one video calls with certified counselors",
    button: "Schedule Call",
    image: img2,
  },
  {
    title: "Profile Review",
    description: "Comprehensive analysis of your application profile",
    button: "Get Review",
    image: img3,
  },
];

const Stepeight = ({onContinue}) => {
  return (
    <div className="w-full h-fit p-9 border-t border-r border-b border-[#C0BFD5] rounded-tr-[8px] rounded-br-[8px] flex flex-col gap-6">
      {/* Heading */}
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-[20px] font-semibold leading-[36px] text-[#343079]">
          Step 8 : Expert Consultation
        </h2>
        <div className="bg-[#FFE4FF] px-4 py-2 rounded-[8px] w-fit">
          <p className="text-[16px] font-medium text-[#343079] leading-[28px]">
            Get personalized advice from study abroad experts
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="w-full flex flex-wrap gap-[24px]">
        {consultationData.map((item, index) => (
          <div
            key={index}
            className="w-full md:w-[48%] lg:w-[calc(33.333%-16px)] h-fit border border-[#C0BFD5] rounded-[8px] flex flex-col overflow-hidden"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[160px] object-cover rounded-t-[8px]"
            />

            {/* Text + Button */}
            <div className="flex flex-col flex-grow p-6">
              {/* Title & Desc */}
              <div>
                <h2 className="text-[20px] font-semibold text-[#343079] leading-[36px]">
                  {item.title}
                </h2>
                <p className="text-[16px] font-normal mt-4 text-[#343079] leading-[32px]">
                  {item.description}
                </p>
              </div>

            </div>              
              {/* Button */}
              <button className="w-full h-[44px] border border-[#282655] text-[#282655] rounded-[8px] text-[16px] font-medium leading-[28px] ">
                {item.button}
              </button>

          </div>
        ))}
         {/* Continue Button */}
        <div className="w-full flex justify-end">
          <button onClick={onContinue}
           className="bg-[#282655] mt-4 text-white px-6 py-2 rounded-[8px] cursor-pointer transition-all duration-300 hover:bg-[#8682D3] hover:border-white">
             Explore Funding Options
          </button>
        </div>

        </div>
    </div>
  );
};

export default Stepeight;
