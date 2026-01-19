import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import CourseContent from "./CourseContent";
import CourseCurriculum from "./CourseCurriculum";
import ReadyToStart from "./ReadyToStart";
import courseCurriculumData from "../../../data/courseData";

const CoursePage = () => {
  const { courseId } = useParams();
  const formattedCourse = courseId?.toUpperCase();
  const navigate = useNavigate();

  const curriculum = courseCurriculumData[formattedCourse] || [];

  return (
    <div className="bg-white">
      <CourseContent selectedCourse={formattedCourse} />
      <CourseCurriculum curriculum={curriculum} />
      <ReadyToStart onStart={() => navigate(`/courses/${courseId}/enroll`)} />    </div>
  );
};

export default CoursePage;
