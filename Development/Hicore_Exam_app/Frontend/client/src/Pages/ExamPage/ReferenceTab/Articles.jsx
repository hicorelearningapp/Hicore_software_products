import React from "react";
import { ChevronRight } from "lucide-react"; // for the arrow icon

const articles = [
  { title: "Problem-solving strategies", readTime: "8 min read" },
  { title: "Problem-solving strategies", readTime: "8 min read" },
  { title: "Problem-solving strategies", readTime: "8 min read" },
  { title: "Problem-solving strategies", readTime: "8 min read" },
  { title: "Problem-solving strategies", readTime: "8 min read" },
  { title: "Problem-solving strategies", readTime: "8 min read" },
];

const Articles = () => {
  return (
    <div className="w-full bg-white p-6">
      <div className=" mx-auto flex flex-col gap-4">
        {articles.map((article, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Left - Article Title */}
            <h3 className="text-[#1d3b8b] font-semibold text-[16px]">
              {article.title}
            </h3>

            {/* Center - Read Time */}
            <p className="text-gray-500 text-sm">{article.readTime}</p>

            {/* Right - Button */}
            <button className="flex items-center gap-2 px-5 py-2 bg-[#0663ff] text-white text-[14px] font-medium rounded-full hover:opacity-90 transition-all">
              Read Article <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Articles;
