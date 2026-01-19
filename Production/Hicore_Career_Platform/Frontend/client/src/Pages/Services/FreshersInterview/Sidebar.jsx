import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import askmentor from "../../../assets/FreshersInterview/askmentor.png";
import download from "../../../assets/FreshersInterview/download.png";

const Sidebar = ({
  percentage = 0,
  activeSubheading = "",
  onSubheadingClick,
  lessonData,
}) => {
  const { weekId, topicId } = useParams();

  // ✅ Safely access nested lesson content
  const sidebarContent =
    lessonData?.[weekId]?.[topicId]?.lesson ||
    lessonData?.[weekId]?.[topicId]?.data?.lesson ||
    [];

  // ✅ Ref to ensure auto-select only happens once
  const hasAutoSelected = useRef(false);

  useEffect(() => {
    // Run only once after data loads
    if (
      !hasAutoSelected.current &&
      sidebarContent.length > 0 &&
      sidebarContent[0].subheadings &&
      sidebarContent[0].subheadings.length > 0
    ) {
      const firstSubheading = sidebarContent[0].subheadings[0].subheading;
      if (firstSubheading && onSubheadingClick) {
        onSubheadingClick(firstSubheading);
        hasAutoSelected.current = true; // ✅ Prevent re-triggering
      }
    }
  }, [sidebarContent, onSubheadingClick]);

  return (
    <div className="w-full lg:w-[215px] flex-shrink-0">
      {/* ========== Mastery Progress Box ========== */}
      <div className="w-full h-fit gap-2 rounded-lg border border-[#EBEAF2] p-4 mb-4 bg-white shadow-sm">
        <h2 className="text-center text-[#343079] font-poppins font-bold text-[16px] leading-[32px]">
          Your Mastery
        </h2>
        <div className="flex flex-col items-center gap-1 mt-2">
          <div className="w-full h-[12px] bg-[#E1E0EB] rounded-full relative overflow-hidden">
            <div
              className="h-full bg-[#008000] rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-[#008000] text-[12px] leading-[24px] font-poppins font-medium text-center">
            {percentage}% completed
          </p>
        </div>
      </div>

      {/* ========== Topics to Learn Section ========== */}
      <div className="p-4 border border-[#EBEAF2] rounded-[8px] w-full max-h-[500px] overflow-y-auto mb-4 bg-white shadow-sm">
        <h2 className="w-full text-center text-[#343079] font-poppins font-bold text-[16px] leading-[32px] mb-2">
          Topics to Learn
        </h2>

        <div className="flex flex-col gap-3">
          {sidebarContent.length > 0 ? (
            sidebarContent.map((section, i) => (
              <div key={i} className="flex flex-col gap-1">
                <h3 className="text-[#343079] font-poppins font-semibold text-[12px] leading-[24px]">
                  {i + 1}. {section.heading}
                </h3>
                <ul className="pl-5 list-disc flex flex-col gap-1">
                  {section.subheadings?.map((sub, j) => {
                    const isActive = activeSubheading === sub.subheading;
                    return (
                      <li
                        key={j}
                        onClick={() => onSubheadingClick?.(sub.subheading)}
                        className={`cursor-pointer font-poppins text-[12px] leading-[24px] transition-colors duration-200 ${
                          isActive
                            ? "text-[#4F80BF] underline font-semibold"
                            : "text-[#343079] hover:text-[#4F80BF]"
                        }`}
                      >
                        {sub.subheading}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-[12px] text-gray-500 text-center font-poppins">
              No lessons available yet.
            </p>
          )}
        </div>
      </div>

      {/* ========== Quick Access Section ========== */}
      <div className="p-4 border border-[#EBEAF2] rounded-[8px] w-full h-fit bg-white shadow-sm">
        <h2 className="text-center text-[#343079] font-poppins font-bold text-[16px] leading-[32px]">
          Quick Access
        </h2>

        <div className="flex flex-col items-center mt-2 gap-2">
          <button className="w-full h-[32px] flex items-center justify-center gap-2 px-4 py-1 bg-[#099427] rounded-[4px] text-white hover:bg-green-700 transition-colors">
            <img src={askmentor} alt="Ask a Mentor" className="w-[16px] h-[16px]" />
            <span className="text-[12px] leading-[24px] font-poppins">Ask a Mentor</span>
          </button>
          <button className="w-full h-[32px] flex items-center justify-center gap-2 px-4 py-1 bg-[#1F5CAC] rounded-[4px] text-white hover:bg-blue-800 transition-colors">
            <img src={download} alt="Interview Q/A" className="w-[16px] h-[16px]" />
            <span className="text-[12px] leading-[24px] font-poppins">Interview Q/A</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
