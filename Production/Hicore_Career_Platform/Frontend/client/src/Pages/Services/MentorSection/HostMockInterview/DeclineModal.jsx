import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const DeclineModal = ({ isOpen, onClose, onConfirm, sessionId }) => {
  const [feedback, setFeedback] = useState("");
  const [declined, setDeclined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // ✅ SUCCESS MESSAGE

  useEffect(() => {
    if (declined) {
      // ✅ AUTO CLOSE AFTER 2 SECONDS
      const timer = setTimeout(() => {
        setDeclined(false);
        setSuccessMsg("");
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [declined, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!sessionId) {
      setError("Session ID missing");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.patch(
        `${API_BASE}/mentor/session/${sessionId}/reject`,
        {
          feedback: feedback || "Declined by mentor",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Reject Response:", res.data);

      // ✅ SHOW SUCCESS MESSAGE
      setSuccessMsg("Mock interview request rejected successfully!");
      onConfirm?.(feedback);
      setDeclined(true);
    } catch (err) {
      console.error("❌ Reject failed:", err);
      setError(
        err.response?.data?.message || "Failed to decline request. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/10 z-50">
      <div className="bg-white p-10 rounded-lg border-gray-100 shadow max-w-2xl w-full">

        {!declined ? (
          // ✅ CONFIRM SCREEN
          <div className="bg-white rounded-lg border border-gray-300 p-6">
            <h2 className="text-lg font-bold text-center text-red-600 mb-4">
              Confirm Decline Request
            </h2>

            <p className="text-gray-700 text-sm mb-4 text-center">
              Are you sure you want to decline this mock interview request?
            </p>

            {error && (
              <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border rounded-md text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-4 py-2 bg-indigo-900 text-white rounded-md flex items-center gap-2"
              >
                {loading && <Loader className="h-4 w-4 animate-spin" />}
                {loading ? "Declining..." : "Confirm Decline"}
              </button>
            </div>
          </div>
        ) : (
          // ✅ SUCCESS NOTIFICATION SCREEN
          <div className="bg-white rounded-lg border border-gray-300 p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-green-700 mb-2">
              Successfully Rejected!
            </h2>

            <p className="text-blue-900 mb-4">
              {successMsg || "The request has been rejected successfully."}
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm flex items-start gap-2 mb-6">
              <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-600" />
              <p>The student has been notified.</p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-indigo-900 text-white rounded-md"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DeclineModal;
