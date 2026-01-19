import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";

const CourseCurriculum = ({ selectedCourse = "C001" }) => {
  const { courseId } = useParams();
  const courseKey = (courseId || selectedCourse).toUpperCase();

  const [curriculum, setCurriculum] = useState([]);
  const [openModules, setOpenModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        setLoading(true);
        const url = `${API_BASE}/courses/module/${courseKey}`;
        console.log("📡 Fetching curriculum from:", url);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Server responded ${response.status}`);

        const data = await response.json();
        console.log("✅ Curriculum API Response:", data);

        // ✅ Unified structure handler
        const firstKey = Object.keys(data)[0];
        const modules = data[firstKey]?.modules || data.modules?.data || data.modules;

        if (modules && modules.length) {
          setCurriculum(modules);
          setOpenModules(new Array(modules.length).fill(false));
        } else {
          console.warn("⚠️ No modules found:", data);
          setCurriculum([]);
        }
      } catch (err) {
        console.error("🚨 Error fetching course curriculum:", err);
        setError("Failed to load course curriculum.");
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculum();
  }, [courseKey, API_BASE]);

  const toggleModule = (index) => {
    const updated = [...openModules];
    updated[index] = !updated[index];
    setOpenModules(updated);
  };

  return (
    <div id="course-curriculum" className="w-full px-10 mt-12 mx-auto  ">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-300">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">📘</span>
          <h2 className="text-3xl font-bold text-[#2C2470]">Course Curriculum</h2>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-500">Loading curriculum...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : curriculum.length === 0 ? (
          <p className="text-gray-500 text-center">
            No curriculum available for this course.
          </p>
        ) : (
          curriculum.map((module, index) => (
            <div
              key={index}
              className="bg-white border border-gray-300 rounded-xl mb-5 overflow-hidden transition-all duration-300 shadow-sm"
            >
              {/* Module Header */}
              <div
                onClick={() => toggleModule(index)}
                className="flex justify-between items-center cursor-pointer px-6 py-5 hover:bg-gray-100 text-[#2C2470] font-medium text-base"
              >
                <span>{module.title}</span>
                {openModules[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>

              {/* Lessons */}
              {openModules[index] && (
                <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                    {module.lessons?.map((lesson, idx) => (
                      <li key={idx}>{lesson}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseCurriculum;
