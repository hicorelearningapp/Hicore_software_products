// src/components/StudentRequest.jsx
import React, { useState, useEffect } from "react";
import searchIcon from "../../../../assets/GuideFinalyearproject/search.png";
import closeicon from "../../../../assets/GuideFinalyearproject/cancel.png";
import tickicon from "../../../../assets/GuideFinalyearproject/full-tick.png";
import eyeicon from "../../../../assets/GuideFinalyearproject/eye.png";
import { useNavigate } from "react-router-dom";
import ActionModal from "./ActionModal";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const StudentRequest = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [modalType, setModalType] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [declineNote, setDeclineNote] = useState("");

  const navigate = useNavigate();
  const mentorId = localStorage.getItem("userId");

  const handleViewProfile = (studentId) => {
    if (!studentId) {
      alert("Student profile not available");
      return;
    }
    navigate(`/candidate-profile/${studentId}`);
  };

  /* ------------------ FETCH REQUESTS ------------------ */
  const fetchRequests = async () => {
    if (!mentorId) return;

    try {
      const res = await axios.get(`${API_BASE}/api/mentor/${mentorId}/new-requests`);
      const requestList = res.data || [];

      const enrichedRequests = await Promise.all(
        requestList.map(async (req) => {
          try {
            const profileRes = await axios.get(`${API_BASE}/profile/${req.student?.id}`);
            const profile = profileRes.data || {};

            const basic = profile.basicInfo || {};
            const education = profile.education || [];

            let edu = education.find((e) => e.currently_studying === true);
            if (!edu && education.length > 0) {
              edu = education[education.length - 1];
            }

            return {
              ...req,
              profileName: `${basic.first_name || ""} ${basic.last_name || ""}`.trim(),
              profileCollegeCourse: edu
                ? `${edu.college_name} / ${edu.field_of_study}`
                : "N/A",
            };
          } catch (err) {
            return {
              ...req,
              profileName: req.student?.name || "",
              profileCollegeCourse: req.student?.college || "",
            };
          }
        })
      );

      setRequests(enrichedRequests);
      setFiltered(enrichedRequests);
    } catch (error) {
      console.error("NEW REQUESTS API ERROR:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [mentorId]);

  /* ------------------ SEARCH LOGIC ------------------ */
  useEffect(() => {
    if (!searchText.trim()) {
      setFiltered(requests);
      return;
    }

    const lower = searchText.toLowerCase();

    const filteredResults = requests.filter((req) =>
      req.profileName?.toLowerCase().includes(lower) ||
      req.profileCollegeCourse?.toLowerCase().includes(lower) ||
      req.project?.title?.toLowerCase().includes(lower) ||
      req.project?.domain?.toLowerCase().includes(lower)
    );

    setFiltered(filteredResults);
  }, [searchText, requests]);

  /* ------------------ PAGINATION ------------------ */
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  /* ------------------ OPEN MODAL FUNCTIONS ------------------ */
  const openAcceptModal = (requestId) => {
    setSelectedRequestId(requestId);
    setModalType("accept");
  };

  const openDeclineModal = (requestId) => {
    setSelectedRequestId(requestId);
    setModalType("decline");
  };

  return (
    <div className="w-full h-fit flex flex-col gap-7 p-9 opacity-100 border border-[#C0BFD5] rounded-br-lg rounded-bl-lg rounded-tr-lg">

      {/* Search Bar */}
      <div className="w-full h-[120px] rounded-lg p-9 md:px-[100px] bg-[#F0F7FF] flex items-center gap-9">
        <div className="w-full h-[48px] rounded-lg border border-[#A4A2B3] flex items-center justify-between p-2 md:px-4">
          <img src={searchIcon} alt="Search" className="w-6 h-6" />
          <input
            type="text"
            placeholder="Search by candidate name, project name, domain..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full border-none outline-none bg-transparent pl-4"
          />
        </div>
      </div>

      {/* EMPTY STATE */}
{filtered.length === 0 ? (
  <div className="w-full h-[300px] flex flex-col items-center justify-center text-center border border-[#C0BFD5] rounded-lg bg-white">
    <img src={searchIcon} className="w-12 h-12 opacity-60 mb-4" />
    <h3 className="text-[#343079] font-semibold text-lg">
      No Requests Found
    </h3>
    <p className="text-gray-500 text-sm mt-2 max-w-[300px]">
      There are no new student mentorship requests at the moment.
    </p>
  </div>
) : (
  /* EXISTING TABLE CODE */
  <div className="overflow-x-auto rounded-lg border border-[#C0BFD5]">
    <table className="table-fixed w-full border-collapse">
      <thead className="h-16 font-poppins font-bold text-[16px] text-[#343079] text-center border-y border-[#C0BFD5]">
        <tr>
          <th className="px-6 py-3">Name</th>
          <th className="px-6 py-3 border-x">College / Course</th>
          <th className="px-6 py-3 border-x">Domain</th>
          <th className="px-6 py-3 border-x">Project Type</th>
          <th className="px-6 py-3 border-x">Project Idea</th>
          <th className="px-6 py-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {currentItems.map((req, index) => (
          <tr key={index} className="bg-white text-[#343079] text-center border-y border-[#C0BFD5]">

            <td className="px-6 py-4">{req.profileName}</td>
            <td className="px-6 py-4 border-x">{req.profileCollegeCourse}</td>

            <td className="px-6 py-4 border-x">{req.project?.domain}</td>

            <td className="px-6 py-4 border-x">
              {req.project?.project_type &&
                req.project.project_type.charAt(0).toUpperCase() +
                req.project.project_type.slice(1)}
            </td>

            <td className="px-6 py-4 border-x text-left">{req.project?.title}</td>

            <td className="px-6 py-4">
              <div className="flex items-center justify-center space-x-2">

                {/* DECLINE */}
                <img
                  src={closeicon}
                  className="w-[36px] h-[36px] cursor-pointer"
                  onClick={() => openDeclineModal(req.request_id)}
                />

                {/* ACCEPT */}
                <img
                  src={tickicon}
                  className="w-[36px] h-[36px] cursor-pointer"
                  onClick={() => openAcceptModal(req.request_id)}
                />

                {/* VIEW PROFILE */}
                <img
                  src={eyeicon}
                  className="w-[48px] h-[48px] cursor-pointer"
                  onClick={() => handleViewProfile(req.student?.id)}
                />
              </div>
            </td>

          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


      {/* Pagination */}
      {totalPages > 1 && (
        <div className="w-full flex justify-end items-center gap-3 p-4">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            ← Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-[32px] h-[32px] rounded ${
                currentPage === page ? "bg-[#4631A1] text-white" : "text-[#4631A1]"
              }`}
            >
              {page}
            </button>
          ))}

          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
            Next →
          </button>
        </div>
      )}

      {/* MODAL */}
      {(modalType === "accept" || modalType === "decline") && (
        <ActionModal
          show={!!modalType}
          type={modalType}
          requestId={selectedRequestId}     // ✔ Correct ID passed
          onClose={() => setModalType(null)}
          declineNote={declineNote}
          setDeclineNote={setDeclineNote}
          refreshList={fetchRequests}        // ✔ refresh after accept/decline
        />
      )}
    </div>
  );
};

export default StudentRequest;
