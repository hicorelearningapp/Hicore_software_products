import React from 'react';
import arrowicon from '../../assets/Semiconductor/Arrow.png';
import bluearrowicon from '../../assets/Semiconductor/bluearrow.png';
import protocolimg from '../../assets/Semiconductor/protocolimg.jpg';
import tickicon from '../../assets/Semiconductor/Tick.png';
import { useNavigate } from 'react-router-dom';

import { homedata } from './Homedata';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col select-none gap-[40px] md:gap-[64px] p-[20px] md:p-[64px] bg-white'>
      
      {/* Header Section */}
      <div className='flex flex-col gap-[16px] items-center justify-center max-w-5xl mx-auto'>
        <h1 className='font-arial font-semibold text-[28px] md:text-[40px] leading-tight text-[#053C61] text-center' style={{ fontFamily: "Arial, sans-serif" }}>
          Unified Equipment Software for <span className='text-[#0A6CFF]'>SECS/GEM</span> Communication
        </h1>
        <p className='font-arial text-[16px] md:text-[18px] leading-[28px] md:leading-[36px] text-[#6C6C6C] text-center' style={{ fontFamily: "Arial, sans-serif" }}>
          A standards-compliant equipment software platform enabling real-time monitoring, 
          command execution, recipe control, and event-driven automation for 
          semiconductor and advanced manufacturing equipment.
        </p>
      </div>

      {/* Buttons Section - Changed to flex-col on mobile, flex-row on desktop */}
      <div className='flex flex-col md:flex-row items-center justify-center gap-[16px]'>
        <button className='w-full md:w-[280px] flex flex-row items-center justify-center bg-[#053C61] border hover:border-[#F0F0F0] hover:shadow-[4px_4px_4px_0px_#053C6180] transition-shadow duration-300 rounded-[4px] px-[24px] py-[12px] md:py-[10px] gap-[8px]'>
          <span className='font-semibold text-[18px] text-white' style={{ fontFamily: "Arial, sans-serif" }}>Request Demo</span>
          <img src={arrowicon} className='w-[20px] h-[20px]' alt="arrow" />
        </button>
        <button className='w-full md:w-[280px] flex flex-row items-center justify-center border border-[#053C61] hover:bg-[#F0F0F0] hover:shadow-[4px_4px_4px_0px_#053C6180] transition-shadow duration-300 rounded-[4px] px-[24px] py-[12px] md:py-[10px] gap-[8px]'>
          <span className='font-semibold text-[18px] text-[#053C61]' style={{ fontFamily: "Arial, sans-serif" }}>Contact Us</span>
          <img src={bluearrowicon} className='w-[20px] h-[20px]' alt="arrow" />
        </button>
      </div>

      {/* Image Section - Responsive height */}
      <img 
        src={protocolimg} 
        className='rounded-[4px] w-full h-[300px] md:h-[750px] object-cover' 
        alt="Protocol" 
      />

      {/* Dynamic Grid Section from homedata.js */}
      <div id='services' className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]'>
        {homedata.map((item, index) => (
          <div key={index} className='flex flex-col justify-between rounded-[8px] p-[24px] md:p-[32px] border border-[#B2C3CE] bg-white shadow-sm hover:shadow-md transition-shadow'>
            <div className='flex flex-col gap-[20px]'>
              <h2 className='font-arial font-semibold text-[22px] md:text-[24px] text-[#053C61] leading-tight' style={{ fontFamily: "Arial, sans-serif" }}>
                {item.title}
              </h2>
              
              <p className='text-[14px] md:text-[15px] leading-[24px] md:leading-[28px] text-[#545454]' style={{ fontFamily: "Arial, sans-serif" }}>
                {item.description}
              </p>

              <div className='flex flex-col gap-[12px]'>
                {item.listLabel && (
                  <p className='text-[15px] text-[#545454] font-medium' style={{ fontFamily: "Arial, sans-serif" }}>{item.listLabel}</p>
                )}
                {item.features.map((feature, fIndex) => (
                  <div key={fIndex} className='flex flex-row gap-[12px] items-start'>
                    <img src={tickicon} className='w-[18px] h-[18px] md:w-[20px] md:h-[20px] mt-1 shrink-0' alt="check" />
                    <span className='text-[#545454] text-[14px] md:text-[15px] leading-[22px] md:leading-[24px]' style={{ fontFamily: "Arial, sans-serif" }}>{feature}</span>
                  </div>
                ))}
              </div>

              {item.footerText && (
                <p className='text-[14px] md:text-[15px] leading-[22px] text-[#545454] mt-2' style={{ fontFamily: "Arial, sans-serif" }}>
                  {item.footerText}
                </p>
              )}
            </div>

            <button 
              onClick={() => item.path && navigate(item.path)}
              className='w-full mt-[24px] md:mt-[32px] bg-[#00385D] text-white font-semibold py-[12px] rounded-[4px] text-[16px] hover:bg-[#03243A] cursor-pointer transition-colors' style={{ fontFamily: "Arial, sans-serif" }}
            >
              {item.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;