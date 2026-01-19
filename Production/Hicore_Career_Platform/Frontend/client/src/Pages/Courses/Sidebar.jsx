import React, { useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({
  menu,
  completedLessons = [],
  onLessonClick,
  activeLessonPath,
}) => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to first lesson only once
  useEffect(() => {
    if (menu.length > 0) {
      const currentPath = location.pathname;
      const basePath = `/courses/${courseId}/learn`;

      if (currentPath === basePath) {
        const firstLesson = menu[0]?.items?.[0];
        if (firstLesson) {
          navigate(`/courses/${courseId}/${firstLesson.path}`, {
            replace: true,
          });
        }
      }
    }
  }, [menu, courseId, navigate, location.pathname]);

  return (
    <div className="h-full flex flex-col font-poppins border border-[#EBEAF2] rounded-[8px] bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">

        <h2 className="text-[#343079] text-[16px] font-bold mb-2 text-center">
          Course Menu
        </h2>

        {menu.length === 0 ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          menu.map((mod, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-[#343079] text-[16px] font-semibold mb-1">
                {mod.module}
              </h3>

              <ul className="list-disc list-outside ml-6 flex flex-col gap-2">
                {mod.items?.map((lesson, idx) => {
                  const isCompleted = completedLessons.includes(lesson.path);

                  const isActive =
                    activeLessonPath === lesson.path ||
                    location.pathname.includes(lesson.path);

                  return (
                    <li
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      {/* LEFT: TITLE */}
                      <Link
                        to={`/courses/${courseId}/${lesson.path}`}
                        onClick={() =>
                          onLessonClick && onLessonClick(lesson.path)
                        }
                        className={`text-[13px] ${
                          isActive
                            ? "font-semibold text-[#4F80BF]"
                            : "font-normal text-[#343079]"
                        }`}
                      >
                        {lesson.title}
                      </Link>

                      {/* RIGHT: ✅ TICK AT END */}
                      {isCompleted && (
                        <span className="text-green-600 font-bold text-sm ml-2">
                          ✔
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
