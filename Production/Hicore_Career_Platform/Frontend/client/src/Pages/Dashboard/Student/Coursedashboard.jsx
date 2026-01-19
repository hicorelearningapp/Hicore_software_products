import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import routes from "../../../Routes/routesConfig"; // ✅ adjust path if needed

const Coursedashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

  // ✅ Extract course data from routesConfig
  const coursesRoute = routes.find((r) => r.label === "Courses");
  const courseTabs = coursesRoute?.tabs?.map((t) => t.name) || [];
  const courseItems = coursesRoute?.items?.Courses?.data || {};

  // ✅ Default to "Frontend" if available, else use the first tab
  const defaultTab =
    Object.keys(courseItems).includes("Frontend")
      ? "Frontend"
      : courseTabs[0] || Object.keys(courseItems)[0];

  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || defaultTab;
  const [activeTab, setActiveTab] = useState(initialTab);

  // ✅ Dashboard-based ongoing + completed courses
  const [ongoingCourses, setOngoingCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("userRole"); // ✅ correct key

        if (!userId || !role) {
          console.warn("⚠️ Missing user info in localStorage");
          return;
        }

        const response = await fetch(`${API_BASE}/dashboard/${role}/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch dashboard data");

        const result = await response.json();
        const inprogress = result?.data?.dashboard?.details?.course?.inprogress || [];
        const completed = result?.data?.dashboard?.details?.course?.completed || [];

        const ongoingIds = inprogress.map((item) => item.item_id);
        const completedIds = completed.map((item) => item.item_id);

        setOngoingCourses(ongoingIds);
        setCompletedCourses(completedIds);
      } catch (error) {
        console.error("🚨 Error fetching dashboard data:", error);
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

  // ✅ Navigate with course ID and label
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

  // ✅ Extract course list properly (including AI)
  const getCoursesForTab = (tab) => {
    const tabData = courseItems[tab];
    if (Array.isArray(tabData)) {
      return tabData; // frontend, backend, testing
    }
    if (tabData && Array.isArray(tabData.courses)) {
      return tabData.courses; // AI
    }
    return [];
  };

  // ✅ Combine both inprogress + completed courses
  const allCourses = getCoursesForTab(activeTab);
  const filteredCourses = allCourses.filter(
    (c) => ongoingCourses.includes(c.id) || completedCourses.includes(c.id)
  );

  // ✅ Helper to get course status
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
                      className={`w-full py-2 text-sm font-semibold rounded-b-xl ${
                        isCompleted
                          ? "bg-gradient-to-r from-green-200 to-green-300 text-green-900"
                          : isInProgress
                          ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800"
                          : "bg-gradient-to-r from-[#B4A7D6] to-[#E3E2F4] text-[#2E2A72]"
                      }`}
                    >
                      {item.label}
                      {isCompleted && (
                        <span className="block text-xs font-medium text-green-800">
                          ✅ Completed
                        </span>
                      )}
                      {isInProgress && (
                        <span className="block text-xs font-medium text-yellow-700">
                          ⏳ In Progress
                        </span>
                      )}
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

export default Coursedashboard;
