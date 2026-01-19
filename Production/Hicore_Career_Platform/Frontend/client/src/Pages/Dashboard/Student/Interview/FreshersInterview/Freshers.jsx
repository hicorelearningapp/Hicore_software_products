import React, { useState, useEffect } from "react";
import WeekTemplate from "./WeekTemplate";

const Freshers = () => {
  const [activeTab, setActiveTab] = useState("week1");
  const [weekData, setWeekData] = useState({});
  const [loading, setLoading] = useState(true);

  const weeks = [
    { id: "week1", label: "Week 1" },
    { id: "week2", label: "Week 2" },
    { id: "week3", label: "Week 3" },
    { id: "week4", label: "Week 4" },
    { id: "week5", label: "Week 5" },
    { id: "week6_7", label: "Week 6-7" },
    { id: "week8", label: "Week 8" },
  ];

  useEffect(() => {
    const fetchWeekData = async () => {
      try {
        const response = await fetch("https://hicore.pythonanywhere.com/week-data");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWeekData(data);
      } catch (error) {
        console.error("Failed to fetch week data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeekData();
  }, []); 

  if (loading) {
    return <div className="p-6 text-center text-lg font-semibold">Loading week data...</div>;
  }

  return (
    <div className="max-w-7xl m-6 rounded-md">
      {/* Tabs */}
      <div className="flex">
        {weeks.map((week) => (
          <button
            key={week.id}
            onClick={() => setActiveTab(week.id)}
            className={`py-2 px-6 text-md font-medium transition-all duration-200 ${
              activeTab === week.id
                ? "bg-blue-900 text-white rounded-t-md"
                : "text-blue-900 hover:bg-blue-100"
            }`}
          >
            {week.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="border border-blue-900 min-h-screen p-6">
        <WeekTemplate data={weekData[activeTab]} weekId={activeTab} />
      </div>
    </div>
  );
};

export default Freshers;