import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PROJECT_IDS = ["PMI1", "PMI2", "PMI3"]; // <-- ADD YOUR PROJECT IDs HERE

const InterbshipPage = () => {
  const API_BASE = import.meta.env.VITE_API_BASE || "/api";
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");

  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [projectProgress, setProjectProgress] = useState({});

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);

  // Fetch with timeout helper
  const fetchWithTimeout = async (url, opts = {}, timeoutMs = 15000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...opts, signal: controller.signal });
      clearTimeout(timer);
      return res;
    } catch (e) {
      clearTimeout(timer);
      throw e;
    }
  };

  // 1️⃣ Fetch details of each project based on PROJECT_IDS
  useEffect(() => {
    const loadProjects = async () => {
      const results = [];

      for (const id of PROJECT_IDS) {
        try {
          const res = await fetch(`${API_BASE}/projects/mini_projects/${id}`);
          const data = await res.json();
          results.push(data.project);
        } catch (err) {
          console.log("Error loading project:", id, err);
        }
      }

      setProjects(results);

      // group domains
      const domainMap = {};
      results.forEach((p) => {
        if (!domainMap[p.domain]) domainMap[p.domain] = [];
        domainMap[p.domain].push(p);
      });

      setDomains(Object.keys(domainMap));
      setSelectedDomain(Object.keys(domainMap)[0] || "");
    };

    loadProjects();
  }, [API_BASE]);

  // 2️⃣ Fetch dashboard progress
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("userRole");

        if (!userId || !role) return;

        const url = `${API_BASE}/dashboard/${role}/${userId}`;
        const response = await fetchWithTimeout(url, { method: "GET" }, 15000);

        if (!response.ok) return;

        const raw = await response.text();
        let result = {};
        try {
          result = raw.trim() ? JSON.parse(raw) : {};
        } catch {}

        const projDetails = result?.data?.dashboard?.details?.project || {};

        const inprogress = projDetails.inprogress || [];
        const completed = projDetails.completed || [];

        setOngoingProjects(inprogress.map((i) => i.item_id));
        setCompletedProjects(completed.map((i) => i.item_id));

        const progressMap = {};
        inprogress.forEach((i) => {
          progressMap[i.item_id] = i.value || i.progress || 0;
        });

        setProjectProgress(progressMap);
      } catch (err) {
        console.log("Dashboard error:", err);
      }
    };

    loadDashboard();
  }, [API_BASE]);

  const filtered = projects.filter((p) => p.domain === selectedDomain);

  const getStatus = (id) => {
    if (completedProjects.includes(id)) return "completed";
    if (ongoingProjects.includes(id)) return "inprogress";
    return null;
  };

  return (
    <div className="min-h-screen bg-white">

      {/* TABS */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap mt-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filtered.map((project) => {
              const status = getStatus(project.id);
              const isCompleted = status === "completed";
              const isInProgress = status === "inprogress";
              const progress = projectProgress[project.id] || 0;

              return (
                <div
                  key={project.id}
                  className={`border rounded-xl p-5 shadow-sm transition-all
                    ${
                      isCompleted
                        ? "border-green-600 shadow-md"
                        : isInProgress
                        ? "border-yellow-500 shadow-sm"
                        : "border-gray-300"
                    }`}
                >

                  <h3 className="font-semibold text-[#2E2E91] mb-2">{project.title}</h3>

                  <p className="text-sm text-gray-700 mb-3">{project.description}</p>

                  {/* PROGRESS STATUS */}
                  {isCompleted && (
                    <span className="text-green-600 block text-sm mb-3">
                      ✅ Completed
                    </span>
                  )}

                  {isInProgress && (
                    <div>
                      <div className="w-full bg-gray-300 h-2 rounded-full">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs mt-1 text-yellow-700">{progress}% Completed</p>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      navigate(`/internship-project/${project.id}/project-wizard`)
                    }
                    className="mt-4 w-full bg-[#2E2E91] text-white py-2 rounded-md"
                  >
                    {isInProgress ? "Continue Project" : "Start Project"}
                  </button>
                </div>
              );
            })}

          </div>
        </div>
      </div>

    </div>
  );
};

export default InterbshipPage;
