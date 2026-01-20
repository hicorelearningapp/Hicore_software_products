// src/Components/ExamPage/LearnTab/Learn.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import bookicon from "../../../assets/Learn/book.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/** create a canonical exam id (lowercase, spaces -> hyphens) */
const toExamId = (s = "") =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

const Learn = ({ onChapterClick }) => {
  const { examName } = useParams();
  const location = useLocation();
  const examId = toExamId(examName || "neet");

  // detect university mode via query param
  const qs = useMemo(
    () => new URLSearchParams(location.search || ""),
    [location.search]
  );
  const queryUniversity = (qs.get("university") || "").trim();
  const queryBranch = (qs.get("branch") || "").trim();
  const querySubject = (qs.get("subject") || "").trim();
  const isUniversityMode = Boolean(queryUniversity);

  // create a storage key that won't collide between course vs university
  const storageKeyPrefix = isUniversityMode
    ? `uni_${encodeURIComponent(queryUniversity)}_${encodeURIComponent(
        queryBranch || ""
      )}_${encodeURIComponent(querySubject || "")}`
    : examId;

  const [learnData, setLearnData] = useState({});
  const [openClassMap, setOpenClassMap] = useState(() => {
    // openClassMap will track which class is open per-subject
    try {
      const raw = localStorage.getItem(`learn_open_map_${storageKeyPrefix}`);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch data (course or university)
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchLearnData = async () => {
      try {
        setLoading(true);
        setError(null);

        const base = (API_BASE || "").replace(/\/$/, "");
        let url;

        if (isUniversityMode) {
          // preserve query string
          url = `${base}/university/learn${location.search || ""}`;
        } else {
          url = `${base}/course/${encodeURIComponent(examId)}/learn`;
        }

        const response = await fetch(url, { signal, cache: "no-store" });

        if (!response.ok) {
          const txt = await response.text().catch(() => "");
          throw new Error(
            `Failed to load learn data (${response.status} ${
              response.statusText
            })${txt ? ": " + txt : ""}`
          );
        }

        const json = await response.json();
        const resolved = json && json.data ? json.data : json;

        if (!resolved || typeof resolved !== "object") {
          throw new Error("Invalid response shape from server for learn data");
        }

        if (!isMounted) return;

        setLearnData(resolved);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error loading learn data:", err);
        if (isMounted) {
          setError(err.message || "Failed to load learn data");
          setLearnData({});
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLearnData();

    return () => {
      isMounted = false;
      controller.abort();
    };
    // re-run when examId or location.search changes
  }, [examId, location.search, isUniversityMode, storageKeyPrefix]);

  // persist openClassMap to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        `learn_open_map_${storageKeyPrefix}`,
        JSON.stringify(openClassMap || {})
      );
    } catch {
      // ignore storage errors
    }
  }, [openClassMap, storageKeyPrefix]);

  const subjectKeys = Object.keys(learnData || {});

  // helper: build grouped classes for a given subject
  const groupedForSubject = (subject) => {
    const grouped = {};
    const arr = Array.isArray(learnData[subject]) ? learnData[subject] : [];
    arr.forEach((unit) => {
      const classKey = unit?.class?.trim() || "Other";
      if (!grouped[classKey]) grouped[classKey] = [];
      grouped[classKey].push(unit);
    });
    return grouped;
  };

  const toggleClass = (subject, className) => {
    setOpenClassMap((prev) => {
      const next = { ...(prev || {}) };
      // store which class is open for this subject (toggle)
      if (next[subject] === className) next[subject] = null;
      else next[subject] = className;
      return next;
    });
  };

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 font-medium">
        <h1>Content will appear soon</h1>
        <p className="text-sm text-red-500 mt-2">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-10 text-blue-700 font-medium">
        Loading Learn data for {String(examId).toUpperCase()}...
      </div>
    );
  }

  // display heading: prefer examName (course) else show university string
  const displayLabel = queryUniversity ? queryUniversity : examName || examId;

  return (
    <div className="w-full p-[36px] bg-white flex justify-center">
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-[16px] mb-[24px]">
          <div className="w-[64px] h-[64px] flex items-center justify-center rounded">
            <img src={bookicon} alt="icon" className="w-full h-full" />
          </div>
          <span className="font-semibold text-[16px] text-[#2758B3]">
            Chapter-wise Notes ({String(displayLabel).toUpperCase()})
          </span>
        </div>

        {/* Subjects stacked vertically — one-by-one full-width cards */}
        {subjectKeys.length === 0 ? (
          <p className="text-center text-[#999] py-4">No subjects available.</p>
        ) : (
          <div className="flex flex-col gap-8">
            {subjectKeys.map((subject) => {
              const grouped = groupedForSubject(subject); // { className: [units...] }
              const classes = Object.keys(grouped);
              const openClass = openClassMap?.[subject] || null;

              return (
                <div
                  key={subject}
                  className="border border-blue-300 rounded-xl p-6 shadow-sm bg-white"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-[#1E40AF] font-semibold text-lg">
                      {subject}
                    </h3>
                  </div>

                  {classes.length === 0 ? (
                    <p className="text-[#999]">No content available.</p>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {classes.map((className, idx) => {
                        const isOpen = openClass === className;
                        return (
                          <details
                            key={className + idx}
                            className="group border border-blue-200 rounded-lg overflow-hidden"
                            open={isOpen}
                          >
                            <summary
                              className="flex justify-between items-center px-4 py-5 cursor-pointer font-medium text-[#2758B3]"
                              onClick={(e) => {
                                // prevent native toggle: we control via openClassMap
                                e.preventDefault();
                                toggleClass(subject, className);
                              }}
                              role="button"
                              aria-controls={`learn-${subject}-${idx}`}
                              aria-expanded={isOpen ? "true" : "false"}
                            >
                              <span>{className}</span>
                              <FiChevronDown
                                className={`text-blue-600 text-xl transition-transform duration-300 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </summary>

                            <ul
                              id={`learn-${subject}-${idx}`}
                              className="px-4 py-4 border-t border-blue-100 list-decimal list-inside space-y-2 text-[#2758B3]"
                            >
                              {grouped[className].map((unit, uIdx) => (
                                <li
                                  key={uIdx}
                                  className="cursor-pointer hover:underline leading-relaxed"
                                  onClick={() =>
                                    onChapterClick(
                                      subject,
                                      className,
                                      unit.chapterName
                                    )
                                  }
                                >
                                  {unit.chapterName || "Untitled Chapter"}
                                </li>
                              ))}
                            </ul>
                          </details>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;
