// Coursetabs.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bannerImg from "../assets/Course/bg-image.jpg";
import courseIcon from "../assets/Course/inner-image.png";
import closeIcon from "../assets/close.png";
import routes from "../Routes/routesConfig";
import OrderSummaryModal from "../Pages/OrderSummaryModal";

/* -------------------- Small UI helpers -------------------- */

const InstructorCard = ({ data, onClick }) => {
  const { name = "Instructor", title = "", profileImage = "" } = data || {};
  const initials =
    name
      ?.split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("") || "IN";
  return (
    <button
      onClick={onClick}
      className="group w-full text-left border border-[#C0BFD5] rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all bg-white"
    >
      <div className="flex items-center gap-3">
        {profileImage ? (
          <img
            src={profileImage}
            alt={name}
            className="w-12 h-12 rounded-full object-cover border border-[#343079]/30"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#EBEAF2] text-[#343079] font-semibold flex items-center justify-center">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-[15px] font-semibold text-[#343079] truncate">
            {name}
          </div>
          {title && (
            <div className="text-[12px] text-[#62616B] leading-tight line-clamp-2">
              {title}
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

const InstructorFullView = ({ instructor }) => {
  if (!instructor) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="pb-6 border-b border-[#E7E7EF]">
        <h3 className="text-[24px] font-semibold text-[#343079]">
          Meet Your Mentor
        </h3>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start py-6">
        {instructor.profileImage ? (
          <img
            src={instructor.profileImage}
            alt={instructor.name}
            className="w-36 h-36 rounded-full object-cover border-2 border-[#343079]"
          />
        ) : (
          <div className="w-36 h-36 rounded-full border-2 border-[#343079] bg-[#EBEAF2] flex items-center justify-center text-[#343079] font-semibold text-3xl">
            {instructor.name?.charAt(0) || "I"}
          </div>
        )}

        <div className="flex-1">
          <h4 className="text-[20px] font-semibold text-[#343079]">
            {instructor.name}
          </h4>
          {(instructor.title || instructor.experience) && (
            <p className="text-[#62616B] text-[15px] font-medium">
              {instructor.title}
              {instructor.experience ? ` • ${instructor.experience}` : ""}
            </p>
          )}

          {instructor.summary && (
            <p className="text-[#4B4A55] text-[15px] mt-3 leading-[26px] whitespace-pre-line">
              {instructor.summary}
            </p>
          )}
        </div>
      </div>

      {Array.isArray(instructor.education) &&
        instructor.education.length > 0 && (
          <div className="mb-6">
            <h5 className="text-[18px] font-semibold text-[#343079] mb-2">
              Education
            </h5>
            <ul className="list-disc list-inside text-[#4B4A55] text-[15px] leading-[26px]">
              {instructor.education.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

      {Array.isArray(instructor.expertise) &&
        instructor.expertise.length > 0 && (
          <div className="mb-6">
            <h5 className="text-[18px] font-semibold text-[#343079] mb-2">
              Expertise
            </h5>
            <div className="flex flex-wrap gap-2">
              {instructor.expertise.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#EBEAF8] text-[#343079] text-[14px] rounded-md"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

      {Array.isArray(instructor.highlights) &&
        instructor.highlights.length > 0 && (
          <div className="mb-6">
            <h5 className="text-[18px] font-semibold text-[#343079] mb-2">
              Highlights
            </h5>
            <ul className="list-disc list-inside text-[#4B4A55] text-[15px] leading-[26px]">
              {instructor.highlights.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

      {Array.isArray(instructor.keyStrengths) &&
        instructor.keyStrengths.length > 0 && (
          <div className="mb-6">
            <h5 className="text-[18px] font-semibold text-[#343079] mb-2">
              Key Strengths
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {instructor.keyStrengths.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-[#C0BFD5] rounded-md p-3 text-[#4B4A55] text-[15px]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

      {Array.isArray(instructor.certifications) &&
        instructor.certifications.length > 0 && (
          <div className="mb-6">
            <h5 className="text-[18px] font-semibold text-[#343079] mb-2">
              Certifications
            </h5>
            <div className="flex flex-wrap gap-2">
              {instructor.certifications.map((cert, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#E8F6FF] text-[#005A8D] border border-[#A8D9FF] text-[14px] rounded-md"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}

      {instructor.overall && (
        <p className="text-[#343079] font-medium text-[15px] border-t pt-4 mt-4 leading-[24px]">
          {instructor.overall}
        </p>
      )}
    </div>
  );
};

/* ==================== MAIN: Coursetabs ==================== */

const Coursetabs = () => {
  const navigate = useNavigate();

  const coursesRoute = routes.find((r) => r.label === "Courses");
  const tabs = coursesRoute?.tabs || [];

  const getFirstTab = () => tabs?.[0]?.name || "";
  const getFirstSubTab = (tabName) => {
    const subTabs = coursesRoute?.items?.[tabName]?.subTabs || [];
    return subTabs?.[0] || "";
  };

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeCourseTab") || getFirstTab()
  );
  const [activeSubTab, setActiveSubTab] = useState(
    localStorage.getItem("activeCourseSubTab") || getFirstSubTab(getFirstTab())
  );

  const [showChooseLevel, setShowChooseLevel] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("");

  const [bannerTitle, setBannerTitle] = useState("Explore Our Courses");

  const [relatedItems, setRelatedItems] = useState([]);
  const [showRelated, setShowRelated] = useState(false);

  const [instructors, setInstructors] = useState([]);
  const [currentInstructor, setCurrentInstructor] = useState(null);

  const relatedSectionRef = useRef(null);
  const profileRef = useRef(null);

  // NEW: suppression flag to avoid auto-scrolling when the instructor is set
  // due to a tab/subtab change. Set this to true before changing tabs/subtabs.
  const suppressScrollRef = useRef(false);

  // NEW: track the very first load/mount so we don't auto-scroll when the user
  // returns to this page (we still show the instructor block but keep viewport at top).
  const firstLoadRef = useRef(true);

  const normalizeInstructors = (maybe) =>
    !maybe ? [] : Array.isArray(maybe) ? maybe : [maybe];

  useEffect(() => {
    const savedTab = localStorage.getItem("activeCourseTab");
    const savedSubTab = localStorage.getItem("activeCourseSubTab");

    const validTab = tabs.find((t) => t.name === savedTab)
      ? savedTab
      : getFirstTab();

    setActiveTab(validTab);

    const validSubTab = coursesRoute?.items?.[validTab]?.subTabs?.includes(
      savedSubTab
    )
      ? savedSubTab
      : getFirstSubTab(validTab);

    setActiveSubTab(validSubTab);
  }, []);

  useEffect(() => {
    setBannerTitle(activeTab ? `Explore ${activeTab}` : "Explore Our Courses");
  }, [activeTab]);

  const tabData = coursesRoute?.items?.[activeTab]?.data?.[activeSubTab];

  useEffect(() => {
    if (activeTab === "Domain Based Courses") {
      const domainInstructors = normalizeInstructors(
        selectedItem?.instructor || selectedItem?.instructors
      );
      setInstructors(domainInstructors);

      if (domainInstructors.length === 1)
        setCurrentInstructor(domainInstructors[0]);
      else setCurrentInstructor(null);

      return;
    }

    setShowRelated(false);
    setRelatedItems([]);

    const arr = normalizeInstructors(
      tabData?.instructor || tabData?.instructors
    );
    setInstructors(arr);

    if (arr.length === 1) setCurrentInstructor(arr[0]);
    else setCurrentInstructor(null);
  }, [activeTab, activeSubTab, selectedItem]);

  // SCROLL effect: will scroll only when not suppressed and not the first mount
  useEffect(() => {
    if (!currentInstructor || !profileRef.current) return;

    // If this is the very first time the component loaded (mount or when user
    // navigates back), skip auto-scroll — we want the page to stay at the top.
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return;
    }

    if (suppressScrollRef.current) {
      // skip this scroll once and reset flag
      suppressScrollRef.current = false;
      return;
    }

    profileRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentInstructor]);

  const handleTabChange = (tab) => {
    // suppress auto scroll caused by downstream instructor update
    suppressScrollRef.current = true;

    setActiveTab(tab);
    const newSub = getFirstSubTab(tab);
    setActiveSubTab(newSub);

    localStorage.setItem("activeCourseTab", tab);
    localStorage.setItem("activeCourseSubTab", newSub);

    setShowRelated(false);
    setRelatedItems([]);
    setSelectedItem(null);
    setInstructors([]);
    setCurrentInstructor(null);
  };

  const handleSubTabChange = (sub) => {
    // suppress auto scroll caused by downstream instructor update
    suppressScrollRef.current = true;

    setActiveSubTab(sub);
    localStorage.setItem("activeCourseSubTab", sub);

    setShowRelated(false);
    setRelatedItems([]);
    setSelectedItem(null);
    setCurrentInstructor(null);
  };

  const subTabs = coursesRoute?.items?.[activeTab]?.subTabs || [];
  const itemsData = coursesRoute?.items?.[activeTab]?.data?.[activeSubTab];

  const items =
    itemsData?.courses ||
    itemsData ||
    coursesRoute?.items?.[activeTab]?.data ||
    coursesRoute?.items?.[activeTab] ||
    [];

  /* ---------------------------------------------------
      UPDATED LOGIC → Domain Based Related Courses use ID
     --------------------------------------------------- */
  const handleCardClick = (item) => {
    setSelectedItem(item);
    setSelectedLevel("");

    if (activeTab === "Certifications") {
      setShowChooseLevel(true);
      return;
    }

    if (activeTab === "Domain Based Courses") {
      if (
        Array.isArray(item.relatedCourses) &&
        item.relatedCourses.length > 0
      ) {
        setRelatedItems(item.relatedCourses);
        setShowRelated(true);
      } else {
        setRelatedItems([]);
        setShowRelated(false);
      }

      setTimeout(() => {
        relatedSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);

      return;
    }

    if (item.id) {
      navigate(`/courses/${item.id}`);
      return;
    }

    if (item.path) {
      navigate(item.path);
      return;
    }
  };

  const handleProceedPayment = () => {
    if (!selectedLevel) {
      alert("Please select a level");
      return;
    }
    setShowChooseLevel(false);
    setShowOrderSummary(true);
  };

  return (
    <div className="flex flex-col items-center relative">
      {/* ------- Banner ------- */}
      <div
        className="w-full md:h-90 bg-white relative border-b border-[#C8ECF5] flex justify-between px-16 py-16"
        style={{
          backgroundImage: `url(${bannerImg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-3xl">
          <h2 className="text-[36px] text-[#343079] mb-5">{bannerTitle}</h2>
          <h3 className="text-[22px] mt-6 text-[#343079] mb-8">
            Start Your Learning Journey – Your Way
          </h3>
          <p className="text-[#343079] text-[18px] leading-[32px]">
            Whether you’re exploring new skills, validating your expertise, or
            mastering a domain – your journey starts here.
          </p>
        </div>
        <div className="w-1/3">
          <img src={courseIcon} alt="Courses" className="w-full h-80" />
        </div>
      </div>

      {/* ------- Tabs + Grid ------- */}
      <div className="w-full max-w-7xl flex flex-col items-center px-4 md:px-4 mt-16">
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-3 rounded-t-xl overflow-hidden w-full">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleTabChange(tab.name)}
                className={`flex items-center justify-center gap-2 py-3 text-[16px] font-medium transition-all duration-300 ${
                  activeTab === tab.name
                    ? "bg-[#343079] text-white"
                    : "text-[#343079] hover:bg-[#e4e2f2]"
                }`}
              >
                <img
                  src={tab.icon}
                  alt={tab.name}
                  className={`w-5 h-5 object-contain transition-all duration-300 ${
                    activeTab === tab.name
                      ? "filter brightness-0 invert"
                      : "hover:filter hover:brightness-0 hover:invert"
                  }`}
                />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* ------- Sub Tabs + Main Grid ------- */}
        <div className="w-full flex border border-[#C0BFD5] rounded-b-xl mb-10">
          {subTabs.length > 0 && (
            <div className="w-1/4 border-r border-[#C0BFD5] rounded-l-xl p-4">
              {subTabs.map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => handleSubTabChange(subTab)}
                  className={`w-full text-left px-4 py-3 mb-2 rounded-md transition-all duration-300 ${
                    activeSubTab === subTab
                      ? "bg-[#EBEAF2] text-[#343079] font-semibold"
                      : "text-[#343079] hover:bg-[#EBEAF2]"
                  }`}
                >
                  {subTab}
                </button>
              ))}
            </div>
          )}

          <div
            className={`flex-1 grid ${
              items.length > 4
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            } gap-6 bg-white p-6 rounded-r-xl`}
          >
            {Array.isArray(items) &&
              items.map((item) => (
                <div
                  key={item.id || item.label}
                  onClick={() => handleCardClick(item)}
                  className="relative cursor-pointer flex flex-col items-center justify-start border border-[#C0BFD5] h-60 rounded-lg hover:bg-[linear-gradient(90deg,rgba(52,48,121,0.3)_0%,rgba(145,142,204,0.1)_100%)] transition-all duration-300 overflow-hidden"
                >
                  {item.icon && (
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-[150px] h-[150px] mt-4 mb-2 object-contain"
                    />
                  )}
                  <span
                    className="absolute bottom-0 left-0 w-full text-center text-[#343079] font-medium px-2 py-2 rounded-bl rounded-br"
                    style={{
                      background:
                        "linear-gradient(90deg, #3430794D 30%, #918ECC1A 100%)",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}

            {items.length === 0 && (
              <p className="text-gray-500 text-center col-span-full">
                No items available.
              </p>
            )}
          </div>
        </div>

        {/* ------- Related Courses ONLY for Domain Based ------- */}
        {activeTab === "Domain Based Courses" &&
          showRelated &&
          relatedItems.length > 0 && (
            <div
              ref={relatedSectionRef}
              className="w-full max-w-7xl mt-4 mb-10 bg-white border border-gray-200 rounded-xl p-8 shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[22px] font-semibold text-[#343079]">
                  Related Courses for {selectedItem?.label}
                </h3>
                <button
                  onClick={() => setShowRelated(false)}
                  className="text-[#343079] font-medium hover:underline"
                >
                  Hide
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedItems.map((rel, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (rel.id) navigate(`/courses/${rel.id}`);
                      else if (rel.path) navigate(rel.path);
                    }}
                    className="cursor-pointer border border-gray-300 rounded-lg hover:shadow-md transition-all flex flex-col items-center justify-center p-6"
                  >
                    {rel.icon && (
                      <img
                        src={rel.icon}
                        alt={rel.label}
                        className="w-[100px] h-[100px] mb-3 object-contain"
                      />
                    )}
                    <span className="text-[#343079] font-medium text-[16px]">
                      {rel.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* ------- Instructors Grid ------- */}
        {instructors.length > 1 && (
          <div className="w-full max-w-7xl bg-white mb-10 border border-[#C0BFD5] rounded-xl p-8 mt-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[22px] font-semibold text-[#343079]">
                Meet Your Mentors
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {instructors.map((ins, idx) => (
                <InstructorCard
                  key={idx}
                  data={ins}
                  onClick={() => setCurrentInstructor(ins)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ------- Single Instructor Full Profile ------- */}
        {currentInstructor && (
          <div
            ref={profileRef}
            className="w-full max-w-7xl bg-white border border-[#C0BFD5] rounded-xl p-8 mt-6 mb-10 shadow-sm"
          >
            <InstructorFullView instructor={currentInstructor} />
          </div>
        )}
      </div>

      {/* ------- Certification Level Modal ------- */}
      {showChooseLevel && selectedItem && (
        <div
          className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-[999]"
          onClick={(e) =>
            e.target === e.currentTarget && setShowChooseLevel(false)
          }
        >
          <div
            className="relative bg-white rounded-[12px] shadow-md w-[900px] p-10 border border-[#E0E0E0]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={closeIcon}
              alt="close"
              className="absolute top-5 right-5 w-5 h-5 cursor-pointer"
              onClick={() => setShowChooseLevel(false)}
            />
            <div className="text-center mb-8">
              <h2 className="text-[20px] font-semibold text-[#343079]">
                Validate Your Knowledge in{" "}
                <span className="capitalize">{selectedItem.label}</span>
              </h2>
              <p className="text-[#A4A2B3] mt-2 text-[15px]">
                Select your level and attempt the certification quiz for the{" "}
                <span className="font-medium text-[#343079] capitalize">
                  {selectedItem.label}
                </span>{" "}
                course.
              </p>
            </div>

            <div className="flex justify-center gap-6 mb-10">
              {[
                {
                  id: 1,
                  title: "Beginner",
                  desc: "Just starting your tech journey",
                },
                {
                  id: 2,
                  title: "Intermediate",
                  desc: "Build on your existing skills",
                },
                {
                  id: 3,
                  title: "Advance",
                  desc: "Master complex technologies",
                },
              ].map((level) => (
                <div
                  key={level.id}
                  onClick={() => setSelectedLevel(level.title)}
                  className={`flex flex-col justify-center items-center w-[230px] h-[120px] rounded-[12px] border transition-all duration-200 cursor-pointer ${
                    selectedLevel === level.title
                      ? "border-[#343079] bg-[#f2f1fc]"
                      : "border-[#d4d4d4] bg-white"
                  }`}
                >
                  <h3 className="font-semibold text-[16px] text-[#343079]">
                    {level.title}
                  </h3>
                  <p className="text-[#62616B] text-[14px] mt-1">
                    {level.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleProceedPayment}
                className="bg-[#343079] hover:bg-[#2b2768] text-white px-8 py-2 rounded-md text-[15px] font-medium transition-colors"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------- Order Summary Modal ------- */}
      {showOrderSummary && selectedItem && (
        <OrderSummaryModal
          course={selectedItem.label}
          level={selectedLevel}
          icon={selectedItem.icon}
          onClose={() => setShowOrderSummary(false)}
        />
      )}
    </div>
  );
};

export default Coursetabs;
