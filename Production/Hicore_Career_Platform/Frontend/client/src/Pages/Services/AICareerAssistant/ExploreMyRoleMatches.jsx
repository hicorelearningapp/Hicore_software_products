import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import backArrow from "../../../assets/AICareerPage/Backarrow.png";
import roleIcon from "../../../assets/AICareerPage/role-icon.png";
import industryIcon from "../../../assets/AICareerPage/industry-icon.png";
import matchIcon from "../../../assets/AICareerPage/match-icon.png";
import salaryIcon from "../../../assets/AICareerPage/salary-icon.png";
import arrowLeft from "../../../assets/AICareerPage/arrow-left.png";
import arrowRight from "../../../assets/AICareerPage/arrow-right.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/* ✅ FINAL HARD-SAFE OBJECT EXTRACTOR
   - Skips `[`, `]`, commas
   - Starts only at first `{`
   - Uses brace depth
   - Ignores broken/truncated last object
*/
const extractValidObjects = (raw) => {
  if (!raw || typeof raw !== "string") return [];

  const clean = raw.replace(/```json/g, "").replace(/```/g, "");

  const results = [];
  let buffer = "";
  let depth = 0;
  let inString = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    const prev = clean[i - 1];

    if (ch === '"' && prev !== "\\") {
      inString = !inString;
    }

    if (!inString) {
      if (ch === "{") {
        if (depth === 0) buffer = ""; // ✅ fresh object
        depth++;
      }

      if (depth > 0) buffer += ch;

      if (ch === "}" && depth > 0) {
        depth--;
        if (depth === 0) {
          try {
            results.push(JSON.parse(buffer));
          } catch (e) {
            // ignore broken object safely
          }
          buffer = "";
        }
        continue;
      }

      continue;
    }

    // inside string
    if (depth > 0) buffer += ch;
  }

  return results;
};

const ExploreMyRoleMatches = () => {
  const [inputValue, setInputValue] = useState();
  const [roleMatches, setRoleMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatches, setShowMatches] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ FINAL SAFE API HANDLER
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const url = `${API_BASE}/ai/role-matches?skills=${encodeURIComponent(
        inputValue
      )}`;

      const response = await fetch(url);
      const data = await response.json();

      let parsedRoles = [];

      if (typeof data.roles === "string") {
        parsedRoles = extractValidObjects(data.roles);
      } else if (Array.isArray(data.roles)) {
        parsedRoles = data.roles;
      }

      if (parsedRoles.length) {
        setRoleMatches(parsedRoles);
        setCurrentIndex(0);
        setShowMatches(true);
        console.log("✅ Recovered roles:", parsedRoles);
      } else {
        console.warn("⚠️ No valid roles could be parsed from API");
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
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentCard = roleMatches[currentIndex];

  return (
    <div className="min-h-screen bg-white px-4 md:px-16 py-8">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#343079] text-sm font-medium mb-6"
      >
        <img src={backArrow} alt="Back" className="w-4 h-4 mr-1" />
        Back
      </button>

      <div className="flex flex-col md:flex-row gap-6">

        {/* Input Section */}
        <div
          className={`bg-white rounded-[8px] border border-[#EBEAF2] p-6 md:p-8 shadow-sm ${
            showMatches ? "md:w-1/2" : "w-full"
          }`}
        >
          <h2 className="text-[#343079] text-base md:text-lg font-semibold mb-4">
            Tell us your current skills or interests.
          </h2>

          <textarea
            rows={4}
            value={inputValue}
            placeholder="Enter your skills"
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border border-[#343079] text-[#343079] font-regular text-[16px] rounded-[8px] p-[36px]"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-[#3D3584] text-white border border-[#343079] rounded-[8px] disabled:opacity-60"
          >
            {loading ? "Loading..." : "Generate My Role Matches"}
          </button>
        </div>

        {/* Role Match Section */}
        {showMatches && currentCard && (
          <div className="md:w-1/2">
            <div className="bg-white rounded-[8px] border border-[#EBEAF2] p-6 shadow-sm">
              <h2 className="text-[#343079] text-base md:text-lg font-semibold mb-4">
                Recommended Roles Based on Your Profile:
              </h2>

              <div className="border border-[#EBEAF2] rounded-[8px] p-6 space-y-4">

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-row text-[#343079] text-[14px] md:text-[14px] font-regular gap-2">
                    <img src={roleIcon} alt="" className="w-5 h-5" />
                    <b>Role:</b> {currentCard?.role || "N/A"}
                  </div>
                  <div className="flex flex-row text-[#343079] text-[14px] md:text-[14px] font-regular gap-2">
                    <img src={industryIcon} alt="" className="w-5 h-5" />
                    <b>Demand:</b> {currentCard?.demand || "N/A"}
                  </div>
                  <div className="flex flex-row text-[#343079] text-[14px] md:text-[14px] font-regular gap-2">
                    <img src={matchIcon} alt="" className="w-5 h-5" />
                    <b>Match:</b> {currentCard?.match || "N/A"}
                  </div>
                  <div className="flex flex-row text-[#343079] text-[14px] md:text-[14px] font-regular gap-2">
                    <img src={salaryIcon} alt="" className="w-5 h-5" />
                    <b>Salary:</b> {currentCard?.salary || "N/A"}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col gap-4 w-full border border-[#C0BFD5] p-4 rounded-[8px]">
                     <h2 className="text-[#343079] text-[16px] md:text-lg font-bold">
                       Required Skills:
                     </h2>
                    <div className="flex flex-col gap-2 p-[8px] bg-[#E8FFDD] rounded-[8px] font-regular text-[#343079] text-[14px]">
                      <h2 className="text-[14px] font-medium">
                        Excellent:
                      </h2> 
                      {currentCard?.skills?.excellent || "N/A"}
                    </div>
                     <div className="flex flex-col gap-2 p-[8px] bg-[#C8ECF5] rounded-[8px] font-regular text-[#343079] text-[14px]">
                      <h2 className="text-[14px] font-medium">
                        Intermediate:
                      </h2> 
                      {currentCard?.skills?.intermediate || "N/A"}
                    </div>
                    <div className="flex flex-col gap-2 p-[8px] bg-[#FFE4FF] rounded-[8px] font-regular text-[#343079] text-[14px]">
                      <h2 className="text-[14px] font-medium">
                        Needs Improvement:
                      </h2> 
                      {currentCard?.skills?.needsImprovement || "N/A"}
                    </div>
                  </div>

                  <div className="flex flex-col w-full border border-[#C0BFD5] p-4 rounded-[8px] gap-4">
                    <b className="text-[#343079] font-bold text-[16px]">Suggested Next Steps:</b>
                    <p className="text-[14px] font-regular text-[#343079]">{currentCard?.suggestion || "No suggestion available"}</p>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  {currentIndex > 0 && (
                    <img
                      src={arrowLeft}
                      onClick={handlePrev}
                      className="w-6 cursor-pointer"
                    />
                  )}

                  {currentIndex < roleMatches.length - 1 && (
                    <img
                      src={arrowRight}
                      onClick={handleNext}
                      className="w-6 cursor-pointer"
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

export default ExploreMyRoleMatches;
