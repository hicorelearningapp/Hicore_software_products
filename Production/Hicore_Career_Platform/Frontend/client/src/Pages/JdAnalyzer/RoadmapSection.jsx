import React, { useState, useEffect } from "react";

const RoadmapSection = ({ roadmap = [] }) => {
  const [selectedTopic, setSelectedTopic] = useState("");

  useEffect(() => {
    if (roadmap.length > 0) {
      setSelectedTopic(roadmap[0].topic);
    }
  }, [roadmap]);

  const getShortTitle = (fullTitle) => {
    return fullTitle.includes(":") ? fullTitle.split(":")[0] : fullTitle;
  };

  const cleanMarkdown = (text) => {
    return text
      .replace(/^[-*\s]+/, "")     // remove "- ", "* ", "- **"
      .replace(/\*\*/g, "");       // remove bold markdown
  };

  const selectedItem = roadmap.find((item) => item.topic === selectedTopic);

  if (!roadmap.length) {
    return (
      <div className="text-center mt-10 text-sm text-gray-600 italic">
        No roadmap data found.
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center mt-2">
      <div className="w-[90%] pb-20">
        <h2 className="text-center text-lg font-semibold text-indigo-900 mb-8">
          Learning Roadmap Extracted from Job Description
        </h2>

        <div className="flex flex-col lg:flex-row border border-indigo-200 rounded-md overflow-hidden">
          {/* Topics List */}
          <div className="w-full lg:w-1/3 bg-white p-5 border-r border-indigo-200">
            <div className="space-y-3">
              {roadmap.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTopic(item.topic)}
                  className={`text-left text-sm w-full px-2 py-1 rounded ${
                    selectedTopic === item.topic
                      ? "bg-indigo-100 text-indigo-800 font-medium"
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {getShortTitle(item.topic)}
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="w-full lg:w-2/3 p-6 bg-white">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">
              {selectedTopic}
            </h3>

            <p className="inline-block bg-pink-100 text-pink-800 px-4 py-1 rounded-md text-sm font-medium mb-4">
              Goal: Learn and master {getShortTitle(selectedTopic)}
            </p>

            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 mb-6">
              {selectedItem?.details.map((point, index) => (
                <li key={index}>{cleanMarkdown(point)}</li>
              ))}
            </ul>

            <p className="text-sm text-gray-600 mb-2">
              Want to explore {getShortTitle(selectedTopic)} from scratch?
            </p>
            <button className="bg-indigo-900 text-white px-6 py-2 rounded-md hover:bg-indigo-800 transition">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapSection;
