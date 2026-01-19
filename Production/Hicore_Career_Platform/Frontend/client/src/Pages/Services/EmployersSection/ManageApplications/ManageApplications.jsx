import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Import assets
import backArrow from "../../../../assets/Employer/ManageApplications/back-arrow.png";
import mainImage from "../../../../assets/Employer/ManageApplications/manage-applications.png";
import searchIcon from "../../../../assets/Employer/ManageApplications/search-icon.png";
import profileIcon from "../../../../assets/Employer/ManageApplications/profile-icon.png";
import eyeIcon from "../../../../assets/Employer/ManageApplications/eye-icon.png";
import mailIcon from "../../../../assets/Employer/ManageApplications/mail-icon.png";
import folderIcon from "../../../../assets/Employer/ManageApplications/folder-icon.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/** ✅ Allowed stages */
const STAGES = [
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Interview", value: "interview" },
  { label: "Hired", value: "hired" },
  { label: "Rejected", value: "rejected" },
];

const LABEL_BY_VALUE = STAGES.reduce((acc, s) => {
  acc[s.value] = s.label;
  return acc;
}, {});

const ManageApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Applications");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState("");
  const [currentAppIndex, setCurrentAppIndex] = useState(null);

  // Message popup
  const [isMessagePopupOpen, setIsMessagePopupOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedAppForMessage, setSelectedAppForMessage] = useState(null);
  const [sending, setSending] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ⭐ ADDED: search term state
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch applications using POSTER ID
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);

        const poster_user_id = localStorage.getItem("userId");

        if (!poster_user_id) {
          console.error("No userId found in localStorage");
          setApplications([]);
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_BASE}/applications/by-poster/${poster_user_id}`
        );

        if (Array.isArray(response.data)) {
          const filteredApps = response.data.filter(
            (app) =>
              String(app.poster_user_id) === String(poster_user_id)
          );

          setApplications(filteredApps);
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Disable scroll when popup open
  useEffect(() => {
    document.body.style.overflow =
      isPopupOpen || isMessagePopupOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupOpen, isMessagePopupOpen]);

  const menuItems = ["All Applications", ...STAGES.map((s) => s.label)];

  // Update stage
  const handleMove = async () => {
    if (currentAppIndex === null || !selectedStage) {
      alert("Please select a stage before moving.");
      return;
    }

    const currentApp = applications[currentAppIndex];
    const applicationId = currentApp.id;

    if (!applicationId) {
      alert("Error: Application ID missing.");
      return;
    }

    try {
      const url = `${API_BASE}/applications/update-stage/${applicationId}?new_stage=${encodeURIComponent(
        selectedStage
      )}`;

      const response = await axios.put(
        url,
        {},
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || response.status === 201) {
        const updatedApps = [...applications];
        updatedApps[currentAppIndex] = {
          ...updatedApps[currentAppIndex],
          stage: selectedStage,
        };
        setApplications(updatedApps);
        setIsPopupOpen(false);
        setSelectedStage("");
        setCurrentAppIndex(null);
        alert(
          `Application moved to "${
            LABEL_BY_VALUE[selectedStage] || selectedStage
          }" successfully!`
        );
      } else {
        alert("Failed to update application stage.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Check console for details.");
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!message.trim()) return alert("Please enter a message.");

    if (!selectedAppForMessage?.applyer_id) {
      alert("Error: Candidate user ID missing.");
      return;
    }

    try {
      setSending(true);

      const payload = {
        user_id: selectedAppForMessage.applyer_id,
        subject: "Message from Employer",
        message,
      };

      const response = await axios.post(
        `${API_BASE}/applications/notify`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || response.status === 201) {
        alert(`Message sent to ${selectedAppForMessage.applicant_name}`);
        setMessage("");
        setIsMessagePopupOpen(false);
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending message");
    } finally {
      setSending(false);
    }
  };

  // ⭐ UPDATED: search + filter logic (Option A)
  const filteredApplications =
    (
      activeTab === "All Applications"
        ? applications
        : applications.filter(
            (app) =>
              (app.stage || "").toLowerCase() ===
              (STAGES.find((s) => s.label === activeTab)?.value || "").toLowerCase()
          )
    ).filter((app) =>
      [app.applicant_name, app.job_title]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      {/* BACK BUTTON */}
      <div
        className="w-full px-8 flex items-center mb-6 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <img src={backArrow} alt="Back" className="w-[24px] h-[24px] mr-2" />
        <span className="text-[16px] text-[#343079]">Back</span>
      </div>

      {/* HEADER */}
      <div className="flex flex-col items-center text-center space-y-4">
        <img src={mainImage} alt="Manage" className="w-32 h-32 md:w-40 md:h-40" />
        <h1 className="text-[36px] font-regular text-[#343079]">
          Manage Your Applications with Ease
        </h1>
        <p className="text-[18px] text-[#343079]">
          Filter, review, and take action on applications faster than ever before.
        </p>
      </div>

      {/* SEARCH */}
      <div className="mt-8 w-full px-8">
        <div className="bg-[#F0F7FF] rounded-lg py-[36px] px-[100px]">
          <div className="flex items-center bg-white border border-[#A4A2B3] rounded-md px-3 py-3">
            <img src={searchIcon} alt="Search" className="w-5 h-5 mr-2 opacity-60" />

            <input
              type="text"
              placeholder="Search by candidate name, job title..."
              className="w-full outline-none text-base text-[#A4A2B3]"
              value={searchTerm}                  // ⭐ ADDED
              onChange={(e) => setSearchTerm(e.target.value)} // ⭐ ADDED
            />
          </div>
        </div>
      </div>

      {/* MAIN SECTION */}
      <div className="mt-8 w-full px-8">
        <div className="flex h-[681px] border border-[#C0BFD5] rounded-lg overflow-hidden">
          {/* SIDEBAR */}
          <div className="w-[231px] flex flex-col border-r border-[#C0BFD5]">
            <div className="bg-[#F3F3FB] px-5 h-16 border-b flex items-center justify-center">
              <h2 className="text-[20px] font-semibold text-[#343079]">
                {applications.length} Applications
              </h2>
            </div>

            <div className="flex flex-col space-y-2 px-5 py-4">
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveTab(item);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 rounded-md text-left transition ${
                    activeTab === item ? "bg-[#EBEAF2]" : "hover:bg-[#F9F9FC]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 flex flex-col">
            <div className="bg-[#F3F3FB] px-5 h-16 border-b flex justify-between items-center">
              <span className="text-[#343079] font-medium">Applications List</span>
            </div>

            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="flex justify-center items-center h-full text-[#343079]">
                  Loading applications...
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-center p-6">
                  <img
                    src={mainImage}
                    alt="No Applications"
                    className="w-32 h-32 opacity-60 mb-4"
                  />
                  <h2 className="text-[20px] font-semibold text-[#343079] mb-2">
                    No applications yet
                  </h2>
                  <p className="text-[#5A5A89] text-[16px] mb-6">
                    Looks like you haven’t received any applications yet. <br />
                    Post a job to start attracting candidates!
                  </p>
                  <button
                    onClick={() => navigate("/post-jobs/internships")}
                    className="bg-[#4631A1] hover:bg-[#37288a] text-white px-6 py-2 rounded-md text-[14px] font-medium transition"
                  >
                    Post a Job
                  </button>
                </div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-center text-[#343079] font-bold text-[14px] border-b border-[#C0BFD5]">
                      <th className="p-3 border-r">Candidate name</th>
                      <th className="p-3 border-r">Job applied for</th>
                      <th className="p-3 border-r">Match score</th>
                      <th className="p-3 border-r">Applied Date</th>

                      {/* ⭐ ADDED column */}
                      <th className="p-3 border-r">Posting Type</th>

                      <th className="p-3 border-r">Current Stage</th>
                      <th className="p-3">Quick Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedApplications.map((app, idx) => {
                      const stageValue = (app.stage || "").toLowerCase();
                      const stageLabel =
                        LABEL_BY_VALUE[stageValue] || app.stage || "-";

                      return (
                        <tr
                          key={app.id || idx}
                          className="border-b border-[#C0BFD5] text-[14px]"
                        >
                          <td className="p-3 flex items-center gap-2 text-[#343079] border-r">
                            <img src={profileIcon} alt="profile" className="w-8 h-8" />
                            {app.applicant_name}
                          </td>

                          <td className="p-3 border-r text-center text-[#343079]">
                            {app.job_title}
                          </td>

                          <td className="p-3 border-r text-center text-[#343079]">
                            {app.match}%
                          </td>

                          <td className="p-3 border-r text-center text-[#343079]">
                            {new Date(app.applied_at).toLocaleDateString()}
                          </td>

                          {/* ⭐ ADDED posting type row */}
                          <td className="p-3 border-r text-center text-[#343079]">
                            {app.posting_type || "-"}
                          </td>

                          <td className="p-3 border-r text-center text-[#343079]">
                            {stageLabel}
                          </td>

                          <td className="p-3 flex gap-3 justify-center">
                            <img
                              src={eyeIcon}
                              alt="view"
                              className="w-5 h-5 cursor-pointer"
                              onClick={() =>
                                app.applyer_id
                                  ? navigate(`/candidate-profile/${app.applyer_id}`)
                                  : alert("Candidate ID not found.")
                              }
                            />

                            <img
                              src={mailIcon}
                              alt="mail"
                              className="w-5 h-5 cursor-pointer"
                              onClick={() => {
                                setSelectedAppForMessage(app);
                                setIsMessagePopupOpen(true);
                              }}
                            />

                            <img
                              src={folderIcon}
                              alt="folder"
                              className="w-5 h-5 cursor-pointer"
                              onClick={() => {
                                setCurrentAppIndex(idx);
                                const curr = (app.stage || "").toLowerCase();
                                setSelectedStage(
                                  STAGES.find((s) => s.value === curr)?.value || ""
                                );
                                setIsPopupOpen(true);
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* PAGINATION */}
        {filteredApplications.length > itemsPerPage && (
          <div className="flex justify-end items-center gap-3 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#4631A1] hover:bg-gray-100"
              }`}
            >
              ← Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-[#4631A1] text-white"
                    : "text-[#4631A1] hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#4631A1] hover:bg-gray-100"
              }`}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* MOVE STAGE POPUP */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/10"
          onClick={() => setIsPopupOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border border-[#EBEAF2] rounded-lg p-4 flex flex-col gap-4">
              <h2 className="text-[#343079] font-semibold mb-4">
                Move this application to:
              </h2>

              {STAGES.map((s) => (
                <label
                  key={s.value}
                  className="flex items-center gap-3 cursor-pointer text-[#343079]"
                >
                  <input
                    type="radio"
                    name="stage"
                    value={s.value}
                    checked={selectedStage === s.value}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="w-[16px] h-[16px] accent-[#343079]"
                  />
                  <span className="text-sm font-medium">{s.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleMove}
                disabled={!selectedStage}
                className={`px-6 py-2 rounded-[8px] text-white text-[14px] font-medium transition-all ${
                  selectedStage
                    ? "bg-[#282655] hover:bg-[#1f1d44]"
                    : "bg-[#9ba0b3] cursor-not-allowed"
                }`}
              >
                Move
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE POPUP */}
      {isMessagePopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/10"
          onClick={() => setIsMessagePopupOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-[500px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <label className="text-[#343079] text-sm font-medium">
                Message for{" "}
                <span className="font-semibold">
                  {selectedAppForMessage?.applicant_name}
                </span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your Message..."
                className="w-full border border-gray-300 rounded-md mt-2 p-3 text-sm outline-none h-32"
              />
            </div>

            <div className="flex justify-start">
              <button
                onClick={handleSendMessage}
                disabled={sending}
                className={`px-6 py-2 rounded-[8px] ${
                  sending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#282655] hover:bg-[#1f1d44]"
                } transition-all text-white text-[14px] font-medium font-poppins`}
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;
