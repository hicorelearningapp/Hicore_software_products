import React, { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { useParams } from "react-router-dom";

// assets
import totalQuestionsIcon from "../../../assets/Analyse/analysis.png";
import attemptedIcon from "../../../assets/Analyse/Circletick.png";
import correctIcon from "../../../assets/Analyse/Circletick.png";
import wrongIcon from "../../../assets/Analyse/icons.png";
import thisUnitIcon from "../../../assets/Analyse/target.png";
import overallScoreIcon from "../../../assets/Analyse/trophy.png";
import speedIcon from "../../../assets/Analyse/flash.png";
import accuracyIcon from "../../../assets/Analyse/Group.png";
import QuestionsIcon from "../../../assets/Analyse/question.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/* ---------- HELPERS ---------- */
const formatSeconds = (secs) => {
  if (secs == null || Number.isNaN(Number(secs))) return "-";
  const s = Math.max(0, Math.floor(Number(secs)));
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
};

/* ---------- QUICK STATS DEFAULT ---------- */
const defaultReport = {
  totalQuestions: 0,
  attempted: 0,
  correct: 0,
  wrong: 0,
  overallScore: "0/0",
  accuracy: "0%",
  unit: "—",
  timeTakenFormatted: "-",
};

const AnalyseTab = () => {
  const { examName } = useParams();
  const examId = (examName || "neet").toLowerCase();

  // 🔴 TEMP USER ID (replace after auth integration)
  const userId = 2;

  const [report, setReport] = useState(defaultReport);
  const [tableRows, setTableRows] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

  /* ---------- LOAD QUICK STATS ---------- */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lastAnalyseReport");
      if (!raw) return;

      const parsed = JSON.parse(raw);
      const timeSecs = parsed.timeTakenSeconds ?? parsed.timeTaken ?? null;

      setReport({
        totalQuestions: parsed.totalQuestions ?? 0,
        attempted: parsed.attempted ?? 0,
        correct: parsed.correct ?? 0,
        wrong: parsed.wrong ?? 0,
        overallScore: parsed.overallScore ?? "0/0",
        accuracy: parsed.accuracy ?? "0%",
        unit: parsed.unit ?? "—",
        timeTakenFormatted: timeSecs ? formatSeconds(timeSecs) : "-",
      });
    } catch {}
  }, []);

  /* ---------- FETCH TABLE DATA ---------- */
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchTableData = async () => {
      try {
        setTableLoading(true);

        const res = await fetch(
          `${API_BASE}/analyzer/unit/${userId}/${examId}?limit=10`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("API failed");

        const json = await res.json();
        if (mounted) setTableRows(Array.isArray(json) ? json : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Table API error:", err);
          mounted && setTableRows([]);
        }
      } finally {
        mounted && setTableLoading(false);
      }
    };

    fetchTableData();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [examId]);

  /* ---------- QUICK STATS CONFIG ---------- */
  const statsData = [
    {
      icon: QuestionsIcon,
      label: "Total Questions",
      value: report.totalQuestions,
      bg: "bg-yellow-50",
    },
    {
      icon: attemptedIcon,
      label: "Attempted",
      value: report.attempted,
      bg: "bg-blue-50",
    },
    {
      icon: correctIcon,
      label: "Correct",
      value: report.correct,
      bg: "bg-green-50",
    },
    { icon: wrongIcon, label: "Wrong", value: report.wrong, bg: "bg-red-50" },
    {
      icon: thisUnitIcon,
      label: "This Unit",
      value: report.unit,
      bg: "bg-pink-50",
    },
    {
      icon: overallScoreIcon,
      label: "Overall Score",
      value: report.overallScore,
      bg: "bg-purple-50",
    },
    {
      icon: speedIcon,
      label: "Time Taken",
      value: report.timeTakenFormatted,
      bg: "bg-yellow-50",
    },
    {
      icon: accuracyIcon,
      label: "Accuracy Pro",
      value: report.accuracy,
      bg: "bg-cyan-50",
    },
  ];

  return (
    <div className="p-6">
      {/* ================= QUICK STATS ================= */}
      <section className="border border-blue-300 p-6 rounded-xl shadow-md bg-white">
        <div className="flex items-center gap-4 mb-8">
          <img src={totalQuestionsIcon} alt="stats" className="w-16 h-16" />
          <h2 className="text-blue-800 text-lg md:text-xl font-semibold">
            Quick Stats{report.unit ? ` — ${report.unit}` : " of Unit Exam"}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {statsData.map((stat, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center p-7 rounded-lg ${stat.bg} shadow-sm border border-gray-100`}
            >
              <img src={stat.icon} alt={stat.label} className="w-6 h-6 mb-3" />
              <p className="text-sm text-blue-800 font-medium">{stat.label}</p>
              <p className="mt-2 text-lg font-semibold text-blue-800">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-green-700 font-medium flex items-center gap-2">
          <FiCheckCircle className="text-green-600 text-xl" />
          <span>
            You're on track! Aim for 90%+ accuracy for {examId?.toUpperCase()}{" "}
            level prep.
          </span>
        </div>
      </section>

      {/* ================= TABLE ================= */}
      <section className="mt-10 bg-white border border-blue-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-blue-700 font-semibold text-lg mb-6">
          Performance Report
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-50 text-blue-800">
                <th className="border px-4 py-3">No</th>
                <th className="border px-4 py-3 text-left">Subject</th>
                <th className="border px-4 py-3 text-left">Unit</th>
                <th className="border px-4 py-3">Total Qs</th>
                <th className="border px-4 py-3">Attempted</th>
                <th className="border px-4 py-3">Correct</th>
                <th className="border px-4 py-3">Wrong</th>
                <th className="border px-4 py-3">Accuracy %</th>
                <th className="border px-4 py-3">Time</th>
                <th className="border px-4 py-3">Score</th>
              </tr>
            </thead>

            <tbody>
              {tableLoading ? (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-gray-400">
                    Loading analysis data...
                  </td>
                </tr>
              ) : tableRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-gray-400">
                    No analysis data available
                  </td>
                </tr>
              ) : (
                tableRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="text-blue-900 hover:bg-blue-50 transition"
                  >
                    <td className="border px-4 py-3">{idx + 1}</td>
                    <td className="border px-4 py-3 font-medium">
                      {row.subject_name}
                    </td>
                    <td className="border px-4 py-3 font-medium">{row.unit}</td>
                    <td className="border px-4 py-3 text-center">
                      {row.total_questions}
                    </td>
                    <td className="border px-4 py-3 text-center">
                      {row.attempted}
                    </td>
                    <td className="border px-4 py-3 text-center font-semibold text-blue-800">
                      {row.correct}
                    </td>
                    <td className="border px-4 py-3 text-center font-semibold text-blue-800">
                      {row.wrong}
                    </td>
                    <td className="border px-4 py-3 text-center">
                      {row.accuracy_percent}%
                    </td>
                    <td className="border px-4 py-3 text-center">
                      {formatSeconds(row.timeTakenSeconds)}
                    </td>
                    <td className="border px-4 py-3 text-center font-semibold">
                      {row.overall_score}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="flex justify-center items-center gap-6 mt-12 mb-8">
        <button className="bg-[#2B59C3] text-white font-semibold py-2.5 px-8 rounded-full hover:bg-[#1E47A1] transition">
          Revise Weak Topics
        </button>
        <button className="border-2 border-[#2B59C3] text-[#2B59C3] font-semibold py-2.5 px-8 rounded-full hover:bg-[#2B59C3] hover:text-white transition">
          Take another Exam
        </button>
      </div>
    </div>
  );
};

export default AnalyseTab;
