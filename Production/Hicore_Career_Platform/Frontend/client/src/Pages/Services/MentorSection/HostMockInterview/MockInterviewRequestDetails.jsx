import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileDown,
  User,
  Target,
  BookOpen,
  Calendar,
} from "lucide-react";

// ✅ Updated requests array with unique IDs
const requests = [
  {
    id: 1,
    name: "Aditi Verma",
    college: "Final Year Student – B.Sc. Data Science",
    role: "Data Analyst (Entry-Level)",
    skills: "Python, Excel, Tableau, SQL",
    focus: "SQL Queries, Data Visualization, Case Study Analysis",
    reason:
      "I want to improve my performance for upcoming campus placement interviews in August.",
    expectations: [
      "A real 30–45 min technical + HR round",
      "Immediate feedback on my answers",
      "Guidance on improving communication and confidence",
    ],
    mode: "Online (Zoom / Meet)",
    availability: [
      "Wednesday, 6–7 PM IST",
      "Friday, 10–11 AM IST",
      "Saturday, 4–5 PM IST",
    ],
    resumeLink: "#",
  },
  {
    id: 2,
    name: "Rohit Sharma",
    college: "3rd Year – B.Tech CSE",
    role: "Frontend Developer",
    skills: "React, JavaScript, TailwindCSS",
    focus: "UI Development, Debugging, Responsive Design",
    reason:
      "I want to practice technical interviews to prepare for summer internships.",
    expectations: [
      "Frontend coding challenges",
      "Feedback on code structure",
      "UI/UX improvement tips",
    ],
    mode: "Online (Google Meet)",
    availability: ["Tuesday, 5–6 PM IST", "Thursday, 11–12 AM IST"],
    resumeLink: "#",
  },
  {
    id: 3,
    name: "Sneha Patel",
    college: "2nd Year – MCA",
    role: "Backend Developer",
    skills: "Node.js, Express, MongoDB",
    focus: "API Development, Database Design",
    reason:
      "I want to prepare for backend interviews with real-time scenarios.",
    expectations: [
      "Database design questions",
      "API optimization",
      "Error handling best practices",
    ],
    mode: "Offline (In-person)",
    availability: ["Saturday, 2–3 PM IST"],
    resumeLink: "#",
  },
];

const MockInterviewRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // ✅ Find request by id (converted to number)
  const request = requests.find((req) => req.id === Number(id));

  if (!request) return <div className="p-10">Request not found</div>;

  const handleSend = () => {
    if (message.trim()) {
      alert(`Message sent to ${request.name}: ${message}`);
      setMessage("");
    }
  };

  return (
    <div className="p-20 max-w-8xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#2F2C79] font-medium mb-6 hover:underline"
      >
        <ArrowLeft className="mr-2 h-5 w-5" /> Back
      </button>

      <div className="border border-gray-200  p-8 rounded-lg  shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#2F2C79]">
            {request.name} Mock Interview Request
          </h1>
          <a
            href={request.resumeLink}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" /> Download Resume
          </a>
        </div>

        {/* Reason Section */}
        <div className="bg-white border border-gray-200 rounded-md p-4 mb-6 shadow">
          <h2 className="flex items-center gap-2 font-semibold text-[#2F2C79] mb-2">
            <BookOpen className="h-5 w-5" /> Reason for Mock Interview
          </h2>
          <p className="text-[#2F2C79]">{request.reason}</p>
        </div>

        {/* Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Role & Focus */}
          <div className="bg-yellow-50 border  border-gray-200 rounded-md p-4 shadow">
            <h2 className="flex items-center gap-2 font-semibold text-[#2F2C79] mb-2">
              <Target className="h-5 w-5" /> Role & Focus Area
            </h2>
            <ul className="list-disc ml-6 text-[#2F2C79]">
              <li>Requested Role: {request.role}</li>
              <li>Focus Area: {request.focus}</li>
            </ul>
          </div>

          {/* Student Background */}
          <div className="bg-green-50 border border-gray-200 rounded-md p-4 shadow">
            <h2 className="flex items-center gap-2 font-semibold text-[#2F2C79] mb-2">
              <User className="h-5 w-5" /> Student Background
            </h2>
            <p className="text-[#2F2C79]">Name: {request.name}</p>
            <p className="text-[#2F2C79]">Status: {request.college}</p>
            <p className="text-[#2F2C79]">Skills: {request.skills}</p>
          </div>
        </div>

        {/* Expectations + Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Expectations */}
          <div className="bg-orange-50 border border-gray-200 rounded-md p-4 shadow">
            <h2 className="flex items-center gap-2 font-semibold text-[#2F2C79] mb-2">
              <BookOpen className="h-5 w-5" /> Expectations from Mentor
            </h2>
            <ul className="list-disc text-[#2F2C79] ml-6 ">
              {request.expectations.map((exp, idx) => (
                <li key={idx}>{exp}</li>
              ))}
            </ul>
          </div>

          {/* Mode & Availability */}
          <div className="bg-purple-50 border border-gray-200 rounded-md p-4 shadow">
            <h2 className="flex items-center gap-2 font-semibold text-[#2F2C79] mb-2">
              <Calendar className="h-5 w-5" /> Preferred Mode & Availability
            </h2>
            <p className="text-[#2F2C79]">
              <strong>Mode:</strong> {request.mode}
            </p>
            <p className="mt-1 mb-1 text-[#2F2C79]">Suggested Slots:</p>
            <div className="space-y-1 text-[#2F2C79]">
              {request.availability.map((slot, idx) => (
                <div key={idx}>{slot}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Box */}
        <h2 className="font-semibold text-[#2F2C79] mb-2">
          Send a message to candidate (optional)
        </h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a feedback note / suggestions to improve / appreciation note..."
          className="w-full border border-gray-200 rounded-md p-3 text-gray-700 focus:outline-none focus:ring focus:ring-[#2F2C79]"
          rows={3}
        />
        <button
          onClick={handleSend}
          className="mt-3 bg-[#2F2C79] hover:bg-[#221d5e] text-white px-5 py-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MockInterviewRequestDetails;
