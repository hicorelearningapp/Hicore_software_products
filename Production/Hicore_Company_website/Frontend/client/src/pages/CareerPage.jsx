import React from "react";
import { useNavigate } from "react-router-dom";
import careerImage from "../assets/career-bg.png";
import bullseyeIcon from "../assets/challenging.png";
import graduationIcon from "../assets/learning.png";
import handshakeIcon from "../assets/collabrative.png";
import globeIcon from "../assets/global.png";

const CareerPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="relative w-full">
      {/* Background Image */}
      <img
        src={careerImage}
        alt="Career Background"
        className="w-full h-auto object-contain"
      />

      {/* Invisible Clickable Area (Top-Left) */}
      <div
        onClick={handleBack}
        className="absolute top-1 left-1 sm:top-10 sm:left-10 w-4 h-4 
        sm:w-12 sm:h-12 rounded-full cursor-pointer md:top-7 md:left-7  transition duration-200 z-50"
      />

      {/* Why Work With Us Section */}
      <div className="mt-4 px-4 py-16 text-center bg-white">
        <h2 className="text-3xl font-semibold text-[#230970] mb-12">
          Why Work With Us?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Card 1 */}
          <div className="rounded-md p-[2px] bg-gradient-to-b from-yellow-300 via-yellow-300 to-yellow-600">
            <div className="rounded-md p-6 bg-purple-50 h-full">
              <img
                src={bullseyeIcon}
                alt="Challenging Projects"
                className="mx-auto w-8 h-8 mb-2"
              />
              <h3 className="font-bold text-[#230970] mb-4">
                Challenging Projects
              </h3>
              <p className="text-sm text-[#230970] leading-loose text-center">
                Work on impactful solutions across CAD, Embedded Systems,
                Software, AI, and IoT.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-md p-[2px] bg-gradient-to-b from-yellow-300 via-yellow-300 to-yellow-600">
            <div className="rounded-md p-6 bg-green-50 h-full">
              <img
                src={graduationIcon}
                alt="Continuous Learning"
                className="mx-auto w-8 h-8 mb-2"
              />
              <h3 className="font-bold text-[#230970] mb-4">
                Continuous Learning
              </h3>
              <p className="text-sm text-[#230970] leading-loose text-center">
                Access to training, mentorship,
                <br />
                and certifications to grow with
                <br />
                the latest tech.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-md p-[2px] bg-gradient-to-b from-yellow-300 via-yellow-300 to-yellow-600">
            <div className="rounded-md p-6 bg-purple-50 h-full">
              <img
                src={handshakeIcon}
                alt="Collaborative Culture"
                className="mx-auto w-8 h-8 mb-2"
              />
              <h3 className="font-bold text-[#230970] mb-4">
                Collaborative Culture
              </h3>
              <p className="text-sm text-[#230970] leading-loose text-center">
                We believe in open communication, flexible thinking, and a
                team-first mindset.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-md p-[2px] bg-gradient-to-b from-yellow-300 via-yellow-300 to-yellow-600">
            <div className="rounded-md p-6 bg-yellow-50 h-full">
              <img
                src={globeIcon}
                alt="Global Clients"
                className="mx-auto w-8 h-8 mb-2"
              />
              <h3 className="font-bold text-[#230970] mb-4">Global Clients</h3>
              <p className="text-sm text-[#230970] leading-loose text-center">
                Build solutions for real businesses in manufacturing,
                automation, and high-tech industries.
              </p>
            </div>
          </div>
        </div>

        {/* No Job Openings Box */}
        <div className="border border-gray-200 rounded-lg mt-24   py-16 md:py-40 text-[#230970] text-4xl font-semibold max-w-7xl mx-auto text-center">
          No Job Openings Right Now
        </div>

        {/* Contact & Internship Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-7xl mx-auto mt-16">
          {/* Open Talent Card */}
          <div className="rounded-lg p-[2px] bg-gradient-to-b from-yellow-200 to-yellow-500">
            <div className="bg-white rounded-lg p-10 h-full flex flex-col justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-[#230970] mb-3 text-start">
                  We're always open to great talent.
                </h3>
                <p className="text-[#230970] text-lg mb-3 text-start">
                  Send your resume and tell us how you can make an impact.
                </p>
                <p className="text-[#230970] font-medium text-lg mb-8 text-start">
                  hicoresoft@gmail.com
                </p>
              </div>
              <a
                href="mailto:hicoresoft@gmail.com"
                className="bg-[#230970] hover:bg-[#1a065c] text-xl text-white py-3  md:py-5 px-6 rounded-md transition self-start"
              >
                Send an Email
              </a>
            </div>
          </div>

          {/* Internship Card */}
          <div className="rounded-lg p-[2px] bg-gradient-to-b from-yellow-200 to-yellow-500">
            <div className="bg-white rounded-lg p-6 h-full flex flex-col justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-[#230970] mb-3 text-start">
                  Internships & Freshers
                </h3>
                <p className="text-[#230970] text-lg mb-3 leading-loose text-start">
                  We offer mentorship–based internships for students and recent
                  graduates in engineering, software, and CAD domains.
                </p>
              </div>
              <button
                className="bg-[#230970] hover:bg-[#1a065c] text-xl text-white py-3 md:py-5 px-6 rounded-md transition self-start" 
              >
                Explore Internships
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPage;
