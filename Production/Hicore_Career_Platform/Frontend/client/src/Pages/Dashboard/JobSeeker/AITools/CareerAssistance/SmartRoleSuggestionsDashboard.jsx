import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import backArrow from "../../../../../assets/AICareerPage/Backarrow.png";
import roleIcon from "../../../../../assets/AICareerPage/role-icon.png";
import industryIcon from "../../../../../assets/AICareerPage/industry-icon.png";
import matchIcon from "../../../../../assets/AICareerPage/match-icon.png";
import salaryIcon from "../../../../../assets/AICareerPage/salary-icon.png";
import arrowLeft from "../../../../../assets/AICareerPage/arrow-left.png";
import arrowRight from "../../../../../assets/AICareerPage/arrow-right.png";

const SmartRoleSuggestionsDashboard = () => {
  const [inputValue, setInputValue] = useState("Python, SQL, React.js");
  const [roleMatches, setRoleMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatches, setShowMatches] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://hicore.pythonanywhere.com/role-matches?skills=${encodeURIComponent(
          inputValue
        )}`
      );
      const data = await response.json();
      if (data?.roles?.length) {
        setRoleMatches(data.roles);
        setCurrentIndex(0);
        setShowMatches(true);
      } else {
        setShowMatches(false);
      }
    } catch (error) {
      console.error("Error fetching role matches:", error);
      setShowMatches(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < roleMatches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentCard = roleMatches[currentIndex];

  return (
    <div className="min-h-screen bg-white px-4  py-8 transition-all duration-500 ease-in-out">
      {/* Back Button */}
      

      {/* Two Column Layout */}
      <div className="flex flex-col md:flex-row gap-6 transition-all duration-500 ease-in-out">
        {/* Input Section */}
        <div
          className={`bg-white rounded-xl  p-6 md:p-8  transition-all duration-500 ease-in-out ${
            showMatches ? "md:w-1/2" : "w-full"
          }`}
        >
          <h2 className="text-[#343079] text-base md:text-lg font-semibold mb-4">
            Tell us your current skills or interests.
          </h2>

          <textarea
            rows={5}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border border-[#3D3584] rounded-md p-4 text-[#343079] text-sm focus:outline-none focus:ring-2 focus:ring-[#3D3584]"
          />

          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-[#3D3584] text-white text-sm rounded-md hover:bg-[#2f2a6e] transition"
          >
            {loading ? "Loading..." : "Generate My Role Matches"}
          </button>
        </div>

        {/* Role Match Section */}
        {showMatches && currentCard && (
          <div className="md:w-1/2 transition-all duration-500 ease-in-out">
            <div className="bg-white rounded-xl border border-[#E2E1F3] p-6 md:p-8 shadow-sm">
              <h2 className="text-[#343079] text-base md:text-lg font-semibold mb-4">
                Recommended Roles Based on Your Profile:
              </h2>

              <div className="rounded-2xl border border-[#E2E1F3] p-6 space-y-4 shadow-sm relative">
                {/* Info Section */}
                <div className="grid grid-cols-2 gap-4 text-sm text-[#343079]">
                  <div className="flex items-center gap-2">
                    <img src={roleIcon} alt="Role" className="w-4 h-4" />
                    <span className="font-medium">Role:</span> {currentCard.role}
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={industryIcon} alt="Industry" className="w-4 h-4" />
                    <span className="font-medium">Industry Demand:</span>{" "}
                    {currentCard.demand}
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={matchIcon} alt="Match" className="w-4 h-4" />
                    <span className="font-medium">Match Score:</span>{" "}
                    {currentCard.match}
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={salaryIcon} alt="Salary" className="w-4 h-4" />
                    <span className="font-medium">Salary Range:</span>{" "}
                    {currentCard.salary}
                  </div>
                </div>

                {/* Skill & Suggestion Boxes */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/2 border border-[#E2E1F3] rounded-xl p-4">
                    <h4 className="font-semibold text-[#343079] text-sm mb-2">
                      Required Skills:
                    </h4>
                    <div className="space-y-2 text-sm text-[#343079]">
                      <div className="bg-green-100 rounded-md px-4 py-2">
                        <p className="font-semibold">Excellent</p>
                        <ul className="list-disc list-inside">
                          <li>{currentCard.skills.excellent}</li>
                        </ul>
                      </div>

                      <div className="bg-blue-100 rounded-md px-4 py-2">
                        <p className="font-semibold">Intermediate</p>
                        <ul className="list-disc list-inside">
                          <li>{currentCard.skills.intermediate}</li>
                        </ul>
                      </div>

                      <div className="bg-pink-100 rounded-md px-4 py-2">
                        <p className="font-semibold">Needs Improvement</p>
                        <ul className="list-disc list-inside">
                          <li>{currentCard.skills.needsImprovement}</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 border border-[#E2E1F3] rounded-xl p-4">
                    <h4 className="font-semibold text-[#343079] text-sm mb-2">
                      Suggested Next Steps:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-[#343079]">
                      <li>{currentCard.suggestion}</li>
                    </ul>
                  </div>
                </div>

                {/* Arrows */}
                <div className="flex justify-between items-center pt-4">
                  {currentIndex > 0 ? (
                    <img
                      src={arrowLeft}
                      alt="Previous"
                      onClick={handlePrev}
                      className="w-6 h-6 cursor-pointer"
                    />
                  ) : (
                    <div />
                  )}

                  {currentIndex < roleMatches.length - 1 && (
                    <img
                      src={arrowRight}
                      alt="Next"
                      onClick={handleNext}
                      className="w-6 h-6 cursor-pointer"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartRoleSuggestionsDashboard;
