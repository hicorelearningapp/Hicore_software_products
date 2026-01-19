// src/Pages/Courses/ReadyToStart.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import LoginNew from "../Auth/LoginNew";

const ReadyToStart = ({ selectedCourse = "C001" }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const courseKey = courseId || selectedCourse;
  const BACKEND_URL = import.meta.env.VITE_API_BASE || "/api";

  const [course, setCourse] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  // ✅ Track login status
  useEffect(() => {
    const handleLoginStatusChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener("loginStatusChanged", handleLoginStatusChange);
    return () => {
      window.removeEventListener("loginStatusChanged", handleLoginStatusChange);
    };
  }, []);

  // ✅ Fetch course data from same backend
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/courses/module/${courseKey}`);
        console.log(
          "📡 Fetching course data from:",
          `${BACKEND_URL}/courses/module/${courseKey}`
        );

        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();

        const firstKey = Object.keys(data)[0];
        const courseData = data[firstKey]?.modules
          ? data[firstKey]
          : data?.modules;
        if (courseData) {
          setCourse(courseData);
        } else {
          console.warn("⚠️ Invalid course structure:", data);
        }
      } catch (error) {
        console.error("🚨 Error fetching course:", error);
      }
    };
    fetchCourse();
  }, [courseKey, BACKEND_URL]);

  // ✅ Enroll click (no payment)
  const handleEnrollClick = () => {
    if (!isLoggedIn) {
      const redirectData = {
        from: location.pathname,
        action: "enroll",
        courseId: courseKey,
      };
      localStorage.setItem("postLoginRedirect", JSON.stringify(redirectData));
      navigate("/login", { state: redirectData });
    } else {
      navigate(`/courses/${courseKey}/learn`);
    }
  };

  // ✅ On login success
  const onLoginSuccess = useCallback(() => {
    setShowLoginModal(false);
    setIsLoggedIn(true);

    const redirectData =
      location.state ||
      JSON.parse(localStorage.getItem("postLoginRedirect") || "{}");

    localStorage.removeItem("postLoginRedirect");

    if (redirectData.action === "enroll" && redirectData.courseId) {
      navigate(`/courses/${redirectData.courseId}/learn`);
    } else {
      navigate(redirectData.from || location.pathname);
    }
  }, [navigate, location]);

  // ✅ Scroll to curriculum
  const scrollToCurriculum = () => {
    const section = document.getElementById("course-curriculum");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  if (!courseId) {
    return (
      <div className="text-center text-gray-500 py-6">
        Loading course info...
      </div>
    );
  }

  return (
    <div className="w-full  mx-auto mb-10 mt-16 px-10">
      <div className="bg-white rounded-3xl border shadow-xl shadow-gray-300 border-gray-200 shadow-md py-10 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#2C2470] mb-3">
          Ready to Start?
        </h2>
        <p className="text-gray-600 mb-6">
          Code with confidence, stay on track, and reach your full potential.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={handleEnrollClick}
            className="px-6 py-3 rounded-xl font-semibold text-white transition bg-[#2C2470] hover:bg-[#1e1a56]"
          >
            Enroll Now
          </button>

          <button
            onClick={scrollToCurriculum}
            className="border border-[#2C2470] text-[#2C2470] px-6 py-3 rounded-xl hover:bg-[#f2f2fa] transition"
          >
            View Curriculum
          </button>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="relative bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <LoginNew onLoginSuccess={onLoginSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadyToStart;
