import React from "react";
import DynamicTopicRenderer from "./DynamicTopicRenderer";

const LessonContent = ({ content = [], notes = [] }) => {
  const mergedContent = [
    ...content,
    ...(notes.length > 0 ? [{ type: "notes", notes }] : []),
  ];
  return <DynamicTopicRenderer content={mergedContent} />;
};

export default LessonContent;
