import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const ReadyToStart = ({ selectedCourse = "C001" }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const courseKey = courseId || selectedCourse;
  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

  const [course, setCourse] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const url = `${API_BASE}/find-my-courses/module/${courseKey}`;
        console.log("📡 Fetch:", url);

        const res = await fetch(url);
        const json = await res.json();

        const root = json.modules;
        if (!root) return;

        setCourse(root);
      } catch (err) {
        console.error(err);
      }
    };

    loadCourse();
  }, [courseKey]);

  if (!course) return <p className="p-4">Loading...</p>;

  return (
    <div className="px-10 mt-16 mb-16">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center">
        <h2 className="text-3xl font-bold text-[#2C2470]">Ready to Start?</h2>
        <p className="text-gray-600 mt-2">
          Code with confidence, stay on track, and reach your potential.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate(`/find-my-courses/${courseKey}/learn`)}
            className="px-6 py-3 bg-[#2C2470] text-white rounded-xl"
          >
            Enroll Now
          </button>

          <button
            onClick={() =>
              document
                .getElementById("course-curriculum")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-6 py-3 border border-[#2C2470] text-[#2C2470] rounded-xl"
          >
            View Curriculum
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadyToStart;
