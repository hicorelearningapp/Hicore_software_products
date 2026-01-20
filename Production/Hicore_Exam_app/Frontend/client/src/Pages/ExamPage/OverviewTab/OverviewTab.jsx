// src/Components/ExamPage/OverviewTab/OverviewTab.jsx
import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useLocation } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_BASE || "/api").replace(/\/$/, "");
const IMAGE_BASE =
  (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_IMAGE_BASE ||
    ""
  ).replace(/\/$/, "") || "";

/** Helper: normalize input into a slug like "neet-ug" */
const toSlug = (str = "") =>
  String(str || "")
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035']/g, "") // strip fancy apostrophes
    .replace(/[^a-z0-9\s-]/g, "") // remove unsafe chars
    .replace(/\s+/g, "-") // spaces -> hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-|-$/g, ""); // trim

/** Resolve image path/url using API_BASE (same behavior as Examcard.resolveImageSrc). */
const absoluteFromBackend = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^\/\/[^/]/.test(trimmed)) {
    if (
      typeof window !== "undefined" &&
      window.location &&
      window.location.protocol
    ) {
      return window.location.protocol + trimmed;
    }
    return "https:" + trimmed;
  }
  const base = (API_BASE || "").replace(/\/$/, "");
  if (!base) {
    if (
      typeof window !== "undefined" &&
      window.location &&
      window.location.origin
    ) {
      if (trimmed.startsWith("/")) return window.location.origin + trimmed;
      return window.location.origin + "/" + trimmed.replace(/^\/+/, "");
    }
    return null;
  }
  if (trimmed.startsWith("/")) return base + trimmed;
  return base + "/" + trimmed.replace(/^\/+/, "");
};

/** Normalizes a search string to a canonical ?k=v&k2=v2 form using encodeURIComponent.
 *  This guarantees spaces are %20 (not '+') and each value is properly percent-encoded.
 */
const normalizeSearch = (search = "") => {
  // If already empty, return empty string
  if (!search) return "";

  // remove leading '?'
  const raw = search.startsWith("?") ? search.slice(1) : search;
  const p = new URLSearchParams(raw);

  // rebuild with encodeURIComponent (ensures %20, not +)
  const parts = [];
  for (const [k, v] of p.entries()) {
    // skip empty keys
    if (k == null || k === "") continue;
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v ?? "")}`);
  }
  return parts.length > 0 ? `?${parts.join("&")}` : "";
};

const OverviewTab = ({ examName }) => {
  const location = useLocation();
  const [overviewSections, setOverviewSections] = useState(null);
  const [syllabusData, setSyllabusData] = useState(null);
  const [icons, setIcons] = useState({
    checkIcon: null,
    syllabusIcon: null,
    subjectsIcon: null,
    durationIcon: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // If examName is a slug (e.g. "neet-ug") or a human string ("NEET UG"), build a slug
  const fetchExamSlug = toSlug(examName || "neet");

  // Determine if we're in "university overview" mode by checking query param
  const qs = new URLSearchParams(location.search || "");
  const queryUniversity = (qs.get("university") || "").trim();
  const isUniversityMode = Boolean(queryUniversity);

  // For UI text: choose a display name
  const displayExamName = isUniversityMode
    ? (queryUniversity || "").replace(/-/g, " ").toUpperCase()
    : String(examName || fetchExamSlug || "")
        .replace(/-/g, " ")
        .toUpperCase();

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchOverview = async () => {
      setLoading(true);
      setError(null);

      try {
        const base = API_BASE.replace(/\/$/, "");
        let url;

        if (isUniversityMode) {
          // Use normalized search so spaces are %20, not '+'
          const normalized = normalizeSearch(location.search || "");
          url = `${base}/university/overview${normalized}`;
        } else {
          // course roadmap
          url = `${base}/course/${encodeURIComponent(fetchExamSlug)}/roadmap`;
        }

        const res = await fetch(url, { signal });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(
            `Server returned ${res.status} ${res.statusText} ${
              txt ? "- " + txt : ""
            }`
          );
        }

        const json = await res.json();
        const payload = json && json.data ? json.data : json;

        if (!payload) throw new Error("No data returned from server.");

        const ov = Array.isArray(payload.overviewData)
          ? payload.overviewData
          : [];
        const syl = payload.syllabusData || null;

        const serverImages = Array.isArray(json.images)
          ? json.images
          : Array.isArray(payload.images)
          ? payload.images
          : null;

        const imgMap = {
          checkIcon: null,
          syllabusIcon: null,
          subjectsIcon: null,
          durationIcon: null,
        };

        if (serverImages) {
          serverImages.forEach((it) => {
            if (!it || !it.name || !it.url) return;
            const key = String(it.name).trim();
            if (
              [
                "checkIcon",
                "syllabusIcon",
                "subjectsIcon",
                "durationIcon",
              ].includes(key)
            ) {
              const abs = absoluteFromBackend(String(it.url).trim());
              imgMap[key] = abs || null;
            }
          });
        }

        // Backwards compatibility: read top-level fields if present
        ["checkIcon", "syllabusIcon", "subjectsIcon", "durationIcon"].forEach(
          (k) => {
            if (!imgMap[k] && payload[k]) {
              const candidate = absoluteFromBackend(String(payload[k]).trim());
              if (candidate) imgMap[k] = candidate;
            }
          }
        );

        if (mounted) {
          setIcons(imgMap);
          setOverviewSections(ov);
          setSyllabusData(syl);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("OverviewTab fetch error:", err);
          if (mounted) {
            setError(err.message || "Failed to fetch overview data");
            setOverviewSections(null);
            setSyllabusData(null);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOverview();

    return () => {
      mounted = false;
      controller.abort();
    };
    // re-run when slug or query string changes. location.search is included so university mode updates.
  }, [fetchExamSlug, location.search, isUniversityMode]);

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading overview data for {displayExamName}...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-10">
        Error loading overview: {error}
      </p>
    );
  }

  if (!overviewSections || overviewSections.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No overview data available for {displayExamName}.
      </p>
    );
  }

  const fixedIcons = [icons.subjectsIcon, icons.durationIcon];

  return (
    <div className="flex flex-col gap-10">
      {/* 🔹 Overview Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {overviewSections.map((section, index) => (
          <div
            key={section.id ?? index}
            className="border border-blue-300 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-6 mb-7">
              {fixedIcons[index % fixedIcons.length] ? (
                <img
                  src={fixedIcons[index % fixedIcons.length]}
                  alt={section.title}
                  className="w-20 h-20 object-contain"
                />
              ) : null}
              <h2 className="font-semibold text-lg text-[#1E40AF]">
                {section.title}
              </h2>
            </div>

            <ul className="space-y-6 text-md text-blue-900">
              {Array.isArray(section.items) &&
                section.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    {icons.checkIcon ? (
                      <img
                        src={icons.checkIcon}
                        alt="check"
                        className="w-6 h-6"
                      />
                    ) : null}
                    <span>
                      <span className="font-semibold text-blue-900">
                        {item.label}:
                      </span>{" "}
                      {item.text}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 🔹 Syllabus Section */}
      {syllabusData ? (
        <div className="border border-blue-300 min-h-screen rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            {icons.syllabusIcon ? (
              <img
                src={icons.syllabusIcon}
                alt="syllabus"
                className="w-20 h-20 object-contain"
              />
            ) : null}
            <h2 className="font-semibold text-lg text-[#1E40AF]">
              {syllabusData.title}
            </h2>
          </div>

          <div className="flex flex-col gap-20 m-14">
            {Array.isArray(syllabusData.subjects) &&
              syllabusData.subjects.map((subject) => (
                <div key={subject.id} className="space-y-6">
                  <h3 className="font-semibold text-blue-800 text-lg">
                    {subject.title}
                  </h3>

                  <div className="flex flex-col gap-6">
                    {Array.isArray(subject.classes) &&
                      subject.classes.map((cls, idx) => (
                        <details
                          key={idx}
                          className="group border border-blue-300 rounded-lg text-blue-800"
                        >
                          <summary className="flex justify-between items-center font-medium cursor-pointer px-4 py-5">
                            {cls.name}
                            <FiChevronDown className="text-blue-600 text-xl transition-transform duration-300 group-open:rotate-180" />
                          </summary>

                          <ul className="space-y-5 list-decimal list-inside text-[#1E40AF] border-t border-blue-300 px-6 py-4">
                            {Array.isArray(cls.chapters) &&
                              cls.chapters.map((chapter, cIdx) => (
                                <li key={cIdx}>{chapter}</li>
                              ))}
                          </ul>
                        </details>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">No syllabus available.</div>
      )}
    </div>
  );
};

export default OverviewTab;
