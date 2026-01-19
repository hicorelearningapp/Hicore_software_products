import React from "react";
import Save from "../../../assets/Save.png";
import {
  FaCalendarAlt,
  FaMoneyBillAlt,
  FaUserGraduate,
  FaRegClock,
  FaGlobe,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaRocket,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const InternshipDetail = ({ job }) => {
  if (!job)
    return (
      <div className="p-4 text-gray-500 font-[Poppins] text-sm">
        Select a job to view details.
      </div>
    );

  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[796.7px] bg-white border border-[#343079] rounded-lg p-9 font-[Poppins] text-[#343079] overflow-x-hidden">
      {/* Header */}
      <div className="w-full mb-7">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <img
              src={job.logo}
              alt={job.company}
              className="h-10 w-10 object-contain"
            />
            <div>
              <h2 className="text-[20px] font-semibold mb-1">
                Title: {job.title}
              </h2>
              <p className="text-sm text-[#3B82F6]">{job.company}</p>
            </div>
          </div>
          <img src={Save} alt="save" className="h-5 w-5 object-contain mt-1" />
        </div>

        {/* Posted info */}
        <div className="mt-1 flex gap-8 text-[12px] leading-6 text-[#A4A2B3] font-normal w-fit">
          <span>Posted {job.postedAgo}</span>
          <span>Over {job.applicants}</span>
        </div>

        {/* Internship Info */}
        <div className="flex flex-wrap gap-6 mt-3 text-sm text-[#343079] items-center">
          <div className="flex items-center gap-2">
            <FaCalendarAlt />
            <span>{job.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMoneyBillAlt />
            <span>{job.stipend}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUserGraduate />
            <span>Eligibility: {job.eligibility}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaRegClock />
            <span>Apply Before: {job.applyBy}</span>
          </div>
        </div>

        {/* Website & Location */}
        <div className="mt-2 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <FaGlobe className="text-[#343079]" />
            <span className="text-blue-600">{job.website}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#343079]" />
            <span>{job.location}</span>
          </div>
        </div>

        {/* Tags + Quick Apply */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-wrap gap-2">
            {job.tags?.map((tag, idx) => {
              const tagClasses =
                idx === 0
                  ? "bg-[#69AAFF] text-white"
                  : "bg-[#E8FFDD] text-[#008000]";
              return (
                <span
                  key={idx}
                  className={`text-xs px-3 py-1 rounded-full ${tagClasses}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
          <button
            onClick={() => navigate("/quick-apply")}
            className="ml-auto px-5 py-2 text-sm bg-[#343079] text-white rounded-md hover:bg-[#2c276a] transition"
          >
            Quick Apply
          </button>
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="w-full h-px bg-[#343079] opacity-100 mt-4"></div>

      {/* Skills Section */}
      <div className="w-full bg-white p-4 pb-2 space-y-2 rounded">
        <h3 className="text-[#343079] font-semibold text-base">
          Required Skills Set
        </h3>
        <div className="flex items-center text-sm text-[#343079] mb-1">
          <span className="mr-2">✨</span>
          <span>3 out of 3 preferred skills are a match</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {job.skillsMatched?.map((skill, idx) => (
            <span
              key={idx}
              className="bg-[#E8FFDD] text-green-700 text-sm px-4 py-1.5 rounded-full flex items-center gap-1"
            >
              <FaCheckCircle className="text-green-600 text-xs" />
              {skill}
            </span>
          ))}
        </div>

        {/* Enroll Banner */}
        <div className="w-full bg-[#FBEAFF] rounded-xl mt-4 flex justify-between items-center px-5 py-3 mb-7">
          <div className="flex items-center text-[#343079] text-sm font-medium">
            <FaRocket className="text-[#343079] mr-2" />
            Missing Some Skills? Enroll & Level Up Today!
          </div>
          <button
            onClick={() => navigate("/courses")}
            className="bg-[#343079] text-white text-sm px-4 py-2 rounded-md hover:bg-[#2c276a] transition"
          >
            Enroll Now
          </button>
        </div>
      </div>

      {/* About Company */}
      <div className="mb-7">
        <h3 className="font-semibold text-[16px]">About {job.company}</h3>
        <p className="text-sm mt-1 text-[#343079]">{job.about}</p>
      </div>

      {/* Overview */}
      <div className="mb-7">
        <h3 className="font-semibold text-[16px]">Internship Overview</h3>
        <p className="text-sm mt-1 text-[#343079]">{job.overview}</p>
      </div>

      {/* Who Can Apply */}
      <div className="mb-7">
        <h3 className="font-semibold text-[16px]">Who can apply</h3>
        <ul className="list-disc list-inside text-sm text-[#343079]">
          {job.whoCanApply?.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>

      {/* Must-Have Skills */}
      <div className="mb-7">
        <h3 className="font-semibold text-[16px]">Must-Have Skills</h3>
        <ul className="list-disc list-inside text-sm text-[#343079]">
          {job.mustHaveSkills?.map((skill, idx) => (
            <li key={idx}>{skill}</li>
          ))}
        </ul>
      </div>

      {/* Perks */}
      <div className="mb-7 w-full">
        <h3 className="font-semibold text-base text-[#343079]">Perks</h3>
        <div className="flex gap-3 mt-2 flex-wrap">
          {[
            "Certificate",
            "Letter of recommendation",
            "Flexible work hours",
          ].map((perk, idx) => (
            <span
              key={idx}
              className="bg-[#E8FFDD] text-[#008000] text-sm px-4 py-1.5 rounded-full flex items-center gap-2"
            >
              <FaCheckCircle className="text-[#008000] text-xs" />
              {perk}
            </span>
          ))}
        </div>
      </div>

      {/* How to Apply */}
      <div className="mb-5">
        <h3 className="font-semibold text-[16px]">How to Apply</h3>
        <p className="text-sm text-[#343079] mt-1">
          Click on <b>Quick Apply.</b> Shortlisted candidates will be contacted
          within 48 hours.
        </p>
      </div>

      {/* Ask Question */}
      <div className="mt-5">
        <textarea
          placeholder="Type your problem here and submit it."
          className="w-full border border-[#ccc] rounded p-2 text-sm"
          rows={3}
        />
        <button className="mt-3 px-5 py-2 text-sm bg-[#D22F2F] text-white rounded hover:bg-[#b72929] transition">
          Submit
        </button>
      </div>
    </div>
  );
};

export default InternshipDetail;
