import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import backgroundImage from "../../assets/Headerframe.jpg";
import careerRouteConfig from "../../Routes/careerrouteConfig";

const CourseHeader = () => {
  const { courseId } = useParams();
  const [headerTitle, setHeaderTitle] = useState("Course Title");

  useEffect(() => {
    if (!courseId) return;

    let foundTitle = null;

    // Recursive scan
    const search = (obj) => {
      if (Array.isArray(obj)) {
        obj.forEach((item) => search(item));
      } else if (typeof obj === "object" && obj !== null) {

        // If this object contains courseId → this is a plan
        if (obj.courseId === courseId && obj.title) {
          foundTitle = obj.title;
        }

        Object.values(obj).forEach((val) => search(val));
      }
    };

    search(careerRouteConfig);

    if (foundTitle) setHeaderTitle(foundTitle);

  }, [courseId]);

  return (
    <header
      className="w-full h-[56px] mx-auto text-center font-bold text-white text-[20px] leading-[32px] font-poppins tracking-wide flex items-center justify-center rounded"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {headerTitle}
    </header>
  );
};

export default CourseHeader;
