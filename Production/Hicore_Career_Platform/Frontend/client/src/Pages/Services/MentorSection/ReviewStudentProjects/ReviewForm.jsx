import React from 'react';
import staricon from "../../../../assets/For Mentor/ReviewLandingPage/star.png";

const ReviewForm = ({ onClose }) => {
  return (
    <div className="review-form-modal w-[592px] max-h-[90vh] overflow-y-auto flex flex-col gap-7 p-9 border border-[#C0BFD5] rounded-lg bg-white">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-poppins font-semibold text-[14px] text-base text-[#343079]">Strengths</label>
          <textarea className="w-full h-[156px] border border-[#C0BFD5] rounded-lg p-4 font-poppins text-[14px]" placeholder="Type your feedback here..."></textarea>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-poppins font-semibold text-[14px] text-base text-[#343079]">Areas of improvement</label>
          <textarea className="w-full h-[156px] border border-[#C0BFD5] rounded-lg p-4 font-poppins text-[14px]" placeholder="Type your feedback here..."></textarea>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-poppins font-semibold text-[14px] text-base text-[#343079]">Suggestions & guidance</label>
          <textarea className="w-full h-[156px] border border-[#C0BFD5] rounded-lg p-4 font-poppins text-[14px]" placeholder="Type your feedback here..."></textarea>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-poppins font-semibold text-[14px] text-base text-[#343079]">Rating</label>
          <div className="flex gap-1 text-2xl text-[#AEADBE]">
            <img src={staricon} alt="star" />
            <img src={staricon} alt="star" />
            <img src={staricon} alt="star" />
            <img src={staricon} alt="star" />
            <img src={staricon} alt="star" />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-poppins font-semibold text-[14px] text-base text-[#343079]">Endorsement</label>
          <textarea className="w-full h-[156px] border border-[#C0BFD5] rounded-lg p-4 font-poppins text-[14px]" placeholder="Type your message here..."></textarea>
        </div>
        
        <button 
          onClick={onClose} 
          className="w-[150px] h-12 bg-[#343079] text-white font-semibold rounded-lg self-center"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;