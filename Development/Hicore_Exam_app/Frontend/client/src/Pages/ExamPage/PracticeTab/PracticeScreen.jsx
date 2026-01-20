import React, { useEffect, useState } from "react";
import progressicon from "../../../assets/Learn/progressbar.png";
import UnitTest from "./UnitTest";

/**
 * PracticeScreen (updated)
 *
 * - Works with UnitTest component that expects the new structured question schema:
 *   question: [{type: "text"|"formula", value, difficulty?}, ...]
 *   options: [{ label: "A", items: [{type:"text"|"formula", value}, ...] }, ...]
 *   answer: "A"
 *   explanation: [{type:"text"|"formula", value}, ...]
 *
 * - No design changes: keeps your left/right layout, unit list and practice sets.
 * - Minor reliability improvements: safer initialization & effect handling.
 */

const PracticeScreen = ({
  onBack,
  subjectName,
  className,
  unitData = {}, // { selectedUnit, unitsList }
  selectedPracticeSet,
  onSelectPracticeSet = () => {},
}) => {
  const normalizedClass = String(className).replace(/[^0-9]/g, "");
  const { selectedUnit: initialSelectedUnit, unitsList = [] } = unitData;

  // Active unit and selected set
  const [activeUnit, setActiveUnit] = useState(
    initialSelectedUnit || unitsList[0] || null
  );
  const [selectedSet, setSelectedSet] = useState(
    selectedPracticeSet ||
      (initialSelectedUnit?.practiceSets?.[0] ??
        unitsList?.[0]?.practiceSets?.[0] ??
        null)
  );

  // When unitsList or incoming props change, ensure internal state stays in sync
  useEffect(() => {
    // If activeUnit not present or unitsList changed, pick a sensible default
    if (!activeUnit && unitsList.length > 0) {
      setActiveUnit(unitsList[0]);
    } else if (activeUnit) {
      // try to find matching unit by id in new unitsList (keeps reference stable across navigation)
      const found =
        unitsList.find((u) => u.id === activeUnit.id) || unitsList[0] || null;
      if (found && found.id !== activeUnit.id) {
        setActiveUnit(found);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitsList]);

  // When activeUnit or selectedPracticeSet prop changes, set the selectedSet
  useEffect(() => {
    if (selectedPracticeSet) {
      setSelectedSet(selectedPracticeSet);
      // ensure parent is aware (idempotent if parent already set)
      onSelectPracticeSet?.(selectedPracticeSet);
    } else if (activeUnit?.practiceSets?.length > 0) {
      const defaultSet = activeUnit.practiceSets[0];
      setSelectedSet(defaultSet);
      onSelectPracticeSet?.(defaultSet);
    } else {
      setSelectedSet(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUnit, selectedPracticeSet]);

  const handleUnitChange = (unit) => {
    setActiveUnit(unit);
    const defaultSet = unit.practiceSets?.[0] ?? null;
    setSelectedSet(defaultSet);
    onSelectPracticeSet?.(defaultSet);
    // scroll to top of practice area (keeps UX similar to before)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSetSelect = (unit, setObj) => {
    setActiveUnit(unit);
    setSelectedSet(setObj);
    onSelectPracticeSet?.(setObj);
    // bring focus to the practice panel
    const practicePanel = document.querySelector("#practice-right-panel");
    if (practicePanel) practicePanel.focus();
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Back */}
      <div className="w-full px-6 pt-6 mb-4">
        <button
          onClick={onBack}
          className="px-5 py-2 bg-[#2758B3] text-white rounded-full shadow-md hover:bg-[#1E3A8A]"
          type="button"
        >
          ← Back to Practice
        </button>
      </div>

      {/* Main Layout */}
      <div className="w-full grid grid-cols-[25%_75%] px-[36px] pb-[36px] gap-[36px]">
        {/* LEFT PANEL */}
        <div className="flex flex-col gap-[16px] h-[100vh]">
          {/* Progress Box */}
          <div className="border border-[#B0CBFE] rounded-lg p-[16px] flex-shrink-0">
            <h2 className="text-[16px] font-semibold text-[#2758B3] text-center">
              {subjectName} Practice (Class {normalizedClass})
            </h2>
          </div>

          {/* Units + Sets List - Scrollable */}
          <div
            className="border border-[#B0CBFE] rounded-lg p-[16px] overflow-y-auto"
            style={{
              height: "100%", // fills remaining height
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>

            {unitsList?.length > 0 ? (
              unitsList.map((unit) => (
                <div key={unit.id ?? unit.unit} className="mb-8">
                  {/* Unit Title */}
                  <h2
                    onClick={() => handleUnitChange(unit)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleUnitChange(unit)
                    }
                    className={`text-[16px] font-medium underline cursor-pointer ${
                      activeUnit?.id === unit.id
                        ? "text-[#0056FB]"
                        : "text-[#2758B3]"
                    }`}
                  >
                    Unit {unit.id}: {unit.unit}
                  </h2>

                  {/* Practice Sets */}
                  <ul className="list-disc mt-4 pl-5 text-[#2758B3] leading-[30px]">
                    {unit.practiceSets?.map((setObj, i) => {
                      const isActiveSet =
                        selectedSet?.name === setObj.name &&
                        activeUnit?.id === unit.id;

                      return (
                        <li
                          key={setObj.name ?? i}
                          onClick={() => handleSetSelect(unit, setObj)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSetSelect(unit, setObj)
                          }
                          className={`cursor-pointer ${
                            isActiveSet
                              ? "text-[#0056FB] text-[15px]  underline"
                              : "text-blue-900 text-[15px]"
                          }`}
                        >
                          {setObj.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-center text-[#999] py-4">No units available</p>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col">
          <div className="flex">
            <button
              className="flex-1 h-[42px] bg-[#B0CBFE] text-black rounded-t-[16px]"
              type="button"
            >
              Practice
            </button>
          </div>

          {/* Right Content */}
          <div
            id="practice-right-panel"
            tabIndex={-1}
            className="border border-t-0 border-[#B0CBFE] rounded-b-[16px] bg-white p-[24px] min-h-screen"
          >
            {selectedSet ? (
              // UnitTest expects structured questions (question array, options objects with label/items, answer label, explanation array)
              <UnitTest
                key={`${activeUnit?.id ?? "unit"}-${selectedSet.name}`}
                unitName={activeUnit?.unit ?? ""}
                practiceSetName={selectedSet.name}
                questions={selectedSet.questions ?? []}
              />
            ) : (
              <p className="text-gray-500">Select a practice set to start</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeScreen;
