import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const QuickFitCheck = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = () => {
    setShowModal(true);
  };

  return (
    <div className="min-h-screen font-[Poppins] bg-white flex flex-col items-center px-4 sm:px-10 py-8 relative">
      {/* Back Button */}
      <div className="w-full max-w-6xl mb-6">
        <div
          className="flex items-center gap-2 text-[#343079] text-sm font-medium cursor-pointer"
          onClick={() => navigate("/quick-apply")}
        >
          <FaArrowLeft className="text-[14px]" />
          <span>Back</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-6xl border border-[#D6D6D6] rounded-lg px-6 sm:px-10 py-10">
        <h2 className="text-center text-[#343079] text-lg sm:text-xl font-semibold">
          Final Step: Quick Fit Check
        </h2>
        <p className="text-center text-[#6C6C6C] text-sm mt-2">
          Answer a few short questions to complete your application.
        </p>

        {/* Questions */}
        <div className="mt-8 flex flex-col gap-4 text-sm text-[#343079]">
          <div className="bg-[#EEF5FF] rounded-md p-6">
            <p className="font-semibold mb-4">Do you have a working laptop and internet</p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="laptop" />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="laptop" />
                No
              </label>
            </div>
          </div>

          <div className="bg-[#EEF5FF] rounded-md p-6">
            <p className="font-semibold mb-4">Are You Available to Start the Internship?</p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="availability" />
                Yes, I’m available to join immediately
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="availability" />
                No, I’d like to specify my availability
              </label>
            </div>
          </div>

          <div className="bg-[#EEF5FF] rounded-md p-6">
            <p className="font-semibold mb-4">Why are you interested in this internship?</p>
            <textarea
              className="w-full min-h-[120px] p-4 border border-[#C0BFD5] rounded-md resize-none text-sm text-[#343079]"
              placeholder="Type your response here."
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            className="bg-[#343079] text-white text-sm rounded-md px-6 py-2 transition"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>

      {/* ✅ Success Modal */}
      {showModal && (
        <div className="fixed top-10 left-0 w-full flex justify-center z-50">
          <div className="w-[786px] h-[376px] bg-white rounded-[8px] p-[64px] flex flex-col items-center justify-between">
          <div className="w-[658px] h-[172px] flex flex-col gap-[16px] text-center text-[#343079]">  
            <h2 className="text-[#008000] font-bold text-xl mb-2">
              Application Submitted Successfully 🎉
            </h2>
            <p className="text-[#343079] mb-4">
              Thank you! Your application has been submitted.
            </p>
            <p className="text-[#343079] mb-6">
              Our team and the employer will review your resume and responses. You’ll be notified
              via email and your dashboard when there’s an update.
            </p>
        </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="bg-[#343079] text-white px-6 py-2 rounded-md"
              >
                Go to Dashboard
              </button>
              <button
                className="border border-[#343079] hover:bg-[#8F88F9] cursor-pointer text-[#343079] px-6 py-2 rounded-md"
                onClick={() => navigate("/browse-open-internships")}
              >
                View More Internships
              </button>
            </div>
          </div>
        </div>

      )}
    </div>
  );
};

export default QuickFitCheck;
