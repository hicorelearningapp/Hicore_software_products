import React, { useState } from "react";

/* ASSETS */
import backArrow from "../../assets/StudentDashboard/StudentDashHome/Backarrow.png";
import examIllustration from "../../assets/StudentDashboard/StudentDashHome/exam-image.jpg";

/* SECTION IMAGES */
import schoolImg from "../../assets/StudentDashboard/StudentDashHome/school-image.jpg";
import medicalImg from "../../assets/StudentDashboard/StudentDashHome/medical-image.jpg";

const sectionsData = [
  {
    id: "school",
    title: "School Boards",
    bgGradient: "from-[#F3F6FF] to-[#ECECEC]",
    image: schoolImg,
    cards: [
      {
        title: "Class 6th",
        boards: ["CBSE", "ICSE", "State Board"],
        subjects: ["Physics", "Chemistry", "Biology"],
        students: "2.5k+ students",
      },
      {
        title: "Class 7th",
        boards: ["ICSE", "CBSE", "State Board"],
        subjects: ["Physics", "Chemistry", "Biology"],
        students: "2.5k+ students",
      },
      {
        title: "Class 8th",
        boards: ["State", "ICSE", "State Board"],
        subjects: ["Physics", "Chemistry", "Biology"],
        students: "2.5k+ students",
      },
      {
        title: "Class 9th",
        boards: ["CBSE", "ICSE", "State Board"],
        subjects: ["Physics", "Chemistry", "Biology"],
        students: "2.5k+ students",
      },
      {
        title: "Class 10th",
        boards: ["ICSE", "CBSE", "State Board"],
        subjects: ["Physics", "Chemistry", "Biology"],
        students: "2.5k+ students",
      },
      {
        title: "Class 11th",
        boards: ["State", "ICSE", "State Board"],
        subjects: ["Physics", "Chemistry", "Biology"],
        students: "2.5k+ students",
      },
    ],
  },
  {
    id: "medical",
    title: "Medical Entrance",
    bgGradient: "from-[#F5F5F5] to-[#E6E6E6]",
    image: medicalImg,
    cards: [
      {
        title: "NEET UG",
        subtitle: "National Eligibility cum Entrance Test",
        subjects: ["Physics", "Chemistry", "Biology"],
        students: "2.5k+ students",
      },
      {
        title: "AIIMS",
        subtitle: "National Eligibility cum Entrance Test",
        subjects: ["Physics", "Chemistry", "Biology"],
        students: "2.5k+ students",
      },
      {
        title: "JIPMER",
        subtitle: "National Eligibility cum Entrance Test",
        subjects: ["Physics", "Chemistry", "Biology"],
        students: "2.5k+ students",
      },
    ],
  },
  {
    id: "engineering",
    title: "Engineering Entrance",
    bgGradient: "from-[#F5F5F5] to-[#E6E6E6]",
    image: medicalImg,
    cards: [
      {
        title: "JEE Main",
        subtitle: "National Eligibility cum Entrance Test",
        subjects: ["Physics", "Chemistry", "Biology"],
        students: "2.5k+ students",
      },
      {
        title: "JEE Advanced",
        subtitle: "National Eligibility cum Entrance Test",
        subjects: ["Physics", "Chemistry", "Biology"],
        students: "2.5k+ students",
      },
      {
        title: "BITSAT",
        subtitle: "National Eligibility cum Entrance Test",
        subjects: ["Physics", "Chemistry", "Biology"],
        students: "2.5k+ students",
      },
    ],
  },
  {
    id: "government",
    title: "Government Jobs",
    bgGradient: "from-[#F5F5F5] to-[#E6E6E6]",
    image: medicalImg,
    cards: [
      {
        title: "UPSC CSE",
        subtitle: "National Eligibility cum Entrance Test",
        subjects: ["Physics", "Chemistry", "Biology"],
        students: "2.5k+ students",
      },
      {
        title: "SSC CGL",
        subtitle: "National Eligibility cum Entrance Test",
        subjects: ["Physics", "Chemistry", "Biology"],
        students: "2.5k+ students",
      },
      {
        title: "Bank PO",
        subtitle: "National Eligibility cum Entrance Test",
        subjects: ["Physics", "Chemistry", "Biology"],
        students: "2.5k+ students",
      },
    ],
  },
];

const AllExams = ({ onBack }) => {
  const [selectedBoards, setSelectedBoards] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedCard, setSelectedCard] = useState(null); // 🔹 NEW

  const handleBoardChange = (key, board) => {
    setSelectedBoards((prev) => ({ ...prev, [key]: board }));
  };

  const handleViewMore = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <div className="mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div
            onClick={onBack}
            className="flex items-center gap-2 text-[#2758B3] mb-6 cursor-pointer"
          >
            <img src={backArrow} alt="back" className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </div>

          <h1 className="text-[20px] font-bold text-[#2758B3]">
            Exams Made Simple. Explore & Start Your Journey Today
          </h1>

          <p className="mt-5 text-gray-400 max-w-xl leading-[32px]">
            Find your exam roadmap – from Grade 6–12, NEET, JEE, and State
            Boards to competitive tests.
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src={examIllustration}
            alt="Exam Illustration"
            className="max-w-[676px] w-full"
          />
        </div>
      </div>

      <div className="border-t-2 border-dashed border-[#2758B3] mt-10" />

      {/* SECTIONS */}
      <div className="px-8 py-14 space-y-20">
        {sectionsData.map((section) => {
          const isExpanded = expandedSections[section.id];
          const visibleCards = isExpanded
            ? section.cards
            : section.cards.slice(0, 3);

          return (
            <div
              key={section.id}
              className="border border-[#999999] rounded-2xl overflow-hidden"
            >
              {/* HEADER */}
              <div
                className={`bg-gradient-to-r ${section.bgGradient} flex items-center justify-between`}
              >
                <h2 className="text-2xl ml-10 font-bold text-[#2758B3]">
                  {section.title}
                </h2>
                <img src={section.image} alt="" className="h-28" />
              </div>

              {/* CARDS */}
              <div className="bg-white px-10 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {visibleCards.map((card, index) => {
                    const cardKey = `${section.id}-${index}`;
                    const isActive = selectedCard === cardKey;

                    return (
                      <div
                        key={cardKey}
                        onClick={() => setSelectedCard(cardKey)} // 🔹 CLICK HANDLER
                        className={`rounded-2xl p-8 border bg-white shadow-sm cursor-pointer transition
                          ${
                            isActive ? "border-[#2758B3]" : "border-[#E0E8FF]"
                          }`}
                      >
                        <h3 className="text-lg font-semibold text-[#2758B3]">
                          {card.title}
                        </h3>

                        {card.subtitle && (
                          <p className="text-gray-500 mt-1 text-sm">
                            {card.subtitle}
                          </p>
                        )}

                        {card.boards && (
                          <div className="flex gap-6 mt-4 text-sm text-gray-500">
                            {card.boards.map((b) => (
                              <label
                                key={b}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="radio"
                                  name={cardKey}
                                  checked={selectedBoards[cardKey] === b}
                                  onChange={() => handleBoardChange(cardKey, b)}
                                  onClick={(e) => e.stopPropagation()} // prevent card click
                                />
                                {b}
                              </label>
                            ))}
                          </div>
                        )}

                        <p className="mt-4 text-[#2758B3] font-medium">
                          Subjects
                        </p>

                        <div className="flex gap-3 flex-wrap mt-2">
                          {card.subjects.map((sub) => (
                            <span
                              key={sub}
                              className="px-4 py-1 rounded-full bg-[#F2F2F2] text-[#2758B3] text-sm"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>

                        <p className="mt-4 text-[#2758B3] font-medium">
                          {card.students}
                        </p>

                        <button className="mt-6 w-full bg-[#2758B3] text-white py-3 rounded-full font-semibold">
                          Start
                        </button>
                      </div>
                    );
                  })}
                </div>

                {section.cards.length > 3 && (
                  <div
                    onClick={() => handleViewMore(section.id)}
                    className="flex justify-end mt-10 text-[#2758B3] font-medium cursor-pointer"
                  >
                    {isExpanded ? "View Less <<" : "View More >>"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllExams;
