import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import menteeIcon from "../../../../assets/MentoDashboardLayout/MenteeDashboard/mentee-icon.png";
import viewIcon from "../../../../assets/MentoDashboardLayout/MenteeDashboard/view.png";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";
const tabs = ["Active Mentees", "New Requests"];

const MenteeDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [apiRequests, setApiRequests] = useState([]);
  const [activeMentees, setActiveMentees] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingActive, setLoadingActive] = useState(false);

  const navigate = useNavigate();
  const mentorId = localStorage.getItem("userId");

  /* ✅ FETCH ACTIVE MENTEES */
  useEffect(() => {
    if (activeTab !== 0 || !mentorId) return;

    const fetchActiveMentees = async () => {
      try {
        setLoadingActive(true);
        const res = await axios.get(
          `${API_BASE}/api/mentor/${mentorId}/active-mentees`
        );
        setActiveMentees(res.data || []);
      } catch (error) {
        console.error("ACTIVE MENTEES API ERROR:", error);
      } finally {
        setLoadingActive(false);
      }
    };

    fetchActiveMentees();
  }, [activeTab, mentorId]);

  /* ✅ FETCH NEW REQUESTS */
  useEffect(() => {
    if (activeTab !== 1 || !mentorId) return;

    const fetchRequests = async () => {
      try {
        setLoadingRequests(true);
        const res = await axios.get(
          `${API_BASE}/api/mentor/${mentorId}/new-requests`
        );
        setApiRequests(res.data || []);
      } catch (error) {
        console.error("REQUEST API ERROR:", error);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchRequests();
  }, [activeTab, mentorId]);

  /* ✅ ACCEPT */
  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.post(
        `${API_BASE}/api/mentor/${mentorId}/accept/${requestId}`
      );

      setApiRequests((prev) =>
        prev.filter((req) => req.request_id !== requestId)
      );

      alert("Request accepted ✅");
    } catch (error) {
      console.error("ACCEPT ERROR:", error);
      alert("Failed to accept ❌");
    }
  };

  /* ✅ REJECT */
  const handleRejectRequest = async (requestId) => {
    try {
      await axios.post(
        `${API_BASE}/api/mentor/${mentorId}/reject/${requestId}`
      );

      setApiRequests((prev) =>
        prev.filter((req) => req.request_id !== requestId)
      );

      alert("Request rejected ✅");
    } catch (error) {
      console.error("REJECT ERROR:", error);
      alert("Failed to reject ❌");
    }
  };

  /* ✅ VIEW STUDENT PROFILE */
  const handleViewProfile = (studentId) => {
    if (!studentId) {
      alert("Student profile not available");
      return;
    }
    navigate(`/candidate-profile/${studentId}`);
  };

  /* ✅ ACTIVE MENTEES UI */
  const renderActiveMentees = () => {
    if (loadingActive)
      return <p className="text-center text-gray-500">Loading mentees...</p>;

    if (activeMentees.length === 0)
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <img src={menteeIcon} className="w-12 h-12 mb-3 opacity-60" />
          <p className="text-gray-500">No mentees available now</p>
        </div>
      );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeMentees.map((req) => (
          <div
            key={req.request_id}
            className="bg-white border border-gray-300 rounded-lg shadow-sm p-4"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-sm">
                  {req.student?.email}
                </h3>
                <p className="text-xs text-gray-500 capitalize">
                  {req.student?.role}
                </p>
              </div>

              <img
                src={viewIcon}
                className="w-5 h-5 cursor-pointer"
                onClick={() => handleViewProfile(req.student?.id)}
              />
            </div>

            <div className="mt-4">
              <h4 className="text-[#343079] font-bold">
                {req.project?.title}
              </h4>
              <p className="text-sm text-gray-600">
                <b>Domain:</b> {req.project?.domain}
              </p>
              <p className="text-sm text-gray-600">
                <b>Tech Stack:</b>{" "}
                {req.project?.techStack?.join(", ")}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Status: {req.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  /* ✅ REQUESTS UI */
  const renderRequests = () => {
    if (loadingRequests)
      return <p className="text-center text-gray-500">Loading requests...</p>;

    if (apiRequests.length === 0)
      return (
        <p className="text-center text-gray-500">
          No mentee requests available
        </p>
      );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apiRequests.map((req) => (
          <div
            key={req.request_id}
            className="bg-white border border-gray-300 rounded-lg shadow-sm p-4"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">
                  {req.student?.email}
                </h3>
                <p className="text-xs text-gray-500 capitalize">
                  {req.student?.role}
                </p>
              </div>

              <img
                src={viewIcon}
                className="w-5 h-5 cursor-pointer"
                onClick={() => handleViewProfile(req.student?.id)}
              />
            </div>

            <div className="mt-4">
              <h4 className="text-[#343079] font-bold">
                {req.project?.title}
              </h4>
              <p className="text-sm text-gray-600">
                <b>Domain:</b> {req.project?.domain}
              </p>
              <p className="text-sm text-gray-600">
                <b>Tech Stack:</b>{" "}
                {req.project?.techStack?.join(", ")}
              </p>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => handleAcceptRequest(req.request_id)}
                className="flex-1 bg-[#343079] text-white py-2 rounded-md"
              >
                Accept
              </button>

              <button
                onClick={() => handleRejectRequest(req.request_id)}
                className="flex-1 border border-[#343079] text-[#343079] py-2 rounded-md"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* ✅ TABS */}
      <div className="flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 ${
              activeTab === index
                ? "text-white bg-blue-900"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="border border-blue-900 rounded-b-lg p-10 min-h-screen">
        {activeTab === 0 ? renderActiveMentees() : renderRequests()}
      </div>
    </div>
  );
};

export default MenteeDashboard;
