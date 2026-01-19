import React from "react";

const InstructorCard = ({ instructor, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 cursor-pointer border border-[#C0BFD5] rounded-lg 
                 hover:shadow-md hover:bg-[#F7F6FF] transition-all duration-300"
    >
      {/* Profile Image */}
      {instructor.profileImage ? (
        <img
          src={instructor.profileImage}
          alt={instructor.name}
          className="w-14 h-14 rounded-full object-cover border border-[#343079]"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-[#EBEAF2] border border-[#343079] flex items-center justify-center text-[#343079] font-semibold">
          {instructor.name?.charAt(0) || "I"}
        </div>
      )}

      {/* Name + Title */}
      <div className="flex flex-col">
        <h4 className="text-[16px] font-semibold text-[#343079] leading-tight">
          {instructor.name}
        </h4>
        {instructor.title && (
          <p className="text-[13px] text-[#62616B] mt-1 leading-tight">
            {instructor.title}
          </p>
        )}
      </div>
    </div>
  );
};

export default InstructorCard;
