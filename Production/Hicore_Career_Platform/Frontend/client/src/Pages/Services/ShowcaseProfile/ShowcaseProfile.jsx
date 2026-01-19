import React from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../../assets/Showcase/showcase-bg-main.jpg";
import videoProfileImage from "../../../assets/Showcase/showcase-inner-one.jpg";
import includeVideoIcon from "../../../assets/Showcase/target-one.png";
import tipsVideoIcon from "../../../assets/Showcase/star.png";
import afterUploadBg from "../../../assets/Showcase/showcase-botton-bg.jpg";
import showcaseReasonsData from "./showcaseReasonsData";
import { FaCheckCircle, FaArrowCircleRight } from "react-icons/fa";

const ShowcaseProfile = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Top Section */}
      <div
        className="w-full bg-cover bg-center py-16 px-6 md:px-16"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
          {/* Text Content */}
          <div className="text-left max-w-xl text-gray-800">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
              Bring Your Profile to Life
            </h2>
            <p className="text-base md:text-lg mb-6 text-blue-900">
              Let your personality, passion, and potential shine through! Our
              Showcase Video Profile feature gives you the power to present
              yourself beyond a resume – in your own words, voice, and style.
            </p>
            <p className="italic text-sm md:text-base mb-6 text-blue-900">
              Whether you’re a student, job seeker, mentor, or freelancer,
              create a compelling video introduction to stand out and make real
              human connections.
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="mt-6 bg-indigo-900 hover:bg-indigo-800 text-white font-medium py-3 px-6 rounded-md transition w-full"
            >
              Showcase Your Video Profile
            </button>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2">
            <img
              src={videoProfileImage}
              alt="Video Profile"
              className="rounded-md shadow-md w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Why Create Section */}
      <div className="bg-white m-10 shadow shadow-gray-300 border border-gray-300 rounded-lg py-16 px-6 md:px-16">
        <h3 className="text-center text-2xl md:text-3xl font-bold text-blue-900 mb-12">
          Why Create a Video Profile?
        </h3>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {showcaseReasonsData.map((reason) => (
            <div
              key={reason.id}
              className={`border border-blue-900 flex flex-col items-start rounded-lg p-6 shadow-sm ${reason.bgColor} 
                    transform transition duration-300 hover:scale-105`}
            >
              <img
                src={reason.icon}
                alt={reason.title}
                className="w-10 h-10 mb-4"
              />
              <h4 className="font-semibold text-lg text-blue-900 mb-2">
                {reason.title}
              </h4>
              <p className="text-md text-blue-900 mb-4">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What to Include / Tips Section */}
      <div className="max-w-8xl md:m-8 md:mb-10 grid grid-cols-1 md:grid-cols-2 gap-9 px-2">
        {/* What to Include */}
        <div className="border border-gray-300 shadow-md rounded-xl p-10">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={includeVideoIcon}
              alt="Include Icon"
              className="w-10 h-10"
            />
            <h3 className="text-lg md:text-2xl font-bold text-blue-900">
              What to Include in Your Video?
            </h3>
          </div>
          <ul className="space-y-3 mt-8 text-blue-900 text-lg md:ml-4">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-600 mt-1" />
              <span>
                <strong>Who you are</strong> – Name, background, and what you’re
                passionate about.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-600 mt-1" />
              <span>
                <strong>Your skills and achievements</strong> – Highlight key
                accomplishments or projects.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-600 mt-1" />
              <span>
                <strong>Your goals</strong> – What roles, industries, or
                collaborations you're looking for.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-600 mt-1" />
              <span>
                <strong>Why you?</strong> – What sets you apart from others in
                your field?
              </span>
            </li>
          </ul>
        </div>

        {/* Tips Section */}
        <div className="border border-gray-300 shadow-md rounded-xl p-10">
          <div className="flex items-center gap-3 mb-4">
            <img src={tipsVideoIcon} alt="Tips Icon" className="w-10 h-10" />
            <h3 className="text-lg md:text-2xl font-bold text-blue-900">
              Tips for a Great Video
            </h3>
          </div>
          <ul className="space-y-3 mt-8 text-blue-900 text-lg md:ml-4">
            <li className="flex items-start gap-2">
              <FaArrowCircleRight className="text-green-600 mt-1" />
              <span>Stand in a well-lit area with a clean background</span>
            </li>
            <li className="flex items-start gap-2">
              <FaArrowCircleRight className="text-green-600 mt-1" />
              <span>Speak clearly and confidently</span>
            </li>
            <li className="flex items-start gap-2">
              <FaArrowCircleRight className="text-green-600 mt-1" />
              <span>Use your phone or webcam (no fancy equipment needed)</span>
            </li>
            <li className="flex items-start gap-2">
              <FaArrowCircleRight className="text-green-600 mt-1" />
              <span>Dress professionally</span>
            </li>
            <li className="flex items-start gap-2">
              <FaArrowCircleRight className="text-green-600 mt-1" />
              <span>
                Edit lightly if needed (trim, captions, background music)
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* What Happens After Upload Section */}
      <div className="max-w-8xl m-10 p-10 bg-white rounded-xl shadow-lg border border-gray-200">
        <div
          className="mx-auto rounded-xl p-10 bg-cover bg-no-repeat bg-center shadow-md"
          style={{ backgroundImage: `url(${afterUploadBg})` }}
        >
          <h3 className="text-center text-xl md:text-2xl font-bold text-blue-900 mb-10">
            What Happens After Upload?
          </h3>

          <div className="grid md:grid-cols-2 gap-6 items-center text-blue-900">
            <div className="space-y-4 text-base md:text-lg">
              <p className="flex items-start gap-2">
                <span className="text-green-400 text-xl">➜</span>
                Our team reviews and approves the content for quality.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-400 text-xl">➜</span>
                It appears on your public profile for companies, mentors, or
                collaborators to view.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-400 text-xl">➜</span>
                You can also share your video link in job or mentorship
                applications.
              </p>
            </div>

            <div className="text-center space-y-6">
              <p className="text-blue-900 font-medium text-lg md:text-2xl">
                Your story deserves to be heard –<br />
                <span className="font-medium">and seen.</span>
              </p>
              <button
                onClick={() => navigate("/upload")}
                className="bg-indigo-900 hover:bg-indigo-800 text-white w-90 font-semibold py-3 px-6 rounded-md"
              >
                Showcase Your Video Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseProfile;
