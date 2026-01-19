import React from "react";

import projectImg from "../../../../assets/MentorProjects/ongoing-image.png";

import bookmarkIcon from "../../../../assets/MentorProjects/Save.png";
import chatIcon from "../../../../assets/MentorProjects/message.png";
import downloadIcon from "../../../../assets/MentorProjects/Download.png";

import profile1 from "../../../../assets/MentorProjects/Approved-Project-image-one.jpg";
import profile2 from "../../../../assets/MentorProjects/Approved-Project-image-two.jpg";
import profile3 from "../../../../assets/MentorProjects/Approved-Project-image-three.jpg";
import profile4 from "../../../../assets/MentorProjects/Approved-Project-image-four.jpg";

import arrowIcon from "../../../../assets/MentorProjects/Circlearrow.png";

const projects = [
  {
    id: 1,
    title: "AI Career Guidance Chatbot",
    mentee: "Ananya Sharma",
    snapshot: "NLP fine-tuning + deployment",
    feedback: "None yet",
    img: projectImg,
  },
  {
    id: 2,
    title: "Data Analytics Dashboard",
    mentee: "Rohan Iyer",
    snapshot: "Advanced SQL + Visualization tasks",
    feedback: "Initial review given on Aug 10, 2025",
    img: projectImg,
  },
  {
    id: 3,
    title: "AI Career Guidance Chatbot",
    mentee: "Ananya Sharma",
    snapshot: "NLP fine-tuning + deployment",
    feedback: "None yet",
    img: projectImg,
  },
];

const feedbackHistory = [
  {
    id: 1,
    name: "Ananya Sharma",
    project: "AI Career Guidance Chatbot",
    date: "Aug 7, 2025",
    img: profile1,
  },
  {
    id: 2,
    name: "Ananya Sharma",
    project: "AI Career Guidance Chatbot",
    date: "Aug 7, 2025",
    img: profile2,
  },
  {
    id: 3,
    name: "Ananya Sharma",
    project: "AI Career Guidance Chatbot",
    date: "Aug 7, 2025",
    img: profile3,
  },
  {
    id: 4,
    name: "Ananya Sharma",
    project: "AI Career Guidance Chatbot",
    date: "Aug 7, 2025",
    img: profile4,
  },
];

const ReviewAndFeedback = () => {
  return (
    <div className="mt-6">
      {/* 🔹 Pending Review Section (unchanged) */}
      <h2 className="text-2xl font-semibold text-blue-900 mb-4">
        Pending Review
      </h2>
      <hr className="border-blue-900 mb-7" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md p-5 border border-gray-300 hover:shadow-lg transition flex flex-col"
          >
            <img
              src={item.img}
              alt={item.title}
              className="rounded-lg mb-4 w-full h-50 object-cover"
            />

            <div className="flex items-center gap-3 mb-4">
              <img
                src={bookmarkIcon}
                alt="bookmark"
                className="w-6 h-6 cursor-pointer"
              />
              <img
                src={chatIcon}
                alt="chat"
                className="w-5 h-5 cursor-pointer"
              />
              <img
                src={downloadIcon}
                alt="download"
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            <span className="bg-[#E9E6FF] text-[#4B3BC0] text-sm px-4 py-2 rounded-full w-fit mb-3">
              In Progress
            </span>

            <h3 className="text-lg font-bold text-blue-900 mb-4">
              {item.title}
            </h3>
            <p className="text-sm text-blue-900 mb-4">
              <strong>Mentee Name:</strong> {item.mentee}
            </p>
            <p className="text-sm text-blue-900 mb-4">
              <strong>Snapshot:</strong> {item.snapshot}
            </p>
            <p className="text-sm text-blue-900 mb-4">
              <strong>Feedback History:</strong> {item.feedback}
            </p>

            <button className="mt-auto bg-blue-900 text-white text-sm py-2 rounded-lg font-medium hover:bg-blue-800 transition">
              Write Feedback
            </button>
          </div>
        ))}
      </div>

      {/* 🔹 Review/Feedback History Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">
          Review/Feedback History
        </h2>
        <hr className="border-blue-900 mb-7" />

        <div className="flex flex-col gap-2">
          {feedbackHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white rounded-xl p-3 "
            >
              {/* Left Side: Profile + Text */}
              <div className="flex items-center gap-4">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-base font-semibold text-blue-900">
                    {item.name}{" "}
                    <span className="font-normal">- {item.project}</span>
                  </h3>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>
              </div>

              {/* Right Side: Arrow */}
              <img
                src={arrowIcon}
                alt="arrow"
                className="w-4 h-4 opacity-70 hover:opacity-100 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewAndFeedback;
