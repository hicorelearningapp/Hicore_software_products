import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const InterProject = () => {
  const API_BASE = import.meta.env.VITE_API_BASE || "/api";
  const API_BASE_CLEAN = API_BASE.replace(/\/$/, "");
  const navigate = useNavigate();

  const [domains, setDomains] = useState([]);
  const [projectsByDomain, setProjectsByDomain] = useState({});
  const [selectedDomain, setSelectedDomain] = useState("");

  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [projectProgress, setProjectProgress] = useState({});

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // helper: fetch with timeout
  const fetchWithTimeout = async (url, opts = {}, timeoutMs = 15000) => {
    const controller = new AbortController();
    const finalOpts = { ...opts, signal: controller.signal };
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, finalOpts);
      clearTimeout(timer);
      return res;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  };

  // 1️⃣ Load domains and projects grouped by domain
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const [domainRes, groupedRes] = await Promise.all([
          fetch(`${API_BASE_CLEAN}/projects/mini_projects/domains`),
          fetch(`${API_BASE_CLEAN}/projects/mini_projects/by_domain`),
        ]);

        if (!domainRes.ok || !groupedRes.ok) {
          console.error("Failed to fetch domains or projects");
          return;
        }

        const domainData = await domainRes.json();
        const groupedData = await groupedRes.json();

        if (!mountedRef.current) return;

        setDomains(domainData || []);
        setProjectsByDomain(groupedData || {});

        if ((domainData || []).length > 0) {
          setSelectedDomain(domainData[0]);
        }
      } catch (err) {
        console.error("Error loading domains/projects:", err);
      }
    };

    loadProjects();
  }, [API_BASE_CLEAN]);

  // 2️⃣ Load dashboard – only in-progress projects
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("userRole");

        if (!userId || !role) {
          console.warn("Missing userId or userRole in localStorage");
          return;
        }

        const url = `${API_BASE_CLEAN}/dashboard/${role}/${userId}`;
        const response = await fetchWithTimeout(url, { method: "GET" }, 15000);

        if (!response.ok) {
          console.warn("Dashboard response not OK");
          if (mountedRef.current) {
            setOngoingProjects([]);
            setProjectProgress({});
          }
          return;
        }

        const rawBody = await response.text();
        let result = {};
        try {
          result = rawBody && rawBody.trim() ? JSON.parse(rawBody) : {};
        } catch {
          result = {};
        }

        const projDetails = result?.data?.dashboard?.details?.project || {};
        const inprogressData = projDetails.inprogress || [];

        const ongoingIds = inprogressData.map((item) => item.item_id);

        const progressMap = {};
        inprogressData.forEach((item) => {
          progressMap[item.item_id] = item.value || item.progress || 0;
        });

        if (mountedRef.current) {
          setOngoingProjects(ongoingIds);
          setProjectProgress(progressMap);
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
        if (mountedRef.current) {
          setOngoingProjects([]);
          setProjectProgress({});
        }
      }
    };

    loadDashboard();
  }, [API_BASE_CLEAN]);

  // All projects for the selected domain
  const domainProjects = projectsByDomain[selectedDomain] || [];
  // ✅ ONLY in-progress projects
  const filteredProjects = domainProjects.filter((p) =>
    ongoingProjects.includes(p.id)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* TABS */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="flex flex-wrap">
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-6 py-2 text-sm font-medium transition-all ${
                selectedDomain === d
                  ? "bg-[#2E2E91] text-white rounded-t-md"
                  : "bg-white text-blue-900 hover:bg-gray-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* PROJECT CARDS */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="border border-blue-900 rounded-lg p-6">
          {filteredProjects.length === 0 ? (
            <p className="text-center text-gray-600 py-10">
              No ongoing projects found in this domain.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const progress = projectProgress[project.id] || 0;

                return (
                  <div
                    key={project.id}
                    className="border border-yellow-500 rounded-xl p-5 shadow-sm"
                  >
                    <h3 className="font-semibold text-[#2E2E91] mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                      {project.description}
                    </p>

                    {/* Progress */}
                    <div>
                      <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs mt-1 text-yellow-700">
                        {progress}% Completed
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/internship-project/${project.id}/project-wizard`
                        )
                      }
                      className="mt-4 w-full bg-[#2E2E91] text-white py-2 rounded-md"
                    >
                      Continue Project
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterProject;
