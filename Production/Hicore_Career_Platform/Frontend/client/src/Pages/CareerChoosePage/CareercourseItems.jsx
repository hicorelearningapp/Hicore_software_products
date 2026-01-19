import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import CourseHeader from "./CourseHeader";
import Coursecontentdata from "./Coursecontentdata";
import ProgressBar from "./Progressbar";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const CourseItems = () => {
  const { courseId, topicId } = useParams();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLessons, setTotalLessons] = useState(0);

  const userId = localStorage.getItem("userId") || "GUEST";

  const [progressData, setProgressData] = useState(() => {
    const saved = localStorage.getItem(`progress_${courseId}_${userId}`);
    return saved ? JSON.parse(saved) : {};
  });

  // Fetch course only ONCE
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch(`${API_BASE}/find-my-courses/structure/${courseId}`);
        const data = await res.json();

        const courseObj = data.course || {};
        const firstKey = Object.keys(courseObj)[0];
        const menuArr = courseObj[firstKey]?.menu || [];

        setMenu(menuArr);
        setTotalLessons(data.totalLessons || 0);

      } catch (err) {
        console.error("Course Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId]);

  const completed = Object.values(progressData).filter(
    (i) => i.lesson && i.quickquiz && i.projectideas
  ).length;

  // Save progress to backend
  const saveProgress = async (lessonPath, tabState) => {
    const status =
      tabState.lesson && tabState.quickquiz && tabState.projectideas
        ? "completed"
        : "in-progress";

    try {
      await fetch(`${API_BASE}/progress/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          courseId,
          lessonPath,
          totalLessons,
          status,
        }),
      });
    } catch (err) {
      console.log("Progress Save Error:", err);
    }
  };

  const handleTabVisit = (lessonPath, tabName) => {
    setProgressData((prev) => {
      const prevState = prev[lessonPath] || {
        lesson: false,
        quickquiz: false,
        projectideas: false,
      };

      const newState = { ...prevState, [tabName]: true };

      saveProgress(lessonPath, newState);

      const updated = { ...prev, [lessonPath]: newState };
      localStorage.setItem(
        `progress_${courseId}_${userId}`,
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white">
      <div className="w-full pt-2 pb-6">
        <CourseHeader />
      </div>

      <div className="flex gap-6 flex-1 pb-6">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4" style={{ width: "30%", height: "912px" }}>
          <ProgressBar completed={completed} total={totalLessons} />
          <p className="text-sm text-[#343079] font-semibold text-center">
            {completed}/{totalLessons} lessons completed
          </p>

          {/* Pass menu here */}
          <Sidebar menu={menu} />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex" style={{ width: "80%", height: "912px" }}>
          <div style={{ width: "100%" }}>
            {!loading && topicId ? (
              <Coursecontentdata
                courseId={courseId}
                topicId={topicId}
                onTabVisit={handleTabVisit}
                menuData={menu}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">
                    Welcome to {courseId}
                  </h2>
                  <p>Select a topic from the sidebar.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseItems;
