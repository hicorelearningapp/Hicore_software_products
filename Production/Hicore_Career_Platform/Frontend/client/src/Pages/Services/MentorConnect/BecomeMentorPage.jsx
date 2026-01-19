import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import {
  FaUserEdit,
  FaSearch,
  FaVideo,
  FaClipboardCheck,
} from "react-icons/fa";

// Images
import bannerBackground from "../../../assets/MentorPage/mentor-second-page-banner.jpg";
import mentorInnerImage from "../../../assets/MentorPage/mentor-second-inner-image.jpg";
import whoIcon from "../../../assets/MentorPage/avatar.png";
import targetIcon from "../../../assets/MentorPage/target-icon.png";
import impactIcon from "../../../assets/MentorPage/Community.png";
import credibilityIcon from "../../../assets/MentorPage/work-one.png";
import moneyIcon from "../../../assets/MentorPage/Profit.png";
import certificateIcon from "../../../assets/MentorPage/Skill.png";
import ctaBg from "../../../assets/MentorPage/become-mentor-bg.jpg";

const steps = [
  {
    icon: <FaUserEdit size={24} />,
    title: "Fill Out the Application",
    description:
      "A simple, step-by-step form to help us understand your qualifications, experience, and mentorship preferences – so we can match you with the right learners.",
    step: "Step 1",
  },
  {
    icon: <FaSearch size={24} />,
    title: "Profile Shortlisting",
    description:
      "After you submit your application, our team carefully evaluates your expertise, experience, and mentoring interests.",
    step: "Step 2",
  },
  {
    icon: <FaVideo size={24} />,
    title: "Interview Round",
    description:
      "If shortlisted, we’ll connect with you for a short video interview to assess your mentoring fit.",
    step: "Step 3",
  },
  {
    icon: <FaClipboardCheck size={24} />,
    title: "Orientation & Onboarding",
    description:
      "Once selected, you’ll join our Mentor Orientation session hosted by our Team.",
    step: "Step 4",
  },
];

const BecomeMentorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Banner Section */}
      <div
        className="bg-cover bg-center px-15 py-8 flex items-center justify-center"
        style={{ backgroundImage: `url(${bannerBackground})` }}
      >
        <div className=" w-full flex flex-col md:flex-row items-start justify-between gap-16">
          <div className="flex-1 text-[#1E1E5B]">
            <button
              className="flex items-center text-[#1E1E5B] mb-6 font-medium"
              onClick={() => navigate(-1)}
            >
              <FiArrowLeft className="mr-2" /> Back
            </button>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 mt-6">
              Want to Become a Mentor & Earn?
            </h2>
            <p className="text-lg md:text-xl mt-6 mb-6">
              Empower Learners. Share Your Knowledge. Get Paid.
            </p>
            <button
              className="bg-[#1E1E5B] w-full text-white px-6 py-3 mt-6 font-semibold rounded-lg hover:bg-[#343079] transition"
              onClick={() => navigate("/apply-as-mentor")}
            >
              Become a Mentor
            </button>
          </div>

          <div className="flex-1">
            <img
              src={mentorInnerImage}
              alt="Mentor"
              className="w-full h-80 rounded-xl shadow-md object-cover"
            />
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="max-w-8xl mx-auto bg-white border border-gray-300 m-4 md:m-10 rounded-lg px-4 md:px-8 py-10 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1E1E5B] mb-12">
          Process to become a Mentor
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-20 m-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-[#FFF9EE] p-6 rounded-lg shadow-sm group hover:shadow-md transition-shadow duration-300"
            >
              <div className="absolute -top-0 -right-12 bg-[#1E1E5B] text-white text-sm px-4 py-2 rounded-r-md font-semibold shadow-md z-20 transform transition-transform duration-300 group-hover:scale-110 group-hover:z-30">
                {step.step}
              </div>
              <div className="text-[#1E1E5B] mb-4 mt-6">{step.icon}</div>
              <h3 className="font-semibold text-[#1E1E5B] text-lg mb-2 group-hover:text-xl transition-all duration-300">
                {step.title}
              </h3>
              <p className="text-[#5A5A89] text-sm group-hover:text-base transition-all duration-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Who Can Apply & What You’ll Do */}
      <div className="max-w-8xl mx-auto px-4 md:px-8 py-10 md:m-2 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-300 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <img src={whoIcon} alt="Who Can Apply" className="w-6 h-6 mr-4" />
            <h3 className="text-xl md:text-2xl font-bold text-[#1E1E5B]">
              Who Can Apply?
            </h3>
          </div>
          <ul className="text-[#1E1E5B] list-disc list-inside space-y-3 text-lg">
            <li>
              2+ years of experience in tech, design, business, or related
              domains
            </li>
            <li>Passionate about teaching, guiding, and giving feedback</li>
            <li>Comfortable with video calls and online collaboration</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-300 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <img src={targetIcon} alt="What You'll Do" className="w-6 h-6 mr-4" />
            <h3 className="text-xl md:text-2xl font-bold text-[#1E1E5B]">
              What You’ll Do
            </h3>
          </div>
          <ul className="text-[#1E1E5B] list-disc list-inside space-y-3 text-lg">
            <li>Host 1-on-1 or group mentorship sessions</li>
            <li>Review resumes, portfolios, or project work</li>
            <li>Conduct mock interviews</li>
            <li>Share career advice, tips, and best practices</li>
          </ul>
        </div>
      </div>

      {/* Perks */}
      <div className="bg-white border border-gray-300 m-10 max-w-8xl rounded-xl px-4 md:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1E1E5B] mb-10">
          Perks of being a Mentor
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="border border-[#DCDCDC] rounded-lg p-8 hover:shadow-md transition-shadow duration-300 text-[#1E1E5B] bg-white">
            <img src={impactIcon} alt="Impact" className="w-12 h-12 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Impact Lives</h3>
            <p className="text-md text-[#5A5A89]">
              Help students and early professionals build confidence and
              clarity.
            </p>
          </div>
          <div className="border border-[#DCDCDC] rounded-lg p-8 hover:shadow-md transition-shadow duration-300 text-[#1E1E5B] bg-[#FFF9EE]">
            <img src={credibilityIcon} alt="Credibility" className="w-12 h-12 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Build Credibility</h3>
            <p className="text-md text-[#5A5A89]">
              Boost your professional brand through mentorship.
            </p>
          </div>
          <div className="border border-[#DCDCDC] rounded-lg p-8 hover:shadow-md transition-shadow duration-300 text-[#1E1E5B] bg-[#F0F6FF]">
            <img src={moneyIcon} alt="Earn" className="w-12 h-12 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Earn for Your Time</h3>
            <p className="text-md text-[#5A5A89]">
              Get paid for each session, review, or mock interview.
            </p>
          </div>
          <div className="border border-[#DCDCDC] rounded-lg p-8 hover:shadow-md transition-shadow duration-300 text-[#1E1E5B] bg-[#E8FDEB]">
            <img src={certificateIcon} alt="Letter of Experience" className="w-12 h-12 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Letter of Experience</h3>
            <p className="text-md text-[#5A5A89]">
              Get your certified proof of your mentorship contribution.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-8xl m-5 my-10 px-4">
        <div
          className="w-full px-4 py-10 rounded-xl"
          style={{
            backgroundImage: `url(${ctaBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-7xl mx-auto rounded-xl p-6 md:p-10 flex flex-col items-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E1E5B] mb-4">
              Ready to be a Mentor? Apply Now
            </h2>
            <p className="text-[#1E1E5B] text-md md:text-lg mb-1">
              Guide aspiring students and gain recognition, experience, and
              rewards.
            </p>
            <p className="text-[#1E1E5B] text-md md:text-lg mb-6">
              Apply today and become a part of a vibrant mentor community
            </p>
            <button
              className="bg-[#1E1E5B] md:w-140 mt-8 text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#343079] transition"
              onClick={() => navigate("/apply-as-mentor")}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeMentorPage;
