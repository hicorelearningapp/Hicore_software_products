import React, { useEffect, useState } from "react";

/* TAB CONTENT */
import FlashCard from "./FlashCard";
import FormulaSheets from "./FormulaSheets";
import Diagrams from "./Diagrams";

/* ICON */
import headerIcon from "../../../assets/Revision/first-icon.png";

const tabs = ["Flashcards", "Formula sheets", "Diagrams"];

const RevisionTab = ({ revisionData, onBack }) => {
  const {
    subject,
    className,
    chapterName,
    unitsList = [],
  } = revisionData || {};

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedUnit, setSelectedUnit] = useState(null);

  /* ---------- INIT SELECTED UNIT (ONLY ON LOAD / CHAPTER CHANGE) ---------- */
  useEffect(() => {
    if (!unitsList.length) return;

    let unit = unitsList.find(
      (u) => u.chapterName === chapterName || u.title === chapterName
    );

    if (!unit) unit = unitsList[0];
    setSelectedUnit(unit);
  }, [unitsList, chapterName]);

  /* ---------- TAB CONTENT ---------- */
  const renderTabContent = () => {
    if (!selectedUnit) return null;

    switch (activeTab) {
      case "Flashcards":
        return <FlashCard subject={subject} unit={selectedUnit} />;
      case "Formula sheets":
        return <FormulaSheets subject={subject} unit={selectedUnit} />;
      case "Diagrams":
        return <Diagrams subject={subject} unit={selectedUnit} />;
      default:
        return null;
    }
  };

  if (!revisionData) return null;

  return (
    <div className="w-full bg-[#f7f9ff] py-8">
      <div className="mx-5 bg-white rounded-2xl">
        {/* BACK */}
        <button
          onClick={onBack}
          className="mb-6 px-5 py-2 bg-[#2758B3] text-white rounded-full"
        >
          ← Back to Revision Topics
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-5 mb-6">
          <img src={headerIcon} alt="Revision" className="w-20 h-20" />
          <p className="text-[#1E47A1] text-md font-medium">
            Rapid Revision Hub – Focused revision for {subject}
          </p>
        </div>

        <div className="flex gap-6">
          {/* LEFT PANEL */}
          <div className="w-[240px] border border-blue-200 rounded-xl p-4 overflow-y-auto">
            <h3 className="text-[#2758B3] font-semibold mb-4">
              {subject} {className && `(${className})`}
            </h3>

            {unitsList.map((unit) => (
              <button
                key={unit.id || unit.chapterName}
                onClick={() => setSelectedUnit(unit)}
                className={`w-full text-left px-3 py-2 mb-2 rounded-md text-sm transition
                  ${
                    selectedUnit === unit
                      ? "bg-[#E8F0FF] text-[#0056FB] font-semibold"
                      : "text-[#2758B3] hover:bg-blue-50"
                  }`}
              >
                {unit.title || unit.chapterName}
              </button>
            ))}
          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1">
            {/* TABS */}
            <div className="grid grid-cols-3 rounded-t-xl overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 text-sm font-medium transition
                    ${
                      activeTab === tab
                        ? "bg-[#b7cdfd] text-[#1E47A1]"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* CONTENT */}
            <div className="border border-blue-200 rounded-b-2xl rounded-tr-2xl bg-white p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevisionTab;
