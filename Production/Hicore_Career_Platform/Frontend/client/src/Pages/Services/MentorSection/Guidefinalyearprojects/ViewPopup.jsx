// src/components/ViewPopupScreen.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../../../../assets/GuideFinalyearproject/back.png';
import arrowIcon from '../../../../assets/GuideFinalyearproject/double-arrow.png';
import folderIcon from '../../../../assets/GuideFinalyearproject/folder.png';
import jobIcon from '../../../../assets/GuideFinalyearproject/job-id.png';
import skillIcon from '../../../../assets/GuideFinalyearproject/skill.png';
import targetIcon from '../../../../assets/GuideFinalyearproject/target.png';
import calendarIcon from '../../../../assets/GuideFinalyearproject/calendar.png';
import interviewIcon from '../../../../assets/GuideFinalyearproject/interview.png';

const ViewPopup = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="w-full h-fit p-9 gap-9 opacity-100">
        {/* Back button */}
        <div
          className="w-[66px] h-6 flex gap-2 items-center cursor-pointer mt-2 mb-4"
          onClick={handleClose}
        >
          <img src={backIcon} alt="Back" className="w-6 h-6" />
          <span className="font-poppins font-normal text-base leading-6 text-[#343079]">
            Back
          </span>
        </div>

        <div className="w-full h-fit p-9 flex flex-col gap-4 opacity-100 rounded-lg border border-[#EBEAF2]">
          {/* Title and Uploaded Documents */}
          <div className="w-full h-fit flex items-center justify-between">
            <h2 className="font-poppins font-bold text-2xl leading-8 text-[#343079]">
              Ravi Sharma & Team Project Proposal
            </h2>
            <div className="flex items-center gap-2">
              <img src={folderIcon} alt="Folder" className="w-6 h-6" />
              <span className="font-poppins font-normal text-base leading-8 text-[#343079]">
                Uploaded Documents
              </span>
              <img src={arrowIcon} alt="Folder" className="w-6 h-6" />
            </div>
          </div>

          {/* Summary Preview */}
          <div className="w-full h-fit rounded-lg p-4 gap-4 border border-[#EBEAF2]">
            <div className="flex items-center gap-2 mb-2">
              <img src={jobIcon} alt="Job" className="w-6 h-6" />
              <h3 className="font-poppins font-bold text-base leading-8 text-[#343079]">
                Summary Preview
              </h3>
            </div>
            <p className="font-poppins font-normal text-sm leading-6 text-[#343079]">
              AI-based Resume Screening System to help HR departments shortlist candidates efficiently using Machine Learning algorithms. The project will focus on dataset preparation, model training, and Flask-based deployment.
            </p>
          </div>

          {/* Student Skills & Background and Expectations from Mentor */}
          <div className="w-full h-fit flex flex-col md:flex-row gap-4">
            <div className="w-full rounded-lg p-4 gap-4 border border-[#EBEAF2] bg-[#FDFFED]">
              <div className="flex items-center gap-2 mb-2">
                <img src={skillIcon} alt="Student Skills" className="w-6 h-6" />
                <h3 className="font-poppins font-bold text-base leading-8 text-[#343079]">
                  Student Skills & Background
                </h3>
              </div>
              <ul className="list-disc pl-5 font-poppins font-normal text-base leading-8 text-[#343079]">
                <li>Team Members: Ravi Sharma, Neha Patel</li>
                <li>Course: B.Tech, Final Year – Computer Science</li>
                <li>Skills Mentioned: Python, Flask, Pandas, Data Preprocessing, GitHub</li>
                <li>Self-assessment level: Intermediate</li>
              </ul>
            </div>
            <div className="w-full rounded-lg p-4 gap-4 border border-[#EBEAF2] bg-[#E8FFDD]">
              <div className="flex items-center gap-2 mb-2">
                <img src={targetIcon} alt="Expectations" className="w-6 h-6" />
                <h3 className="font-poppins font-bold text-base leading-8 text-[#343079]">
                  Expectations from Mentor
                </h3>
              </div>
              <p className="font-poppins font-normal text-base leading-8 text-[#343079]">
                We are seeking guidance in:
              </p>
              <ul className="list-disc pl-5 font-poppins font-normal text-base leading-8 text-[#343079]">
                <li>Structuring the project roadmap</li>
                <li>Improving our ML model accuracy</li>
                <li>Deployment best practices</li>
                <li>Weekly feedback on progress</li>
              </ul>
            </div>
          </div>

          {/* Deadlines / Milestones and Preferred Mentorship Mode */}
          <div className="w-full h-fit flex flex-col md:flex-row gap-4">
            <div className="w-full rounded-lg p-4 gap-4 border border-[#EBEAF2] bg-[#FDFFED]">
              <div className="flex items-center gap-2 mb-2">
                <img src={calendarIcon} alt="Deadlines" className="w-6 h-6" />
                <h3 className="font-poppins font-bold text-base leading-8 text-[#343079]">
                  Deadlines / Milestones
                </h3>
              </div>
              <p className="font-poppins font-normal text-base leading-8 text-[#343079]">
                Project Duration: 6 months
              </p>
              <p className="font-poppins font-bold text-base leading-8 text-[#343079]">
                Key Milestone
              </p>
              <ul className="list-disc pl-5 font-poppins font-normal text-base leading-8 text-[#343079]">
                <li>Proposal Review – Week 1</li>
                <li>Model Training – Month 2</li>
                <li>Deployment – Month 5</li>
                <li>Final Submission – Month 6</li>
              </ul>
            </div>
            <div className="w-full rounded-lg p-4 gap-4 border border-[#EBEAF2] bg-[#F3F3FB]">
              <div className="flex items-center gap-2 mb-2">
                <img src={interviewIcon} alt="Mentorship" className="w-6 h-6" />
                <h3 className="font-poppins font-bold text-base leading-8 text-[#343079]">
                  Preferred Mentorship Mode
                </h3>
              </div>
              <p className="font-poppins font-normal text-base leading-8 text-[#343079]">
                Online (Google Meet / Zoom) - Weekly Sessions
              </p>
            </div>
          </div>

          {/* Send a message to student */}
          <div className="w-full h-fit flex flex-col gap-2">
            <h3 className="font-poppins font-bold text-base leading-8 text-[#343079]">
              Send a message to student (optional)
            </h3>
            <textarea
              className="w-full h-[82px] p-2 border border-[#DAD8EE] rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#4631A1] font-poppins"
              placeholder="Add a feedback note / suggestions to improve / appreciation note..."
            />
            <button className="px-4 py-2 mt-4 rounded-lg bg-[#343079] text-white font-semibold self-start">
              Send
            </button>
          </div>
        </div>
      </div>
  );
};

export default ViewPopup;