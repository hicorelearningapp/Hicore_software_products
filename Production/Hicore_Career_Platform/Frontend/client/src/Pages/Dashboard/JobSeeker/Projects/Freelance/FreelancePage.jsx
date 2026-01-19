import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FreelancePage = () => {
  const [domains, setDomains] = useState([]);
  const [projectsByDomain, setProjectsByDomain] = useState({});
  const [selectedDomain, setSelectedDomain] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://hicore.pythonanywhere.com/api/domains")
      .then((res) => res.json())
      .then((data) => {
        setDomains(data);
        setSelectedDomain(data[0] || "");
      });
    fetch("https://hicore.pythonanywhere.com/api/projects")
      .then((res) => res.json())
      .then((data) => setProjectsByDomain(data));
  }, []);

  const projects = projectsByDomain[selectedDomain] || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Domain Filter */}
      <div className="max-w-7xl mx-auto mb-0 px-4 ">
        <div className="flex flex-wrap  justify-center md:justify-start">
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-6 py-2  text-sm font-medium  transition-all duration-200 ${
                selectedDomain === domain
                  ? "bg-[#2E2E91] rounded-tl rounded-tr text-white "
                  : "bg-white text-blue-900 rounded-tl rounded-tr hover:bg-gray-200"
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards */}
      <div className="max-w-7xl mx-auto px-4 ">
        <div className="border border-blue-900 rounded-lg rounded-tl-xs p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-gray-300 rounded-xl p-5 shadow-sm flex flex-col"
              >
                <h3 className="font-semibold text-[#2E2E91] mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  {project.description}
                </p>
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500">
                    Tools/Software:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.tools.map((t) => (
                      <span
                        key={t}
                        className="bg-gray-200 text-xs px-2 py-1 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500">
                    Tech Stack:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.techStack.map((t) => (
                      <span
                        key={t}
                        className="bg-gray-200 text-xs px-2 py-1 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-auto pt-6">
                  <button
                    onClick={() =>
                      navigate(
                        `/internship-project/${project.id}/project-wizard`
                      )
                    }
                    className="w-full bg-[#2E2E91] text-white text-sm py-2 rounded-md hover:bg-[#1f1f75]"
                  >
                    Start Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancePage;
