import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import bookicon from "../../../assets/Learn/book.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const toExamId = (s = "") =>
  String(s).trim().toLowerCase().replace(/\s+/g, "-");

const RevisionFront = ({ onChapterClick }) => {
  const { examName } = useParams();
  const examId = toExamId(examName || "neet");

  const [revisionData, setRevisionData] = useState({});
  const [openClassMap, setOpenClassMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------- FETCH REVISION DATA (API) ---------- */
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchRevision = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_BASE}/course/${encodeURIComponent(examId)}/revision`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error(`API failed: ${res.status}`);
        }

        const json = await res.json();
        const data = json?.data ?? json;

        if (mounted) setRevisionData(data || {});
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Revision fetch failed:", err);
          mounted && setError("Revision content will appear soon");
        }
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchRevision();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [examId]);

  /* ---------- SAME HELPERS (UNCHANGED UI LOGIC) ---------- */
  const subjectKeys = Object.keys(revisionData || {});

  const groupedForSubject = (subject) => {
    const grouped = {};
    const arr = Array.isArray(revisionData[subject])
      ? revisionData[subject]
      : [];

    arr.forEach((unit) => {
      const classKey = unit?.class?.trim() || "Other";
      if (!grouped[classKey]) grouped[classKey] = [];
      grouped[classKey].push(unit);
    });

    return grouped;
  };

  const toggleClass = (subject, className) => {
    setOpenClassMap((prev) => ({
      ...prev,
      [subject]: prev[subject] === className ? null : className,
    }));
  };

  /* ---------- UI STATES ---------- */
  if (loading) {
    return (
      <div className="text-center text-blue-700 mt-10">
        Loading revision content...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10">
        <h1>{error}</h1>
      </div>
    );
  }

  /* ---------- UI (UNCHANGED) ---------- */
  return (
    <div className="w-full p-[36px] bg-white flex justify-center">
      <div className="w-full flex flex-col">
        {/* HEADER — SAME AS LEARN */}
        <div className="flex items-center gap-[16px] mb-[24px]">
          <div className="w-[64px] h-[64px] flex items-center justify-center rounded">
            <img src={bookicon} alt="icon" className="w-full h-full" />
          </div>
          <span className="font-semibold text-[16px] text-[#2758B3]">
            Chapter-wise Revision
          </span>
        </div>

        {/* SUBJECTS */}
        {subjectKeys.length === 0 ? (
          <p className="text-center text-[#999] py-4">
            No revision content available.
          </p>
        ) : (
          <div className="flex flex-col gap-8">
            {subjectKeys.map((subject) => {
              const grouped = groupedForSubject(subject);
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
                    <p className="text-[#999]">No chapters available.</p>
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
                                e.preventDefault();
                                toggleClass(subject, className);
                              }}
                            >
                              <span>{className}</span>
                              <FiChevronDown
                                className={`text-blue-600 text-xl transition-transform duration-300 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </summary>

                            <ul className="px-4 py-4 border-t border-blue-100 list-decimal list-inside space-y-2 text-[#2758B3]">
                              {grouped[className].map((unit, uIdx) => (
                                <li
                                  key={uIdx}
                                  className="cursor-pointer hover:underline leading-relaxed"
                                  onClick={() =>
                                    onChapterClick?.(
                                      subject,
                                      className,
                                      unit.chapterName,
                                      grouped[className]
                                    )
                                  }
                                >
                                  {unit.chapterName}
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

export default RevisionFront;
