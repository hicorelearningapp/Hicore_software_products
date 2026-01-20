import React from 'react';
import bottombannerimg from '../../assets/Landingpage/footerbg.png';
import rightSideImg from '../../assets/Landingpage/footerimg.png';

const Successstart = () => {
  return (
    <div className='w-full h-fit py-16 px-24 opacity-100'>
      <div
        className='w-full h-[440px] flex items-center justify-between p-9 gap-4 opacity-100 rounded-[36px] bg-cover bg-center'
        style={{ backgroundImage: `url(${bottombannerimg})` }}
      >
        {/* Left side content */}
        <div className='flex flex-col w-[70%] p-9 gap-9 opacity-100'>
          {/* Text container */}
          <div className='flex flex-col gap-9 p-9 opacity-100'>
            {/* Heading */}
            <h2 className='font-poppins font-semibold text-[20px] leading-[44px] tracking-[0.015em] text-[#002771]'>
              From First Concept to Final Exam - We’ve Got You Covered
            </h2>
            {/* Paragraph */}
            <p className='font-poppins font-normal text-[16px] leading-[38px] tracking-[0.015em] text-[#002771]'>
              AI-powered roadmap that helps you focus on what really matters. Learn, practice, test, revise, and master — all in one app.
            </p>
            {/* Button */}
            <button className='w-full h-[56px] px-4 py-2 gap-2 rounded-[80px] bg-[#2758B3] hover:bg-[#08265F] cursor-pointer flex items-center justify-center w-fit'>
            <span className='font-poppins font-semibold text-[20px] leading-[40px] tracking-[0.015em] text-white'>
              Your Success Starts Here
            </span>
            </button>
          </div>

          
        </div>

        {/* Right side image */}
        <div className='w-[30%] p-9 opacity-100 flex items-center justify-center'>
          <img
            src={rightSideImg}
            alt='Illustration'
            className='w-full object-contain'
          />
        </div>
      </div>
    </div>
  );
};

export default Successstart;