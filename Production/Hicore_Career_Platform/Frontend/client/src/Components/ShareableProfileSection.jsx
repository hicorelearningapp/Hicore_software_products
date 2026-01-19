import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import profileImg from "../assets/profile-card.png";
import bgSharable from "../assets/bgSharable.jpg";
import PublicProfileFeatures from "./PublicProfileFeatures";

const ShareableProfileSection = () => {
  const [showFeatures, setShowFeatures] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const navigate = useNavigate();

  // ✅ Check if profile already exists (from localStorage)
  useEffect(() => {
    const profileStatus =
      localStorage.getItem("hasProfile") === "true" ||
      localStorage.getItem("profileCreated") === "true";
    setHasProfile(profileStatus);
  }, []);

  // ✅ Redirect if triggered
  if (redirect) return <Navigate to="/create-profile" replace />;

  // ✅ Hide the section completely if profile exists
  if (hasProfile) return null;

  return (
    <>
      <div className="bg-white py-16 px-4 flex justify-center">
        <div
          className="w-full max-w-7xl rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-8 p-6 md:p-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgSharable})` }}
        >
          {/* Image Section */}
          <div className="flex flex-col gap-6 items-start w-full md:w-1/2">
            <img
              src={profileImg}
              alt="Profile preview"
              className="w-full h-auto rounded-lg object-contain"
            />
          </div>

          {/* Text + Actions Section */}
          <div className="w-full md:w-1/2 text-center md:text-left flex flex-col items-center md:items-start">
            <h2 className="font-poppins font-semibold text-[20px] leading-[36px] text-[#343079] mb-4">
              A Shareable Profile That Works Like Your Career Portfolio
            </h2>
            <p className="font-poppins font-normal text-[18px] leading-[28px] text-[#343079] mb-6">
              Create a public profile that showcases your skills, certifications,
              projects, and video pitch — and share it with employers, mentors, and
              global clients. Let job opportunities come to you.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 w-full justify-center md:justify-start">
              <button
                onClick={() => setRedirect(true)}
                className="w-full sm:w-[290px] h-[60px] cursor-pointer items-center px-6 py-4 rounded-md border border-[#282655] bg-[#282655] text-white text-sm sm:text-base font-medium transition-colors duration-300 hover:bg-[#403B93]"
              >
                Create Your Public Profile
              </button>

              <button
                onClick={() => setShowFeatures(true)}
                className="w-full sm:w-[280px] h-[60px] items-center px-6 py-4 rounded-md border border-[#282655] text-[#2B2160] text-sm sm:text-base font-medium transition-colors duration-300 hover:bg-[#E1E0EB]"
              >
                Know more
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Modal */}
      {showFeatures && (
        <PublicProfileFeatures
          onClose={() => setShowFeatures(false)}
          onCreateProfile={() => {
            setShowFeatures(false);
            setRedirect(true);
          }}
        />
      )}
    </>
  );
};

export default ShareableProfileSection;
