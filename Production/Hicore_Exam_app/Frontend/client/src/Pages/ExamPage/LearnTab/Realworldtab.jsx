import React from "react";

const Realworldtab = ({ selectedTopic }) => {
  const realData = selectedTopic?.realworld || [];

  return (
    <div className="flex flex-col p-[24px] gap-[24px]">
      {realData.length > 0 ? (
        realData.map((item, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 p-4 rounded-[16px] border border-[#B0CBFE] bg-[#F8FBFF]"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-[14px] font-semibold text-[#2758B3]">
                {item.title}
              </h2>

              {item.concept && (
                <div className="flex items-center justify-center h-[32px] px-4 py-1 rounded-[80px] border border-[#2758B3] bg-[#E9EEF7] text-[12px] font-medium text-[#2758B3]">
                  {item.concept}
                </div>
              )}
            </div>

            <p className="text-[14px] text-[#2758B3] mt-2">
              {item.description}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">
          No real-world examples available for this topic.
        </p>
      )}
    </div>
  );
};

export default Realworldtab;
