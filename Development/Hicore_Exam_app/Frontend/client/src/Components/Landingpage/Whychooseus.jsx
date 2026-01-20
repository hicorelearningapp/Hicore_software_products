import React from 'react';
import examimg from "../../assets/Landingpage/exam.png";
import time from "../../assets/Landingpage/stopwatch.png";
import learn from "../../assets/Landingpage/learn.png";
import goal from "../../assets/Landingpage/goal.png";
import sale from "../../assets/Landingpage/sale.png";

const cardsData = [
  {
    title: "Save time",
    description: "AI highlights only weak areas for revision",
    img: time
  },
  {
    title: "Learn smarter",
    description: "Flashcards and Formula Sheets simplify complex concepts",
    img: learn
  },
  {
    title: "Practice right",
    description: "Mock exams & quizzes built like real exam",
    img: goal
  },
  {
    title: "Perform better",
    description: "Track accuracy, speed & progress with detailed reports",
    img: sale
  },
];

const Whychooseus = () => {
  return (
    <div className='w-full h-auto gap-[36px] pt-16 pr-24 pb-16 pl-24 opacity-100 flex flex-col'>
      {/* Heading with Arrow */}
      <h2 className="text-[#2758B3] text-[20px] font-semibold leading-[48px] tracking-[0.015em] flex items-center gap-6">
        <div id='about'
         className="relative flex items-center w-[300px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <div className="w-3 h-3 rounded-full bg-[#2758B3]  z-10"></div>
          <div className="flex-1 h-[3px] bg-[#2758B3]"></div>
          <div className="border-t-[8px] border-b-[10px] border-l-[8px] border-t-transparent border-b-transparent border-l-[#2758B3] "></div>
        </div>
        Why Choose Us?
      </h2>

      {/* Top Section */}
      <div className="w-full flex gap-[16px] pr-[36px] items-center jusitfy-center">
        {/* Left Side */}
        <div className="w-[660px] h-[252px] p-[36px] flex flex-col  gap-[16px] opacity-100">
          <p className="font-poppins font-normal text-[16px] leading-[38px] tracking-[1.5%] text-[#2758B3]">
            Preparing for competitive exams can feel overwhelming. That’s why we built a platform that acts like your personal study coach, guiding you step by step, analyzing your performance, and helping you master concepts faster.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex ">
          <img src={examimg} alt="Exam Preparation" className="w-[450px] h-[252px] opacity-100 object-cover  object-bottom" />
        </div>
      </div>

      {/* Key Benefits Section */}
      <div className="w-full h-auto flex flex-col gap-[36px]">
        <h2 className="text-[#2758B3] text-[18px] font-bold">Key Benefits</h2>

        {/* Cards Container */}
        <div className="w-full flex gap-[36px] flex-wrap">
          {cardsData.map((card, index) => (
            <div
              key={index}
              className="flex flex-col h-auto gap-[36px] p-[36px] rounded-[36px] border border-[#2758B3] shadow-[0_4px_8px_0_#E1E9FF] flex-1 min-w-[250px]">
              {/* Card Image */}
              <img src={card.img} alt={card.title} className="w-[48px] h-[48px] opacity-100 items-start" />

              {/* Card Text */}
              <div className="flex flex-col gap-[8px]">
                <h2 className="font-poppins font-semibold text-[18px] leading-[40px] tracking-[1.5%] text-[#2758B3]">
                  {card.title}
                </h2>
                <p className="font-poppins font-normal text-[14px] leading-[36px] tracking-[1.5%] text-[#2758B3]">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Whychooseus;
