import React from "react";
import { useNavigate } from "react-router-dom";

// Hero Section Images
import bgImage from "../../../../assets/HostMockInterview/header-bg.jpg";
import innerImage from "../../../../assets/HostMockInterview/header-inner.jpg";

// Step Icons
import step1Icon from "../../../../assets/HostMockInterview/Submit.png";
import step2Icon from "../../../../assets/HostMockInterview/Answer.png";
import step3Icon from "../../../../assets/HostMockInterview/Explore.png";
import step4Icon from "../../../../assets/HostMockInterview/Editprofile.png";

// Uses of the Service Images
import urgentHiringImg from "../../../../assets/HostMockInterview/image-one.jpg";
import nicheRolesImg from "../../../../assets/HostMockInterview/image-two.jpg";
import bulkHiringImg from "../../../../assets/HostMockInterview/image-three.jpg";
import passiveSearchImg from "../../../../assets/HostMockInterview/image-four.jpg";

// Bottom Section Images
import bottomBg from "../../../../assets/HostMockInterview/bottom-bg.jpg";
import bottomInner from "../../../../assets/HostMockInterview/bottom-bg-inner.png";

const HostInterviewHome = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* ✅ Hero Section */}
      <div
        className="w-full bg-cover bg-center py-16 px-6 md:px-20 md:pt-10 md:pb-10 flex justify-between items-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Left Section - Text */}
        <div className="max-w-2xl">
          <h2 className="text-xl md:text-3xl font-bold text-blue-900 mb-8">
            Host a Mock Interview
          </h2>
          <p className="text-blue-900 text-lg mb-8 leading-relaxed">
            Empower mentees with hands-on, real-world interview practice that
            boosts their confidence and career readiness – while you strengthen
            your credibility, build your mentorship profile, and gain
            recognition as an industry leader.
          </p>
          <button
            onClick={() => navigate("/view-mock-interview-setup")}
            className="bg-[#2F2C79] text-white w-full mt-2 font-medium py-3 px-6 rounded-md hover:bg-[#24205f] transition"
          >
            Launch Interview Session
          </button>
        </div>

        {/* Right Section - Image */}
        <div className="hidden md:block ml-10">
          <img
            src={innerImage}
            alt="Mock Interview"
            className="rounded-xl md:h-74 shadow-md w-[540px]"
          />
        </div>
      </div>

      {/* ✅ How It Works Section */}
      <div className="w-full px-6 md:px-10 py-16">
        <div className="border border-[#ddd] rounded-xl p-8 bg-white">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-[#343079] mb-10">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mr-6">
            {/* Step 1 */}
            <div className="relative rounded-lg p-8 bg-[#fffaf2] border border-[#eee] hover:shadow-lg transition">
              <div className="absolute top-0 -right-10 bg-[#2F2C79] text-white text-sm font-medium px-4 py-2 rounded">
                Step 1
              </div>
              <img src={step1Icon} alt="Step 1" className="w-8 h-8 mb-4" />
              <h3 className="font-bold text-[#2F2C79] text-lg mb-4">
                Mentor Sets Up Interview
              </h3>
              <p className="text-blue-900">
                Mentor selects interview type, role, duration, mode, and date/time.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-lg p-8 bg-[#fffaf2] border border-[#eee] hover:shadow-lg transition">
              <div className="absolute top-0 -right-10 bg-[#2F2C79] text-white text-sm font-medium px-4 py-2 rounded">
                Step 2
              </div>
              <img src={step2Icon} alt="Step 2" className="w-8 h-8 mb-4" />
              <h3 className="font-bold text-[#2F2C79] text-lg mb-4">
                Interview Conducted
              </h3>
              <p className="text-blue-900">
                Mentor asks real interview-style questions, provides live
                feedback.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-lg p-8 bg-[#fffaf2] border border-[#eee] hover:shadow-lg transition">
              <div className="absolute top-0 -right-10 bg-[#2F2C79] text-white text-sm font-medium px-4 py-2 rounded">
                Step 3
              </div>
              <img src={step3Icon} alt="Step 3" className="w-8 h-8 mb-4" />
              <h3 className="font-bold text-[#2F2C79] text-lg mb-4">
                Post-Interview Feedback
              </h3>
              <p className="text-blue-900">
                Mentor can give structured feedback (rating strengths, areas to
                improve).
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative rounded-lg p-8 bg-[#fffaf2] border border-[#eee] hover:shadow-lg transition">
              <div className="absolute top-0 -right-10 bg-[#2F2C79] text-white text-sm font-medium px-4 py-2 rounded">
                Step 4
              </div>
              <img src={step4Icon} alt="Step 4" className="w-8 h-8 mb-4" />
              <h3 className="font-bold text-[#2F2C79] text-lg mb-4">
                Mentor Rewards / Recognition
              </h3>
              <p className="text-blue-900">
                Consistent mentors earn badges, higher visibility, and trust
                level.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Uses of the Service Section */}
      <div className="max-w-8xl m-10 mt-0 border border-gray-200 rounded-md p-10 py-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#2b2b5f] mb-10">
          How It Helps the Mentor?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10">
          {/* Cards */}
          <div className="rounded-lg border border-gray-300 overflow-hidden shadow-sm">
            <img
              src={urgentHiringImg}
              alt="Build Credibility"
              className="w-full h-120 object-cover object-contain"
            />
            <div className="p-6 bg-[#fff8f0]">
              <h3 className=" text-xl font-semibold text-[#2b2b5f] mb-3 mt-4">
                Build Credibility & Reputation
              </h3>
              <p className="text-[#2b2b5f] text-md">
                Every mock interview hosted boosts mentor’s profile on the
                platform.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-300 overflow-hidden shadow-sm">
            <img
              src={nicheRolesImg}
              alt="Recognition Rewards"
              className="w-full h-120 object-cover object-contain"
            />
            <div className="p-6 bg-[#fff8f0]">
              <h3 className="text-xl font-semibold text-[#2b2b5f] mb-3 mt-4">
                Earn Recognition & Rewards
              </h3>
              <p className="text-[#2b2b5f] text-md">
                Gamification: points, badges, and certificates for active
                mentors.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-300 overflow-hidden shadow-sm">
            <img
              src={bulkHiringImg}
              alt="Networking"
              className="w-full h-120 object-cover object-contain"
            />
            <div className="p-6 bg-[#fff8f0]">
              <h3 className="text-xl font-semibold text-[#2b2b5f] mb-3 mt-4">
                Networking & Influence
              </h3>
              <p className="text-[#2b2b5f] text-md">
                Builds a strong professional network that can lead to future
                collaborations, hiring, or speaking opportunities.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-300 overflow-hidden shadow-sm">
            <img
              src={passiveSearchImg}
              alt="Sharpen Skills"
              className="w-full h-120 object-cover object-contain"
            />
            <div className="p-6 bg-[#fff8f0]">
              <h3 className="text-xl font-semibold text-[#2b2b5f] mb-3 mt-4">
                Sharpen Interviewing & Leadership Skills
              </h3>
              <p className="text-[#2b2b5f] text-md">
                By conducting interviews, mentors stay sharp with industry
                interview patterns. Enhances leadership, communication, and
                evaluation skills.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ New Section (Shape Future Careers) */}
      <div className="m-10 border md:h-110 border-gray-200 p-10 rounded-md">
        <div
          className="w-full md:h-90 rounded-lg overflow-hidden"
          style={{
            backgroundImage: `url(${bottomBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="items-center px-10 md:px-20 py-8 md:py-12 rounded-lg">
           

            {/* Right Side */}
            <div className="md:w-[55%] flex justify-end mt-6 md:mt-0">
              <img
                src={bottomInner}
                alt="Shape Careers"
                className="h-72 md:h-70 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostInterviewHome;
