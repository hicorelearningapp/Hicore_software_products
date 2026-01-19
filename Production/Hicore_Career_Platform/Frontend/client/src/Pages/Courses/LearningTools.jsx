import React, { useEffect, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import axios from "axios";

const LearningTools = ({ course = "html" }) => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await axios.get(
          `https://flask-api-426839393530.asia-south1.run.app/get-course?language=${course}`
        );
        const featureData = res.data[course.toUpperCase()]?.features || [];
        setTools(featureData);
      } catch (err) {
        console.error("Failed to fetch course data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [course]);

  if (loading) return null;
  if (!tools.length) return null;

  return (
    <div className="py-12 bg-white w-full">
      <h2 className="text-3xl font-semibold text-center text-black mb-10">
        Tools That Power Your Learning Journey
      </h2>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        {tools.map((tool, idx) => (
          <LearningToolCard
            key={idx}
            icon={`https://flask-api-426839393530.asia-south1.run.app${tool.icon}`}
            title={tool.title}
            description={tool.description}
          />
        ))}
      </div>
    </div>
  );
};

const LearningToolCard = ({ icon, title, description = [] }) => {
  const [hovered, setHovered] = useState(false);

  const gradientStyle = {
    backgroundImage: hovered
      ? "none"
      : "linear-gradient(to right, #ecedf5 0%, #f3f4fa 40%, #fafbff 80%, #ffffff 100%)",
    transition: "background 0.3s ease-in-out",
  };

  return (
    <div
      className="relative border border-[#d1d5ff] rounded-3xl shadow-[0_4px_20px_rgba(49,44,129,0.12)] w-full max-w-[520px] min-h-[400px] overflow-hidden"
      style={gradientStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!hovered ? (
        <div className="flex flex-col items-center justify-center text-center h-full p-10">
          <img
            src={icon}
            alt={title}
            className="w-24 h-24 mb-4 mx-auto object-contain"
          />
          <h3 className="text-xl font-bold text-[#312c81] mb-4">{title}</h3>
        </div>
      ) : (
        <div className="flex flex-col justify-start h-full p-10 bg-white transition-colors duration-300">
          <div className="flex flex-col items-center text-left">
            <img
              src={icon}
              alt={title}
              className="w-20 h-20 mb-4 object-contain"
            />
            <h3 className="text-xl font-bold text-[#312c81] mb-4 w-full text-left">
              {title}
            </h3>
          </div>
          <div className="text-sm text-[#312c81] space-y-4 w-full text-left">
            {description.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <BsCheckCircleFill className="text-green-500 text-base mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningTools;
