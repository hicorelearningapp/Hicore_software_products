import React from 'react';
import tickicon from '../../../assets/Semiconductor/Tick.png';
import eqsoftimg from '../../../assets/Semiconductor/eqsoftimg.png';
import challengeicon from '../../../assets/Semiconductor/challenge.png';
import arrowrighticon from '../../../assets/Semiconductor/arrowright.png';
import solutionicon from '../../../assets/Semiconductor/solution.png';

// --- Data Constants ---
const EQUIPMENT_FEATURES = [
  "Equipment connectivity",
  "Data visibility",
  "Process control",
  "Event-driven automation"
];

const CHALLENGES = [
  "Limited visibility into equipment parameters",
  "Inconsistent communication across tools",
  "Manual command execution",
  "Reactive fault handling",
  "Complex host integration"
];

const Eqsoftrequire = () => {
  return (
    <div  className='flex flex-col gap-[32px] md:gap-[64px] p-[24px] md:p-[64px]'>
      
      {/* SECTION: WHAT IT IS */}
      <div className='flex flex-col gap-[24px] md:gap-[36px]'>
        <div className="flex flex-col gap-[6px] items-center justify-center">
          <h2 className="font-bold text-[18px] md:text-[20px] leading-[32px] md:leading-[48px] text-[#053C61] text-center inline-block"
          style={{ fontFamily: "Arial, sans-serif" }}>
            WHAT IT IS
          </h2>
          <svg viewBox="0 0 300 8" xmlns="http://www.w3.org/2000/svg"
            className="w-[60px] md:w-[10%] h-[8px]"
            preserveAspectRatio="none">
            <path d="M0 4 C70 0, 230 0, 300 4 C230 8, 70 8, 0 4 Z" fill="#053C61" />
          </svg>
        </div>

        <div className='flex flex-col md:flex-row gap-[16px] items-center'>
          <div className='flex flex-col w-full md:w-[50%] p-[16px] md:p-[36px] gap-[16px]'>
            <span className='text-[14px] md:text-[16px] leading-[28px] md:leading-[32px] text-[#053C61]'
            style={{ fontFamily: "Arial, sans-serif" }}>
              <b className='font-bold'>Industrial-Grade Equipment Software:</b> This Equipment Software provides a unified control and communication layer between factory host systems and manufacturing equipment using SECS/GEM standards.
            </span>
            
            <div className='flex flex-col gap-[8px]'>
              <p className='font-bold text-[16px] text-[#053C61]'
              style={{ fontFamily: "Arial, sans-serif" }}>It enables:</p>
              <div className='flex flex-col gap-[4px]'>
                {EQUIPMENT_FEATURES.map((feature, index) => (
                  <div key={index} className='flex flex-row gap-[12px] md:gap-[16px] items-center'>
                    <img src={tickicon} alt="tick" className='w-[20px] h-[20px] md:w-[24px] md:h-[24px]' />
                    <span className='text-[14px] md:text-[16px] leading-[28px] md:leading-[32px] text-[#053C61]'
                    style={{ fontFamily: "Arial, sans-serif" }}>{feature}</span>
                  </div>
                ))}
                <p className='text-[14px] md:text-[16px] text-[#053C61] mt-2'
                style={{ fontFamily: "Arial, sans-serif" }}>
                  All without modifying existing machine controllers.
                </p>
              </div>
            </div>
          </div>

          <div className='w-full md:w-[50%] flex items-center justify-center'>
            <img src={eqsoftimg} alt="Equipment Software" className='w-full max-w-[600px] h-auto object-contain' />
          </div>
        </div>
      </div>

      {/* SECTION: WHY IT IS REQUIRED */}
      <div id='why-us' className='flex flex-col gap-[24px] md:gap-[36px]'>
        <div className="flex flex-col gap-[6px] items-center justify-center">
          <h2 className="font-bold text-[18px] md:text-[20px] leading-[32px] md:leading-[48px] text-[#053C61] text-center inline-block"
          style={{ fontFamily: "Arial, sans-serif" }}>
            WHY EQUIPMENT SOFTWARE IS REQUIRED
          </h2>
          <svg viewBox="0 0 300 8" xmlns="http://www.w3.org/2000/svg"
            className="w-[120px] md:w-[30%] h-[8px]"
            preserveAspectRatio="none">
            <path d="M0 4 C70 0, 230 0, 300 4 C230 8, 70 8, 0 4 Z" fill="#053C61" />
          </svg>
        </div>

        <div className='flex flex-col md:flex-row gap-[24px] md:gap-[36px]'>
            {/* Challenges Box - Added flex-1 to ensure equal height */}
            <div className='flex flex-1 flex-col rounded-[4px] p-[20px] md:p-[36px] gap-[16px] bg-[#E6272705] border border-[#E62727]'>
                <div className='flex flex-row gap-[12px] items-center'>
                    <img src={challengeicon} alt="challenges" className='w-[28px] h-[28px] md:w-[36px] md:h-[36px]' />
                    <h3 className='text-[16px] md:text-[18px] leading-[24px] md:leading-[36px] font-bold text-[#E62727]'
                    style={{ fontFamily: "Arial, sans-serif" }}>
                        Challenges in Equipment Integration
                    </h3>
                </div>
                <div className='flex flex-col gap-[12px]'>
                    {CHALLENGES.map((challenge, index) => (
                        <div key={index} className='flex flex-row gap-[12px] items-start'>
                            <img src={arrowrighticon} alt="arrow" className='w-[20px] h-[20px] md:w-[24px] md:h-[24px] mt-1' />
                            <span className='text-[14px] md:text-[16px] leading-[24px] md:leading-[32px] text-[#053C61]'
                            style={{ fontFamily: "Arial, sans-serif" }}>
                                {challenge}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Solution Box - Added flex-1 and removed h-fit */}
            <div className='flex flex-1 flex-col rounded-[4px] p-[20px] md:p-[36px] gap-[16px] bg-[#17981703] border border-[#179817]'>
                <div className='flex flex-row gap-[12px] items-center'>
                    <img src={solutionicon} alt="solution" className='w-[28px] h-[28px] md:w-[36px] md:h-[36px]' />
                    <h3 className='text-[16px] md:text-[18px] leading-[24px] md:leading-[36px] font-bold text-[#179817]'
                    style={{ fontFamily: "Arial, sans-serif" }}>
                        Our Solution
                    </h3>
                </div>
                <p className='text-[14px] md:text-[16px] leading-[24px] md:leading-[32px] text-[#053C61]'
                style={{ fontFamily: "Arial, sans-serif" }}>
                    A single, standardized platform that simplifies equipment integration, centralizes control, and enables automation across all tools.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Eqsoftrequire;