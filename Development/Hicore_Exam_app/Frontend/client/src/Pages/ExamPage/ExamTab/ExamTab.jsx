// src/Components/ExamPage/ExamTab/ExamTab.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import practiceIcon from "../../../assets/Learn/book.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/** canonical exam id: lowercase, spaces -> hyphens */
const toExamId = (s = "") =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

const ExamTab = ({ onExamClick }) => {
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

  // storage prefix to avoid collisions between course & university
  const storageKeyPrefix = isUniversityMode
    ? `uni_${encodeURIComponent(queryUniversity)}_${encodeURIComponent(
        queryBranch || ""
      )}_${encodeURIComponent(querySubject || "")}`
    : examId;

  const [examData, setExamData] = useState({});
  const [activeSubject, setActiveSubject] = useState(
    () => localStorage.getItem(`exam_active_tab_${storageKeyPrefix}`) || ""
  );
  const [openClass, setOpenClass] = useState(() => {
    const val = localStorage.getItem(`exam_open_class_${storageKeyPrefix}`);
    return val === "" ? null : val;
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchExamData = async () => {
      try {
        setLoading(true);
        setError(null);

        const base = (API_BASE || "").replace(/\/$/, "");
        let url;

        if (isUniversityMode) {
          // preserve query string
          url = `${base}/university/test${location.search || ""}`;
        } else {
          url = `${base}/course/${encodeURIComponent(examId)}/test`;
        }

        const res = await fetch(url, { cache: "no-store", signal });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(
            `Server returned ${res.status} ${res.statusText} ${
              txt ? "- " + txt : ""
            }`
          );
        }

        const json = await res.json();
        const resolvedTop = json && json.data ? json.data : json;

        // handle shapes: either { examId: {...} } or direct object
        const extracted =
          resolvedTop && typeof resolvedTop === "object"
            ? resolvedTop[examId] && typeof resolvedTop[examId] === "object"
              ? resolvedTop[examId]
              : resolvedTop
            : {};

        if (!isMounted) return;

        if (!extracted || typeof extracted !== "object") {
          throw new Error("Unexpected response shape from server");
        }

        setExamData(extracted);

        // ensure activeSubject is valid, else pick the first key
        const firstSubject = Object.keys(extracted)[0] || "";
        const saved =
          localStorage.getItem(`exam_active_tab_${storageKeyPrefix}`) || "";
        if (saved && extracted[saved]) {
          setActiveSubject(saved);
        } else {
          const newVal = firstSubject;
          setActiveSubject(newVal);
          try {
            localStorage.setItem(
              `exam_active_tab_${storageKeyPrefix}`,
              newVal || ""
            );
          } catch {
            /* ignore storage errors */
          }
        }

        // validate openClass stored value (clear if not present)
        const storedOpen = localStorage.getItem(
          `exam_open_class_${storageKeyPrefix}`
        );
        if (storedOpen) {
          const classesForActive = extracted[saved || firstSubject] || {};
          if (
            !Object.prototype.hasOwnProperty.call(classesForActive, storedOpen)
          ) {
            try {
              localStorage.removeItem(`exam_open_class_${storageKeyPrefix}`);
            } catch {}
            setOpenClass(null);
          } else {
            setOpenClass(storedOpen);
          }
        }

        setError(null);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("ExamTab fetch failed:", err);
        if (isMounted) {
          setError(err.message || "Failed to load test data");
          setExamData({});
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchExamData();

    return () => {
      isMounted = false;
      controller.abort();
    };
    // re-run when examId or location.search changes (university queries)
  }, [examId, location.search, isUniversityMode, storageKeyPrefix]);

  const subjectKeys = Object.keys(examData || {});

  const handleSubjectChange = (subject) => {
    setActiveSubject(subject);
    setOpenClass(null);
    try {
      localStorage.setItem(
        `exam_active_tab_${storageKeyPrefix}`,
        subject || ""
      );
      localStorage.removeItem(`exam_open_class_${storageKeyPrefix}`);
    } catch {
      /* ignore storage errors */
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeSubjectData = useMemo(
    () => examData?.[activeSubject] || {},
    [examData, activeSubject]
  );

  const toggleClass = (className) => {
    const newOpen = openClass === className ? null : className;
    setOpenClass(newOpen);
    try {
      localStorage.setItem(
        `exam_open_class_${storageKeyPrefix}`,
        newOpen || ""
      );
    } catch {
      /* ignore storage errors */
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10">
        <h1>Content will appear soon</h1>
        <p className="text-sm text-red-500 mt-2">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center text-blue-700 mt-10">
        Loading test data...
      </div>
    );
  }

  return (
    <div className="w-full p-[36px] bg-white flex justify-center">
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-[16px] mb-[36px]">
          <div className="w-[64px] h-[64px] flex items-center justify-center rounded">
            <img src={practiceIcon} alt="Test icon" className="w-full h-full" />
          </div>
          <span className="font-semibold text-[16px] text-[#2758B3]">
            Chapter-wise Tests ({String(examName || examId).toUpperCase()})
          </span>
        </div>

        {/* Subject Tabs */}
        {subjectKeys.length > 0 && (
          <div className="flex gap-4 flex-wrap">
            {subjectKeys.map((subject) => (
              <button
                key={subject}
                onClick={() => handleSubjectChange(subject)}
                className={`flex-1 h-[42px] flex items-center justify-center font-medium min-w-[100px] ${
                  activeSubject === subject
                    ? "bg-[#B0CBFE] text-black rounded-t-[16px]"
                    : "bg-white text-[#999999]"
                }`}
                type="button"
              >
                {subject}
              </button>
            ))}
          </div>
        )}

        {/* Class → Units */}
        <div className="border border-[#B0CBFE] rounded-b-[16px] bg-white p-6">
          <div className="flex flex-col gap-[16px]">
            {Object.keys(activeSubjectData).length > 0 ? (
              Object.keys(activeSubjectData).map((className) => {
                const isOpen = openClass === className;

                return (
                  <div
                    key={className}
                    className="border border-[#B0CBFE] rounded-lg"
                  >
                    {/* Class Header */}
                    <button
                      type="button"
                      className="w-full px-4 py-5 font-medium text-[#2758B3] flex justify-between items-center cursor-pointer"
                      onClick={() => toggleClass(className)}
                      aria-expanded={isOpen}
                      aria-controls={`units-${className}`}
                    >
                      <span>{className}</span>
                      <FiChevronDown
                        className={`transition duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Units */}
                    {isOpen && (
                      <ul
                        id={`units-${className}`}
                        className="px-6 py-4 space-y-3 border-t border-[#B0CBFE] text-[#2758B3] text-[14px]"
                      >
                        {Array.isArray(activeSubjectData[className]) &&
                          activeSubjectData[className].map((unit, i) => (
                            <li
                              key={unit.unit ?? unit.id ?? i}
                              className="cursor-pointer hover:underline"
                              onClick={() =>
                                onExamClick?.(
                                  activeSubject,
                                  className,
                                  unit,
                                  activeSubjectData[className]
                                )
                              }
                            >
                              {unit.unit ||
                                unit.title ||
                                unit.name ||
                                "Untitled Unit"}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-[#999] py-4">
                No tests available for {activeSubject || "this subject"}.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamTab;
