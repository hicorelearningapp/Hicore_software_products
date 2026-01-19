import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import routes from "../../../../Routes/routesConfig";

const JobSeekerCourse = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

  // ✅ Extract course data from routesConfig
  const coursesRoute = routes.find((r) => r.label === "Courses");
  const courseTabs = coursesRoute?.tabs?.map((t) => t.name) || [];
  const courseItems = coursesRoute?.items?.Courses?.data || {};

  // ✅ Default to "Frontend" if available
  const defaultTab = Object.keys(courseItems).includes("Frontend")
    ? "Frontend"
    : courseTabs[0] || Object.keys(courseItems)[0];

  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || defaultTab;
  const [activeTab, setActiveTab] = useState(initialTab);

  // ✅ Dashboard-based ongoing + completed courses
  const [ongoingCourses, setOngoingCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});

  // guard to avoid state updates after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // helper: fetch with timeout
  const fetchWithTimeout = async (url, opts = {}, timeoutMs = 15000) => {
    const controller = new AbortController();
    const finalOpts = { ...opts, signal: controller.signal };
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, finalOpts);
      clearTimeout(timer);
      return res;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("userRole");

        if (!userId || !role) {
          console.warn("⚠️ Missing user info in localStorage");
          return;
        }

        const url = `${API_BASE.replace(/\/$/, "")}/dashboard/${role}/${userId}`;
        const response = await fetchWithTimeout(url, { method: "GET" }, 15000);

        if (!response.ok) {
          if (mountedRef.current) {
            setOngoingCourses([]);
            setCompletedCourses([]);
            setCourseProgress({});
          }
          return;
        }

        const rawBody = await response.text();
        let result = {};
        try {
          result = rawBody && rawBody.trim() ? JSON.parse(rawBody) : {};
        } catch (parseErr) {
          result = {};
        }

        // backend returns result.data.dashboard.details.course
        const inprogressData = result?.data?.dashboard?.details?.course?.inprogress || [];
        const completedData = result?.data?.dashboard?.details?.course?.completed || [];

        // 1. Extract IDs for filtering
        const ongoingIds = inprogressData.map((item) => item.item_id);
        const completedIds = completedData.map((item) => item.item_id);

        // 2. Extract Progress Values into a Map { "HTML": 50, "CSS": 20 }
        const progressMap = {};
        inprogressData.forEach((item) => {
            // Check for 'value' (from your update API) or 'progress'
            progressMap[item.item_id] = item.value || item.progress || 0; 
        });

        if (mountedRef.current) {
          setOngoingCourses(ongoingIds);
          setCompletedCourses(completedIds);
          setCourseProgress(progressMap);
        }
      } catch (error) {
        console.error("🚨 Error fetching dashboard data:", error);
        if (mountedRef.current) {
          setOngoingCourses([]);
          setCompletedCourses([]);
        }
      }
    };

    fetchDashboard();
  }, [API_BASE]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const newParams = new URLSearchParams(location.search);
    newParams.set("tab", tab);
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  };

  const handleCourseClick = (course) => {
    if (course?.id) {
      navigate(`/courses/${course.id}`, {
        state: { courseId: course.id, label: course.label },
      });
      return;
    }
    if (course?.path) {
      navigate(course.path, {
        state: { courseId: course.id, label: course.label },
      });
    }
  };

  const getCoursesForTab = (tab) => {
    const tabData = courseItems[tab];
    if (Array.isArray(tabData)) return tabData;
    if (tabData && Array.isArray(tabData.courses)) return tabData.courses;
    return [];
  };

  const allCourses = getCoursesForTab(activeTab);
  const filteredCourses = allCourses.filter(
    (c) => ongoingCourses.includes(c.id) || completedCourses.includes(c.id)
  );

  const getCourseStatus = (id) => {
    if (completedCourses.includes(id)) return "completed";
    if (ongoingCourses.includes(id)) return "inprogress";
    return null;
  };

  return (
    <section className="min-h-screen">
      <div className="max-w-7xl ml-4 mr-4 mx-auto rounded-xl bg-white overflow-hidden min-h-[800px] relative">
        {/* Topbar Tabs */}
        <div className="flex justify-start md:justify-start border-[#B4A7D6]">
          {Object.keys(courseItems).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-3 font-medium text-sm transition-all ${
                activeTab === tab
                  ? "bg-[#2E2A72] text-white rounded-t-md"
                  : "text-[#2E2A72] hover:bg-gray-200 rounded-tl rounded-tr hover:text-blue-900"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Course Cards */}
        <div className="p-6 border border-blue-900 min-h-screen rounded-tr rounded-bl rounded-br">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {filteredCourses.map((item) => {
                const status = getCourseStatus(item.id);
                const isCompleted = status === "completed";
                const isInProgress = status === "inprogress";
                
                // Get specific progress for this course, default to 0
                const currentProgress = courseProgress[item.id] || 0;

                return (
                  <div
                    key={item.label}
                    onClick={() => handleCourseClick(item)}
                    className={`cursor-pointer bg-white border ${
                      isCompleted
                        ? "border-green-600 shadow-md"
                        : isInProgress
                        ? "border-yellow-500 shadow-sm"
                        : "border-[#65629E]"
                    } rounded-xl shadow-sm flex flex-col justify-between items-center text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:bg-gradient-to-br hover:from-[#B4A7D6] hover:to-[#E3E2F4] hover:border-[#7b68ee]`}
                  >
                    <div className="p-6">
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="w-20 h-20 object-contain"
                      />
                    </div>

                    <div
                      className={`w-full py-2 px-3 text-sm font-semibold rounded-b-xl ${
                        isCompleted
                          ? "bg-gradient-to-r from-green-200 to-green-300 text-green-900"
                          : isInProgress
                          ? "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800" // Lighter bg for progress bar visibility
                          : "bg-gradient-to-r from-[#B4A7D6] to-[#E3E2F4] text-[#2E2A72]"
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <span>{item.label}</span>
                        
                        {isCompleted && (
                          <span className="block text-xs font-medium text-green-800">
                            ✅ Completed
                          </span>
                        )}

                        {isInProgress && (
                          <div className="w-full mt-1">
                            {/* Progress Bar Container */}
                            <div className="w-full bg-gray-300 rounded-full h-2.5 overflow-hidden">
                              <div 
                                className="bg-[#099427] h-2.5 rounded-full transition-all duration-500 ease-out" 
                                style={{ width: `${currentProgress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-yellow-800 mt-1 block">
                              {currentProgress}% Completed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10 text-lg font-medium">
              {ongoingCourses.length === 0 && completedCourses.length === 0
                ? "No courses found."
                : "No courses available for this category."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobSeekerCourse;