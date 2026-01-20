import React, { useEffect, useState } from "react";
import backIcon from "../../../assets/Customers/SearchLabs/back.png";
import searchIcon from "../../../assets/Customers/SearchLabs/search.png";
import labLogo from "../../../assets/Customers/SearchLabs/icon.png";
import locationIcon from "../../../assets/Customers/SearchLabs/location.png";
import clockIcon from "../../../assets/Customers/SearchLabs/clock.png";
import starIcon from "../../../assets/Customers/SearchLabs/star.png";
import heartOutline from "../../../assets/Customers/SearchLabs/save.png";
import aiIcon from "../../../assets/Customers/SearchLabs/AI-icon.png";
import uploadIcon from "../../../assets/Customers/SearchLabs/upload.png";

import LabDetailsModal from "./LabDetailsModal";

const SearchLabsFullPage = ({ open, onClose }) => {
  // ---- Hooks: ALWAYS top-level and unconditional ----
  const [selectedLab, setSelectedLab] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // reset selection when panel is closed
  useEffect(() => {
    if (!open) {
      setSelectedLab(null);
      setModalOpen(false);
    }
  }, [open]);

  // single effect to manage body overflow and keydown handling
  useEffect(() => {
    if (!open) return; // guard *inside* effect (safe)
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") {
        if (modalOpen) {
          setModalOpen(false);
          setSelectedLab(null);
        } else if (typeof onClose === "function") {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // modalOpen and onClose are fine in deps; effect still always declared
  }, [open, modalOpen, onClose]);

  // If not open, render nothing (hooks are still declared earlier)
  if (!open) return null;

  // Sample labs (keep/replace with props or API)
  const labs = [
    {
      id: 1,
      name: "Apollo Diagnostics",
      distance: "23 MG Road, Gurugram, Haryana",
      timings: "7:00 AM - 9:00 PM",
      rating: "4.8",
      reviewsCount: 210,
      tests: "CBC, Lipid Profile, COVID Test",
      logo: labLogo,
    },
    {
      id: 2,
      name: "Dr. Lal PathLabs",
      distance: "1.2 km",
      timings: "9 AM - 10 PM",
      rating: "4.5",
      reviewsCount: 210,
      tests: "Thyroid, Vitamin D, Urine Test",
      logo: labLogo,
    },
    {
      id: 3,
      name: "Healthians Lab",
      distance: "2.1 km",
      timings: "9 AM - 10 PM",
      rating: "4.8",
      reviewsCount: 210,
      tests: "Diabetes, Liver Function",
      logo: labLogo,
    },
    {
      id: 4,
      name: "Apollo Diagnostics",
      distance: "0.8 km",
      timings: "9 AM - 10 PM",
      rating: "4.8",
      reviewsCount: 210,
      tests: "CBC, Lipid Profile, COVID Test",
      logo: labLogo,
    },
    {
      id: 5,
      name: "Apollo Diagnostics",
      distance: "0.8 km",
      timings: "9 AM - 10 PM",
      rating: "4.8",
      reviewsCount: 210,
      tests: "CBC, Lipid Profile, COVID Test",
      logo: labLogo,
    },
    {
      id: 6,
      name: "Dr. Lal PathLabs",
      distance: "1.2 km",
      timings: "9 AM - 10 PM",
      rating: "4.5",
      reviewsCount: 210,
      tests: "Thyroid, Vitamin D, Urine Test",
      logo: labLogo,
    },
    {
      id: 7,
      name: "Healthians Lab",
      distance: "2.1 km",
      timings: "9 AM - 10 PM",
      rating: "4.8",
      reviewsCount: 210,
      tests: "Diabetes, Liver Function",
      logo: labLogo,
    },
    {
      id: 8,
      name: "Apollo Diagnostics",
      distance: "0.8 km",
      timings: "9 AM - 10 PM",
      rating: "4.8",
      reviewsCount: 210,
      tests: "CBC, Lipid Profile, COVID Test",
      logo: labLogo,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-start justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Search Labs"
    >
      <div
        className="absolute inset-0 bg-black/10"
        onClick={() => {
          if (typeof onClose === "function") onClose();
        }}
        aria-hidden="true"
      />

      <div
        className="relative w-full bg-white overflow-auto"
        style={{ maxHeight: "100vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full px-8 py-8">
          <div className="flex items-center">
            <button
              onClick={() => (typeof onClose === "function" ? onClose() : null)}
              aria-label="Back"
              className="flex items-center gap-3 text-[#115D29] focus:outline-none"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-white">
                <img src={backIcon} alt="back" className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>

          <h1 className="mt-6 text-2xl md:text-2xl font-semibold text-[#115D29]">
            Search Labs & Book Tests
          </h1>

          {/* (keeping rest of your markup; ensure no hooks in JSX) */}
          <div className="mt-8 w-full">
            <div className="flex items-center gap-4 w-full overflow-x-auto">
              <div className="flex-shrink-0">
                <div className="flex items-center gap-6 rounded-lg border border-[#B5CDBD] px-4 py-3">
                  <span className="text-sm text-[#115D29] font-medium">
                    Filter by :
                  </span>

                  <div className="flex items-center gap-6 ml-3 flex-nowrap">
                    <label className="flex items-center gap-2 text-sm text-[#115D29]">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-[#115D29]"
                      />
                      <span>Distance</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-[#115D29]">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-[#115D29]"
                      />
                      <span>Price</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-[#115D29]">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-[#115D29]"
                      />
                      <span>Rating</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-[#115D29]">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-[#115D29]"
                      />
                      <span>Home Sample Pickup</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search for Tests or Labs “e.g., Blood Test, Thyroid Profile”"
                    className="w-full px-5 py-3 pr-14 border border-[#B5CDBD] rounded-lg text-sm placeholder:text-[#93A69A] focus:outline-none focus:ring-0"
                    aria-label="Search tests or labs"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white"
                    aria-label="Search"
                  >
                    <img src={searchIcon} alt="search" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="h-6" />

          <div className="border border-[#B5CDBD] rounded-2xl p-6">
            <section aria-label="Labs near you" className="px-0">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#115D29]">
                    Labs Near You
                  </h2>
                  <div className="text-sm text-[#2874BA]">
                    <button className="text-sm">Change Location &gt;</button>
                  </div>
                </div>
                <div className="mt-3 mb-6 flex items-center gap-2 text-sm text-[#115D29]">
                  <img
                    src={locationIcon}
                    alt=""
                    className="w-4 h-4"
                    aria-hidden="true"
                  />
                  <span className="select-none">
                    23 MG Road, Sector 14, Chennai
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {labs.map((lab) => (
                  <article
                    key={lab.id}
                    className="group border border-[#B5CDBD] rounded-xl p-4 relative bg-white transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-[1.02] hover:border-[#115D29]"
                    role="article"
                    aria-labelledby={`lab-${lab.id}-name`}
                  >
                    <div className="absolute top-4 right-4">
                      <button
                        aria-label={`Favorite ${lab.name}`}
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-transparent focus:outline-none"
                      >
                        <img
                          src={heartOutline}
                          alt=""
                          className="w-5 h-5 opacity-60"
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-md border border-[#E6F0EA] flex items-center justify-center bg-white p-2">
                        {lab.logo ? (
                          <img
                            src={lab.logo}
                            alt={`${lab.name} logo`}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded" />
                        )}
                      </div>

                      <div>
                        <h3
                          id={`lab-${lab.id}-name`}
                          className="text-lg font-semibold text-[#115D29]"
                        >
                          {lab.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-sm text-[#115D29]">
                          <img
                            src={locationIcon}
                            alt=""
                            className="w-4 h-4"
                            aria-hidden="true"
                          />
                          <span>{lab.distance}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-5 text-[#115D29]">
                      <div className="flex items-center gap-3 text-sm">
                        <img
                          src={clockIcon}
                          alt=""
                          className="w-4 h-4"
                          aria-hidden="true"
                        />
                        <span className="text-sm">
                          Timings:{" "}
                          <span className="font-semibold">{lab.timings}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <img
                          src={starIcon}
                          alt=""
                          className="w-4 h-4"
                          aria-hidden="true"
                        />
                        <span className="text-sm">
                          <span className="font-semibold">{lab.rating}</span>{" "}
                          <span className="ml-2">
                            ({lab.reviewsCount} Reviews)
                          </span>
                        </span>
                      </div>

                      <div className="text-sm">{lab.tests}</div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="button"
                        className="w-full py-3 rounded-lg bg-[#0F4D28] text-white font-medium border-2 border-[#0F4D28] hover:shadow-lg shadow-gray-500 transition-all duration-200 hover:border-white focus:border-white focus:outline-none active:translate-y-[1px]"
                        aria-label={`View details for ${lab.name}`}
                        onClick={() => {
                          setSelectedLab(lab);
                          setModalOpen(true);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-6 border border-[#B6D0E8] rounded-lg p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-md">
                  {aiIcon ? (
                    <img
                      src={aiIcon}
                      alt="AI Assistant"
                      className="max-w-full max-h-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-white rounded" />
                  )}
                </div>

                <div>
                  <h3 className="text-md font-semibold text-[#2B7BBF]">
                    AI Health Assistant
                  </h3>
                  <div className="mt-2 text-sm font-medium text-[#2874BA]">
                    Need help choosing a doctor?
                  </div>
                  <p className="mt-2 text-sm text-[#2874BA]">
                    Suggests best doctors based on uploaded prescription,
                    symptoms, or previous searches.
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#2B7BBF] text-white text-sm font-medium shadow-sm focus:outline-none"
                  onClick={() => console.log("Upload prescription clicked")}
                >
                  {uploadIcon && (
                    <img
                      src={uploadIcon}
                      alt="Upload icon"
                      className="w-4 h-4"
                    />
                  )}
                  <span>Upload prescription</span>
                </button>
              </div>
            </div>
          </div>

          <div className="h-8" />
        </div>
      </div>

      {/* Lab details modal (rendered conditionally; modal code itself may have hooks but that's fine) */}
      {modalOpen && selectedLab && (
        <LabDetailsModal
          open={modalOpen}
          lab={selectedLab}
          onClose={() => {
            setModalOpen(false);
            setSelectedLab(null);
          }}
        />
      )}
    </div>
  );
};

export default SearchLabsFullPage;
