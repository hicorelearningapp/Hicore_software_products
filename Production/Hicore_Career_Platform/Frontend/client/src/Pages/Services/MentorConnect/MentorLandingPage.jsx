import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import bgImage from "../../../assets/MentorPage/mentor-banner.jpg";
import mentorPhoto from "../../../assets/MentorPage/mentor-banner-inner.jpg";
import becomeMentorBg from "../../../assets/MentorPage/become-mentor-bg.jpg";
import mentorshipFeaturesData from "./mentorshipFeaturesData";
import MentorCard from "./MentorCard";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const MentorLandingPage = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch(`${API_BASE}/mentor/list`);
        const data = await res.json();

        // ✅ Only accepted mentors
        const acceptedMentors = data?.filter(
          (mentor) => mentor.status === "accepted"
        );

        // ✅ Map backend fields to MentorCard format
        const formattedMentors = acceptedMentors.map((mentor) => ({
          id: mentor.id,
          name: `${mentor.first_name} ${mentor.last_name}`,
          title: mentor.professional_title,
          experience: mentor.experience_years,
          tags: mentor.tags || [],
          availability: mentor.available_time_slots || [],
          image: mentor.image
        }));

        setMentors(formattedMentors);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  return (
    <>
      {/* ✅ BANNER SECTION */}
      <div
        className="w-full p-10 bg-cover bg-center flex items-center justify-center px-6"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-8xl gap-1">
          <div className="flex-1 text-blue-900 text-center md:text-left md:ml-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Connect with a Mentor
            </h2>
            <p className="text-lg md:mt-10 mb-6">
              Find the right mentor to guide your journey, review your projects,
              and prepare you for the real world.
            </p>
            <button
              onClick={() => navigate("/all-mentors")}
              className="bg-blue-900 md:mt-4 text-white w-full font-semibold px-6 py-3 rounded-md hover:bg-blue-800 transition"
            >
              Find a Mentor
            </button>
          </div>

          <div className="flex-1 mt-4 md:mt-0">
            <img
              src={mentorPhoto}
              alt="Mentor helping student"
              className="rounded-lg w-full max-w-xl mx-auto mr-10"
            />
          </div>
        </div>
      </div>

      {/* ✅ FEATURES SECTION */}
      <div className="w-full mt-5 px-6 py-12">
        <div className="max-w-8xl mb-0 m-8 bg-white border border-gray-300 rounded-lg p-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900">
              Mentorship That Works — Seamlessly
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentorshipFeaturesData.map((feature, index) => (
              <div
                key={index}
                className={`rounded-lg border border-blue-900 p-6 ${feature.bgColor} transition-transform duration-300 transform hover:scale-105 hover:shadow-xl`}
              >
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-8 h-8 mb-6"
                />
                <h3 className="font-semibold text-xl text-indigo-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-lg text-blue-900">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ MENTOR NETWORK */}
      <div id="mentor-network" className="w-full px-4">
        <div className="max-w-8xl m-8 mt-0 bg-white border border-gray-300 rounded-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900">
              Explore Our Mentor Network
            </h2>
          </div>

          {loading ? (
            <p className="text-center text-blue-900">Loading mentors...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mentors.slice(0, 4).map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          )}

          <div className="text-right mt-4">
            <button
              onClick={() => navigate("/all-mentors")}
              className="text-indigo-900 text-xl mt-4 font-semibold hover:underline"
            >
              View More »
            </button>
          </div>
        </div>
      </div>

      {/* ✅ BECOME A MENTOR */}
      <div className="bg-white p-6 sm:p-8 md:p-10 m-6 sm:m-6 md:m-12 rounded-lg border border-gray-200 shadow shadow-gray-200">
        <div
          className="w-full px-4 py-10 rounded-xl"
          style={{
            backgroundImage: `url(${becomeMentorBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-7xl mx-auto bg-opacity-60 rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            {/* LEFT */}
            <div className="w-full md:w-1/2 text-center md:ml-10 md:text-left">
              <h2 className="text-2xl sm:text-2xl font-bold text-indigo-900 mb-6 sm:mb-8">
                Want to Help the Next Generation of Creators?
              </h2>

              <ul className="space-y-6 text-blue-900 sm:text-lg md:text-xl font-medium text-left">
                {[ 
                  "Host 1-on-1 or group mentorship sessions",
                  "Review resumes, portfolios, or project work",
                  "Conduct mock interviews",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="bg-green-600 text-white p-2 rounded-full">
                      <FiCheck className="text-md" />
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col w-full md:w-1/2 text-center md:justify-center">
              <p className="text-blue-900 mb-4 sm:mb-6 font-semibold md:mt-20 md:text-2xl sm:text-lg">
                Use your expertise to guide beginners and earn while doing it.
              </p>

              <button
                className="bg-indigo-900 md:m-8 text-white px-6 py-3 font-semibold rounded-md hover:bg-indigo-800 transition"
                onClick={() => navigate("/become-a-mentor")}
              >
                Become a Mentor
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorLandingPage;
