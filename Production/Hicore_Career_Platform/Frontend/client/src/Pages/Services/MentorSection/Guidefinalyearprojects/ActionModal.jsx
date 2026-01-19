import React, { useState } from "react";
import tickIcon from '../../../../assets/GuideFinalyearproject/full-tick.png';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const ActionModal = ({
  show,
  type, 
  onClose,
  requestId,          // ⬅️ Added
  declineNote,
  setDeclineNote,
  refreshList         // ⬅️ Parent can refresh API list after action
}) => {

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDecline = type === "decline";
  const navigate = useNavigate();

  const mentorId = localStorage.getItem("userId");

  if (!show) return null;

  /* ------------------- API CALL HANDLER ------------------- */
  const handleConfirm = async () => {
    if (!mentorId || !requestId) {
      console.error("Missing mentorId or requestId");
      return;
    }

    try {
      setLoading(true);

      if (isDecline) {
        // ❌ REJECT API
        await axios.post(`${API_BASE}/api/mentor/${mentorId}/reject/${requestId}`, {
          note: declineNote || ""
        });
      } else {
        // ✅ ACCEPT API
        await axios.post(`${API_BASE}/api/mentor/${mentorId}/accept/${requestId}`);
      }

      setShowConfirmation(true);

      // refresh parent list
      if (refreshList) refreshList();

    } catch (error) {
      console.error("API ERROR:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setShowConfirmation(false);
  };

  const handleNavigate = (path) => {
    handleClose();
    navigate(path);
  };

  /* ------------------- SUCCESS POPUPS ------------------- */

  const AcceptedPopup = () => (
    <div className="w-[570px] p-9 flex flex-col items-center gap-9 border rounded-lg bg-white shadow-xl text-center">
      <img src={tickIcon} alt="Tick Icon" className="w-[72px] h-[72px]" />
      <h2 className="text-[#343079] font-bold text-2xl">Accepted Successfully</h2>
      <p className="text-[#343079] text-base">
        This project has been added to your Mentorship List. Students have been notified.
      </p>

      <button
        className="px-4 py-2 bg-[#4631A1] text-white rounded-lg w-[205px] h-[40px]"
        onClick={() => handleNavigate("/mentor-dashboard/mentees")}
      >
        View My Mentorship List
      </button>
    </div>
  );

  const DeclinedPopup = () => (
    <div className="w-[570px] p-9 flex flex-col items-center gap-9 border rounded-lg bg-white shadow-xl text-center">
      <img src={tickIcon} alt="Tick Icon" className="w-[72px] h-[72px]" />
      <h2 className="text-[#343079] font-bold text-2xl">Declined Successfully</h2>
      <p className="text-[#343079] text-base">
        The student has been notified.
      </p>

      <button
        className="px-4 py-2 bg-[#4631A1] text-white rounded-lg w-[205px] h-[40px]"
        onClick={handleClose}
      >
        Close
      </button>
    </div>
  );

  /* ------------------- MAIN UI ------------------- */

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {showConfirmation ? (
        isDecline ? <DeclinedPopup /> : <AcceptedPopup />
      ) : (
        <div className="bg-white p-9 rounded-lg shadow-xl w-[570px] flex flex-col gap-9">

          <div className="w-[498px] p-9 border rounded-lg flex flex-col gap-9 text-center">

            <h2
              className={`text-2xl font-bold ${
                isDecline ? "text-[#FF0000]" : "text-[#343079]"
              }`}
            >
              {isDecline ? "Confirm Decline Request" : "Confirm Accept Request"}
            </h2>

            {isDecline ? (
              <p className="text-[#343079] text-base text-left">
                Are you sure you want to decline this request? The student will be notified.
              </p>
            ) : (
              <p className="text-[#343079] text-base text-left">
                You are about to accept this student/group for mentorship. They will be notified.
              </p>
            )}

            {/* BUTTONS */}
            <div className="w-full flex justify-center gap-4 mt-6">
              <button
                disabled={loading}
                className={`px-4 py-2 rounded-lg w-[205px] h-[40px] text-white ${
                  isDecline ? "bg-[#343079]" : "bg-[#4631A1]"
                }`}
                onClick={handleConfirm}
              >
                {loading ? "Processing..." : isDecline ? "Confirm Decline" : "Confirm & Accept"}
              </button>

              <button
                className="px-4 py-2 rounded-lg border border-[#282655] text-[#282655] w-[205px] h-[40px]"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ActionModal;
