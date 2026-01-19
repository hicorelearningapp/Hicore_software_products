import React from "react";

const ProgressBar = ({ completed, total }) => {
  const pct = total ? Math.round((completed / total) * 100) : completed;

  return (
    <div className="h-[95px] border border-[#EBEAF2] rounded-[8px] px-4 py-[6px] flex flex-col gap-2">
      <h3 className="text-[#343079] font-semibold text-sm">Course Progress</h3>

      <div className="w-full h-3 rounded-full bg-[#E1E0EB] overflow-hidden">
        <div
          className="h-full bg-[#008000] transition-all duration-500"
          style={{ width: `${pct}%` }}
        ></div>
      </div>

      <span className="text-[#008000] text-sm font-medium">
        {pct}% Completed
      </span>
    </div>
  );
};

export default ProgressBar;
