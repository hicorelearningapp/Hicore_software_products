import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, Check, Eye, Search } from "lucide-react";
import axios from "axios";

import bgImage from "../../../../assets/HostMockInterview/header-bg.jpg";
import innerImage from "../../../../assets/HostMockInterview/second-page-inner.png";
import DeclineModal from "./DeclineModal";
import AcceptModal from "./AcceptModal";

// ✅ API BASE (Vite Env or Proxy)
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const ViewMockInterviewRequests = () => {
  const navigate = useNavigate();

  // ✅ mentor id from localStorage
  const mentorId = Number(localStorage.getItem("userId"));

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isDeclineOpen, setIsDeclineOpen] = useState(false);
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // ✅ FETCH API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_BASE}/mentor/${mentorId}/sessions/requested`
        );

        console.log("✅ API Raw Response:", res.data);

        const sessionData = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        setRequests(sessionData);
      } catch (error) {
        console.error("❌ Error fetching requests:", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    if (mentorId) fetchRequests();
  }, [mentorId]);

  // ✅ MODAL HANDLERS
  const handleDeclineClick = (req) => {
    setSelectedRequest(req);
    setIsDeclineOpen(true);
  };

  const handleConfirmDecline = (feedback) => {
  console.log("Declined:", selectedRequest, feedback);

  // ✅ REMOVE DECLINED ROW FROM TABLE
  setRequests((prev) =>
    prev.filter((item) => item.id !== selectedRequest?.id)
  );

  setSelectedRequest(null);
  setIsDeclineOpen(false);
};


  const handleAcceptClick = (req) => {
    setSelectedRequest(req);
    setIsAcceptOpen(true);
  };

  const handleConfirmAccept = () => {
  console.log("Accepted:", selectedRequest);

  // ✅ REMOVE ACCEPTED ROW FROM TABLE
  setRequests((prev) =>
    prev.filter((item) => item.id !== selectedRequest?.id)
  );

  setSelectedRequest(null);
  setIsAcceptOpen(false);
};


  // ✅ SEARCH FILTER
  const filteredRequests = Array.isArray(requests)
    ? requests.filter((req) => {
        const query = searchQuery.toLowerCase();
        const student = req.student_profile || {};

        return (
          student.first_name?.toLowerCase().includes(query) ||
          student.last_name?.toLowerCase().includes(query) ||
          student.professional_title?.toLowerCase().includes(query) ||
          student.location?.toLowerCase().includes(query) ||
          req.session_type?.toLowerCase().includes(query)
        );
      })
    : [];

  // ✅ PAGINATION
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="w-full">
      {/* ✅ HEADER */}
      <div
        className="w-full bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16">
          <div className="max-w-2xl">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-[#2F2C79] font-medium mb-6 hover:underline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back
            </button>

            <h1 className="text-xl md:text-3xl font-bold text-[#2F2C79] mb-8">
              View Mock Interview Requests
            </h1>
            <p className="text-[#2F2C79] text-lg leading-loose mb-8">
              Browse and manage student requests for mock interviews.
            </p>
          </div>

          <div className="hidden md:block ml-10">
            <img
              src={innerImage}
              alt="Requests"
              className="w-[440px] h-[296px] object-cover"
            />
          </div>
        </div>
      </div>

      {/* ✅ TABLE */}
      <div className="max-w-8xl m-5 rounded-md p-10 py-10">
        <div className="border rounded-xl border-gray-300 p-6">

          {/* ✅ SEARCH */}
          <div className="relative w-full mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, title, location, session type..."
              className="w-full pl-12 pr-4 py-3 rounded-md border border-gray-200 bg-gray-50"
            />
          </div>

          <div className="overflow-x-auto">

  {/* SHOW EMPTY STATE IF NO DATA */}
  {!loading && filteredRequests.length === 0 ? (
    <div className="w-full py-20 flex flex-col items-center justify-center text-center">
      <Search className="h-10 w-10 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-blue-900">No Requests Found</h3>
      <p className="text-gray-500 text-sm mt-2 max-w-md">
        There are no mock interview requests at the moment. Please check back later.
      </p>
    </div>
  ) : (
    /* SHOW TABLE ONLY WHEN DATA EXISTS */
    <table className="w-full border-collapse border border-blue-900 text-left">
      <thead className="bg-gray-100">
        <tr className="text-center">
          <th className="p-3 border text-blue-900">Name</th>
          <th className="p-3 border text-blue-900">Professional Title</th>
          <th className="p-3 border text-blue-900">Email</th>
          <th className="p-3 border text-blue-900">Session Date</th>
          <th className="p-3 border text-blue-900">Session Type</th>
          <th className="p-3 border text-blue-900">Topic</th>
          <th className="p-3 border text-blue-900 text-center">Quick Actions</th>
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan="7" className="text-center py-6">Loading...</td>
          </tr>
        ) : (
          currentItems.map((req) => {
            const student = req.student_profile;
            return (
              <tr key={req.id} className="hover:bg-gray-50">

                <td className="p-3 border text-blue-900">
                  {student?.first_name} {student?.last_name}
                </td>

                <td className="p-3 border text-blue-900">
                  {student?.professional_title}
                </td>

                <td className="p-3 border text-blue-900">
                  {student?.email}
                </td>

                <td className="p-3 border text-blue-900">
                  {req.date} | {req.start_time}
                </td>

                <td className="p-3 border text-blue-900">
                  {req.session_type ?? "N/A"}
                </td>

                <td className="p-3 border text-blue-900">
                  {req.topic ?? "N/A"}
                </td>

                <td className="p-3 border text-blue-900">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleDeclineClick(req)}
                      className="bg-red-500 text-white p-2 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleAcceptClick(req)}
                      className="bg-green-500 text-white p-2 rounded-full"
                    >
                      <Check className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/candidate-profile/${req.student_profile?.user_id}`)
                      }
                      className="bg-blue-100 text-blue-600 p-2 rounded-full"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  )}
</div>
</div>
      </div>

      {/* ✅ MODALS */}
      <DeclineModal
  isOpen={isDeclineOpen}
  onClose={() => setIsDeclineOpen(false)}
  onConfirm={handleConfirmDecline}
  sessionId={selectedRequest?.id}   // ✅ THIS FIXES EVERYTHING
/>


     <AcceptModal
  isOpen={isAcceptOpen}
  onClose={() => setIsAcceptOpen(false)}
  onConfirm={handleConfirmAccept}
  sessionId={selectedRequest?.id}
/>


    </div>
  );
};

export default ViewMockInterviewRequests;
