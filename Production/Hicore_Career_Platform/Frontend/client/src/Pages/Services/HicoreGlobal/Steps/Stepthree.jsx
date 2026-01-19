import React from "react";
import torontoImg from "../../../../assets/HicoreGlobal/toronto.png";
import mitImg from "../../../../assets/HicoreGlobal/usa.png";
import tumImg from "../../../../assets/HicoreGlobal/germany.png";
import melbourneImg from "../../../../assets/HicoreGlobal/australia.png";


const universityData = [
  {
    image: torontoImg,
    name: "University of Toronto",
    location: "Toronto, Ontario, Canada",
    stats: ["Rank: #34 World", "Tuition: CAD $63,830", "Acceptance: 43%", "IELTS: 7.0+"]
  },
  {
    image: mitImg,
    name: "Massachusetts Institute of Technology",
    location: "Cambridge, Massachusetts, USA",
    stats: ["Rank: #2 World", "Tuition: $57,986", "Acceptance: 4%", "TOEFL: 110+"]
  },
  {
    image: tumImg,
    name: "Technical University of Munich",
    location: "Munich, Bavaria, Germany",
    stats: ["Rank: #50 World", "Tuition: €3,000", "Acceptance: 25%", "German: B2"]
  },
  {
    image: melbourneImg,
    name: "University of Melbourne",
    location: "Melbourne, Victoria, Australia",
    stats: ["Rank: #33 World", "Tuition: AUD $47,000", "Acceptance: 70%", "IELTS: 6.5+"]
  }
];

const Stepthree = ({onContinue}) => {
  return (
  <div className="w-full h-fit p-9 border-t border-r border-b border-[#C0BFD5] rounded-tr-[8px] rounded-br-[8px] flex flex-col gap-6">
    {/* Heading */}
    <div className="w-full flex flex-col gap-2">
        <h2 className="text-[20px] font-semibold leading-[36px] text-[#343079]">
          Step 3 : University Results
        </h2>
        <div className="bg-[#FFE4FF] px-4 py-2 rounded-[8px] w-fit">
          <p className="text-[16px] font-medium text-[#343079] leading-[28px]">
            Select universities that interest you for detailed analysis
          </p>
        </div>
      </div>

      {/* University Cards */}
<div className="flex flex-wrap -mx-3">
  {universityData.map((uni, index) => (
    <div
      key={index}
      className="w-full sm:w-1/2 px-3 mb-6"
    >
      <div className="border border-[#EBEAF2] rounded-[8px] overflow-hidden">
        {/* Image */}
        <img
          src={uni.image}
          alt={uni.name}
          className="w-full h-[230px] object-cover rounded-t-[8px]"
        />

        {/* Details */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-[#343079] font-bold text-[16px] leading-[32px]">{uni.name}</h3>
          <p className="text-[#83828F] text-[16px] leading-[32px]">{uni.location}</p>

          {/* Stats */}
          <div className="flex flex-wrap gap-2 mt-2">
            {uni.stats.map((stat, idx) => (
              <p
                key={idx}
                className="text-[16px] text-[#343079]  py-1 rounded"
                style={{ width: "calc(50% - 4px)", lineHeight: "32px" }}
              >
                {stat}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  ))}
          {/* Continue Button */}
        <div className="w-full flex justify-end">
          <button onClick={onContinue}
           className="bg-[#282655] mt-4 text-white px-6 py-2 rounded-[8px] cursor-pointer transition-all duration-300 hover:bg-[#8682D3] hover:border-white">
             Add University
          </button>
        </div>

</div>
    </div>
  );
};

export default Stepthree;
