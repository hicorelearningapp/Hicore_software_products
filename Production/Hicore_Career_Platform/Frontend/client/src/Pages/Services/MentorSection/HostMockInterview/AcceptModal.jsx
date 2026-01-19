import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const AcceptModal = ({ isOpen, onClose, sessionId, onConfirm }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ AUTO CLOSE AFTER SUCCESS
  useEffect(() => {
    if (confirmed) {
      const timer = setTimeout(() => {
        setConfirmed(false);
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [confirmed, onClose]);

  if (!isOpen) return null;

  const handleAccept = async () => {
    if (!sessionId) {
      setError("Session ID missing");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.patch(
        `${API_BASE}/mentor/session/${sessionId}/accept`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Accept Response:", res.data);

      setConfirmed(true);        // ✅ SHOW SUCCESS SCREEN
      onConfirm?.();             // ✅ INFORM PARENT TO REMOVE ROW
    } catch (err) {
      console.error("❌ Accept failed:", err);
      setError(
        err.response?.data?.message || "Failed to accept request. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/10 z-50">
      <div className="bg-white p-10 rounded-lg border-gray-100 shadow max-w-2xl w-full">
        <div className="bg-white rounded-lg border border-gray-300 p-6">

          {!confirmed ? (
            <>
              <h2 className="text-xl font-bold text-center text-green-600 mb-4">
                Confirm Acceptance
              </h2>

              <p className="text-blue-900 text-md mb-6 text-center">
                Are you sure you want to accept this mock interview request?{" "}
                <br />
                Once confirmed, the student will be notified, and the session
                will be added to your upcoming interviews.
              </p>

              {error && (
                <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
              )}

              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleAccept}
                  disabled={loading}
                  className="px-6 py-2 bg-[#4631A1] text-white rounded-md hover:bg-indigo-700"
                >
                  {loading ? "Accepting..." : "Confirm & Accept"}
                </button>

                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-2 border rounded-md text-gray-700 border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 flex items-center justify-center bg-green-100 rounded-full mb-4">
                  <span className="text-green-600 text-4xl">✔</span>
                </div>

                <h2 className="text-xl font-bold text-green-600 mb-2">
                  Mock Interview Confirmed! 🎉
                </h2>

                <p className="text-blue-900 text-md mb-4">
                  You’ve successfully accepted this request. The student has
                  been notified, and the interview has been added to your
                  upcoming sessions.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-6 text-green-700 text-sm">
                  ⭐ Every mock interview you host strengthens your mentorship
                  profile and helps students face real-world hiring challenges
                  with confidence.
                </div>

                <div className="flex justify-center space-x-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-[#4631A1] text-white rounded-md hover:bg-indigo-700"
                  >
                    Add to Calendar
                  </button>

                  <button
                    onClick={onClose}
                    className="px-6 py-2 border rounded-md text-gray-700 border-gray-300 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default AcceptModal;
