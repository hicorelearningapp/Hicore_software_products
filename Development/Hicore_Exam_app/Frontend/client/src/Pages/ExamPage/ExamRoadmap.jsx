// src/Pages/ExamPage/ExamRoadmap.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import OverviewTab from "./OverviewTab/OverviewTab";
import Learn from "./LearnTab/Learn";
import PracticeTab from "./PracticeTab/PracticeTab";
import ExamTab from "./ExamTab/ExamTab";
import AnalyseTab from "./AnalyseTab/AnalyseTab";
import Contentpage from "./LearnTab/Contentpage";
import RevisionTab from "./RevisionTab/RevisionTab";
import RevisionFront from "./RevisionTab/RevisionFront";
import PracticeScreen from "./PracticeTab/PracticeScreen";
import TestScreen from "./ExamTab/TestScreen";
import ReferenceTab from "./ReferenceTab/ReferenceTab";
import ExtrasTab from "./ExtrasTab/ExtrasTab";

/**
 * Roadmap page used for:
 * - /course/:examName/roadmap
 */
const ExamRoadmap = () => {
  const { examName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  /* ---------------- Tabs ---------------- */
  const tabs = useMemo(
    () => [
      "Overview",
      "Learn",
      "Practice",
      "Unit Test",
      "Analyze",
      "Revision",
      "Reference",
    //  "Extras",
    ],
    []
  );

  const q = useMemo(
    () => new URLSearchParams(location.search || ""),
    [location.search]
  );

  const displayExamName = examName ? examName.toUpperCase() : "";

  const initialTab = (() => {
    const tabFromQuery = q.get("tab");
    if (tabFromQuery && tabs.includes(tabFromQuery)) return tabFromQuery;
    return "Overview";
  })();

  const [activeTab, setActiveTab] = useState(initialTab);

  /* ---------------- Shared State ---------------- */
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const [selectedUnitData, setSelectedUnitData] = useState(null);
  const [selectedPracticeSet, setSelectedPracticeSet] = useState(null);

  const [selectedTestUnitData, setSelectedTestUnitData] = useState(null);

  /* ---------------- Revision State ---------------- */
  const [selectedRevisionData, setSelectedRevisionData] = useState(null);

  /* ---------------- Helpers ---------------- */
  const buildSearch = (obj = {}) => {
    const parts = [];
    for (const key of Object.keys(obj)) {
      if (obj[key] == null) continue;
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    }
    return parts.length ? `?${parts.join("&")}` : "";
  };

  const pushTabToUrl = (tabName) => {
    const search = buildSearch({ tab: tabName });
    navigate({ pathname: `/course/${examName}/roadmap`, search });
  };

  /* ---------------- Sync tab from URL ---------------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabFromQuery = params.get("tab");
    if (tabFromQuery && tabs.includes(tabFromQuery)) {
      setActiveTab(tabFromQuery);
    }
  }, [location.search, tabs]);

  /* ---------------- Handlers ---------------- */

  // Learn
  const handleChapterClick = (subject, classNumber) => {
    setSelectedSubject(subject);
    setSelectedClass(classNumber);
    setActiveTab("Learn");
    pushTabToUrl("Learn");
  };

  const handleBackToLearn = () => {
    setSelectedSubject(null);
    setSelectedClass(null);
  };

  // Practice
  const handlePracticeClick = (subject, className, selectedUnit, unitsList) => {
    setSelectedSubject(subject);
    setSelectedClass(className);
    setSelectedUnitData({ selectedUnit, unitsList });
    setSelectedPracticeSet(null);
    setActiveTab("Practice");
    pushTabToUrl("Practice");
  };

  const handleBackToPractice = () => {
    setSelectedUnitData(null);
    setSelectedPracticeSet(null);
  };

  // Unit Test
  const handleTestClick = (subject, className, selectedUnit, unitsList) => {
    setSelectedSubject(subject);
    setSelectedClass(className);
    setSelectedTestUnitData({ selectedUnit, unitsList });
    setActiveTab("Unit Test");
    pushTabToUrl("Unit Test");
  };

  const handleBackToTest = () => {
    setSelectedTestUnitData(null);
  };

  // Revision
  const handleRevisionChapterClick = (
    subject,
    className,
    chapterName,
    unitsList
  ) => {
    setActiveTab("Revision");
    pushTabToUrl("Revision");

    setSelectedRevisionData({
      subject,
      className,
      chapterName,
      unitsList,
    });
  };

  const handleBackToRevisionFront = () => {
    setSelectedRevisionData(null);
  };

  // Top Tabs
  const handleTabClick = (tab) => {
    if (!tabs.includes(tab)) return;

    setActiveTab(tab);
    pushTabToUrl(tab);

    if (tab !== "Learn") {
      setSelectedSubject(null);
      setSelectedClass(null);
    }
    if (tab !== "Practice") {
      setSelectedUnitData(null);
      setSelectedPracticeSet(null);
    }
    if (tab !== "Unit Test") {
      setSelectedTestUnitData(null);
    }

    // Always reset revision when leaving OR re-entering
    if (tab !== "Revision") {
      setSelectedRevisionData(null);
    }
    if (tab === "Revision") {
      setSelectedRevisionData(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* HEADER */}
      <div className="bg-blue-50 w-full flex flex-col items-center px-6 py-12">
        <button
          onClick={() => navigate(`/course/${examName}`)}
          className="self-start text-blue-900 cursor-pointer flex items-center gap-2 mb-6"
        >
          ← Back
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-[#1E40AF] mb-4 text-center">
          Your {displayExamName} Preparation Roadmap
        </h1>

        <p className="text-blue-900 text-center max-w-7xl">
          Plan smart, learn properly, and achieve your goal faster!
        </p>
      </div>

      {/* BODY */}
      <div className="w-full px-10">
        <div className="flex flex-col items-center py-12 bg-white">
          {/* TABS */}
          <div className="flex flex-wrap justify-center gap-4 border p-2 rounded-full border-[#D9E6FE] w-full max-w-8xl mb-8">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(tab)}
                className={`relative w-[130px] py-2 font-medium rounded-full transition ${
                  activeTab === tab
                    ? "text-white bg-[#1E40AF] after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:top-full after:w-0 after:h-0 after:border-l-[20px] after:border-r-[20px] after:border-t-[42px] after:border-l-transparent after:border-r-transparent after:border-t-[#1E40AF]"
                    : "text-[#1E40AF] bg-transparent"
                }`}
              >
                {`${index + 1}. ${tab}`}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="w-full max-w-8xl border min-h-screen border-[#2758B3] rounded-lg bg-white p-6">
            {activeTab === "Overview" && <OverviewTab examName={examName} />}

            {activeTab === "Learn" &&
              (selectedSubject && selectedClass ? (
                <Contentpage
                  examName={examName}
                  subjectName={selectedSubject}
                  className={selectedClass}
                  onBack={handleBackToLearn}
                />
              ) : (
                <Learn
                  examName={examName}
                  onChapterClick={handleChapterClick}
                />
              ))}

            {activeTab === "Practice" &&
              (selectedUnitData ? (
                <PracticeScreen
                  onBack={handleBackToPractice}
                  subjectName={selectedSubject}
                  className={selectedClass}
                  unitData={selectedUnitData}
                  selectedPracticeSet={selectedPracticeSet}
                  onSelectPracticeSet={setSelectedPracticeSet}
                />
              ) : (
                <PracticeTab
                  examName={examName}
                  onPracticeClick={handlePracticeClick}
                />
              ))}

            {activeTab === "Unit Test" &&
              (selectedTestUnitData ? (
                <TestScreen
                  onBack={handleBackToTest}
                  subjectName={selectedSubject}
                  className={selectedClass}
                  unitsList={selectedTestUnitData.unitsList}
                  selectedUnit={selectedTestUnitData.selectedUnit}
                />
              ) : (
                <ExamTab examName={examName} onExamClick={handleTestClick} />
              ))}

            {activeTab === "Analyze" && <AnalyseTab examName={examName} />}

            {activeTab === "Revision" &&
              (selectedRevisionData ? (
                <RevisionTab
                  examName={examName}
                  revisionData={selectedRevisionData}
                  onBack={handleBackToRevisionFront}
                />
              ) : (
                <RevisionFront onChapterClick={handleRevisionChapterClick} />
              ))}

            {activeTab === "Reference" && <ReferenceTab examName={examName} />}
            {activeTab === "Extras" && <ExtrasTab examName={examName} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamRoadmap;
