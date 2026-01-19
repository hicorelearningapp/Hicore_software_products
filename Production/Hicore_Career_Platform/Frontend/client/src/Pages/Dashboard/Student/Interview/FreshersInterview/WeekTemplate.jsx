import React from "react";
import { useNavigate } from "react-router-dom";

const WeekTemplate = ({ data, weekId }) => {
  const navigate = useNavigate();

  if (!data) return <p>No content available</p>;

  return (
    <div className="w-full px-2 py-8 md:px-[40px] md:py-[80px] mx-auto">
      <div className="w-full max-w-[1240px] mx-auto border border-[#E1E0EB] rounded-[16px] p-6 md:p-[36px]">
        {/* Heading */}
        <h2 className="text-[36px] leading-[48px] text-center font-poppins text-[#343079] mb-12">
          {data.heading}
        </h2>

        {/* Cards Grid */}
        <div className="w-full max-w-[1168px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[36px] mx-auto">
          {data.cards.map((card, index) => (
            <div
              key={index}
              onClick={() =>
                navigate(
                  `/fresher-interview-success-program/${weekId}/${card.topicId}`
                )
              }
              className="w-full h-auto cursor-pointer p-[36px] rounded-[8px] border"
              style={{
                backgroundColor: card.bgColor,
                borderColor: "#65629E",
              }}
            >
              <img
                src={card.icon}
                alt={card.title}
                className="w-[48px] h-[48px] mb-4"
              />
              <h3 className="font-bold text-[16px] leading-[32px] text-[#343079] mb-2 font-poppins">
                {card.title}
              </h3>
              <p className="w-full text-[16px] leading-[32px] text-[#343079] font-poppins">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekTemplate;
