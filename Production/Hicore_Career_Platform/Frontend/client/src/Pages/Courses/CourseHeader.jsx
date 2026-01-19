import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import backgroundImage from "../../assets/Headerframe.jpg";
import routes from "../../Routes/routesConfig";

const CourseHeader = () => {
  const { courseId } = useParams();
  const [headerTitle, setHeaderTitle] = useState("Course Title");

  useEffect(() => {
    if (!courseId) return;

    const allCourses = [];

    // 🔥 recursively scan all objects to collect all {id, label}
    const findCourses = (obj) => {
      if (Array.isArray(obj)) {
        obj.forEach((item) => findCourses(item));
      } else if (typeof obj === "object" && obj !== null) {
        // if it has id + label → it's a course → save it
        if (obj.id && obj.label) {
          allCourses.push({ id: obj.id, label: obj.label });
        }

        // scan deeper
        Object.values(obj).forEach((val) => findCourses(val));
      }
    };

    findCourses(routes); // scan entire routes config

    // match id
    const found = allCourses.find((c) => c.id === courseId);

    if (found) setHeaderTitle(found.label);
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
