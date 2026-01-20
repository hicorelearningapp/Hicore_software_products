import React from "react";

const FeatureCard = ({ icon: Icon, title, subtitle, description }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-xl  border border-gray-400
       p-10 flex flex-col items-center text-center 
    hover:shadow-2xl transition-all duration-300 my-4 min-h-[320px]"
    >
      <div className="bg-red-700 p-3 rounded-lg text-white mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-[20px] mt-2 font-bold">{title}</h3>
      <p className="mt-3 font-semibold text-[16px] text-gray-700">{subtitle}</p>
      <p className="mt-3 text-[14px] leading-[32px] text-gray-500">{description}</p>
    </div>
  );
};

export default FeatureCard;
