// src/Components/ExamPage/ExamDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_BASE || "/api").replace(/\/$/, "");

/** Make absolute URLs for images returned by backend */
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
  const base = API_BASE.replace(/\/$/, "");
  if (!base) return null;
  if (trimmed.startsWith("/")) return base + trimmed;
  return base + "/" + trimmed.replace(/^\/+/, "");
};

/** Helper: always use encodeURIComponent (produces %20 for spaces) */
const enc = (v) => encodeURIComponent(String(v ?? ""));

/** Component */
const ExamDetail = () => {
  // route params
  const {
    examName: examNameParam,
    branch: routeBranch,
    subject: routeSubject,
  } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [imagesMap, setImagesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolveImage = (keyOrUrl) => {
    if (!keyOrUrl) return null;
    if (typeof keyOrUrl === "string" && imagesMap[keyOrUrl]) {
      return absoluteFromBackend(String(imagesMap[keyOrUrl]));
    }
    if (typeof keyOrUrl === "string" && /^https?:\/\//i.test(keyOrUrl))
      return keyOrUrl;
    if (
      typeof keyOrUrl === "string" &&
      (keyOrUrl.startsWith("/") || keyOrUrl.includes("/"))
    )
      return absoluteFromBackend(String(keyOrUrl));
    return null;
  };

  const resolveFeatureIcon = (icon) => {
    if (!icon) return null;
    if (imagesMap && imagesMap[icon])
      return absoluteFromBackend(String(imagesMap[icon]));
    if (/^https?:\/\//i.test(icon)) return icon;
    if (icon.startsWith("/") || icon.includes("/"))
      return absoluteFromBackend(icon);
    return null;
  };

  useEffect(() => {
    // if no course provided, error out early
    if (!examNameParam) {
      setError("No course specified");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchExam() {
      setLoading(true);
      setError(null);

      try {
        const base = API_BASE.replace(/\/$/, "");
        let url;

        // original /course/... route using route param examNameParam and optional routeBranch/routeSubject
        const examRoutePart = encodeURIComponent(examNameParam);
        if (routeBranch && routeSubject) {
          url = `${base}/course/${examRoutePart}/${encodeURIComponent(
            routeBranch
          )}/${encodeURIComponent(routeSubject)}`;
        } else if (routeBranch) {
          url = `${base}/course/${examRoutePart}/${encodeURIComponent(
            routeBranch
          )}`;
        } else {
          url = `${base}/course/${examRoutePart}`;
        }

        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(
            `Server returned ${res.status} ${res.statusText} ${
              txt ? "- " + txt : ""
            }`
          );
        }

        const json = await res.json();
        const resolved = json && json.data ? json.data : json;

        if (!resolved || typeof resolved !== "object") {
          throw new Error("Unexpected response shape from server");
        }

        const imgMap = {};
        const srcImages = Array.isArray(json?.images)
          ? json.images
          : Array.isArray(resolved?.images)
          ? resolved.images
          : [];

        srcImages.forEach((img) => {
          if (img && img.name && img.url) {
            imgMap[String(img.name).trim()] = String(img.url).trim();
          }
        });

        setImagesMap(imgMap);
        setData(resolved);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("ExamDetail fetch failed:", err);
          setError(err.message || "Failed to fetch course data from server");
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchExam();
    return () => controller.abort();
    // include query/search so effect re-runs when user arrives with query params
  }, [examNameParam, routeBranch, routeSubject]);

  const displayExamName = (
    examNameParam ||
    (data && (data.examName || data.title)) ||
    ""
  ).toUpperCase();

  const quickIntro =
    data && typeof data.quickIntro === "string"
      ? data.quickIntro
      : data && data.quickIntro && data.quickIntro.description
      ? data.quickIntro.description
      : "";

  const infoBox = (data && data.infoBox) || {};
  const features = Array.isArray(data?.examFeatures) ? data.examFeatures : [];
  const featuresSection = data?.featuresSection || {};
  const bottomBanner = data?.bottomBanner || {};
  const overviewData = Array.isArray(data?.overviewData)
    ? data.overviewData
    : [];
  const syllabusData = data?.syllabusData || null;

  const defaultClass =
    syllabusData &&
    Array.isArray(syllabusData.subjects) &&
    syllabusData.subjects.length > 0 &&
    Array.isArray(syllabusData.subjects[0].classes) &&
    syllabusData.subjects[0].classes.length > 0
      ? syllabusData.subjects[0].classes[0].name
      : null;

  const rawCta =
    (data && data.cta && data.cta.primary) ||
    `Let’s Crack ${displayExamName} Together`;

  const ctaDerivedFirstWord = String(rawCta || "")
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035']/g, "'")
    .replace(/^\s*let['’]s crack\s*/i, "")
    .replace(/^\s*let's crack\s*/i, "")
    .replace(/^\s*let\s+us\s+crack\s*/i, "")
    .replace(/\s+together\s*$/i, "")
    .trim()
    .split(/\s+/)[0]
    .toLowerCase();

  const buildCoursePathFromDisplay = () =>
    String(displayExamName).toLowerCase().replace(/\s+/g, "-");

  // route to course roadmap
  const goToRoadmapWithTab = (tab, className, subjectName) => {
    // tab/className semantics preserved for course roadmap
    const t = typeof tab === "string" ? tab : String(tab || "");

    // original course roadmap flow
    const courseParams = [];
    if (t) courseParams.push(`tab=${enc(t)}`);
    if (className) courseParams.push(`class=${enc(className)}`);

    const subjectFinalCourse =
      (typeof subjectName === "string" && subjectName.trim()) ||
      ctaDerivedFirstWord ||
      "";
    if (subjectFinalCourse)
      courseParams.push(`subject=${enc(subjectFinalCourse)}`);

    const cleanRoute = buildCoursePathFromDisplay();
    navigate(`/course/${cleanRoute}/roadmap?${courseParams.join("&")}`);
  };

  return (
    <div>
      <div className=" bg-[linear-gradient(440deg,_#FFFFFF_1.59%,_#EDF2FF_32.48%,_#FFFFFF_59.6%,_#EDF2FF_98.13%)] w-full min-h-screen p-[60px] gap-[64px]">
        <div className="w-full mx-auto flex flex-col items-center">
          <h1 className="text-center text-[24px] font-semibold text-[#2758B3] mb-4">
            {data?.heading || `${displayExamName} `}
          </h1>

          <p className="text-center font-regular text-[18px] text-[#2758B3] mb-12">
            {data?.subHeading || `${displayExamName}`}
          </p>

          <div className="flex flex-col gap-9 p-9 rounded-lg border border-[#E6EEFF] opacity-100 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-white w-full max-w-7xl">
            <div className="flex flex-col gap-9 p-9 rounded-lg border border-[#E6EEFF] opacity-100 bg-white w-full">
              <div className="md:flex md:gap-8">
                <div className="md:w-1/2 mb-8 md:mb-0 flex flex-col gap-4 opacity-100">
                  <h2 className="text-[#2758B3] font-bold text-[18px] mb-4">
                    Quick Introduction
                  </h2>
                  <p className="text-[#2758B3] text-[14px] leading-[40px]">
                    {loading && (
                      <span className="text-gray-500">
                        Loading course details...
                      </span>
                    )}
                    {!loading && error && (
                      <span className="text-red-500">{error}</span>
                    )}
                    {!loading && !error && (
                      <span
                        dangerouslySetInnerHTML={{
                          __html:
                            quickIntro || "<i>No quick intro provided.</i>",
                        }}
                      />
                    )}
                  </p>
                </div>

                <div className="md:w-1/2 grid grid-cols-2 gap-[36px]">
                  <InfoBox
                    title="Subjects"
                    value={infoBox.subjects}
                    iconKey="subjectsIcon"
                    resolveImage={resolveImage}
                  />
                  <InfoBox
                    title="Duration"
                    value={infoBox.duration}
                    iconKey="durationIcon"
                    resolveImage={resolveImage}
                  />
                  <InfoBox
                    title="Target"
                    value={infoBox.target}
                    iconKey="targetIcon"
                    resolveImage={resolveImage}
                  />
                  <InfoBox
                    title="Questions"
                    value={infoBox.questions}
                    iconKey="questionsIcon"
                    resolveImage={resolveImage}
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <button
                onClick={() => goToRoadmapWithTab("Overview", defaultClass)}
                className="px-8 py-4 text-[20px] bg-[#2758B3] text-white font-semibold rounded-full shadow-lg hover:bg-[#08265F] cursor-pointer transition flex items-center gap-[8px]"
                disabled={loading}
              >
                <span>
                  {data?.cta?.primary ||
                    `Let’s Crack ${displayExamName} Together`}
                </span>
                {resolveImage("handIcon") ? (
                  <img
                    src={resolveImage("handIcon")}
                    alt="hand"
                    className="w-[24px] h-[24px] object-contain"
                  />
                ) : null}
              </button>
            </div>
          </div>

          {!loading &&
            Array.isArray(overviewData) &&
            overviewData.length > 0 && (
              <div className="w-full max-w-5xl mt-8">
                <h3 className="text-[#2758B3] text-[20px] font-semibold mb-4">
                  Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {overviewData.map((block) => (
                    <div
                      key={block.id}
                      className="bg-white border rounded-lg p-6 shadow-sm"
                    >
                      <h4 className="text-[#2758B3] font-semibold mb-3">
                        {block.title}
                      </h4>
                      <ul className="space-y-2">
                        {Array.isArray(block.items) &&
                          block.items.map((it, i) => (
                            <li key={i} className="text-[#2758B3]">
                              <strong className="font-semibold">
                                {it.label}:
                              </strong>{" "}
                              {it.text}
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {!loading && syllabusData && (
            <div className="w-full max-w-5xl mt-8">
              <h3 className="text-[#2758B3] text-[20px] font-semibold mb-4">
                {syllabusData.title || "Syllabus Overview"}
              </h3>
              {Array.isArray(syllabusData.subjects) &&
                syllabusData.subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="mb-6 bg-white border rounded-lg p-6 shadow-sm"
                  >
                    <h4
                      className="text-[#2758B3] text-[18px] font-semibold mb-3 cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        goToRoadmapWithTab(
                          "Overview",
                          defaultClass,
                          subject.title
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          goToRoadmapWithTab(
                            "Overview",
                            defaultClass,
                            subject.title
                          );
                      }}
                    >
                      {subject.title}
                    </h4>

                    {Array.isArray(subject.classes) &&
                      subject.classes.map((cls, ci) => (
                        <div key={ci} className="mb-3">
                          <div className="text-[#2758B3] font-semibold">
                            {cls.name}
                          </div>
                          <ul className="list-disc list-inside mt-2 text-[#2758B3]">
                            {Array.isArray(cls.chapters) &&
                              cls.chapters.map((chap, cidx) => (
                                <li key={cidx} className="text-[#2758B3]">
                                  {chap}
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white pt-[100px] pb-[100px] pr-[64px] pl-[64px] gap-[64px]">
        <div className="w-full text-center pr-[36px] pl-[36px] justify-center">
          <h3 className="text-[24px] font-semibold text-[#2758B3] mb-4">
            {featuresSection.title}
          </h3>
          <p className="text-[#2758B3] font-regular text-[18px] leading-7">
            {featuresSection.subtitle}
          </p>
        </div>

        <div className="bg-white p-[36px] gap-[64px]">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-[64px] justify-center">
            {features.map((feature) => {
              const ribbonUrl = resolveImage("ribbonimg");
              const featIcon = resolveFeatureIcon(feature.icon);
              return (
                <div
                  key={feature.id}
                  className="relative bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col items-start"
                >
                  <div className="absolute -top-0 right-6">
                    <div className="w-[90px] h-[96px] relative flex items-center justify-center">
                      {ribbonUrl ? (
                        <img
                          src={ribbonUrl}
                          alt="ribbon"
                          className="w-[90px] h-[96px] object-contain"
                        />
                      ) : null}
                      <span className="absolute text-[#2758B3] font-semibold text-[14px]">
                        {feature.ribbon}
                      </span>
                    </div>
                  </div>

                  {featIcon ? (
                    <img
                      src={featIcon}
                      alt={feature.title}
                      className="w-[64px] h-[64px] mb-4"
                    />
                  ) : null}

                  <h4 className="text-[16px] mt-20 font-semibold text-[#2758B3] mb-6">
                    {feature.title}
                  </h4>

                  <p className="text-[#2758B3] text-[16px]  leading-[30px] mb-6">
                    <strong className="font-regular text-[16px] ">
                      Benefit:{" "}
                    </strong>
                    {feature.benefit}
                  </p>

                  <p className="text-[#2758B3] text-[16px] leading-[30px]  mb-6">
                    <strong className="font-regular text-[16px]">
                      Why it helps:{" "}
                    </strong>
                    {feature.why}
                  </p>

                  <button
                    onClick={() => goToRoadmapWithTab("Overview", defaultClass)}
                    className="mt-auto w-full px-6 py-3 bg-[#2758B3] text-white rounded-full font-semibold hover:bg-[#08265F] cursor-pointer transition flex items-center justify-center gap-2"
                  >
                    <span>{feature.buttonText}</span>
                    {resolveImage("doublearrow") ? (
                      <img
                        src={resolveImage("doublearrow")}
                        alt="arrow"
                        className="w-[24px] h-[24px]"
                      />
                    ) : null}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-13">
        <div
          className="max-w-7xl h-120 mx-auto relative rounded-lg"
          style={{
            backgroundImage: `url(${resolveImage("bannerImg") || ""})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
          }}
        >
          <div className="absolute inset-0 rounded-xl" />
          <div className="relative flex items-center justify-end md:mr-30 h-full">
            <div className="p-10 max-w-lg text-center">
              <h2 className="text-[28px] font-semibold text-black mb-4">
                {bottomBanner.title}
              </h2>
              <p className="text-[18px] font-regular leading-8 mb-6">
                {bottomBanner.subtitle}
              </p>
              <button
                onClick={() => goToRoadmapWithTab("Overview", defaultClass)}
                className="flex items-center justify-center mx-auto gap-[8px] px-7 py-3 bg-[#2758B3] text-white font-semibold text-[20px] rounded-full shadow-lg hover:bg-[#08265F] cursor-pointer text-center transition"
              >
                <span>{bottomBanner.buttonText}</span>
                {resolveImage("handIcon") ? (
                  <img
                    src={resolveImage("handIcon")}
                    alt="hand"
                    className="w-[24px] h-[24px] items-center"
                  />
                ) : null}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ title, value, iconKey, resolveImage }) => {
  const iconUrl = resolveImage(iconKey);
  return (
    <div
      className="flex flex-col items-center gap-2 rounded-lg p-4 text-center"
      style={{
        backgroundColor:
          title === "Subjects" ? "rgba(51,204,51,0.05)" : undefined,
      }}
    >
      {iconUrl ? (
        <img
          src={iconUrl}
          alt={title}
          className="w-[40px] h-[40px] object-contain"
        />
      ) : null}
      <p className="text-[#2758B3] mt-2 font-medium text-[14px]">{title}</p>
      <p className="text-[#2758B3] mt-1 font-semibold text-[14px]">
        {value || "—"}
      </p>
    </div>
  );
};

export default ExamDetail;
