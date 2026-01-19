import React, { useState, useRef } from "react";
import { FiArrowLeft } from "react-icons/fi";
import studioImage from "../../../assets/Showcase/studio-image.jpg";
import bgImage from "../../../assets/Showcase/showcase-bg-main.jpg";
import { useNavigate } from "react-router-dom";
import processStepsData from "./processStepsData";
import VideoRecordingSteps from "./VideoRecordingSteps";
import VideoUploadForm from "./VideoUploadForm";

const VideoUploadPage = () => {
  const navigate = useNavigate();
  const [option, setOption] = useState("record"); // default to "record"

  const sectionRef = useRef(null); // Ref for scrolling

  const handleOptionChange = (selectedOption) => {
    setOption(selectedOption);
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      {/* ⬆️ Hero Section */}
      <div
        className="bg-cover bg-center flex items-center justify-center px-4 py-8"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="w-full max-w-8xl p-4 ml-10 mr-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
          {/* Left Content */}
          <div className="flex-1 text-white">
            <button
              className="flex items-center text-blue-900 font-medium mb-4"
              onClick={() => navigate(-1)}
            >
              <FiArrowLeft className="mr-2" />
              Back
            </button>

            <h2 className="text-2xl md:text-3xl text-blue-900 font-bold mb-3">
              Record or Upload Your Video Now
            </h2>

            <p className="text-blue-900 text-base md:text-lg mb-8 mt-6">
              Choose how you’d like to create your video profile. Whether you
              prefer recording live or uploading a pre-recorded clip, we make it
              quick and easy for you to share your story.
            </p>

            <div className="flex gap-5 flex-wrap">
              <button
                onClick={() => handleOptionChange("record")}
                className={`${
                  option === "record"
                    ? "bg-indigo-900 text-white"
                    : "border border-blue-900 text-blue-900"
                } px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition`}
              >
                Record Your Video Profile
              </button>
              <button
                onClick={() => handleOptionChange("upload")}
                className={`${
                  option === "upload"
                    ? "bg-indigo-900 text-white"
                    : "border border-blue-900 text-blue-900"
                } px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition`}
              >
                Upload Your Video Profile
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center">
            <img
              src={studioImage}
              alt="Studio setup"
              className="w-full max-w-xl rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* ⬇️ Step Grid Section */}
      <div className="bg-white m-10 border border-gray-300 shadow rounded-lg px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-indigo-900 mb-10">
            Process to Showcase your Video Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-14 m-8">
            {processStepsData.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className={`${step.bgColor} p-7 rounded-lg relative shadow-sm group transition-all duration-300`}
                >
                  <div className="absolute top-0 -right-8 bg-indigo-900 text-white px-3 py-1 text-sm font-medium rounded-tr-lg rounded-br-lg transition-transform duration-300 group-hover:scale-110">
                    {step.step}
                  </div>

                  <div className="text-blue-900 text-4xl mb-6">
                    <Icon />
                  </div>
                  <h4 className="font-semibold text-md text-blue-900 mb-4">
                    {step.title}
                  </h4>
                  <p className="text-sm text-blue-900">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ⬇️ Record/Upload Choice Section */}
      <div
        className="bg-white m-10 border border-gray-300 shadow rounded-lg px-8 py-12"
        ref={sectionRef}
      >
        <div className="max-w-8xl mx-auto flex flex-col items-center">
          <div className="flex p-10 pb-2 w-full gap-8 justify-center">
            <button
              onClick={() => handleOptionChange("record")}
              className={`flex-1 py-6 rounded-lg border-2 font-semibold text-lg transition ${
                option === "record"
                  ? "bg-indigo-200 border-indigo-900 text-indigo-900"
                  : "hover:bg-indigo-100 border-indigo-900 text-indigo-900"
              }`}
            >
              Record Live Video
            </button>
            <button
              onClick={() => handleOptionChange("upload")}
              className={`flex-1 py-6 rounded-lg border-2 font-semibold text-lg transition ${
                option === "upload"
                  ? "bg-indigo-200 border-indigo-900 text-indigo-900"
                  : "hover:bg-indigo-100 border-indigo-900 text-indigo-900"
              }`}
            >
              Upload Video File
            </button>
          </div>

          {/* Conditionally render content */}
          <div className="w-full">
            {option === "record" && <VideoRecordingSteps />}
            {option === "upload" && <VideoUploadForm />}
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoUploadPage;
