import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import DynamicTopicRenderer from "./DynamicTopicRenderer";

const Lesson = ({ activeSubheading, lessonData }) => {
  const { weekId, topicId } = useParams();

  // ✅ Safely access nested topic data
  const topicData = lessonData?.[weekId]?.[topicId];
  const lessonSections = topicData?.lesson || [];

  // ✅ Determine which subheading to show:
  // Use selected one if exists, else default to the first available
  const currentSubheading = useMemo(() => {
    if (activeSubheading) return activeSubheading;
    if (lessonSections.length > 0 && lessonSections[0].subheadings?.length > 0) {
      return lessonSections[0].subheadings[0].subheading;
    }
    return null;
  }, [activeSubheading, lessonSections]);

  // ✅ Extract content for the chosen subheading
  const filteredContent = useMemo(() => {
    if (!lessonSections || lessonSections.length === 0 || !currentSubheading)
      return [];

    for (const section of lessonSections) {
      const foundSubheading = section.subheadings?.find(
        (sub) => sub.subheading === currentSubheading
      );
      if (foundSubheading) return foundSubheading.content || [];
    }

    return [];
  }, [lessonSections, currentSubheading]);

  // ✅ If no topic data found
  if (!topicData) {
    return (
      <div className="p-4 text-red-600 font-poppins">
        Lesson content not found.
      </div>
    );
  }

  // ✅ Render lesson content (auto-selects first one if not clicked yet)
  return (
    <div className="space-y-6">
      <h2 className="text-[#343079] font-poppins font-semibold text-[18px] mb-4">
        {currentSubheading}
      </h2>
      <DynamicTopicRenderer lessonContent={filteredContent} />
    </div>
  );
};

export default Lesson;
