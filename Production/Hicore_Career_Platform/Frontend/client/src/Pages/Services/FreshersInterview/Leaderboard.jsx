import React, { useState } from 'react'
import barchart from "../../../assets/FreshersInterview/barchart.png";
import leaderbg from "../../../assets/FreshersInterview/leaderbg.png";
import trophyImg from "../../../assets/FreshersInterview/trophy.png";
import clockImg from "../../../assets/FreshersInterview/clock.png";
import BotIcon from '../../../assets/bot.png';
import ChatbotPopup from './ChatBotPopup';

const Leaderboard = () => {
  const percentage = 60;
  const radius = 20;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="w-[300px] h-[900px] gap-2 rounded-[8px] border border-[#EBEAF2] p-2">
      <div className="w-full flex flex-col gap-2 rounded-md opacity-100">
        
        {/* Header */}
        <div className="flex items-center gap-2 opacity-100">
          <img
            src={barchart}
            alt="icon"
            className="w-[12px] h-[16px]"
          />
          <h2 className="text-[#343079] font-bold text-[16px] leading-[32px] font-poppins">
            Your Learning in Real-Time
          </h2>
        </div>

        {/* Leaderboard Card */}
        <div className="w-[282px] h-[264px] relative border border-gray-300 rounded-md overflow-hidden opacity-100">
          <img
            src={leaderbg}
            alt="Leaderboard background"
            className="w-full h-full object-cover"
          />

          <h2 className="absolute top-4 left-1/2 transform -translate-x-1/2 
                         text-[#343079] font-medium text-[16px] leading-[28px] text-center 
                         font-poppins w-[254px] h-[28px]">
            Leaderboard Rank
          </h2>

          <img
            src={trophyImg}
            alt="Trophy"
            className="absolute top-[60px] left-1/2 transform -translate-x-1/2 
                     w-[92px] h-[92px] opacity-100"
          />

          <p className="absolute top-[165px] left-1/2 transform -translate-x-1/2 
                        text-[#343079] font-medium text-[14px] leading-[24px] text-center 
                        font-poppins w-[254px] h-[28px]">
            You’re 12 in this topic
          </p>

          <p className="absolute top-[193px] left-1/2 transform -translate-x-1/2 
                        text-[#343079] font-normal text-[12px] leading-[24px] text-center 
                        font-poppins w-[254px] h-[48px]">
            Answer 10 more questions correctly to break into Top 10!
          </p>
        </div>

        {/* Completion Rate Card */}
        <div className="w-[282px] p-4 border border-gray-300 rounded-md opacity-100 flex flex-col gap-4">
          <p className="text-[#343079] font-medium text-[14px] leading-[24px] font-poppins w-[254px] h-[24px]">
            Your Completion Rate
          </p>

          {/* Progress Indicator */}
          <div className="w-full flex items-center gap-4 opacity-100">
            <div className="w-[48px] h-[48px] relative">
              <svg height="48" width="48" className="transform -rotate-90">
                <circle
                  stroke="#EBEAF2"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx="24"
                  cy="24"
                />
                <circle
                  stroke="#008000"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx="24"
                  cy="24"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[#008000] text-[12px] font-medium font-poppins">
                {percentage}%
              </div>
            </div>

            {/* Description */}
            <p className="text-[#343079] font-normal text-[12px] leading-[24px] font-poppins w-[188px] h-[48px]">
              Finish remaining quizzes & challenges to reach 100%
            </p>
          </div>
        </div>
        <div className="w-full h-auto p-4 border border-[#EBEAF2] rounded gap-4 opacity-100 flex flex-col">
  <h2 className="w-[254px] h-[24px]  text-[#343079] text-[14px] leading-[24px] font-medium font-poppins opacity-100">
  Average Time Per Question
</h2>
<div className="w-full h-auto flex items-center gap-4 opacity-100">
  {/* Left: Clock Image */}
  <img
    src={clockImg} // make sure you imported this image
    alt="Clock"
    className="w-[50px] h-[50px]"
  />

  {/* Right: Text Container */}
  <div className="flex flex-col justify-center gap-1">
    {/* Top Text */}
    <p className="text-[#343079] text-[16px] leading-[28px] font-medium font-poppins w-[188px] h-[28px]">
      1 min 30 secs
    </p>

    {/* Bottom Text */}
    <p className="text-[#343079] text-[12px] leading-[24px] font-normal font-poppins w-[188px] h-[24px]">
      Improved by 3 secs this week
    </p>
  </div>
</div>

      </div>
      <button
          onClick={() => setShowChat(true)}
          className="absolute bottom-[10px] top-[900px] right-[40px] w-[92px] h-[92px] bg-[#343079] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition duration-300 ease-out z-10"
        >
          <img src={BotIcon} alt="Chatbot Icon" className="w-10 h-10" />
        </button>
         {/* Chatbot popup if open */}
      {showChat && <ChatbotPopup onClose={() => setShowChat(false)} />}
</div>

    </div>
  );
};

export default Leaderboard;
