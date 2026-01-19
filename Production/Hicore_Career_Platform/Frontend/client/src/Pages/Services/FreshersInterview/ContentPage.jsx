import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Lesson from "./lesson";
import QuickQuiz from "./Quickquiz";
import Test from "./Test";
import Leaderboard from "./Leaderboard";
import headerBg from "../../../assets/FreshersInterview/contentbg.png";

const ContentPage = () => {
  const { weekId, topicId } = useParams();

  const [activeTab, setActiveTab] = useState("lesson");
  const [activeSubheading, setActiveSubheading] = useState("");
  const [lessonData, setLessonData] = useState({});
  const [visitedTabs, setVisitedTabs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

  // ✅ Fetch lesson data
  useEffect(() => {
    const fetchLessonData = async () => {
      if (!weekId || !topicId) return;
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/freshers/week/${weekId}/card/${topicId}`);
        if (!res.ok) throw new Error(`Failed to fetch content. Status: ${res.status}`);
        const data = await res.json();

        // normalize keys dynamically
        const weekKey = Object.keys(data)[0];
        const topicKey = Object.keys(data[weekKey])[0];
        const topicData = data[weekKey][topicKey];

        setLessonData({
          [weekId]: {
            [topicId]: topicData,
          },
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonData();
  }, [weekId, topicId, API_BASE]);

  // Reset when topic changes
  useEffect(() => {
    setActiveTab("lesson");
    setActiveSubheading("");
  }, [topicId]);

  /** ✅ Handle subheading click */
  const handleSubheadingClick = (subheading) => {
    setActiveSubheading(subheading);
    setActiveTab("lesson");
  };

  /** ✅ Handle tab visit (tracks lesson / quiz / test progress) */
  const handleTabVisit = useCallback(
    (tabName) => {
      if (!activeSubheading) return; // only track when subheading selected
      setVisitedTabs((prev) => {
        const subVisits = prev[activeSubheading] || {};
        if (subVisits[tabName]) return prev; // already visited
        return {
          ...prev,
          [activeSubheading]: { ...subVisits, [tabName]: true },
        };
      });
    },
    [activeSubheading]
  );

  // ✅ Trigger tab visit when user switches tabs
  useEffect(() => {
    handleTabVisit(activeTab);
  }, [activeTab, handleTabVisit]);

  /** Helper: get data for active subheading */
  const getSubheadingData = (subheadingName) => {
    const topicData = lessonData[weekId]?.[topicId];
    if (!topicData?.lesson) return null;
    for (const section of topicData.lesson) {
      const found = section.subheadings?.find(
        (s) => s.subheading === subheadingName
      );
      if (found) return found;
    }
    return null;
  };

  const activeSubheadingData = useMemo(
    () => getSubheadingData(activeSubheading),
    [activeSubheading, lessonData, weekId, topicId]
  );

  const filteredQuizQuestions = useMemo(
    () =>
      activeSubheadingData?.quiz?.questions ??
      activeSubheadingData?.quiz?.data ??
      [],
    [activeSubheadingData]
  );

  const filteredTestQuestions = useMemo(
    () =>
      activeSubheadingData?.timedTest?.questions ??
      activeSubheadingData?.timedTest?.data ??
      [],
    [activeSubheadingData]
  );

  const topicContent = lessonData[weekId]?.[topicId];

  // ✅ Progress calculation logic
  const { completed, total, percentage } = useMemo(() => {
    let total = 0;
    let completed = 0;

    const allLessons = topicContent?.lesson || [];
    allLessons.forEach((section) => {
      section.subheadings?.forEach((sub) => {
        total += 3; // lesson + quickquiz + timedtest
        const visited = visitedTabs[sub.subheading] || {};
        if (visited.lesson) completed += 1;
        if (visited.quickquiz) completed += 1;
        if (visited.timedtest) completed += 1;
      });
    });

    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage: pct };
  }, [topicContent, visitedTabs]);

  useEffect(() => {
    console.log("📊 Mastery Progress:", { completed, total, percentage, visitedTabs });
  }, [completed, total, percentage]);

  // ✅ Loading / error / no data
  if (isLoading)
    return <div className="text-center mt-10 text-xl font-semibold text-gray-500">Loading content...</div>;
  if (error)
    return <div className="text-center mt-10 text-xl font-semibold text-red-600">Error: {error}</div>;
  if (!topicContent)
    return <div className="text-center mt-10 text-xl font-semibold text-gray-500">📝 Content Coming Soon...</div>;

  return (
    <div className="w-full h-fit">
      {/* ===== Header ===== */}
      <div
        className="w-full h-[64px] pt-1 pb-1 bg-no-repeat mt-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${headerBg})` }}
      >
        <h2 className="w-full max-w-[1370px] mx-auto text-white text-[28px] font-semibold leading-[56px] text-center font-poppins">
          {topicContent.heading || "Topic Heading"}
        </h2>
      </div>

      {/* ===== Main Layout ===== */}
      <div className="w-full h-fit p-6 flex flex-col lg:flex-row gap-5 items-start">
        {/* Sidebar */}
        <div className="w-full lg:w-[280px] flex-shrink-0">
          <Sidebar
            percentage={percentage}
            activeSubheading={activeSubheading}
            onSubheadingClick={handleSubheadingClick}
            lessonData={lessonData}
          />
        </div>

        {/* Center Content */}
        <div className="flex-grow min-w-0 w-full lg:w-[800px] h-[900px] p-2 gap-2 border border-[#EBEAF2] rounded-[8px] flex flex-col items-center overflow-y-auto">
          {/* Tabs */}
          <div className="w-full h-auto flex justify-between p-1 rounded-[4px] border border-[#EBEAF2] mb-4">
            {[
              { label: "Lesson", key: "lesson" },
              { label: "Quick Quiz", key: "quickquiz" },
              { label: "Timed Test", key: "timedtest" },
            ].map(({ label, key }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full h-[32px] px-4 py-1 rounded-[4px] text-[14px] font-poppins font-medium text-center transition-colors duration-200 ${
                  activeTab === key
                    ? "bg-[#F4F3FA] border border-[#343079] text-[#343079]"
                    : "text-[#343079] hover:bg-gray-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Content Display */}
          <div className="w-full h-fit px-2">
            {activeTab === "lesson" && (
              <Lesson
                key="lesson-tab"
                activeSubheading={activeSubheading}
                lessonData={lessonData}
              />
            )}
            {activeTab === "quickquiz" && (
              <QuickQuiz key="quickquiz-tab" questions={filteredQuizQuestions} />
            )}
            {activeTab === "timedtest" && (
              <Test
                key="timedtest-tab"
                testData={{
                  ...activeSubheadingData?.timedTest,
                  questions: filteredTestQuestions,
                }}
              />
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="hidden lg:block w-[280px] flex-shrink-0">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
