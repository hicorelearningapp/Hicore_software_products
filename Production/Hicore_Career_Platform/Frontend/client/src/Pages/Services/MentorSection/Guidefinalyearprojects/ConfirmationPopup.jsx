// src/components/ConfirmationPopup.js
import React from 'react';
import tickIcon from '../../../../assets/GuideFinalyearproject/full-tick.png'; 
import starIcon from '../../../../assets/GuideFinalyearproject/star.png';
import { useNavigate } from 'react-router-dom';

const ConfirmationPopup = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="w-[698px] h-[620px] p-9 rounded-lg bg-white shadow-lg flex flex-col items-center">
      {/* Inner container with border */}
      <div className="w-[626px] h-[546px] p-9 flex flex-col items-center rounded-lg border border-[#EBEAF2]">
        {/* Tick icon container, centered at the top */}
        <div className="w-[415px] flex flex-col items-center mb-8">
          <img
            src={tickIcon}
            alt="Success Tick"
            className="w-[100px] h-[100px]"
          />
        </div>

        {/* Content container */}
        <div className="w-[415px] h-36 gap-4 flex flex-col items-center">
          <div className="flex items-center gap-4">
            <span className="font-poppins font-bold text-2xl leading-8 text-[#008000]">
              Your Project Guidance is Live!
            </span>
          </div>
          <span className="font-poppins font-normal text-base leading-8 text-center text-[#343079]">
            Students can now request mentorship for their final year projects.
          </span>
        </div>
        
        <div className="w-[554px] h-fit p-4 rounded-lg bg-[#E8FFDD] flex flex-col gap-2 mt-8">
          <div className="flex items-center gap-2">
            <img src={starIcon} alt="Star" className="w-6 h-6" />
            <span className="font-poppins font-normal text-base leading-8 text-[#343079]">
              You’ve earned +20 Mentorship Points.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <img src={starIcon} alt="Star" className="w-6 h-6" />
            <span className="font-poppins font-normal text-base leading-8 text-[#343079]">
              This session boosts your visibility in the Top Mentor Spotlight.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <img src={starIcon} alt="Star" className="w-6 h-6" />
            <span className="font-poppins font-normal text-base leading-8 text-[#343079]">
              Keep guiding projects to unlock new badges and recognition.
            </span>
          </div>
        </div>
        <div className="w-[554px] flex justify-center gap-4 mt-8 mb-14">
          <button
            onClick={() => {
              onClose(); // Close the popup
              navigate('/guide-final-year-projects/mentoringprojects', { state: { activeTab: 'guidance' } });
            }}
            className="w-[269px] h-10 px-4 py-2 border border-[#403B93] bg-[#343079] text-white font-semibold rounded-lg hover:bg-[#282562] transition-colors duration-300"
          >
            Guide Another Project
          </button>
          <button
            onClick={() => {
              onClose(); // Close the popup
              navigate('/guide-final-year-projects/mentoringprojects', { state: { activeTab: 'requests' } });
            }}
            className="w-[269px] h-10 px-4 py-2 border border-[#282655] text-[#343079] font-semibold rounded-lg bg-white hover:bg-[#f5f5f5] transition-colors duration-300"
          >
            View Student Requests
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;