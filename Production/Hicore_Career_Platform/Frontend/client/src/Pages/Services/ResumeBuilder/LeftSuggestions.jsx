import React, { useEffect, useState, useRef } from "react";
import suggestionsData from "../../../../data/suggestionsData";
import smartIcon from "../../../assets/smart-icon.png";
import closeicon from "../../../assets/close.png";

const BACKEND_URL = import.meta.env.VITE_API_BASE || "/api"; // use this

const LeftSuggestions = ({
  collapsed,
  onToggle,
  section = "Summary",
  currentContent = "",
  onApplySuggestion,
}) => {
  const [appliedSections, setAppliedSections] = useState({});
  const [backendAfter, setBackendAfter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const mountedRef = useRef(true);
  const justAppliedRef = useRef(false); // <-- new: track when we just applied a suggestion

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (abortRef.current) {
        try {
          abortRef.current.abort();
        } catch (e) {
          /* ignore */
        }
      }
    };
  }, []);

  // Normalize section names
  const normalizedSection =
    section?.toLowerCase().startsWith("experience") ||
    section?.toLowerCase() === "newexperience"
      ? "experience"
      : section?.toLowerCase();

  const sectionSuggestion = suggestionsData.find(
    (s) => s.section.toLowerCase() === normalizedSection
  );

  // helper to check applied state (compare against local after or backendAfter)
  const isAlreadyApplied = () => {
    const curr = (currentContent ?? "").trim();
    if (!curr) return false;
    if (sectionSuggestion?.after && curr === sectionSuggestion.after.trim())
      return true;
    if (backendAfter && curr === backendAfter.trim()) return true;
    return false;
  };

  useEffect(() => {
    // sync applied state whenever inputs change
    setAppliedSections((prev) => ({
      ...prev,
      [section]: isAlreadyApplied(),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, currentContent, backendAfter, sectionSuggestion?.after]);

  // CLEAR previous backend suggestion/error when section or content changes,
  // BUT DO NOT auto-fetch. Special-case: if we just applied a suggestion,
  // skip clearing once so the applied text remains visible.
  useEffect(() => {
    if (justAppliedRef.current) {
      // skip clearing once after apply so the "After" box continues to show the applied text
      justAppliedRef.current = false;
      return;
    }

    setBackendAfter(null);
    setError(null);
    setLoading(false);
    // abort any inflight fetch when user changes section/content
    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch (e) {
        /* ignore */
      }
      abortRef.current = null;
    }
  }, [normalizedSection, currentContent]);

  const normalizeBackendResponse = (data) => {
    if (!data) return null;
    if (typeof data.after === "string" && data.after.trim())
      return data.after.trim();
    if (typeof data.suggestion === "string" && data.suggestion.trim())
      return data.suggestion.trim();
    if (Array.isArray(data.suggestions) && data.suggestions.length > 0)
      return data.suggestions.join("\n\n");
    if (data.data && typeof data.data.after === "string")
      return data.data.after.trim();
    if (typeof data === "string" && data.trim()) return data.trim();
    // fallback: first string-valued property
    const firstString =
      Object.values(data).find((v) => typeof v === "string") ?? null;
    return firstString ? firstString.trim() : null;
  };

  const fetchSuggestion = async (signal) => {
    // attempt backend fetch
    const endpoint = `${BACKEND_URL.replace(/\/$/, "")}/ai/suggest`;
    const payload = {
      section: normalizedSection,
      original: currentContent ?? "",
      content: currentContent ?? "",
    };

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(
        `Server returned ${resp.status}${text ? `: ${text}` : ""}`
      );
    }

    const data = await resp.json().catch(() => null);
    return normalizeBackendResponse(data);
  };

  // Called only when user clicks "Get Suggestion"
  const handleGetSuggestion = async () => {
    setError(null);
    setLoading(true);
    setBackendAfter(null);

    // abort previous
    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch (e) {
        /* ignore */
      }
    }
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const afterText = await fetchSuggestion(controller.signal);
      if (!afterText)
        throw new Error(
          "Invalid response from backend. Expected a suggestion string."
        );
      if (!mountedRef.current) return;
      setBackendAfter(afterText);
      setError(null);
    } catch (err) {
      if (err.name === "AbortError") {
        // ignore aborts
        console.warn("Suggestion fetch aborted");
      } else {
        console.error("Suggestion fetch error:", err);
        if (mountedRef.current)
          setError(err.message || "Failed to fetch suggestion");
      }
    } finally {
      if (mountedRef.current) setLoading(false);
      abortRef.current = null;
    }
  };

  const handleApply = () => {
    const contentToApply = backendAfter ?? sectionSuggestion?.after;
    if (!contentToApply) return;

    // keep applied content visible after parent updates currentContent:
    justAppliedRef.current = true;
    setBackendAfter(contentToApply);

    onApplySuggestion(section, contentToApply);
    setAppliedSections((prev) => ({ ...prev, [section]: true }));
  };

  const applied = appliedSections[section];

  return (
    <div
      className={`bg-white rounded-xl shadow border border-gray-300 h-full transition-all duration-300 ${
        collapsed ? "w-[70px]" : "w-[330px]"
      }`}
    >
      {/* Header */}
      <div
        className="p-3 flex items-center gap-2 cursor-pointer"
        onClick={onToggle}
        title="Toggle Suggestions"
      >
        <img src={smartIcon} alt="Smart Icon" className="w-[48px] h-[48px]" />
        {!collapsed && (
          <span className="text-[20px] font-semibold text-[#343079]">
            AI Suggestions
          </span>
        )}
      </div>

      {/* Suggestion Card */}
      {!collapsed && (
        <div className="m-3 px-2 pb-4">
          <div className="rounded-xl border bg-[#FBFBFB] border-[#83828F] shadow-sm px-4 py-4">
            {/* Section Title */}
            <h2 className="text-[16px] font-bold text-[#343079] ml-2 mb-4 flex items-center justify-between">
              <span>
                • &nbsp;
                {sectionSuggestion?.section === "Experience"
                  ? section.replaceAll("-", " ")
                  : sectionSuggestion?.section ?? section}
              </span>
              <img
                src={closeicon}
                alt="close"
                onClick={onToggle}
                className="w-[24px] h-[24px] cursor-pointer"
              />
            </h2>

            {/* Title */}
            {sectionSuggestion?.title && (
              <p className="text-[18px] font-medium text-[#343079] leading-snug">
                {sectionSuggestion.title}
              </p>
            )}

            {/* Description */}
            {sectionSuggestion?.description && (
              <p className="text-[14px] font-medium text-[#83828F] mt-3">
                {sectionSuggestion.description}
              </p>
            )}

            {/* Before */}
            <div className="mt-4">
              <div className="bg-[#FFFAEF] text-[#FF0000] text-[16px] border border-[#FF0000] rounded-md px-3 py-5 break-words whitespace-pre-line">
                <strong className="text-[#FF0000] text-[18px] font-medium">
                  Before:
                </strong>
                <br />
                {currentContent?.trim()
                  ? currentContent
                  : "No content added yet."}
              </div>
            </div>

            {/* After */}
            <div className="mt-4">
              <div className="bg-[#E8FFDD] text-[#1CD51C] text-[16px] border border-[#1CD51C] rounded-md px-3 py-5 min-h-[56px] break-words whitespace-pre-line">
                <strong className="text-[#1CD51C] text-[18px] font-medium">
                  After:
                </strong>
                <br />
                {/* Show applied badge if suggestion has been applied for this section */}
                {applied && (
                  <div className="inline-block mb-2 px-2 py-1 rounded text-sm font-medium bg-[#E6F9EA] text-[#1CD51C] border border-[#C0F0CC]">
                    Suggestion applied
                  </div>
                )}

                {loading && <em>Generating suggestion...</em>}
                {error && <span className="text-red-600">{error}</span>}

                {/* If there's backendAfter, show it. Otherwise show the first-time message */}
                {!loading && !error && backendAfter && (
                  <div>{backendAfter}</div>
                )}

                {!loading && !error && !backendAfter && (
                  <span className="text-gray-500">
                    No suggestion generated yet.
                  </span>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4">
              {!backendAfter && !loading && (
                <button
                  onClick={handleGetSuggestion}
                  className="w-full rounded-md py-3 font-medium text-[16px] bg-[#2D9CDB] text-white hover:opacity-90 transition"
                >
                  Get Suggestion
                </button>
              )}

              {loading && (
                <button
                  disabled
                  className="w-full rounded-md py-3 font-medium text-[16px] bg-gray-300 text-white cursor-not-allowed"
                >
                  Fetching...
                </button>
              )}

              {backendAfter && (
                <button
                  onClick={handleApply}
                  disabled={applied}
                  className={`w-full mt-2 rounded-md py-3 font-medium text-[16px] transition ${
                    applied
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-[#2D2C8D] text-white border border-[#403B93] hover:bg-[#27245B]"
                  }`}
                >
                  {applied ? "Suggestion Applied " : "Apply Suggestion"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSuggestions;
