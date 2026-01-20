// src/Components/ExamPage/PracticeTab/PracticeTab.jsx
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

const PracticeTab = ({ onPracticeClick }) => {
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

  // use a storage prefix to avoid collisions between course and university data
  const storageKeyPrefix = isUniversityMode
    ? `uni_${encodeURIComponent(queryUniversity)}_${encodeURIComponent(
        queryBranch || ""
      )}_${encodeURIComponent(querySubject || "")}`
    : examId;

  const [practiceData, setPracticeData] = useState({});
  const [activeSubject, setActiveSubject] = useState(() => {
    return (
      localStorage.getItem(`practice_active_tab_${storageKeyPrefix}`) || ""
    );
  });

  // NOTE: openClass now stores a composite key "subject::className" so multiple
  // subject cards can be shown and we keep which exact class is open.
  const [openClass, setOpenClass] = useState(() => {
    const val = localStorage.getItem(`practice_open_class_${storageKeyPrefix}`);
    return val === "" ? null : val;
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // normalizer: convert various backend shapes into:
  // { "Physics": { "Class 11": [unit1, unit2], "Class 12": [...] }, "Chemistry": { ... } }
  const normalizePracticePayload = (payload = {}) => {
    if (!payload || typeof payload !== "object") return {};

    // If already in desired shape: subject -> object-of-classes
    const allSubjectsAreObjects =
      Object.keys(payload).length > 0 &&
      Object.keys(payload).every(
        (k) =>
          payload[k] &&
          typeof payload[k] === "object" &&
          !Array.isArray(payload[k])
      );
    if (allSubjectsAreObjects) {
      // ensure each subject value is object (className -> array)
      return payload;
    }

    // If payload is wrapper with `subjects: [...]` (common)
    if (Array.isArray(payload.subjects)) {
      const out = {};
      payload.subjects.forEach((sub) => {
        const title = sub.title || sub.name;
        if (!title) return;
        const classesObj = {};

        // classes may be in sub.classes
        if (Array.isArray(sub.classes)) {
          sub.classes.forEach((cls) => {
            const className = cls.name || "Other";
            const items = Array.isArray(cls.units)
              ? cls.units
              : Array.isArray(cls.chapters)
              ? cls.chapters
              : Array.isArray(cls.topics)
              ? cls.topics
              : [];
            classesObj[className] = (classesObj[className] || []).concat(
              items.map((u) => ({
                ...u,
                id: u.id ?? u.unitId ?? u.chapterId,
                unit: u.unit || u.title || u.chapterName || u.name || "",
              }))
            );
          });
        }

        // also allow sub.units directly
        if (Array.isArray(sub.units)) {
          sub.units.forEach((u) => {
            const className = u.class || "Other";
            classesObj[className] = (classesObj[className] || []).concat({
              ...u,
              id: u.id ?? u.unitId ?? u.chapterId,
              unit: u.unit || u.title || u.chapterName || u.name || "",
            });
          });
        }

        out[title] = classesObj;
      });
      return out;
    }

    // If payload has syllabusData.subjects
    if (payload.syllabusData && Array.isArray(payload.syllabusData.subjects)) {
      const out = {};
      payload.syllabusData.subjects.forEach((s) => {
        const title = s.title || s.name;
        if (!title) return;
        const classesObj = {};
        if (Array.isArray(s.classes)) {
          s.classes.forEach((cls) => {
            const cname = cls.name || "Other";
            const items = Array.isArray(cls.chapters)
              ? cls.chapters
              : Array.isArray(cls.units)
              ? cls.units
              : [];
            classesObj[cname] = (classesObj[cname] || []).concat(
              items.map((it) =>
                typeof it === "string"
                  ? { unit: it }
                  : {
                      ...it,
                      id: it.id ?? it.unitId,
                      unit:
                        it.title || it.chapterName || it.name || it.unit || "",
                    }
              )
            );
          });
        }
        out[title] = classesObj;
      });
      return out;
    }

    // If there's a top-level data wrapper, recurse into it
    if (payload.data && typeof payload.data === "object") {
      return normalizePracticePayload(payload.data);
    }

    // If payload is an array of subject objects but not named 'subjects'
    if (Array.isArray(payload)) {
      // try to interpret as subjects array
      const out = {};
      payload.forEach((sub) => {
        const title = sub.title || sub.name;
        if (!title) return;
        out[title] = out[title] || {};
        if (Array.isArray(sub.classes)) {
          sub.classes.forEach((cls) => {
            const cname = cls.name || "Other";
            const items = Array.isArray(cls.units)
              ? cls.units
              : Array.isArray(cls.chapters)
              ? cls.chapters
              : [];
            out[title][cname] = (out[title][cname] || []).concat(
              items.map((it) =>
                typeof it === "string"
                  ? { unit: it }
                  : {
                      ...it,
                      id: it.id ?? it.unitId,
                      unit:
                        it.title || it.chapterName || it.name || it.unit || "",
                    }
              )
            );
          });
        }
      });
      return out;
    }

    // Last-resort attempt: if payload looks like { subject: [ {class, unit...}, ... ] }
    const fallback = {};
    Object.keys(payload).forEach((k) => {
      if (Array.isArray(payload[k])) {
        const classesObj = {};
        payload[k].forEach((unit) => {
          const className = (unit && unit.class) || "Other";
          classesObj[className] = classesObj[className] || [];
          classesObj[className].push({
            ...unit,
            id: unit.id ?? unit.unitId,
            unit:
              unit.unit || unit.title || unit.chapterName || unit.name || "",
          });
        });
        fallback[k] = classesObj;
      }
    });
    return fallback;
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPracticeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const base = (API_BASE || "").replace(/\/$/, "");
        let url;
        if (isUniversityMode) {
          // preserve query string
          url = `${base}/university/practice${location.search || ""}`;
        } else {
          url = `${base}/course/${encodeURIComponent(examId)}/practice`;
        }

        const response = await fetch(url, { cache: "no-store", signal });

        if (!response.ok) {
          const txt = await response.text().catch(() => "");
          throw new Error(
            `Server returned ${response.status} ${response.statusText} ${
              txt ? "- " + txt : ""
            }`
          );
        }

        const json = await response.json();
        // pick json.data if present
        const resolvedTop = json && json.data ? json.data : json;

        // Normalize into { Subject: { ClassName: [units...] } }
        const normalized = normalizePracticePayload(resolvedTop);

        if (!isMounted) return;

        // validate shape
        if (!normalized || typeof normalized !== "object") {
          throw new Error("Unexpected response shape from server");
        }

        setPracticeData(normalized);

        // set active subject (use stored if still valid)
        const firstSubject = Object.keys(normalized)[0] || "";
        const saved =
          localStorage.getItem(`practice_active_tab_${storageKeyPrefix}`) || "";
        if (saved && normalized[saved]) {
          setActiveSubject(saved);
        } else {
          setActiveSubject(firstSubject);
          try {
            localStorage.setItem(
              `practice_active_tab_${storageKeyPrefix}`,
              firstSubject || ""
            );
          } catch {
            /* ignore storage errors */
          }
        }

        // ensure stored openClass is valid for something; if invalid, clear
        const storedOpen = localStorage.getItem(
          `practice_open_class_${storageKeyPrefix}`
        );
        if (storedOpen) {
          // if composite key maps to an existing class, keep it; else clear
          const [sub, ...rest] = storedOpen.split("::");
          const cls = rest.join("::");
          if (
            !normalized[sub] ||
            !Object.prototype.hasOwnProperty.call(normalized[sub], cls)
          ) {
            localStorage.removeItem(`practice_open_class_${storageKeyPrefix}`);
            setOpenClass(null);
          } else {
            setOpenClass(storedOpen);
          }
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("PracticeTab fetch failed:", err);
        if (isMounted) {
          setError(err.message || "Failed to load practice data");
          setPracticeData({});
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPracticeData();

    return () => {
      isMounted = false;
      controller.abort();
    };
    // re-run when examId or location.search changes
  }, [examId, location.search, isUniversityMode, storageKeyPrefix]);

  const subjectKeys = Object.keys(practiceData || {});

  const handleSubjectChange = (subject) => {
    setActiveSubject(subject);
    // clear any open class when user manually selects subject
    setOpenClass(null);
    try {
      localStorage.setItem(
        `practice_active_tab_${storageKeyPrefix}`,
        subject || ""
      );
      localStorage.removeItem(`practice_open_class_${storageKeyPrefix}`);
    } catch {
      /* ignore storage errors */
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeSubjectData = useMemo(() => {
    // expected shape: { className: [units...] }
    return practiceData?.[activeSubject] || {};
  }, [practiceData, activeSubject]);

  // toggleClass now takes subject + className and stores composite key
  const toggleClass = (subject, className) => {
    const compositeKey = `${subject}::${className}`;
    const newOpen = openClass === compositeKey ? null : compositeKey;
    setOpenClass(newOpen);
    try {
      localStorage.setItem(
        `practice_open_class_${storageKeyPrefix}`,
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
        Loading practice data...
      </div>
    );
  }

  return (
    <div className="w-full p-[36px] bg-white flex justify-center">
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-[16px] mb-[36px]">
          <div className="w-[64px] h-[64px] flex items-center justify-center rounded">
            <img
              src={practiceIcon}
              alt="Practice icon"
              className="w-full h-full"
            />
          </div>
          <span className="font-semibold text-[16px] text-[#2758B3]">
            Chapter-wise Practice ({String(examName || examId).toUpperCase()})
          </span>
        </div>

        {/* STACKED SUBJECT CARDS (no tabs) */}
        <div className="flex flex-col gap-8">
          {subjectKeys.length === 0 ? (
            <p className="text-center text-[#999] py-4">
              No subjects available.
            </p>
          ) : (
            subjectKeys.map((subject) => {
              const classesObj = practiceData[subject] || {};
              const classNames = Object.keys(classesObj);

              return (
                <div
                  key={subject}
                  className="border border-[#B0CBFE] rounded-xl p-6 shadow-sm bg-white"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-[#1E40AF] font-semibold text-lg">
                      {subject}
                    </h3>
                  </div>

                  {classNames.length === 0 ? (
                    <p className="text-[#999]">No content available.</p>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {classNames.map((className, idx) => {
                        const compositeKey = `${subject}::${className}`;
                        const isOpen = openClass === compositeKey;

                        return (
                          <div
                            key={`${subject}::${className}::${idx}`}
                            className="border border-[#B0CBFE] rounded-lg overflow-hidden"
                          >
                            {/* Class Header */}
                            <button
                              type="button"
                              className="w-full px-4 py-5 font-medium text-[#2758B3] flex justify-between items-center cursor-pointer bg-white"
                              onClick={() => toggleClass(subject, className)}
                              aria-expanded={isOpen}
                              aria-controls={`units-${subject}-${idx}`}
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
                                id={`units-${subject}-${idx}`}
                                className="px-6 py-4 space-y-3 border-t border-[#B0CBFE] text-[#2758B3] text-[14px]"
                              >
                                {Array.isArray(classesObj[className]) &&
                                  classesObj[className].map((unit, uIdx) => (
                                    <li
                                      key={unit.id ?? unit.unit ?? `${uIdx}`}
                                      className="cursor-pointer hover:underline"
                                      onClick={() =>
                                        onPracticeClick(
                                          subject,
                                          className,
                                          unit,
                                          classesObj[className]
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
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeTab;
