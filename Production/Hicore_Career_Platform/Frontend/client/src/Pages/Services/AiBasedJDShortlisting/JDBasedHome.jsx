import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ React Router navigation

// Backgrounds
import bgImage from "../../../assets/JDBaesdAi/main-bg.jpg";
import innerImage from "../../../assets/JDBaesdAi/main-bg-inner.jpg";

// Icons
import timeIcon from "../../../assets/JDBaesdAi/time.png";
import accuracyIcon from "../../../assets/JDBaesdAi/Target.png";
import biasIcon from "../../../assets/JDBaesdAi/Sort.png";
import hiresIcon from "../../../assets/JDBaesdAi/Flash.png";

// Benefits Images
import urgentHiringImg from "../../../assets/JDBaesdAi/card-image-one.jpg";
import nicheRolesImg from "../../../assets/JDBaesdAi/card-image-two.jpg";
import bulkHiringImg from "../../../assets/JDBaesdAi/card-image-four.jpg";
import passiveSearchImg from "../../../assets/JDBaesdAi/card-image-three.jpg";

// Bottom Section images
import bottomBgImage from "../../../assets/JDBaesdAi/bottom-bg.jpg";
import bottomInnerImage from "../../../assets/JDBaesdAi/bottom-bg-inner.png";

const JDBasedHome = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* ✅ Top Section */}
      <div
        className="w-full bg-cover bg-center py-16 px-6 md:px-20 md:pt-10 md:pb-10 flex justify-between items-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Left Section - Text */}
        <div className="max-w-2xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#343079] mb-8">
            AI-Powered JD Shortlisting —{" "}
            <span className="text-[#343079]">Hire Smarter, Faster</span>
          </h2>
          <p className="text-blue-900 text-lg mb-8">
            Instantly match your job description with the most qualified
            candidates — saving you hours of manual screening.
          </p>
          <button
            onClick={() => navigate("/hiring")}
            className="bg-[#343079] text-white w-full mt-2 font-medium py-3 px-6 rounded-md hover:bg-[#2a2561] transition"
          >
            Start Shortlisting Now
          </button>
        </div>

        {/* Right Section - Image */}
        <div className="hidden md:block ml-10">
          <img
            src={innerImage}
            alt="JD Shortlisting"
            className="rounded-xl shadow-md w-[540px]"
          />
        </div>
      </div>

      {/* ✅ Why Use This Service Section */}
      <div className="w-full px-6 md:px-10 py-16">
        <div className="border border-[#ddd] rounded-xl p-8 bg-white">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-[#343079] mb-10">
            Why Use This Service
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="border border-blue-900 rounded-lg p-10 bg-[#f8f7ff] hover:shadow-xl transition">
              <img src={timeIcon} alt="Save Time" className="w-12 h-12 mb-4" />
              <h3 className="font-bold text-[#343079] text-lg mb-3">
                Save Time
              </h3>
              <p className="text-blue-900 text-md">
                Reduce hours of screening into minutes with automated ranking.
              </p>
            </div>

            {/* Card 2 */}
            <div className="border border-blue-900 rounded-lg p-10 bg-[#fffbea] hover:shadow-xl transition">
              <img
                src={accuracyIcon}
                alt="Accuracy at Scale"
                className="w-12 h-12 mb-4"
              />
              <h3 className="font-bold text-[#343079] text-lg mb-3">
                Accuracy at Scale
              </h3>
              <p className="text-blue-900 text-md">
                AI ensures you never miss a strong candidate buried in a pile.
              </p>
            </div>

            {/* Card 3 */}
            <div className="border border-blue-900 rounded-lg p-10 bg-[#eef4ff] hover:shadow-xl transition">
              <img
                src={biasIcon}
                alt="Bias Reduction"
                className="w-12 h-12 mb-4"
              />
              <h3 className="font-bold text-[#343079] text-lg mb-3">
                Bias Reduction
              </h3>
              <p className="text-blue-900 text-md">
                Objective matching based on skills & experience, not subjective
                factors.
              </p>
            </div>

            {/* Card 4 */}
            <div className="border border-blue-900 rounded-lg p-10 bg-[#eaffea] hover:shadow-xl transition">
              <img
                src={hiresIcon}
                alt="Better Hires"
                className="w-12 h-12 mb-4"
              />
              <h3 className="font-bold text-[#343079] text-lg mb-3">
                Better Hires, Faster
              </h3>
              <p className="text-blue-900 text-md">
                Shortlist only the top fit candidates for your JD.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Benefits Section */}
      <div className="max-w-8xl m-10 mt-0 border border-gray-200 rounded-md p-10 py-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#2b2b5f] mb-10">
          Benefits of the Service
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10">
          {/* Urgent Hiring */}
          <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <img
              src={urgentHiringImg}
              alt="Urgent Hiring"
              className="w-full h-84 object-cover object-contain"
            />
            <div className="p-6 bg-[#fff8f0]">
              <h3 className=" text-2xl font-semibold text-blue-900 mb-3 mt-4">
                Urgent Hiring
              </h3>
              <p className="text-blue-900 mt-8 text-md">
                Fill critical positions quickly
              </p>
            </div>
          </div>

          {/* Niche Roles */}
          <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <img
              src={nicheRolesImg}
              alt="Niche Roles"
              className="w-full h-84 object-cover object-contain"
            />
            <div className="p-6 bg-[#fff8f0]">
              <h3 className="text-2xl font-semibold text-blue-900 mb-3 mt-4">
                Niche Roles
              </h3>
              <p className="text-blue-900 mt-8 text-md">
                Identify rare skill sets instantly
              </p>
            </div>
          </div>

          {/* Bulk Hiring */}
          <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <img
              src={bulkHiringImg}
              alt="Bulk Hiring"
              className="w-full h-84 object-cover object-contain"
            />
            <div className="p-6 bg-[#fff8f0]">
              <h3 className="text-2xl font-semibold text-blue-900 mb-3 mt-4">
                Bulk Hiring
              </h3>
              <p className="text-blue-900 mt-8 text-md">
                Manage thousands of resumes without being overwhelmed.
              </p>
            </div>
          </div>

          {/* Passive Search */}
          <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <img
              src={passiveSearchImg}
              alt="Passive Search"
              className="w-full h-84 object-cover object-contain"
            />
            <div className="p-6 bg-[#fff8f0]">
              <h3 className="text-2xl font-semibold text-blue-900 mb-3 mt-4">
                Passive Search
              </h3>
              <p className="text-blue-900 mt-8 text-md">
                Maintain high standards across multiple hires.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Bottom Section */}
      <div className="m-10 border md:h-110 border-gray-200 p-10 rounded-md">
        <div
          className="w-full md:h-90 rounded-lg overflow-hidden"
          style={{
            backgroundImage: `url(${bottomBgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col md:flex-row items-center px-20 py-8 md:py-12 rounded-lg">
            {/* Left Side */}
            <div className="md:w-[45%]">
              <h2 className="text-xl md:text-3xl mt-8 font-bold mb-6 text-[#2b2b5f]">
                Cut Screening time by 70%
              </h2>
              <p className="mb-6 text-lg text-[#2b2b5f]">
                Leverage our smart AI-powered platform to hire efficiently.
              </p>
              <button
                onClick={() => navigate("/hiring")}
                className="bg-[#2b2b5f] w-full hover:bg-[#1e1e3f] transition text-white px-5 py-2 rounded-md"
              >
                Start Hiring
              </button>
            </div>

            {/* Right Side */}
            <div className="md:w-[55%] flex justify-end mt-6 md:mt-0">
              <img
                src={bottomInnerImage}
                alt="Talent Search"
                className="h-72 md:h-70 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JDBasedHome;
