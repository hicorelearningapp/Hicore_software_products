import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LaunchCareerSection = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const rotatingWords = ["Projects", "Careers", "Skills"];
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setFade(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleCareerClick = () => {
    // Check login status (example: using localStorage)
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // or your auth logic

    if (isLoggedIn) {
      navigate("/course");
    } else {
      // store the redirect path so login can redirect back
      localStorage.setItem("redirectAfterLogin", "/course");
      navigate("/login");
    }
  };

  return (
    <section className="bg-[#F9F9FC] pt-20 pb-20 px-4 text-center relative z-10">
      <div className="max-w-4xl mx-auto ">
        <h2 className="text-2xl md:text-3xl font text-black mb-4">
          Launch Your Career With Real{" "}
          <span
            className={`inline-block transition-opacity duration-300 text-[#343079] font-semibold align-bottom ${
              fade ? "opacity-100" : "opacity-0"
            }`}
            style={{
              minWidth: "120px",
              whiteSpace: "nowrap",
              textAlign: "left",
            }}
          >
            {rotatingWords[currentWordIndex]}
          </span>
        </h2>

        <p className="max-w-[800px] mx-auto text-sm sm:text-base font-poppins leading-relaxed text-[#8682D3] mb-6 px-2">
          Experience a powerful career launchpad where students build real-world
          skills, job seekers find roles that fit, employers hire top talent,
          and mentors grow future leaders.
        </p>

        <button
          onClick={handleCareerClick}
          className="bg-[#343079] hover:bg-[#12112A]  cursor-pointer text-white font-medium px-6 py-3 rounded-lg transition-all duration-300"
        >
          Choose the right career for you
        </button>
      </div>
    </section>
  );
};

export default LaunchCareerSection;
