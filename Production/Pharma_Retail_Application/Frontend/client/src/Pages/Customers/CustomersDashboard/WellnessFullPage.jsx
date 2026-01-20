import React, { useState } from "react";
import backIcon from "../../../assets/Customers/Wellness/back-icon.png";
import searchIcon from "../../../assets/Customers/Wellness/Search.png";

// Category images
import yogaImg from "../../../assets/Customers/Wellness/yoga.png";
import mentalImg from "../../../assets/Customers/Wellness/mental-health.png";
import nutritionImg from "../../../assets/Customers/Wellness/multi-graints.png";
import wellnessImg from "../../../assets/Customers/Wellness/wellness.png";

/* Guide assets - replace filenames/paths if needed */
import guide1 from "../../../assets/Customers/Wellness/guide-1.jpg";
import guide2 from "../../../assets/Customers/Wellness/guide-1.jpg";
import guide3 from "../../../assets/Customers/Wellness/guide-1.jpg";

/* small icons */
import starIcon from "../../../assets/Customers/Wellness/star.png";
import briefcaseIcon from "../../../assets/Customers/Wellness/work.png";
import clockIcon from "../../../assets/Customers/Wellness/clock.png";
import rupeeIcon from "../../../assets/Customers/Wellness/dollar-circle.png";
import locationIcon from "../../../assets/Customers/Wellness/Location.png";
import heartOutline from "../../../assets/Customers/Wellness/Save.png";

/* Smart Action Zone icons (ensure these exist in assets) */
import actionBook from "../../../assets/Customers/Wellness/Hospital.png";
import actionQuiz from "../../../assets/Customers/Wellness/Police.png";
import actionMotivate from "../../../assets/Customers/Wellness/Fire.png";

/* Wellness Resources images/icons (ensure these exist in assets) */
import resourceImg1 from "../../../assets/Customers/Wellness/girl.png";
import resourceImg2 from "../../../assets/Customers/Wellness/kidney.png";
import resourceImg3 from "../../../assets/Customers/Wellness/tree.png";

const WellnessFullPage = ({ open, onClose }) => {
  const [query, setQuery] = useState("");

  if (!open) return null;

  const categories = [
    {
      id: 1,
      title: "Fitness & Yoga",
      desc: "Stretch, strengthen, and energize your body - from mindful yoga to personalized fitness sessions.",
      img: yogaImg,
    },
    {
      id: 2,
      title: "Mental Health",
      desc: "Talk, heal, and grow with certified therapists - because your peace of mind matters.",
      img: mentalImg,
    },
    {
      id: 3,
      title: "Nutrition",
      desc: "Eat smart, feel better - get tailored meal plans and expert nutrition guidance for your lifestyle.",
      img: nutritionImg,
    },
    {
      id: 4,
      title: "Wellness Programs",
      desc: "Discover holistic wellness journeys - from stress relief to better sleep, guided by top specialists.",
      img: wellnessImg,
    },
  ];

  const guides = [
    {
      id: 1,
      name: "Ananya Sharma",
      role: "Yoga Instructor",
      specialties: "Yoga, Zumba",
      experience: "10+ Years Experience",
      price: "₹600/consultation",
      rating: "4.8",
      reviews: "210 Reviews",
      availability: "Available Today: 4 PM – 8 PM",
      location: "Yoga Center, Sector 14, Gurugram",
      avatar: guide1,
    },
    {
      id: 2,
      name: "Dr. Rohan Mehta",
      role: "Psychologist",
      specialties: "Stress, Anxiety, Sleep Therapy",
      experience: "10+ Years Experience",
      price: "₹600/consultation",
      rating: "4.8",
      reviews: "210 Reviews",
      availability: "Available Today: 4 PM – 8 PM",
      location: "Psychology Clinic, Sector 14, Gurugram",
      avatar: guide2,
    },
    {
      id: 3,
      name: "Priya Nair",
      role: "Diet & Nutrition Coach",
      specialties: "Personalized meal plans",
      experience: "10+ Years Experience",
      price: "₹600/consultation",
      rating: "4.8",
      reviews: "210 Reviews",
      availability: "Available Today: 4 PM – 8 PM",
      location: "Nutritionist Clinic, Sector 14, Gurugram",
      avatar: guide3,
    },
  ];

  const resources = [
    {
      id: 1,
      img: resourceImg1,
      title: "Top 5 Breathing Techniques for Stress Relief",
      cta1: "Watch Now",
      cta2: "Read Article",
    },
    {
      id: 2,
      img: resourceImg2,
      title: "How Gut Health Impacts Your Mood",
      cta1: "Watch Now",
      cta2: "Read Article",
    },
    {
      id: 3,
      img: resourceImg3,
      title: "Signs You Need a Mental Health Check-In",
      cta1: "Watch Now",
      cta2: "Read Article",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start bg-black/90 p-5 pt-0 pb-0 justify-center overflow-y-auto scrollbar-hide"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full  bg-white rounded-lg shadow-lg p-6"
        style={{ minHeight: 220 }}
      >
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={onClose}
            aria-label="Back"
            className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-gray-50 transition"
          >
            <img src={backIcon} alt="back" className="w-5 h-5" />
            <span className="text-sm font-medium text-[#115D29]">Back</span>
          </button>
        </div>
        {/* Title + Subtitle */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#115D29] leading-tight">
            Your Path to Better Living Starts Here
          </h1>
          <p className="text-sm text-[#115D29] mt-5 max-w-3xl">
            Find trusted experts and wellness programs to balance your body and
            mind.
          </p>
        </div>
        {/* Search Bar */}
        <div className="mt-8">
          <label htmlFor="wellness-search" className="sr-only">
            Search wellness programs or experts
          </label>

          <div className="relative">
            <input
              id="wellness-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search by category, expert name, or goal (e.g., yoga, therapy, weight loss...)"
              className="w-full rounded-md border border-[#BFDAC8] px-6 py-4 pr-14 text-sm placeholder:text-[#9DB69A] focus:outline-none"
            />

            <button
              type="button"
              aria-label="Search"
              onClick={() => console.log("Searching:", query)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 hover:shadow-sm transition"
            >
              <img src={searchIcon} alt="search" className="w-7 h-7" />
            </button>
          </div>
        </div>
        {/* --- CATEGORY CARDS --- */}
        <div className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((item) => (
              <div
                key={item.id}
                className="border border-[#BFDAC8] rounded-xl bg-gradient-to-br from-white to-blue-50 p-5 hover:border-[#2874BA] hover:border-2 hover:shadow-md transition-all duration-200"
              >
                <div className="w-full h-32 flex items-center justify-center mb-6 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full object-contain"
                  />
                </div>

                <h3 className="text-[#115D29] text-lg font-semibold mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 leading-[28px]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* --- GUIDES SECTION (EXISTING) --- */}
        <div className="mt-12 border border-[#BFDAC8] rounded-lg p-5">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-[#115D29] font-semibold text-lg">
                Meet Your Wellness Guides
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Connect with verified experts for personalized guidance
              </p>
            </div>

            <div>
              <button className="text-[#2874BA] text-sm font-medium">
                View All &gt;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guides.map((g) => (
              <div
                key={g.id}
                className="relative border border-[#D9E6D8] rounded-xl bg-white p-4 hover:border-[#115D29] hover:border-2 hover:shadow-md transition-all duration-200"
                style={{ minHeight: 220 }}
              >
                {/* Heart Icon */}
                <img
                  src={heartOutline}
                  alt="save"
                  className="absolute right-4 top-4 w-5 h-5 opacity-80"
                />

                {/* Top Row: Avatar + Name Section */}
                <div className="flex items-start gap-4">
                  <img
                    src={g.avatar}
                    alt={g.name}
                    className="w-18 h-18 rounded-md object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[#115D29] font-semibold text-[16px] leading-tight">
                        {g.name}{" "}
                        <span className="font-normal text-[14px]">
                          ({g.role})
                        </span>
                      </h2>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      {g.specialties}
                    </p>
                  </div>
                </div>

                {/* Center Info Area */}
                <div className="mt-6 text-sm text-[#115D29]">
                  {/* ROW 1: Experience | Price */}
                  <div className="grid grid-cols-2 ">
                    {/* Experience */}
                    <div className="flex items-center gap-2">
                      <img src={briefcaseIcon} className="w-4 h-4" alt="" />
                      <span>{g.experience}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <img src={rupeeIcon} className="w-4 h-4" alt="" />
                      <span>{g.price}</span>
                    </div>
                  </div>

                  {/* ROW 2: Rating | Availability */}
                  <div className="grid grid-cols-2  mt-5">
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <img src={starIcon} className="w-4 h-4" alt="" />
                      <span className="font-semibold">{g.rating}</span>
                      <span className="text-gray-600">({g.reviews})</span>
                    </div>

                    {/* Availability */}
                    <div className="flex items-start gap-2">
                      <img src={clockIcon} className="w-4 h-4 mt-1" alt="" />
                      <span className="leading-tight">{g.availability}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mt-5 text-sm text-gray-500 flex items-center gap-2">
                    <img src={locationIcon} alt="loc" className="w-4 h-4" />
                    <span>{g.location}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    className="
                      flex-1 bg-[#115D29] text-white py-2 rounded-md text-sm
                      border-2 border-transparent shadow-md shadow-gray-500
                      hover:border-white transition-all duration-150
                    "
                  >
                    Book a Session
                  </button>

                  <button className="flex-1 border-1 border-[#115D29] py-2 rounded-md text-[#115D29] text-sm">
                    Video Consultant
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>{" "}
        {/* --- SMART ACTION ZONE (EXISTING) --- */}
        <div className="mt-8 p-4 rounded-lg border border-[#B5CDBD] bg-white">
          <div className="px-3 py-2 rounded-lg border border-transparent bg-[#F7FBF8]">
            <h3 className="text-md font-semibold text-[#2874BA]">
              Smart Action Zone
            </h3>
          </div>

          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="flex items-start gap-4 border border-[#CFE6FB] rounded-lg p-4 hover:shadow-sm transition">
              <div className="flex-shrink-0 w-20 h-20 rounded-md flex items-center justify-center bg-[#2874BA]/[5%] ">
                <img src={actionBook} alt="book" className="w-18 h-18" />
              </div>
              <div>
                <h4 className="text-md mt-3 font-semibold text-[#2874BA] ">
                  Book New Session
                </h4>
                <p className="text-sm  text-gray-600 mt-1 leading-[28px]">
                  Connect with certified experts and start your next step toward
                  a healthier, happier you.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex items-start gap-4 border border-[#CFE6FB] rounded-lg p-4 hover:shadow-sm transition">
              <div className="flex-shrink-0 w-20 h-20 rounded-md flex items-center justify-center bg-[#2874BA]/[5%]">
                <img src={actionQuiz} alt="quiz" className="w-18 h-18" />
              </div>
              <div>
                <h4 className="text-md mt-3 font-semibold text-[#2874BA]">
                  Take Wellness Quiz
                </h4>
                <p className="text-sm  text-gray-600 mt-1 leading-[28px]">
                  Find out what your mind and body really need - take our smart
                  wellness quiz to get personalized guidance.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex items-start gap-4 border border-[#CFE6FB] rounded-lg p-4 hover:shadow-sm transition">
              <div className="flex-shrink-0 w-20 h-20 rounded-md flex items-center justify-center bg-[#2874BA]/[5%]">
                <img
                  src={actionMotivate}
                  alt="motivate"
                  className="w-18 h-18"
                />
              </div>
              <div>
                <h4 className="text-md mt-3 font-semibold text-[#2874BA]">
                  Get Daily Motivation Reminders
                </h4>
                <p className="text-sm  text-gray-600 mt-1 leading-[28px]">
                  Stay inspired every day - receive gentle nudges, quotes, and
                  health tips right when you need them.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* --- WELLNESS RESOURCES (NEW SECTION) --- */}
        <div className="mt-8 p-4 rounded-lg border border-[#B5CDBD] bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#115D29]">
                Wellness Resources
              </h3>
            </div>
            <div>
              <button className="text-sm text-[#2874BA]">View All &gt;</button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-4 border border-[#B5CDBD] rounded-lg p-4 hover:shadow-sm transition"
              >
                <div className="flex-shrink-0 w-24 h-24 rounded-md flex items-center justify-center bg-white ">
                  <img
                    src={r.img}
                    alt={r.title}
                    className="w-24 h-24 object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-[#2874BA] leading-[32px]">
                    {r.title}
                  </h4>

                  <div className="mt-4 flex gap-3">
                    <button className="px-4 py-2 bg-[#2874BA] w-full text-white text-sm rounded-md">
                      {" "}
                      {r.cta1}{" "}
                    </button>
                    <button className="px-4 py-2 w-full border border-[#BFDAC8] text-sm rounded-md text-[#2874BA]">
                      {" "}
                      {r.cta2}{" "}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
};

export default WellnessFullPage;
