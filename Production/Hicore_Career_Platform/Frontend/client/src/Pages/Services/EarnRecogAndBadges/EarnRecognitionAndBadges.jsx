import React from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../../assets/EarnAndBadges/header-bg-image.jpg";
import trophyImage from "../../../assets/EarnAndBadges/header-inner.jpg";

import timeIcon from "../../../assets/EarnAndBadges/learn.png";
import accuracyIcon from "../../../assets/EarnAndBadges/Eye.png";
import biasIcon from "../../../assets/EarnAndBadges/Growth.png";
import hiresIcon from "../../../assets/EarnAndBadges/Secure.png";

import urgentHiringImg from "../../../assets/EarnAndBadges/image-one.jpg";
import nicheRolesImg from "../../../assets/EarnAndBadges/image-two.jpg";
import bulkHiringImg from "../../../assets/EarnAndBadges/image-three.jpg";
import passiveSearchImg from "../../../assets/EarnAndBadges/image-four.jpg";

// Bottom Section images
import bottomBgImage from "../../../assets/EarnAndBadges/bottom-bg.jpg";
import bottomInnerImage from "../../../assets/EarnAndBadges/bottom-inner.png";

const EarnRecognitionAndBadges = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* ✅ Top Section (updated like your reference) */}
      <div
        className="w-full bg-cover bg-center py-16 px-6 md:px-20 md:pt-10 md:pb-10 flex justify-between items-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Left Section - Text */}
        <div className="max-w-2xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#343079] mb-8">
            Earn Recognition & Showcase Your Impact
          </h2>
          <p className="text-blue-900 text-lg mb-8">
            Every session you guide, every mock interview you host, and every
            project you support brings you closer to badges that highlight your
            expertise and dedication.
          </p>
          <button
            onClick={() => navigate("/start-badges")}
            className="bg-[#2d2a5f] text-white w-full md:w-140 mt-2 font-medium py-3 px-6 rounded-md hover:bg-[#1f1c45] transition"
          >
            Start Earning Badges
          </button>
        </div>

        {/* Right Section - Image */}
        <div className="hidden md:block ml-10">
          <img
            src={trophyImage}
            alt="Recognition Trophy"
            className="rounded-xl  w-[500px] max-w-md"
          />
        </div>
      </div>

      {/* ✅ Bottom Section (unchanged) */}
      <div className="w-full px-6 md:px-10 py-16">
        <div className="border border-[#ddd] rounded-xl p-8 bg-white">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-[#343079] mb-10">
            Why It’s Useful for Mentors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="border border-blue-900 rounded-lg p-10 bg-[#f8f7ff] hover:shadow-xl transition">
              <img src={timeIcon} alt="Save Time" className="w-12 h-12 mb-4" />
              <h3 className="font-bold text-[#343079] text-lg mb-3">
                Boost Credibility
              </h3>
              <p className="text-blue-900 text-md">
                Show your verified achievements to attract more mentees.
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
                Gain Visibility
              </h3>
              <p className="text-blue-900 text-md">
                Featured on the platform’s “Top Mentors” page.
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
                Career Growth
              </h3>
              <p className="text-blue-900 text-md">
                Recognition adds value to your professional portfolio.
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
                Make an Impact
              </h3>
              <p className="text-blue-900 text-md">
                Celebrate your contribution to shaping careers.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-8xl m-10 mt-0 border border-gray-200 rounded-md p-10 py-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#2b2b5f] mb-10">
          Benefits of the Service
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10">
          <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <img
              src={urgentHiringImg}
              alt="Urgent Hiring"
              className="w-full h-84 object-cover object-contain"
            />
            <div className="p-6 bg-[#fff8f0]">
              <h3 className=" text-2xl font-semibold text-blue-900 mb-3 mt-4">
                Build Professional Brand
              </h3>
              <p className="text-blue-900 mt-8 text-md">
                Adds tangible proof of your mentorship skills.
              </p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <img
              src={nicheRolesImg}
              alt="Niche Roles"
              className="w-full h-84 object-cover object-contain"
            />
            <div className="p-6 bg-[#fff8f0]">
              <h3 className="text-2xl font-semibold text-blue-900 mb-3 mt-4">
                Gain More Opportunities
              </h3>
              <p className="text-blue-900 mt-8 text-md">
                Employers, institutions, and mentees trust verified mentors.
              </p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <img
              src={bulkHiringImg}
              alt="Bulk Hiring"
              className="w-full h-84 object-cover object-contain"
            />
            <div className="p-6 bg-[#fff8f0]">
              <h3 className="text-2xl font-semibold text-blue-900 mb-3 mt-4">
                Motivation to Contribute
              </h3>
              <p className="text-blue-900 mt-8 text-md">
                Badges gamify the process, rewarding consistency.
              </p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <img
              src={passiveSearchImg}
              alt="Passive Search"
              className="w-full h-84 object-cover object-contain"
            />
            <div className="p-6 bg-[#fff8f0]">
              <h3 className="text-2xl font-semibold text-blue-900 mb-3 mt-4">
                Community Recognition
              </h3>
              <p className="text-blue-900 mt-8 text-md">
                Stand out among other mentors with visible achievements.
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
            <div className="md:w-[55%]">
              <h2 className="text-xl md:text-3xl mt-8 font-bold mb-6 text-[#2b2b5f]">
                Turn Your Mentorship into Recognition
              </h2>
              <p className="mb-6 text-lg text-[#2b2b5f]">
                Your mentorship journey deserves recognition — begin today. Turn
                your mentorship into measurable recognition that builds trust
                and credibility.
              </p>
              <button
                onClick={() => navigate("/start-badges")}
                className="bg-[#2b2b5f] w-full hover:bg-[#1e1e3f] transition text-white px-5 py-2 rounded-md"
              >
                Start Earning Badges
              </button>
            </div>

            {/* Right Side */}
            <div className="md:w-[45%] md:mr-10 flex justify-end mt-6 md:mt-0">
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

export default EarnRecognitionAndBadges;
