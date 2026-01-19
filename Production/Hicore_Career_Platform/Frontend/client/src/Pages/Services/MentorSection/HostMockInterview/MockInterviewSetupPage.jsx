import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../../../assets/HostMockInterview/header-bg.jpg";
import innerImage from "../../../../assets/HostMockInterview/second-page-inner.png";
import { ArrowLeft, Lightbulb, CheckCircle } from "lucide-react";

const MockInterviewSetupPage = () => {
  const navigate = useNavigate();

  // State
  const [interviewType, setInterviewType] = useState("");
  const [role, setRole] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // ✅ Added

  // Format date nicely
  const formatDate = (d) => {
    if (!d) return "";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    return new Date(d).toLocaleDateString("en-US", options);
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div
        className="w-full bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16">
          {/* Left Section */}
          <div className="max-w-2xl">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-[#2F2C79] font-medium mb-6 hover:underline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back
            </button>

            <h1 className="text-xl md:text-3xl font-bold text-[#2F2C79] mb-8">
              Set Up Your Mock Interview
            </h1>
            <p className="text-[#2F2C79] text-lg leading-relaxed mb-8">
              Set the key details – from interview type and focus area to
              duration and schedule – and create a mock interview session that
              your mentees can easily join to practice and prepare for
              real-world opportunities.
            </p>
          </div>

          {/* Right Image */}
          <div className="hidden md:block ml-10">
            <img
              src={innerImage}
              alt="Handshake"
              className="w-[440px] h-[296px] object-cover"
            />
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-8xl m-10 rounded-md p-10 py-12">
        <div className="flex">
          <button className="px-6 py-3 text-sm font-medium text-white bg-[#2F2C79] rounded-t-md">
            Setup Mock Interview
          </button>
          <button
            onClick={() => navigate("/view-mock-interview-setup")}
            className="px-6 py-3 text-sm font-medium text-[#2F2C79] bg-gray-100 hover:bg-blue-900 hover:text-white rounded-t-md ml-2"
          >
            View Mock Interview Requests
          </button>
        </div>

        <div className="border rounded-xl border-gray-300 p-10">
          {/* Step 1 */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#2F2C79] mb-3">
              Step 1 – Choose Interview Type
            </h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="interviewType"
                  className="accent-[#2F2C79]"
                  value="One-on-One"
                  onChange={(e) => setInterviewType(e.target.value)}
                />
                <span className="text-blue-900">One-on-One</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="interviewType"
                  className="accent-[#2F2C79]"
                  value="Panel (2–3 mentees)"
                  onChange={(e) => setInterviewType(e.target.value)}
                />
                <span className="text-blue-900">Panel (2–3 mentees)</span>
              </label>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#2F2C79] mb-3">
              Step 2 – Choose Role / Focus Area
            </h3>
            <select
              className="md:w-80 border text-blue-900 border-blue-900 rounded-md p-3"
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Select option</option>
              <option>Frontend Developer</option>
              <option>UI/UX Designer</option>
              <option>Data Analyst</option>
              <option>Operating Systems</option>
              <option>Web Development</option>
            </select>
          </div>

          {/* Step 3 */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#2F2C79] mb-3">
              Step 3 – Set Duration Time
            </h3>
            <div className="space-y-2">
              {["30 min", "45 min", "60 min"].map((d) => (
                <label key={d} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="duration"
                    className="accent-[#2F2C79]"
                    value={d}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                  <span className="text-blue-900">{d}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Step 4 */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#2F2C79] mb-3">
              Step 4 – Set Schedule
            </h3>
            <input
              type="datetime-local"
              className="border border-blue-900 rounded-md p-3 text-gray-700 w-70"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Step 5 */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#2F2C79] mb-3">
              Step 5 – Add Notes (Optional)
            </h3>
            <textarea
              className="w-full md:w-220 border border-blue-900 rounded-md p-3 text-gray-700"
              rows="3"
              placeholder="Add preparation instructions or areas of focus (e.g., coding, HR, system design)."
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          {/* Info Box */}
          <div className="flex items-center bg-green-100 text-green-800 p-4 rounded-md mb-8">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
            <p>
              Hosting this interview adds <b>+20 Mentorship Points</b> to your
              profile and increases your visibility in the Top Mentor Spotlight
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowPreview(true)}
              className="px-6 py-2 rounded-md border text-[#2F2C79] hover:bg-gray-50"
            >
              Preview
            </button>
            <button
              onClick={() => setShowSuccess(true)} // ✅ Updated
              className="px-6 py-2 rounded-md bg-[#2F2C79] text-white hover:bg-[#24205f]"
            >
              Confirm & Publish
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm z-50">
          <div className=" w-full border border-gray-200 rounded bg-white rounded-lg max-w-lg p-10">
            <div className="bg-white rounded-lg p-8 border border-blue-900 max-w-lg w-full">
              <div className="space-y-3 text-[#2F2C79]">
                <p>
                  Type: <b>{interviewType || "N/A"}</b>
                </p>
                <p>
                  Role: <b>{role || "N/A"}</b>
                </p>
                <p>
                  Duration: <b>{duration || "N/A"}</b>
                </p>
                <p>
                  Date/Time: <b>{date ? formatDate(date) : "N/A"}</b>
                </p>
                <p>
                  Notes: <b>{notes || "N/A"}</b>
                </p>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-2 rounded-md bg-[#2F2C79] text-white hover:bg-[#24205f]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className=" w-full rounded bg-white rounded-lg max-w-3xl p-10">
            <div className="bg-white rounded-lg p-10  max-w-3xl w-full border border-gray-300">
              <div className="flex justify-center mb-6">
                <CheckCircle className="text-green-500 h-16 w-16" />
              </div>

              <h2 className="text-3xl font-bold text-green-600 text-center mb-6">
                Your Mock Interview is Live! 🎉
              </h2>
              <p className="text-center text-lg text-blue-900 mb-6">
                Your session has been successfully created. Mentees can now view
                and join this interview slot to practice and learn from your
                guidance.
              </p>

              <div className="bg-green-50  rounded-md p-4 mb-6 text-green-800">
                <ul className="space-y-2">
                  <li>
                    ⭐ You’ve earned <b>+20 Mentorship Points</b>.
                  </li>
                  <li>
                    ⭐ This session boosts your visibility in the Top Mentor
                    Spotlight.
                  </li>
                  <li>
                    ⭐ Keep hosting interviews to unlock new badges and
                    recognition.
                  </li>
                </ul>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setInterviewType("");
                    setRole("");
                    setDuration("");
                    setDate("");
                    setNotes("");
                  }}
                  className="px-6 py-2 rounded-md bg-[#2F2C79] text-white hover:bg-[#24205f]"
                >
                  Host Another Interview
                </button>
                <button
                  onClick={() => navigate("/scheduled-interviews")}
                  className="px-6 py-2 rounded-md border border-[#2F2C79] text-[#2F2C79] hover:bg-gray-50"
                >
                  View Scheduled Interviews
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterviewSetupPage;
