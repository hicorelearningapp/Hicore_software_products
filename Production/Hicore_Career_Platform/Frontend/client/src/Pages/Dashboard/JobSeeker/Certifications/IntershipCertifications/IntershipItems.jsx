import React from 'react';
import {
  FaMapMarkerAlt,
  FaMoneyBillAlt,
  FaCalendarAlt,
} from 'react-icons/fa';
import Save from "../../../../../assets/Save.png";

const InternshipItems = ({ job, onClick, isSelected }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 mb-4 rounded-xl border cursor-pointer transition-all font-[Poppins] ${
        isSelected ? 'bg-[#f3f3f3] border-[#343079]' : 'bg-white border-[#E6E6E6]'
      } shadow-sm hover:shadow-md`}
    >
      {/* Wrapper for responsiveness */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Left Section */}
        <div className="flex-1">
          <h3 className="text-[#343079] font-semibold text-base md:text-lg mb-1">{job.title}</h3>
          <p className="text-sm text-[#3B82F6] font-medium mb-2">{job.company}</p>

          {/* Duration & Stipend */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-[#343079]">
            <FaCalendarAlt className="text-xs" />
            <span>{job.duration}</span>
            <FaMoneyBillAlt className="text-xs ml-3" />
            <span>{job.stipend}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-[#343079] mt-1">
            <FaMapMarkerAlt className="text-xs" />
            <span>{job.location}</span>
          </div>
        </div>

        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src={job.logo}
            alt={job.company}
            className="h-10 w-10 object-contain"
          />
        </div>
      </div>

      {/* Posted date and Save icon */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-[12px] text-[#A0A0A0]">Posted {job.postedAgo}</p>
        <img src={Save} alt="save" className="h-5 w-5 object-contain" />
      </div>
    </div>
  );
};

export default InternshipItems;
