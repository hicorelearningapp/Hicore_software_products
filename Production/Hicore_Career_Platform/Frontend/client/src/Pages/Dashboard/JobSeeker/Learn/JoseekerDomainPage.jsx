import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import routes from "../../../../Routes/routesConfig"; // Ensure this path is correct

const JoseekerDomainPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

  // ==========================================
  // 1. Extract Data from Routes Config
  // ==========================================
  
  // We need to dig into routes to find the "Domain Based Courses" array
  // Adjust the .find() logic if your routes structure is slightly different
  const domainRouteEntry = routes.find((r) => r.items && r.items["Domain Based Courses"]);
  const domainCategories = domainRouteEntry?.items?.["Domain Based Courses"] || [];

  // ==========================================
  // 2. State Management
  // ==========================================

  // Get Tab names from the labels (Medical, Bio Technology, etc.)
  const tabNames = domainCategories.map((cat) => cat.label);
  
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || tabNames[0];
  const [activeTab, setActiveTab] = useState(initialTab);

  const [ongoingDomains, setOngoingDomains] = useState([]);
  const [completedDomains, setCompletedDomains] = useState([]);
  const [domainProgress, setDomainProgress] = useState({});
  const [loading, setLoading] = useState(true);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Sync active tab with URL
  useEffect(() => {
    if(initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const newParams = new URLSearchParams(location.search);
    newParams.set("tab", tab);
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  };

  // ==========================================
  // 3. Fetch Progress from Dashboard
  // ==========================================

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
        setLoading(true);
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("userRole");

        if (!userId || !role) {
             setLoading(false);
             return;
        }

        const url = `${API_BASE.replace(/\/$/, "")}/dashboard/${role}/${userId}`;
        const response = await fetchWithTimeout(url, { method: "GET" }, 15000);

        if (!response.ok) {
          if (mountedRef.current) {
            setOngoingDomains([]);
            setCompletedDomains([]);
            setDomainProgress({});
            setLoading(false);
          }
          return;
        }

        const rawBody = await response.text();
        let result = {};
        try {
          result = rawBody && rawBody.trim() ? JSON.parse(rawBody) : {};
        } catch (e) {
          result = {};
        }

        // Assuming domains are stored in course.inprogress or similar
        const inprogressData = result?.data?.dashboard?.details?.course?.inprogress || [];
        const completedData = result?.data?.dashboard?.details?.course?.completed || [];

        const ongoingIds = inprogressData.map((item) => item.item_id);
        const completedIds = completedData.map((item) => item.item_id);

        const progressMap = {};
        inprogressData.forEach((item) => {
          progressMap[item.item_id] = item.value || item.progress || 0;
        });

        if (mountedRef.current) {
          setOngoingDomains(ongoingIds);
          setCompletedDomains(completedIds);
          setDomainProgress(progressMap);
          setLoading(false);
        }
      } catch (error) {
        console.error("🚨 Error fetching domain progress:", error);
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchDashboard();
  }, [API_BASE]);

  // ==========================================
  // 4. Filtering & Rendering Logic
  // ==========================================

  const handleCourseClick = (course) => {
    if (course.path) {
      navigate(`/courses/${course.id}`, { state: { courseId: course.id, label: course.label }});
    }
  };

  const getDomainStatus = (id) => {
    if (completedDomains.includes(id)) return "completed";
    if (ongoingDomains.includes(id)) return "inprogress";
    return null;
  };

  // 1. Find the Category Object based on active Tab
  const currentCategory = domainCategories.find(cat => cat.label === activeTab);
  
  // 2. Get the 'relatedCourses' array from that category
  const currentCourses = currentCategory ? currentCategory.relatedCourses : [];

  // 3. Filter: Show only if ID exists in ongoing or completed lists
  const filteredCourses = currentCourses.filter(
    (item) => item.id && (ongoingDomains.includes(item.id) || completedDomains.includes(item.id))
  );

  return (
    <section className="min-h-screen">
      <div className="max-w-7xl ml-4 mr-4 mx-auto rounded-xl bg-white overflow-hidden min-h-[600px] relative">
        
        {/* Tabs */}
        <div className="flex justify-start md:justify-start border-[#B4A7D6] overflow-x-auto">
          {tabNames.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-3 font-medium text-sm transition-all whitespace-nowrap ${
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

        {/* Content Grid */}
        <div className="p-6 border border-blue-900 min-h-screen rounded-tr rounded-bl rounded-br">
          {loading ? (
             <div className="text-center text-gray-500 py-10">Loading enrolled courses...</div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {filteredCourses.map((item) => {
                const status = getDomainStatus(item.id);
                const isCompleted = status === "completed";
                const isInProgress = status === "inprogress";
                const currentProgress = domainProgress[item.id] || 0;

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
                      className={`w-full py-2 px-3 font-semibold text-sm rounded-b-xl ${
                        isCompleted
                          ? "bg-gradient-to-r from-green-200 to-green-300 text-green-900"
                          : isInProgress
                          ? "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800"
                          : "bg-gradient-to-r from-[#B4A7D6] to-[#E3E2F4] text-[#2E2A72]"
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="truncate w-full block" title={item.label}>{item.label}</span>

                        {isCompleted && (
                          <span className="block text-xs font-medium text-green-800">
                            ✅ Completed
                          </span>
                        )}

                        {isInProgress && (
                          <div className="w-full mt-1">
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
              {ongoingDomains.length === 0 && completedDomains.length === 0 
                 ? "You haven't enrolled in any domain courses yet." 
                 : `No enrolled courses found in ${activeTab}.`}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JoseekerDomainPage;