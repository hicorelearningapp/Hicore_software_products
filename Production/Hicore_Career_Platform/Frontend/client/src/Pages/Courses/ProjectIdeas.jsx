import React from "react";
import DynamicTopicRenderer from "./DynamicTopicRenderer";

const ProjectIdeas = ({ content = [] }) => {
  return (
    <div className="flex flex-col justify-between h-full font-poppins text-[#343079]">
      <div className="flex-1 overflow-y-auto pr-1">
        <DynamicTopicRenderer content={content} />
      </div>
    </div>
  );
};

export default ProjectIdeas;
