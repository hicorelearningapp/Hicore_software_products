// src/Components/ExamPage/LearnTab/Contentpage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import progressiconFallback from "../../../assets/Learn/progressbar.png";
import quiziconFallback from "../../../assets/Learn/quizquestions.png";

import Notestab from "./Notestab";
import Formulatab from "./Formulatab";
import Realworldtab from "./Realworldtab";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/** create a canonical exam id (lowercase, spaces -> hyphens) */
const toExamId = (s = "") =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

const Contentpage = ({
  onBack,
  subjectName = "",
  className = "",
  chapterName,
}) => {
  const { examName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const examId = toExamId(examName || "neet");

  // detect university mode via query params in URL
  const qs = useMemo(
    () => new URLSearchParams(location.search || ""),
    [location.search]
  );
  const queryUniversity = (qs.get("university") || "").trim();
  const queryBranch = (qs.get("branch") || "").trim();
  const querySubject = (qs.get("subject") || "").trim();
  const isUniversityMode = Boolean(queryUniversity);

  const [subjectData, setSubjectData] = useState([]); // units array for selected subject
  const [activeTab, setActiveTab] = useState("Notes");
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [imagesMap, setImagesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = ["Notes", "Formula Sheets", "Real World"];
  const normalizedClass = String(className).replace(/[^0-9]/g, "");

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchFromCourseApi = async () => {
      const base = (API_BASE || "").replace(/\/$/, "");
      const url = `${base}/course/${encodeURIComponent(examId)}/learn`;
      const res = await fetch(url, {
        signal: controller.signal,
        cache: "no-store",
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(
          `Course API returned ${res.status}${txt ? ": " + txt : ""}`
        );
      }
      return res.json();
    };

    const fetchFromUniversityApi = async () => {
      const base = (API_BASE || "").replace(/\/$/, "");
      const url = `${base}/university/learn${location.search || ""}`; // preserve full query string
      const res = await fetch(url, {
        signal: controller.signal,
        cache: "no-store",
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(
          `University API returned ${res.status}${txt ? ": " + txt : ""}`
        );
      }
      return res.json();
    };

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let json = null;

        if (isUniversityMode) {
          // prefer university endpoint; fall back to course endpoint if it fails
          try {
            json = await fetchFromUniversityApi();
          } catch (univErr) {
            console.warn(
              "University fetch failed, falling back to course API:",
              univErr
            );
            json = await fetchFromCourseApi();
          }
        } else {
          json = await fetchFromCourseApi();
        }

        if (!mounted) return;

        // backend may return { images: [...], data: {...} } or { data: {...} } or directly {...}
        const payload = json && json.data ? json.data : json;
        const images = Array.isArray(json?.images)
          ? json.images
          : Array.isArray(payload?.images)
          ? payload.images
          : null;

        const imgMap = {};
        if (images) {
          images.forEach((it) => {
            if (it && it.name && it.url) {
              imgMap[String(it.name).trim()] = String(it.url).trim();
            }
          });
        }
        setImagesMap(imgMap);

        // payload is expected to be object where keys are subjects e.g. "Physics" => [units...]
        if (!payload || typeof payload !== "object") {
          setSubjectData([]);
          return;
        }

        // tolerant subject key matching: exact -> case-insensitive -> substring
        let units = Array.isArray(payload[subjectName])
          ? payload[subjectName]
          : null;
        if (!units) {
          const keys = Object.keys(payload || {});
          const lower = (subjectName || "").trim().toLowerCase();
          const exactKey = keys.find(
            (k) =>
              String(k || "")
                .trim()
                .toLowerCase() === lower
          );
          if (exactKey)
            units = Array.isArray(payload[exactKey]) ? payload[exactKey] : null;
        }
        if (!units) {
          const keys = Object.keys(payload || {});
          const lower = (subjectName || "").trim().toLowerCase();
          const substrKey = keys.find(
            (k) =>
              String(k || "")
                .toLowerCase()
                .includes(lower) ||
              lower.includes(String(k || "").toLowerCase())
          );
          if (substrKey)
            units = Array.isArray(payload[substrKey])
              ? payload[substrKey]
              : null;
        }

        units = Array.isArray(units) ? units : [];

        // filter units by class if className provided (matches digits)
        const filtered = units.filter((unit) => {
          if (!normalizedClass) return true;
          const uc = String(unit.class || "")
            .replace(/[^0-9]/g, "")
            .trim();
          return uc === normalizedClass;
        });

        setSubjectData(filtered.length > 0 ? filtered : units);
      } catch (err) {
        console.error("Error loading content:", err);
        if (mounted) {
          setError(err.message || "Failed to load content");
          setSubjectData([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, subjectName, normalizedClass, location.search, isUniversityMode]);

  // pick default selected unit/topic when subjectData changes or chapterName provided
  useEffect(() => {
    if (!subjectData || subjectData.length === 0) {
      setSelectedUnit(null);
      setSelectedTopicIndex(0);
      return;
    }

    let defaultUnit = subjectData[0];
    let defaultTopicIndex = 0;

    // prefer a unit that matches unit.chapterName === chapterName
    if (chapterName) {
      const found = subjectData.find(
        (u) => String(u.chapterName || "") === String(chapterName || "")
      );
      if (found) {
        defaultUnit = found;
        // if found, try to pick topic index 0 (or possibly find topic by same name — not necessary)
        defaultTopicIndex = 0;
      } else {
        // maybe chapterName is a topic name; search topics
        for (const u of subjectData) {
          const idx = (u.topics || []).findIndex((t) => t.name === chapterName);
          if (idx !== -1) {
            defaultUnit = u;
            defaultTopicIndex = idx;
            break;
          }
        }
      }
    }

    // if normalizedClass exists, prefer a unit that matches class
    if (normalizedClass) {
      const matchByClass = subjectData.find((u) => {
        const uc = String(u.class || "")
          .replace(/[^0-9]/g, "")
          .trim();
        return uc === normalizedClass;
      });
      if (matchByClass) defaultUnit = matchByClass;
    }

    setSelectedUnit(defaultUnit);
    setSelectedTopicIndex(defaultTopicIndex);
    // scroll to top of content area
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [subjectData, chapterName, normalizedClass]);

  const renderTabContent = () => {
    if (!selectedUnit) return <p>No Content Available</p>;

    const selectedTopic = selectedUnit.topics?.[selectedTopicIndex];
    if (!selectedTopic) return <p>No Content Available</p>;

    switch (activeTab) {
      case "Notes":
        return <Notestab selectedTopic={selectedTopic} />;
      case "Formula Sheets":
        return <Formulatab selectedTopic={selectedTopic} />;
      case "Real World":
        return <Realworldtab selectedTopic={selectedTopic} />;
      default:
        return null;
    }
  };

  // Updated: navigate to university overview with tab=Practice when in university mode
  const handlePracticeClick = () => {
    if (isUniversityMode) {
      try {
        // build search params preserving existing ones and forcing tab=Practice
        const newParams = new URLSearchParams(location.search || "");
        newParams.set("tab", "Practice");
        // ensure the route is /university/overview
        navigate(`/university/overview?${newParams.toString()}`);
      } catch {
        // fallback: simple path if something goes wrong
        navigate(`/university/overview?tab=Practice`);
      }
      return;
    }

    // default course route
    navigate(`/course/${examName}/roadmap?tab=Practice`);
  };

  const handleBackClick = () => {
    try {
      if (subjectName)
        localStorage.setItem(`learn_active_tab_${examId}`, subjectName);
      if (className)
        localStorage.setItem(
          `learn_open_class_${examId}`,
          `class-${className}`
        );
    } catch {}
    if (onBack) onBack();
  };

  // image fallbacks if backend does not provide urls
  const progressicon = imagesMap?.progressicon || progressiconFallback;
  const quizicon = imagesMap?.quizicon || quiziconFallback;

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Back Button */}
      <div className="w-full px-6 pt-6 mb-4">
        <button
          onClick={handleBackClick}
          className="px-5 py-2 bg-[#2758B3] text-white rounded-full shadow-md hover:bg-[#1E3A8A]"
        >
          ← Back to Chapters
        </button>
      </div>

      {loading && (
        <p className="text-center text-blue-700 font-medium">
          Loading content...
        </p>
      )}

      {!loading && error && (
        <p className="text-center text-red-600 font-semibold">Error: {error}</p>
      )}

      {!loading && !selectedUnit && !error && (
        <p className="text-center text-red-600 font-semibold">
          ❗ No Chapters Found for {subjectName}{" "}
          {normalizedClass ? `(Class ${normalizedClass})` : ""}
        </p>
      )}

      {!loading && selectedUnit && (
        <div className="w-full grid grid-cols-[25%_75%] px-[36px] pb-[36px] gap-[36px]">
          {/* LEFT PANEL */}
          <div className="flex flex-col gap-[16px] min-h-[85vh]">
            <div className="border border-[#B0CBFE] rounded-lg p-[16px]">
              <h2 className="text-[16px] font-semibold text-[#2758B3] text-center mb-2">
                {subjectName} Progress{" "}
                {normalizedClass ? `(Class ${normalizedClass})` : ""}
              </h2>
            </div>

            {/* Topics List */}
            <div
              className="border border-[#B0CBFE] rounded-lg p-[16px] overflow-y-scroll"
              style={{
                maxHeight: "100vh",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style>{`div::-webkit-scrollbar { display: none; }`}</style>

              {subjectData.map((unit) => (
                <div key={unit.id ?? unit.title} className="mb-4">
                  <h2
                    className={`text-[16px] font-semibold cursor-pointer ${
                      selectedUnit?.id === unit.id
                        ? "text-[#0056FB] underline"
                        : "text-[#2758B3] hover:text-[#003E9F]"
                    }`}
                    onClick={() => {
                      setSelectedUnit(unit);
                      setSelectedTopicIndex(0);
                    }}
                  >
                    {unit.title || unit.chapterName}
                  </h2>

                  {unit.topics?.length > 0 ? (
                    <ul className="list-disc mt-2 pl-5 text-[#2758B3] leading-[28px]">
                      {unit.topics.map((topic, i) => (
                        <li
                          key={i}
                          className={`cursor-pointer ${
                            selectedUnit?.id === unit.id &&
                            selectedTopicIndex === i
                              ? "text-[#0056FB] text-[15px] font-semibold underline"
                              : "text-blue-900 text-[16px]"
                          }`}
                          onClick={() => {
                            setSelectedUnit(unit);
                            setSelectedTopicIndex(i);
                          }}
                        >
                          {topic.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-red-500 pl-2 mt-1">
                      Topics Coming Soon...
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex flex-col">
            {/* Tabs */}
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 h-[42px] flex items-center border-blue-300 border-b justify-center ${
                    activeTab === tab
                      ? "bg-[#B0CBFE] text-black rounded-t-[16px]"
                      : "bg-white text-[#999999]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Header */}
            <div className="border border-t-0 border-[#B0CBFE] bg-white p-[24px]">
              <h2 className="text-[16px] font-semibold text-[#2758B3]">
                {selectedUnit.title || selectedUnit.chapterName} —{" "}
                {selectedUnit.topics?.[selectedTopicIndex]?.name || "No Topic"}
              </h2>
            </div>

            {/* Content */}
            <div
              className="min-h-screen border border-t-0 border-[#B0CBFE] rounded-b-[16px] bg-white p-[24px] overflow-y-auto scrollbar-hide"
              style={{ maxHeight: "100vh" }} // adjust height if needed
            >
              {renderTabContent()}
            </div>

            {/* Congrats */}
            <div className="w-full h-[100px] bg-[#E4FFE4] mt-4 p-[16px] flex items-center justify-between rounded-lg">
              <div>
                <p className="font-semibold text-[#008000]">Great Job!</p>
                <p className="text-[14px] text-[#008000]">
                  You are learning{" "}
                  {selectedUnit.topics?.[selectedTopicIndex]?.name || ""}
                </p>
              </div>
              <button
                onClick={handlePracticeClick}
                className="h-[44px] flex gap-2 items-center px-4 rounded-full bg-[#2758B3] text-white"
              >
                Practice Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contentpage;
