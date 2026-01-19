import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backArrow from "../../../assets/AICareerPage/Backarrow.png";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { CHART_COLORS, LEGEND_TEXT } from "./skillChartConfig";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartDataLabels);

// ✅ SAME API BASE PATTERN AS ExploreMyRoleMatches
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const ShowMySkillGaps = () => {
  const [inputValue, setInputValue] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [skillData, setSkillData] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ API CALL SAME STYLE AS ExploreMyRoleMatches
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const userId = Number(localStorage.getItem("userId"));

      if (!userId) {
        alert("User ID not found in local storage");
        setLoading(false);
        return;
      }

      if (!inputValue.trim()) {
        alert("Please enter a job role");
        setLoading(false);
        return;
      }

      const payload = {
        jobRole: inputValue,
        user_id: userId,
      };

      // ✅ Build API URL using BASE
      const url = `${API_BASE}/ai/compare-skills-ai`;

      console.log("API URL:", url);
      console.log("Payload:", payload);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data?.skills?.length) {
        setRole(data.role);
        setSkillData(data.skills);
        setShowChart(true);
      } else {
        setShowChart(false);
      }
    } catch (error) {
      console.error("Error fetching skill gaps:", error);
      setShowChart(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CHART DATA
  const chartData = {
    labels: skillData.map((skill) => skill.name),
    datasets: [
      {
        label: LEGEND_TEXT.user,
        data: skillData.map((skill) => skill.userLevel),
        backgroundColor: CHART_COLORS.user,
        borderRadius: 4,
        barThickness: 30,
      },
      {
        label: LEGEND_TEXT.industry,
        data: skillData.map((skill) => skill.industryLevel),
        backgroundColor: CHART_COLORS.industry,
        borderRadius: 4,
        barThickness: 30,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: "end",
        align: "end",
        offset: 4,
        font: { weight: "bold", size: 12 },
        color: CHART_COLORS.axisText,
        formatter: Math.round,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
          font: { weight: "bold" },
          color: CHART_COLORS.axisText,
        },
        title: {
          display: true,
          text: "Skill level (0–10)",
          font: { size: 13, weight: "bold" },
          color: CHART_COLORS.axisText,
        },
        grid: { display: false },
      },
      x: {
        ticks: {
          font: { size: 13, weight: "bold" },
          color: CHART_COLORS.axisText,
          padding: 8,
          maxRotation: 0,
          minRotation: 0,
          callback: function (value) {
            const label = this.getLabelForValue(value);
            return label.length > 12 ? label.split(" ") : label;
          },
        },
        title: {
          display: true,
          text: "Skills",
          font: { size: 13, weight: "bold" },
          color: CHART_COLORS.axisText,
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="min-h-screen bg-white px-4 md:px-16 py-8 transition-all duration-500 ease-in-out">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#343079] text-sm font-medium mb-6"
      >
        <img src={backArrow} alt="Back" className="w-4 h-4 mr-1" />
        Back
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Input Section */}
        <div
          className={`bg-white rounded-xl border border-[#E2E1F3] p-6 md:p-8 shadow-sm ${
            showChart ? "md:w-1/2" : "w-full"
          }`}
        >
          <h2 className="text-[#343079] text-base md:text-lg font-semibold mb-4">
            What job role are you aiming for?
          </h2>

          <textarea
            rows={5}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your job role here..."
            className="w-full border border-[#3D3584] rounded-md p-4 text-[#343079] text-sm focus:outline-none focus:ring-2 focus:ring-[#3D3584]"
          />

          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-[#3D3584] text-white text-sm rounded-md hover:bg-[#2f2a6e] transition"
          >
            {loading ? "Analyzing..." : "Show My Skill Gaps"}
          </button>
        </div>

        {/* Chart Section */}
        {showChart && (
          <div className="bg-white rounded-xl border border-[#E2E1F3] p-6 md:p-8 shadow-sm md:w-1/2">
            <h2 className="text-[#343079] text-lg font-semibold mb-2">
              Skill Gap Analysis
            </h2>

            <p className="text-sm text-[#343079]">
              Your skills vs. industry expectations for the {role} role.
            </p>

            <div className="h-4" />

            <div className="flex justify-between items-start mb-4 flex-wrap">
              <p className="text-[#343079] font-semibold text-sm">
                Skill Gap Analysis: {role}
              </p>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-3 rounded-full bg-[#7C65D8]" />
                  <span className="text-sm font-semibold text-[#343079]">
                    {LEGEND_TEXT.user}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-3 rounded-full bg-[#8CA8F0]" />
                  <span className="text-sm font-semibold text-[#343079]">
                    {LEGEND_TEXT.industry}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full h-[320px]">
              <Bar data={chartData} options={chartOptions} />
            </div>

            <button
              onClick={() => navigate("/courses")}
              className="mt-6 px-4 py-2 bg-[#3D3584] text-white text-sm rounded-md hover:bg-[#2f2a6e] transition"
            >
              Fill Your Gaps Fast
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowMySkillGaps;
