import React, { useState } from 'react';
import earningimg from "../../../../assets/MentoDashboardLayout/Earnings/profit.png";

const Performance = () => {
  const [activeTab, setActiveTab] = useState("Earnings");
  
  const tabs = [
    "Earnings",
    "Performance"
  ];

  return (
    <div className="w-full h-auto opacity-100 rounded-tl-[8px]">
      {/* Tabs Section */}
      <div className="w-full h-[37px] opacity-100 flex space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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
      <div className="w-full h-auto opacity-100 gap-4 rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px] p-[20px] border border-[#343079]">
        <div className="flex flex-col items-center justify-center h-[600px] text-center">
          <div className="flex items-center justify-center">
            <img 
              src={earningimg} 
              alt="Growth"
              className="w-[100px] h-[100px] object-cover opacity-100"
            />
          </div>
          <p className="w-full h-8 text-center text-[#A4A2B3] font-poppins font-bold text-[16px] leading-8">
            No earnings yet to show the performance.
          </p>
          <p className="w-full h-8 text-center text-[#A4A2B3] font-poppins font-normal text-[16px] leading-8">
            Complete your first task to see your earnings performance here.
          </p>
          <button
              className="bg-[#343079] text-white px-6 py-2 rounded-md mt-4"
            >
              Explore Opportunities
            </button>
        </div>
      </div>
    </div>
  );
};

export default Performance;