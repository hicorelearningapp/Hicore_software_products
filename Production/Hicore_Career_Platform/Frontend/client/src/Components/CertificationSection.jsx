import React from "react";
import { useNavigate } from "react-router-dom";
import certImg from "../assets/certificate.png";
import showcaseImg from "../assets/showcase.png";
import learnIcon from "../assets/learn.png";

const CertificationSection = () => {
  const navigate = useNavigate();

  const handleEnrollClick = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      navigate("/course"); // If logged in, go to course page
    } else {
      // Store redirect path so login can redirect back to course
      localStorage.setItem("redirectAfterLogin", "/course");
      navigate("/login"); // If not logged in, go to login page
    }
  };

  return (
    <section className="py-14 px-4 sm:px-6 bg-white flex justify-center">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-10">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 justify-center">
          <h2 className="w-full font-poppins font-semibold text-[28px] md:text-[32px] leading-tight text-[#343079]">
            Turn Your Skills Into Credentials & Global Recognition with HiCore
            Software Technologies
          </h2>
          <p className="w-full font-poppins font-normal text-[18px] leading-normal text-[#343079] mb-4">
            Start building. Get certified. Get seen.
          </p>
          <button
            onClick={handleEnrollClick}
            className="w-full cursor-pointer h-[56px] px-6 py-4 bg-[#282655] text-white rounded-lg border border-[#403B93] font-medium text-base transition-all duration-300 hover:border-white hover:bg-gradient-to-r hover:from-[#403B93] hover:to-[#8682D3]"
          >
            Enroll Now
          </button>
        </div>

        {/* Right Cards */}
        <div className="w-full lg:w-2/2 flex flex-col md:flex-row gap-8">
          {/* Card 1 */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 p-6 md:p-9 rounded-3xl border border-[#343079] bg-[#FDFFED]">
            <div>
              <h3 className="w-full font-poppins font-semibold text-[16px] leading-9 text-center text-[#343079] mb-4">
                Officially Certified by an MNC
              </h3>
              <img
                src={certImg}
                alt="Certificate"
                className="mx-auto mb-6 w-32 h-32 object-contain"
              />
              <p className="w-full font-poppins font-normal text-base leading-9 text-[#343079]">
                Successfully complete your internship or project and receive a{" "}
                <strong className="font-poppins font-bold text-base leading-9 text-[#343079]">
                  verified certificate
                </strong>{" "}
                from{" "}
                <strong className="font-poppins font-bold text-base leading-9 text-[#343079]">
                  HiCore Software Technologies
                </strong>
                , a leading multinational company.
              </p>
            </div>
            <div className="space-y-2 mt-3">
              {[
                "Boost your resume",
                "Share it on LinkedIn",
                "Impress future employers",
              ].map((text, index) => (
                <div key={index} className="flex items-start gap-3">
                  <img
                    src={learnIcon}
                    alt="icon"
                    className="w-6 h-6 flex-shrink-0"
                  />
                  <p className="w-full text-[#343079] font-poppins text-sm leading-6">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2 */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 p-6 md:p-9 rounded-3xl border border-[#343079] bg-[#FDFFED]">
            <div>
              <h3 className="w-full font-poppins font-semibold text-[16px] leading-9 text-center text-[#343079] mb-4">
                Let the World See Your Work!
              </h3>
              <img
                src={showcaseImg}
                alt="Showcase"
                className="mx-auto mb-6 w-32 h-32 object-contain"
              />
              <p className="w-full font-poppins font-normal text-base leading-9 text-[#343079]">
                Top-performing projects will be featured on the official{" "}
                <strong className="font-poppins font-bold text-base leading-9 text-[#343079]">
                  HiCore Website
                </strong>
                , giving you{" "}
                <strong className="font-poppins font-bold text-base leading-9 text-[#343079]">
                  international visibility
                </strong>{" "}
                and{" "}
                <strong className="font-poppins font-bold text-base leading-9 text-[#343079]">
                  industry attention
                </strong>
                .
              </p>
            </div>
            <div className="space-y-2 mt-3">
              {[
                "Reach global recruiters",
                "Stand out professionally",
                "Shine as a future tech leader",
              ].map((text, index) => (
                <div key={index} className="flex items-start gap-3">
                  <img
                    src={learnIcon}
                    alt="icon"
                    className="w-6 h-6 flex-shrink-0"
                  />
                  <p className="w-full text-[#343079] font-poppins text-sm leading-6">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;
