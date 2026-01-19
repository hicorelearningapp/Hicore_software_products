import React, { useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ menu }) => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to first lesson only once
  useEffect(() => {
    if (menu.length > 0) {
      const currentPath = location.pathname;
      const basePath = `/find-my-courses/${courseId}/learn`;

      if (currentPath === basePath) {
        const firstModule = menu[0];
        const firstLesson = firstModule.items?.[0];
        if (firstLesson) {
          navigate(`/find-my-courses/${courseId}/${firstLesson.path}`, { replace: true });
        }
      }
    }
  }, [menu, courseId, navigate]);

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
            <div key={index}>
              <h3 className="text-[#343079] text-[16px] font-semibold mb-1">
                {mod.module}
              </h3>

              <ul className="list-disc list-outside ml-10 flex flex-col gap-1">
                              {mod.items?.map((lesson, idx) => {
                                const isActive = location.pathname.includes(lesson.path);
              
                                return (
                                  <li key={idx}>
                                    <Link
                                      to={`/find-my-courses/${courseId}/${lesson.path}`}
                                      className={`text-[13px] ${
                                        isActive
                                          ? "font-semibold text-[#4F80BF]"
                                          : "font-normal text-[#343079]"
                                      }`}
                                    >
                                      {lesson.title}
                                    </Link>
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
