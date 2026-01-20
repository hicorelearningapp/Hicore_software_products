import React from 'react';
import student from "../../assets/Landingpage/student.png";
import parent from "../../assets/Landingpage/parent.png";
import teacher from "../../assets/Landingpage/teacher.png";
import tickicon from "../../assets/Landingpage/tick.png";

const Appforwhom = () => {
  const cardsData = [
    {
      title: "Students - For Every Exam, Every Goal",
      points: [
        "NCERT-aligned notes + inline examples – makes learning simple",
        "Topic-wise quizzes, mock tests & custom tests – practice at your pace",
        "AI Smart Revision – targets weak areas for faster improvement",
        "Flashcards, formula sheets & mind maps – quick last-minute recall"
      ],
      benefit: "Students get clarity, confidence, and consistency in preparation for boards, competitive exams (NEET, JEE, UPSC, etc.)",
      image: student,
      reverse: false,
    },
    {
      title: "Parents - Stay Informed, Stay Involved",
      points: [
        "Progress tracking – see accuracy, speed & consistency trends",
        "Weekly reports – know if your child is improving or needs help",
        "AI recommendations – ensure learning is efficient, not overwhelming"
      ],
      benefit: "Parents get peace of mind knowing their child is preparing the right way with measurable progress.",
      image: parent,
      reverse: true,
    },
    {
      title: "Teachers & Mentors - Smarter Way to Guide Students",
      points: [
        "Performance dashboards – identify strong & weak topics instantly",
        "Assign quizzes, tests & practice packs – save time in preparation",
        "AI insights – personalized guidance based on each student’s learning curve"
      ],
      benefit: "Teachers become mentors who empower, not just evaluators – ensuring students perform better with less stress.",
      image: teacher,
      reverse: false,
    },
  ];

  const TickIcon = () => (
    <img src={tickicon} alt="tick" className="w-6 h-6 object-contain"/>
  );

  return (
    <div className='w-full h-auto gap-[64px] pt-16 pr-24 pb-16 pl-24 opacity-100 flex flex-col'>
      {/* Heading with Arrow */}
      <h2 className="text-[#2758B3] text-[20px] font-semibold leading-[48px] tracking-[0.015em] flex items-center gap-6">
        <div className="relative flex items-center w-[300px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <div className="w-3 h-3 rounded-full bg-[#2758B3]  z-10"></div>
          <div className="flex-1 h-[3px] bg-[#2758B3]"></div>
          <div className="border-t-[8px] border-b-[10px] border-l-[8px] border-t-transparent border-b-transparent border-l-[#2758B3]"></div>
        </div>
        Who Is This App For?
      </h2>

      <div className="w-full h-auto gap-[36px] opacity-100 flex flex-col">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className={`w-full gap-[20px] opacity-100 rounded-[36px] p-[36px] border border-[#2758B3] flex items-center ${
              card.reverse ? 'flex-row-reverse' : 'flex-row'
            } flex-wrap lg:flex-nowrap`}
          >
            {/* Left/Right Side Div - Text Content */}
            <div className={`w-full lg:w-[700px] h-fit p-[34px] gap-[32px] flex flex-col`}>
              <h2 className="font-bold text-[18px] leading-[40px] tracking-[1.5%] text-[#2758B3]">
                {card.title}
              </h2>
              <div className="flex flex-col gap-[12px]">
                {card.points.map((point, pointIndex) => (
                  <div key={pointIndex} className="flex items-start gap-[8px]">
                    <img src={tickicon} alt="tick" className="w-[20px] h-[20px] rounded-[12px]"/>
                    <span className="text-[#2758B3] font-medium text-[16px] leading-[24px] tracking-[1.5%]">{point}</span>
                  </div>
                ))}
              </div>
              <p className="font-semibold text-[16px] leading-[38px] text-[#008000] tracking-[1.5%]">
                Benefit: <span className="font-normal text-[#008000]">{card.benefit}</span>
              </p>
            </div>

            {/* Left/Right Side Div - Image */}
            <div className="flex-shrink-0">
              <div
                className="w-[392px] h-[392px] rounded-full p-[36px] flex items-center justify-center"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appforwhom;
