import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import LoginNew from "../Auth/LoginNew";

const CourseContent = ({ selectedCourse = "C001" }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const courseKey = (courseId || selectedCourse).toUpperCase();
  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

  const [course, setCourse] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [loadingEnroll, setLoadingEnroll] = useState(false);

  useEffect(() => {
    const handleLoginStatusChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener("loginStatusChanged", handleLoginStatusChange);
    return () => {
      window.removeEventListener("loginStatusChanged", handleLoginStatusChange);
    };
  }, []);

  // ✅ Fetch unified backend response
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${API_BASE}/courses/module/${courseKey}`);
        console.log("📡 Fetching from:", `${API_BASE}/courses/module/${courseKey}`);

        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        console.log("✅ API Response:", data);

        const firstKey = Object.keys(data)[0];
        const courseData = data[firstKey]?.modules ? data[firstKey] : data?.modules;

        if (courseData) {
          setCourse(courseData);
        } else {
          console.warn("⚠️ Invalid response structure:", data);
        }
      } catch (error) {
        console.error("🚨 Error fetching course data:", error);
      }
    };

    fetchCourse();
  }, [courseKey, API_BASE]);

  // ✅ Enroll Handler
  const handleEnrollClick = async () => {
    if (!isLoggedIn) {
      const redirectData = {
        from: location.pathname,
        action: "enroll",
        courseId: courseId || selectedCourse,
      };
      localStorage.setItem("postLoginRedirect", JSON.stringify(redirectData));
      navigate("/login", { state: redirectData });
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID missing. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      setLoadingEnroll(true);
      const checkUrl = `${API_BASE}/access/check?user_id=${userId}&item_type=course&item_id=${courseKey}`;
      console.log("🔍 Checking access:", checkUrl);

      const checkRes = await fetch(checkUrl, { method: "GET" });
      const checkData = await checkRes.json();
      console.log("✅ Access check result:", checkData);

      if (checkData.has_access) {
        console.log("🎓 Access already granted. Redirecting...");
        navigate(`/courses/${courseKey}/learn`);
      } else {
        console.log("🚀 No access. Granting now...");
        const grantRes = await fetch(`${API_BASE}/access/grant`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: parseInt(userId),
            item_type: "course",
            item_id: courseKey,
          }),
        });

        const grantData = await grantRes.json();
        console.log("✅ Grant Response:", grantData);

        if (grantData.status === "success") {
          alert("Access granted successfully!");
          navigate(`/courses/${courseKey}/learn`);
        } else {
          alert("Failed to grant access. Please try again.");
        }
      }
    } catch (error) {
      console.error("❌ Error during enroll:", error);
      alert("Something went wrong while enrolling. Please try again.");
    } finally {
      setLoadingEnroll(false);
    }
  };

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

  if (!course) {
    return (
      <div className="p-6 text-gray-500 text-center">
        Loading course details...
      </div>
    );
  }

  // ✅ Safe background URL handler
  const backgroundUrl = course.background
    ? `${API_BASE}/${course.background}`.replace(/([^:]\/)\/+/g, "$1") // removes double slashes
    : "";

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${encodeURI(backgroundUrl)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-8xl mx-16 flex flex-col md:flex-row items-center justify-between gap-8 px-6 py-14">
          {/* Left Content */}
          <div className="max-w-2xl text-left text-[#2C2470]">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome to the {course.title}
            </h1>
            <p className="text-md leading-[32px] mb-2">{course.description1}</p>
            <p className="font-semibold text-lg mb-2 text-[#2C2470]">
              {course.highlight}
            </p>
            <p className="text-md leading-[32px] mb-2">{course.description2}</p>
            <p className="text-md leading-relaxed mb-6">{course.closing}</p>

            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={handleEnrollClick}
                disabled={loadingEnroll}
                className={`bg-[#2C2470] text-white font-semibold px-6 py-2 rounded transition duration-200 ${
                  loadingEnroll ? "opacity-50 cursor-not-allowed" : "hover:bg-[#1e1a5d]"
                }`}
              >
                {loadingEnroll ? "Checking Access..." : "Enroll Now"}
              </button>

              <p className="text-sm text-gray-700 font-medium">
                Course Rating{" "}
                <span className="text-yellow-500">⭐ {course.rating}</span>
              </p>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white shadow-lg px-4 py-2 rounded-lg text-center">
              <p className="text-lg font-semibold text-gray-500 line-through">
                ₹{course.price}
              </p>
              <p className="text-2xl font-bold text-green-600">
                ₹{course.offer_price}
              </p>
            </div>

            {course.image && (
              <img
                src={`${API_BASE}/${course.image}`}
                alt={course.title}
                className="w-[250px] md:w-[300px] drop-shadow-xl"
              />
            )}
          </div>
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
    </>
  );
};

export default CourseContent;
