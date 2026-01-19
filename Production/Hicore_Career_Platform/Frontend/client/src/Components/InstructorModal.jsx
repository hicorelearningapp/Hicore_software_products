import React from "react";
import closeIcon from "../assets/close.png";

const InstructorModal = ({ instructor, onClose }) => {
  if (!instructor) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex justify-center items-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-8 shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <img
          src={closeIcon}
          alt="close"
          onClick={onClose}
          className="absolute top-4 right-4 w-6 h-6 cursor-pointer"
        />

        <h3 className="text-[24px] font-semibold text-[#343079] mb-6 text-center">
          Meet Your Mentor
        </h3>

        {/* Profile Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
          {instructor.profileImage ? (
            <img
              src={instructor.profileImage}
              alt={instructor.name}
              className="w-36 h-36 rounded-full object-cover border-2 border-[#343079]"
            />
          ) : (
            <div className="w-36 h-36 rounded-full border-2 border-[#343079] bg-[#EBEAF2] flex items-center justify-center text-[#343079] font-semibold">
              {instructor.name?.charAt(0) || "I"}
            </div>
          )}

          <div className="flex-1">
            <h4 className="text-[20px] font-semibold text-[#343079]">
              {instructor.name}
            </h4>
            <p className="text-[#62616B] text-[15px] font-medium">
              {instructor.title}
              {instructor.experience ? ` • ${instructor.experience}` : ""}
            </p>

            {instructor.summary && (
              <p className="text-[#4B4A55] text-[15px] mt-3 leading-[26px] whitespace-pre-line">
                {instructor.summary}
              </p>
            )}
          </div>
        </div>

        {/* Education */}
        {Array.isArray(instructor.education) &&
          instructor.education.length > 0 && (
            <div className="mb-5">
              <h5 className="text-[18px] font-semibold text-[#343079] mb-2">
                Education
              </h5>
              <ul className="list-disc list-inside text-[#4B4A55] text-[15px] leading-[26px]">
                {instructor.education.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

        {/* Expertise */}
        {Array.isArray(instructor.expertise) &&
          instructor.expertise.length > 0 && (
            <div className="mb-5">
              <h5 className="text-[18px] font-semibold text-[#343079] mb-2">
                Expertise
              </h5>
              <div className="flex flex-wrap gap-2">
                {instructor.expertise.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#EBEAF8] text-[#343079] text-[14px] rounded-md"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Highlights */}
        {Array.isArray(instructor.highlights) &&
          instructor.highlights.length > 0 && (
            <div className="mb-5">
              <h5 className="text-[18px] font-semibold text-[#343079] mb-2">
                Highlights
              </h5>
              <ul className="list-disc list-inside text-[#4B4A55] text-[15px] leading-[26px]">
                {instructor.highlights.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

        {/* Key Strengths */}
        {Array.isArray(instructor.keyStrengths) &&
          instructor.keyStrengths.length > 0 && (
            <div className="mb-5">
              <h5 className="text-[18px] font-semibold text-[#343079] mb-2">
                Key Strengths
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {instructor.keyStrengths.map((item, index) => (
                  <div
                    key={index}
                    className="border border-[#C0BFD5] rounded-md p-3 text-[#4B4A55] text-[15px]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Certifications */}
        {Array.isArray(instructor.certifications) &&
          instructor.certifications.length > 0 && (
            <div className="mb-5">
              <h5 className="text-[18px] font-semibold text-[#343079] mb-2">
                Certifications
              </h5>
              <div className="flex flex-wrap gap-2">
                {instructor.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#E8F6FF] text-[#005A8D] border border-[#A8D9FF] text-[14px] rounded-md"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Final Statement */}
        {instructor.overall && (
          <p className="text-[#343079] font-medium text-[15px] border-t pt-4 mt-4 leading-[24px]">
            {instructor.overall}
          </p>
        )}
      </div>
    </div>
  );
};

export default InstructorModal;
