import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import CourseHeader from "./CourseHeader";
import Coursecontentdata from "./Coursecontentdata";
import ProgressBar from "./Progressbar";

// ✅ ENV BASE (MUST BE HTTPS IN PROD)
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

// ✅ Helpers
const getFullUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  const cleanPath = path.replace(/^\/+/, "");
  const base = API_BASE.replace(/\/+$/, "");
  return `${base}/${cleanPath}`;
};

const CourseItems = () => {
  const { courseId, topicId } = useParams();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalLessons, setTotalLessons] = useState(0);
  const [completedTopics, setCompletedTopics] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const [completedPaths, setCompletedPaths] = useState([]);
  const [activeLessonPath, setActiveLessonPath] = useState("");

  const userId = localStorage.getItem("userId") || "";

  /* ================================
     FETCH COURSE + TOTAL LESSONS
  ================================= */
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch(
          getFullUrl(`/courses/full_course/${courseId}`)
        );

        const data = await res.json();

        const courseObj = data.course || {};
        const firstKey = Object.keys(courseObj)[0];
        const menuArr = courseObj[firstKey]?.menu || [];

        setMenu(menuArr);

        let topicCount = 0;
        menuArr.forEach((mod) => {
          topicCount += mod.items?.length || 0;
        });

        setTotalLessons(topicCount);
      } catch (err) {
        console.error("Course Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId]);

  /* ================================
     FETCH EXISTING PROGRESS (GET)
  ================================= */
  const fetchProgress = async () => {
    if (!userId || !courseId || !totalLessons) return;

    try {
      const params = new URLSearchParams({
        userId: String(userId),
        itemId: String(courseId),
        itemType: "course",
      });

      const res = await fetch(
        getFullUrl(`/api/progress/progress?${params.toString()}`)
      );

      if (!res.ok) return;

      const data = await res.json();

      const apiCompleted = Array.isArray(data.completed)
        ? data.completed
        : [];

      setCompletedPaths(apiCompleted);
      setCompletedTopics(apiCompleted.length);
      setPercentage(data.percentage ?? 0);
      setActiveLessonPath(data.active || "");
    } catch (err) {
      console.log("Progress Fetch Error:", err);
    }
  };

  useEffect(() => {
    if (totalLessons > 0) fetchProgress();
  }, [totalLessons, courseId, userId]);

  /* ================================
      PUT /progress (update)
  ================================= */
  const saveProgressOnServer = async (lessonPath, status = "active") => {
    if (!userId || !courseId || !lessonPath) return;

    try {
      await fetch(getFullUrl("/api/progress/progress"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: String(userId),
          itemType: "course",
          itemId: String(courseId),
          lessonPath,
          totalLessons,
          status,
        }),
      });

      fetchProgress();
    } catch (err) {
      console.log("Progress Update Error:", err);
    }
  };

  /* ================================
     LESSON CLICK → update active
  ================================= */
  const handleLessonClick = (lessonPath) => {
    if (!lessonPath) return;
    setActiveLessonPath(lessonPath);
    saveProgressOnServer(lessonPath, "active");
  };

  /* ================================
     TOPIC FULLY COMPLETED
  ================================= */
  const handleTopicCompleted = (lessonPath) => {
    if (!lessonPath || completedPaths.includes(lessonPath)) return;

    const updatedCompleted = [...completedPaths, lessonPath];
    const newCompletedCount = updatedCompleted.length;

    const newPercentage = Math.round(
      (newCompletedCount / totalLessons) * 100
    );

    setCompletedPaths(updatedCompleted);
    setCompletedTopics(newCompletedCount);
    setPercentage(newPercentage);
    setActiveLessonPath(lessonPath);

    saveProgressOnServer(lessonPath, "completed");
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white">
      <div className="w-full pt-2 pb-6">
        <CourseHeader />
      </div>

      <div className="flex gap-6 flex-1 pb-6">
        <div className="flex flex-col gap-4" style={{ width: "30%", height: "912px" }}>
          <ProgressBar completed={percentage} total={100} />

          <p className="text-sm text-[#343079] font-semibold text-center">
            {completedTopics}/{totalLessons} topics completed
          </p>

          <Sidebar
            menu={menu}
            completedLessons={completedPaths}
            onLessonClick={handleLessonClick}
            activeLessonPath={activeLessonPath}
          />
        </div>

        <div className="flex" style={{ width: "80%", height: "912px" }}>
          <div style={{ width: "100%" }}>
            {!loading && topicId ? (
              <Coursecontentdata
                topicId={topicId}
                onTopicComplete={handleTopicCompleted}
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
