// src/pages/Freelance/SmartGigBanner.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import arrow from "../../../assets/Freelance/arrow.png";
import girl from "../../../assets/Freelance/girl.png";
import swirl from "../../../assets/Freelance/banner-bg.jpg";
import { FiSearch } from "react-icons/fi";
import GigListLeft from "./GigListLeft";
import GigDetailsRight from "./GigDetailsRight";
import axios from "axios";

const SmartGigBanner = () => {
  const navigate = useNavigate();

  const [gigs, setGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    domain: "",
    rating: "",
    budget: "",
    duration: "",
    verified: false,
  });

  // Fetch gigs on mount
  useEffect(() => {
    axios
      .get("https://hicore.pythonanywhere.com/freelance")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setGigs(res.data);
          setFilteredGigs(res.data);
          setSelectedGig(res.data[0]);
        }
      })
      .catch((err) => {
        console.error("Error fetching gigs:", err);
      });
  }, []);

  // Filter gigs based on search & filters
  useEffect(() => {
    let updated = [...gigs];

    // Apply skill-based search if term is provided
    if (searchTerm.trim() !== "") {
      updated = updated.filter((gig) =>
        Array.isArray(gig.skills?.allSkills)
          ? gig.skills.allSkills.some((skill) =>
              skill.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : false
      );
    }

    // Domain filter
    if (filters.domain !== "") {
      updated = updated.filter(
        (gig) =>
          gig.domain &&
          gig.domain.toLowerCase().includes(filters.domain.toLowerCase())
      );
    }

    // Rating filter
    if (filters.rating !== "") {
      updated = updated.filter(
        (gig) => Number(gig.rating) >= Number(filters.rating)
      );
    }

    // Budget filter
    if (filters.budget !== "") {
      updated = updated.filter((gig) => {
        const budget = Number(gig.budget);
        if (filters.budget === "₹500 – ₹5K") return budget >= 500 && budget <= 5000;
        if (filters.budget === "₹5K – ₹10K") return budget > 5000 && budget <= 10000;
        if (filters.budget === "₹10K+") return budget > 10000;
        return true;
      });
    }

    // Duration filter
    if (filters.duration !== "") {
      updated = updated.filter(
        (gig) =>
          gig.duration &&
          gig.duration.toLowerCase().includes(filters.duration.toLowerCase())
      );
    }

    // Verified clients only
    if (filters.verified) {
      updated = updated.filter((gig) => gig.verified === true);
    }

    setFilteredGigs(updated);
    setSelectedGig(updated[0] || null);
  }, [searchTerm, filters, gigs]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="w-full">
      {/* Banner */}
      <section className="relative w-full bg-[#EAF2FA] min-h-[400px] flex items-start justify-between px-8 py-12 overflow-hidden mb-10">
        <img
          src={swirl}
          alt="Background Swirl"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-10 w-full md:w-1/2 max-w-[600px]">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#5B5B98] text-sm font-medium mb-4"
          >
            <img src={arrow} alt="Back" className="w-3.5 h-3.5 mr-2" />
            Back
          </button>
          <h1 className="text-[28px] md:text-[32px] font-semibold text-[#2F2F51] mb-4">
            Smart Gig Recommendations
          </h1>
          <p className="text-[#5B5B98] text-[16px] leading-relaxed">
            Discover freelance projects that match your skills, schedule, and
            goals – kickstart your professional journey today.
          </p>
        </div>
        <div className="absolute bottom-0 right-40 z-10 hidden md:block">
          <img src={girl} alt="Girl" className="w-[260px] h-auto object-contain" />
        </div>
      </section>

      {/* Search Input */}
      <div className="flex justify-center mb-13">
        <div className="bg-[#F3F8FE] rounded-xl px-6 py-5 shadow-sm w-[1200px]">
          <div className="relative w-full max-w-[1000px] mx-auto">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8A8A8A]" />
            <input
              type="text"
              placeholder="Search for roles, companies, skills....."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-center mb-6">
        <div className="w-[1200px] flex items-center justify-between flex-wrap gap-4">
          {[
            {
              label: "Domain",
              key: "domain",
              options: [
                "Web Development",
                "AI & Machine Learning",
                "Semiconductors",
                "Cybersecurity",
                "Cloud & DevOps",
              ],
            },
            {
              label: "Rating",
              key: "rating",
              options: ["2", "3", "4", "5"],
            },
            {
              label: "Budget",
              key: "budget",
              options: ["₹500 – ₹5K", "₹5K – ₹10K", "₹10K+"],
            },
            {
              label: "Duration",
              key: "duration",
              options: ["1 week", "2 weeks", "1 month", "Ongoing"],
            },
          ].map(({ label, key, options }) => (
            <div className="flex items-center gap-2" key={key}>
              <label className="text-sm text-[#2F2F51] font-medium">{label}</label>
              <select
                value={filters[key]}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="w-[160px] h-[40px] border border-gray-300 rounded-md px-3 text-sm text-[#2F2F51] focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Select option</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Verified Checkbox */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#2F2F51] font-medium">
              Verified Clients Only
            </label>
            <label className="relative inline-flex items-center cursor-pointer w-12 h-6">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={filters.verified}
                onChange={(e) => handleFilterChange("verified", e.target.checked)}
              />
              <div className="w-full h-full bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
              <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t border-[#5B5B98] w-[1200px] mx-auto" />

      {/* Gigs */}
      <div className="w-[1200px] mx-auto mt-10">
        {filteredGigs.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            ❌ No gigs match your current filters.
          </div>
        ) : (
          <div className="flex gap-6">
            <GigListLeft
              gigs={filteredGigs}
              selectedGig={selectedGig}
              onSelectGig={setSelectedGig}
            />
            {selectedGig && <GigDetailsRight gig={selectedGig} />}
          </div>
        )}
      </div>

      <div className="h-8" />
    </div>
  );
};

export default SmartGigBanner;
