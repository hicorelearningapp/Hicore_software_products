import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/** small slug helper */
const toSlug = (str) =>
  String(str || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const Examcard = () => {
  const [activeTab, setActiveTab] = useState("");
  const [imageHeight, setImageHeight] = useState("auto");
  const [examData, setExamData] = useState({});
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const rightContentRef = useRef(null);
  const navigate = useNavigate();

  const resolveImageSrc = (imgPathOrUrl) => {
    if (!imgPathOrUrl) return "";

    if (/^https?:\/\//i.test(imgPathOrUrl)) return imgPathOrUrl;

    if (imgPathOrUrl.startsWith("/")) {
      return API_BASE.replace(/\/$/, "") + imgPathOrUrl;
    }

    return API_BASE.replace(/\/$/, "") + "/" + imgPathOrUrl.replace(/^\/+/, "");
  };

  // Match left image height with right content
  useEffect(() => {
    const updateHeight = () => {
      if (rightContentRef.current)
        setImageHeight(rightContentRef.current.offsetHeight + "px");
      else setImageHeight("auto");
    };

    updateHeight();
    let ro;

    if (typeof ResizeObserver !== "undefined" && rightContentRef.current) {
      ro = new ResizeObserver(updateHeight);
      ro.observe(rightContentRef.current);
    } else {
      window.addEventListener("resize", updateHeight);
    }

    return () => {
      if (ro && rightContentRef.current) {
        ro.unobserve(rightContentRef.current);
      } else {
        window.removeEventListener("resize", updateHeight);
      }
    };
  }, [activeTab, examData]);

  // Fetch final /homepage endpoint
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const base = API_BASE.replace(/\/$/, "");
        const url = base + "/homepage"; // ✅ UPDATED ENDPOINT

        console.log("Examcard fetching:", url);

        const res = await fetch(url, { signal });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(
            `Server returned ${res.status} ${res.statusText} - ${txt}`
          );
        }

        const json = await res.json();

        if (!json || typeof json !== "object") {
          throw new Error("Invalid JSON format from backend");
        }

        // Now using your new perfect shape
        const resolvedData = json.data || {};
        const resolvedTabs = Array.isArray(json.tabs) ? json.tabs : [];

        setExamData(resolvedData);

        const mappedTabs = resolvedTabs.map((t) => ({
          id: t.id,
          label: t.label,
          image: resolveImageSrc(t.image || ""),
        }));

        setTabs(mappedTabs);

        // Set default activeTab
        if (!activeTab && mappedTabs.length > 0) {
          setActiveTab(mappedTabs[0].id);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Examcard error:", err);
          setError(err.message || "Failed to fetch exam data");
          setExamData({});
          setTabs([]);
          setActiveTab("");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
    // eslint-disable-next-line
  }, []);

  // Select correct tab data
  const activeTabData =
    examData?.[activeTab] && Array.isArray(examData[activeTab].categories)
      ? examData[activeTab]
      : { categories: [] };

  const activeImage = tabs.find((t) => t.id === activeTab)?.image || "";

  /**
   * When user clicks an exam pill:
   * - prefer a sensible slug:
   *   1) if exam.id exists and looks like a slug, use it
   *   2) else create slug from exam.label
   *
   * This ensures we navigate to /course/{slug} and your CourseDetail (ExamDetail)
   * will fetch /api/course/{slug} (e.g. /api/course/neet)
   */
  const handleExamClick = (examIdOrLabel) => {
    if (!examIdOrLabel) return;

    // if examIdOrLabel already looks slug-like (alphanumeric + dashes), use it,
    // otherwise fallback to slugifying the label
    const candidate = String(examIdOrLabel || "");
    const maybeSlug = toSlug(candidate);
    const slug = maybeSlug || toSlug(candidate);

    if (!slug) return;

    navigate(`/course/${encodeURIComponent(slug)}`);
  };

  return (
    <div className="w-full h-fit pr-[100px] pl-[100px] pb-16">
      <div className="pt-16 pr-1 pb-1 pl-1 rounded-[36px] bg-[#2758B3]">
        {/* Header */}
        <div className="w-full h-fit bg-[#2758B3] rounded-t-[36px]">
          <h2 className="text-white text-[20px] font-semibold flex gap-6 mb-16">
            <div
              id="exams"
              className="relative flex items-center ml-8 w-[300px]"
            >
              <div className="w-3 h-3 rounded-full bg-white shadow-md z-10"></div>
              <div className="flex-1 h-[3px] bg-white shadow-md"></div>
              <div className="border-t-[8px] border-b-[10px] border-l-[8px] border-t-transparent border-b-transparent border-l-white"></div>
            </div>
            Exams You Can Prepare For
          </h2>
        </div>

        {/* Tabs */}
        <div className="w-full h-[70px] flex mt-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full py-6 text-[16px] rounded-tl-[36px] rounded-tr-[36px] ${
                activeTab === tab.id
                  ? "bg-white text-[#2758B3]"
                  : "bg-transparent text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="w-full h-full flex bg-white rounded-b-[36px] p-[36px] gap-[36px]">
          {/* Left Image */}
          <div className="w-[420px]" style={{ height: imageHeight }}>
            {activeImage ? (
              <img
                src={activeImage}
                alt="tab"
                className="w-full h-full rounded-[12px] object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#F3F6FB] rounded-[12px] flex items-center justify-center text-sm text-gray-500">
                No image
              </div>
            )}
          </div>

          {/* Right Content */}
          <div ref={rightContentRef} className="space-y-10">
            {loading && (
              <div className="text-sm text-gray-500">Loading exams...</div>
            )}
            {error && (
              <div className="text-sm text-red-500">Error: {error}</div>
            )}

            {activeTabData.categories.map((category, i) => (
              <div key={i}>
                <h3 className="text-[#2758B3] text-[16px] font-semibold mb-3">
                  {category.name}
                </h3>

                <div className="flex flex-wrap gap-3">
                  {category.exams &&
                    category.exams.map((exam, idx) => {
                      const label = exam.label;
                      // IMPORTANT: exam.id should ideally be a slug (e.g. "neet").
                      // If not provided, we'll fallback to slugifying the label.
                      const rawId = exam.id || exam.label || label;
                      const idSlug = toSlug(rawId);

                      return (
                        <span
                          key={idx}
                          onClick={() => handleExamClick(idSlug)}
                          className="px-4 py-2 bg-[#E6EEFF] rounded-full text-[14px] text-[#2758B3] cursor-pointer hover:bg-[#B0CBFE]"
                        >
                          {label}
                        </span>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Examcard;
