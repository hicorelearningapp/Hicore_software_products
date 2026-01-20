import React from 'react'
import righthand from "../../assets/Landingpage/righthand.png";
import roadmap from "../../assets/Landingpage/Roadmap.png";

const Roadmap = () => {
  return (
    <div className='w-full h-auto gap-[64px] pt-16 pr-24 pb-16 pl-24 opacity-100 flex flex-col'>
    {/* Heading with Arrow */}
      <h2 className="text-[#2758B3] text-[20px] font-semibold leading-[48px] tracking-[0.015em] flex items-center gap-6">
        <div id='roadmap'
         className="relative flex items-center w-[300px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <div className="w-3 h-3 rounded-full bg-[#2758B3] z-10"></div>
          <div className="flex-1 h-[3px] bg-[#2758B3]"></div>
          <div className="border-t-[8px] border-b-[10px] border-l-[8px] border-t-transparent border-b-transparent border-l-[#2758B3]"></div>
        </div>
        Your Exam Success Roadmap
      </h2>
      <div className='w-full h-fit gap-16 opacity-100 rotate-0 flex'>
        <img src={roadmap} alt="roadmap" className="w-full h-full" />
      </div>
      <div className="w-full h-[204px] flex gap-[64px] p-[64px] rounded-[36px] border border-[#0041BC] shadow-[0px_4px_4px_0px_#2758B380] bg-gradient-to-r from-[#E6EEFF] to-[#FFFFFF]">
        {/* Left side text */}
        <h2 className="w-[760px] h-[76px] text-[#2758B3] text-[18px] font-semibold leading-[38px] text-center">
          No matter which exam you’re preparing for, this roadmap ensures you learn the smart way — step by step, with guidance at every stage.
        </h2>
        {/* Right side button */}
        <button className="w-[280px] h-[56px] flex items-center justify-center gap-2 px-4 py-2 rounded-[80px] bg-[#2758B3] hover:bg-[#08265F] cursor-pointer text-white items-center font-bold text-[16px] leading-[40px] tracking-[0.015em]">
           Unlock My Roadmap
          <img src={righthand} alt="hand" className="w-6 h-6 opacity-100 object-cover" />
        </button>
      </div>
    </div>
  )
}

export default Roadmap