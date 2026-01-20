import React, { useState, useEffect } from "react";
import progressicon from "../../../assets/Learn/progressbar.png";
import UnitTest from "./UnitTest";

const TestScreen = ({
  onBack,
  subjectName,
  className,
  unitsList = [],
  selectedUnit,
}) => {
  const normalizedClass = String(className).replace(/[^0-9]/g, "");
  const [activeUnit, setActiveUnit] = useState(selectedUnit);

  useEffect(() => {
    setActiveUnit(selectedUnit);
  }, [selectedUnit]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Back Button */}
      <div className="w-full px-6 pt-6 mb-4">
        <button
          onClick={onBack}
          className="px-5 py-2 bg-[#2758B3] text-white rounded-full shadow-md hover:bg-[#1E3A8A]"
        >
          ← Back to Test
        </button>
      </div>

      {/* Main Layout */}
      <div className="w-full grid grid-cols-[25%_75%] px-[36px] pb-[36px] gap-[36px]">
        {/* LEFT PANEL */}
        <div className="flex flex-col gap-[16px] h-[120vh]">
          {/* Header Box */}
          <div className="border border-[#B0CBFE] rounded-lg p-[16px] flex-shrink-0">
            <h2 className="text-[16px] font-semibold text-[#2758B3] text-center">
              Unit-Wise Test ({subjectName} - Class {normalizedClass})
            </h2>
          </div>

          {/* Units List - Scrollable */}
          <div
            className="border border-[#B0CBFE] rounded-lg p-[16px] overflow-y-auto"
            style={{
              height: "100%",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>

            {unitsList.map((unit, index) => {
              const isActive = activeUnit?.unit === unit.unit;
              return (
                <div key={index} className="mb-5">
                  <h2
                    onClick={() => setActiveUnit(unit)}
                    className={`text-[16px] font-semibold cursor-pointer ${
                      isActive ? "text-[#0056FB] underline" : "text-[#2758B3]"
                    }`}
                  >
                    Unit {index + 1}: {unit.unit}
                  </h2>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col">
          <div className="flex">
            <button className="flex-1 h-[42px] bg-[#B0CBFE] text-black rounded-t-[16px] font-medium">
              Unit-Wise Test
            </button>
          </div>

          <div className="border border-t-0 border-[#B0CBFE] rounded-b-[16px] bg-white p-[24px] min-h-screen">
            {!activeUnit ? (
              <p className="text-gray-500 text-center mt-20">
                Select a Unit to Start Test
              </p>
            ) : (
              <UnitTest
                unit={activeUnit}
                subjectName={subjectName} // ✅ THIS IS THE FIX
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestScreen;
