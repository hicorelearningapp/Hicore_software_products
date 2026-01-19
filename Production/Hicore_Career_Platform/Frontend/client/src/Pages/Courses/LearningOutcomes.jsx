import React, { useEffect, useState } from "react";
import { Target, BrainCircuit } from "lucide-react";
import { useParams } from "react-router-dom";

const LearningOutcomes = ({ selectedCourse = "HTML" }) => {
  const { courseId } = useParams();
  const courseKey = (courseId || selectedCourse).toUpperCase();

  const [outcomes, setOutcomes] = useState(null);

  useEffect(() => {
    const fetchOutcomes = async () => {
      try {
        const response = await fetch(
          `https://flask-api-426839393530.asia-south1.run.app/get-course?language=${courseKey.toLowerCase()}`
        );
        const data = await response.json();
        setOutcomes(data[courseKey]);
      } catch (error) {
        console.error("Error fetching learning outcomes:", error);
        setOutcomes(null);
      }
    };

    fetchOutcomes();
  }, [courseKey]);

  if (!outcomes) return null;

  return (
    <div className="w-full bg-white py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 place-items-center">
        {/* What You’ll Learn Card */}
        <div className="border border-[#d1d5ff] rounded-3xl shadow-[0_4px_20px_rgba(49,44,129,0.12)] w-full max-w-[520px] min-h-[400px] bg-white p-10">
          <div className="flex items-center mb-4">
            <Target className="text-[#ef4444] w-6 h-6 mr-2" />
            <h2 className="text-2xl font-bold text-[#312c81]">What You’ll Learn</h2>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-[#312c81]">
            {outcomes.learn?.map((item, index) => (
              <li key={index} className="text-base leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Skills You’ll Gain Card */}
        <div className="border border-[#d1d5ff] rounded-3xl shadow-[0_4px_20px_rgba(49,44,129,0.12)] w-full max-w-[520px] min-h-[400px] bg-white p-10">
          <div className="flex items-center mb-4">
            <BrainCircuit className="text-[#f97316] w-6 h-6 mr-2" />
            <h2 className="text-2xl font-bold text-[#312c81]">Skills You’ll Gain</h2>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-[#312c81]">
            {outcomes.skills?.map((item, index) => (
              <li key={index} className="text-base leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LearningOutcomes;
