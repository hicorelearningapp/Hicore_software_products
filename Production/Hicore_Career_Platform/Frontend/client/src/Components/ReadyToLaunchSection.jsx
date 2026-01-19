import React from "react";
import { useNavigate } from "react-router-dom";
import LaunchGuy from "../assets/Ready to launch.png";

const ReadyToLaunchSection = () => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userRole = localStorage.getItem("userRole");

    if (!isLoggedIn) {
      navigate("/login");
    } else {
      // Redirect according to role
      switch (userRole) {
        case "student":
          navigate("/student-dashboard");
          break;
        case "jobseeker":
          navigate("/jobseeker-dashboard");
          break;
        case "mentor":
          navigate("/mentor-dashboard");
          break;
        case "employer":
          navigate("/employer-dashboard");
          break;
        default:
          navigate("/dashboard");
          break;
      }
    }
  };

  const handleExplorePrograms = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/services"); // Redirect to services if logged in
    } else {
      navigate("/login", { state: { from: "/services" } }); // Pass intended page
    }
  };

  return (
    <div className="w-full h-full bg-white flex justify-center mb-31 mt-3">
      <div
        className="w-full max-w-7xl h-auto lg:h-[480px] flex flex-col lg:flex-row gap-8 justify-center rounded-2xl opacity-100 p-6 lg:px-[100px] lg:pt-[100px] lg:pb-[200px] bg-cover bg-center border"
        style={{
          backgroundImage: "linear-gradient(to right, #D1CCE7, #E9E4F3)",
        }}
      >
        {/* Text Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center gap-6 text-center lg:text-left">
          <h2 className="w-full font-poppins text-2xl lg:text-[32px] text-center lg:text-left leading-8 lg:leading-[48px] font-bold text-[#282655] lg:ml-16">
            Ready to launch your career?
          </h2>
          <p className="w-full text-[#282655] text-base leading-7 lg:leading-[32px] font-poppins lg:w-[620px]">
            Join thousands who've already built projects, earned MNC-accepted
            certifications, and landed real jobs through{" "}
            <span className="font-bold">HiCore Career Project Platform</span>.
            Whether you're a student, jobseeker, mentor, or employer — there’s a
            smart, personalized track made just for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
            <button
              onClick={handleStartJourney}
              className="w-full sm:w-[300px] h-[44px] cursor-pointer px-[24px] py-[8px] bg-[#282655] text-white font-medium text-base rounded-[8px] border  border-[#282655] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 hover:border-white"
            >
              Start My Journey Now
            </button>

            <button
              onClick={handleExplorePrograms}
              className="w-full sm:w-[300px] h-[44px] cursor-pointer px-[24px] py-[8px] text-[#282655] font-medium text-base rounded-[8px] border border-[#282655] transition-all duration-300 hover:bg-[#E1E0EB]"
            >
              Explore Programs
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end lg:ml-4">
          <img
            src={LaunchGuy}
            alt="Launch"
            className="w-full h-auto max-w-[380px] mb-6 lg:w-[380px] lg:h-[513px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ReadyToLaunchSection;
