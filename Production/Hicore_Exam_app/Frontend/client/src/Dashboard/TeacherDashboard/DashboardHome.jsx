import React, { useState } from "react";

/* ICONS FROM ASSETS */
import booksIcon from "../../assets/TeachersDashboard/book.png";
import classIcon from "../../assets/TeachersDashboard/Add.png";
import examIcon from "../../assets/TeachersDashboard/QuizQuestions.png";
import studentIcon from "../../assets/TeachersDashboard/Addstudent.png";
import messageIcon from "../../assets/TeachersDashboard/Message.png";
import clipboardIcon from "../../assets/TeachersDashboard/note.png";
import userIcon from "../../assets/TeachersDashboard/profile.png";
import bulbIcon from "../../assets/TeachersDashboard/bulb.png";

const DashboardHome = () => {
  const [showClassPopup, setShowClassPopup] = useState(false);

  const performanceData = [
    { subject: "Physics", avg: 90, top: 95 },
    { subject: "Chemistry", avg: 78, top: 89 },
    { subject: "Biology", avg: 85, top: 89 },
    { subject: "Maths", avg: 80, top: 85 },
    { subject: "English", avg: 75, top: 85 },
  ];

  const yAxisValues = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];

  return (
    <div className="w-full px-6 py-4 space-y-8">
      {/* ================= EXISTING UI (UNCHANGED) ================= */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2 bg-gradient-to-r from-[#F4F7FF] to-[#FFF6FB] border border-[#B0CBFE] rounded-2xl px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-[#001E58]">
              Welcome Back, Mr. Sharma
            </h2>
            <p className="text-sm text-[#001E58] mt-1">
              Manage exams, students, and communicate directly with parents.
            </p>
          </div>
          <img src={booksIcon} className="w-16 h-16" alt="books" />
        </div>

        <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 border bg-[#F6FFF8] border-[#B0CBFE] text-[#16A34A] rounded-2xl py-4 font-medium">
            <img src={classIcon} className="w-5 h-5" alt="class" />
            Create New Class
          </button>
          <button
            onClick={() => setShowClassPopup(true)}
            className="flex items-center justify-center gap-3 border border-[#B0CBFE] text-[#7C3AED] bg-[#FBF0FF] rounded-2xl py-4 font-medium"
          >
            <img src={examIcon} className="w-5 h-5" alt="exam" />
            Create New Exam
          </button>
          <button className="flex items-center justify-center gap-3 border border-[#B0CBFE] text-[#DC2626] bg-[#FFFAFA] rounded-2xl py-4 font-medium">
            <img src={studentIcon} className="w-5 h-5" alt="student" />
            Add Student
          </button>
          <button className="flex items-center justify-center gap-3 border border-[#B0CBFE] text-[#0D9488] bg-[#F6FFFE] rounded-2xl py-4 font-medium">
            <img src={messageIcon} className="w-5 h-5" alt="message" />
            Send Message
          </button>
        </div>
      </div>
      {showClassPopup && (
        <div className="fixed inset-0 z-40 h-full bg-black/40 overflow-y-auto">
          {/* CENTERING WRAPPER */}
          <div className="min-h-screen  flex items-center justify-center  px-4">
            {/* MODAL */}
            <div className="bg-white w-full max-w-3xl border border-[#B0CBFE] rounded-2xl p-8">
              {/* HEADER */}
              <div className="flex justify-between   items-center mb-8">
                <h3 className="text-lg font-semibold text-[#2758B3]">
                  Create New Exam
                </h3>
                <button
                  onClick={() => setShowClassPopup(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* FORM */}
              <div className="space-y-6">
                {/* EXAM TITLE */}
                <div>
                  <label className="text-sm text-[#2758B3] block mb-1">
                    Exam Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Physics Unit Test"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                  />
                </div>

                {/* ROW 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-[#2758B3] block mb-1">
                      Select Class
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm">
                      <option>Select option</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-[#2758B3] block mb-1">
                      Select Exam
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm">
                      <option>Select option</option>
                    </select>
                  </div>
                </div>

                {/* ROW 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-[#2758B3] block mb-1">
                      Select Subject
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm">
                      <option>Select option</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-[#2758B3] block mb-1">
                      Select Difficulty Level
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm">
                      <option>Select option</option>
                    </select>
                  </div>
                </div>

                {/* ROW 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-[#2758B3] block mb-1">
                      Enter Total Marks
                    </label>
                    <input
                      type="number"
                      placeholder="Total number of marks"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-[#2758B3] block mb-1">
                      Select Exam Date
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* QUESTION TYPE */}
                <div>
                  <label className="text-sm text-[#2758B3] block mb-1">
                    Select Question Types
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm">
                    <option>Select option</option>
                  </select>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="text-sm text-[#2758B3] block mb-1">
                    Description of the Exam
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Enter units or chapters covered in this exam"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm resize-none"
                  />
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-between mt-10">
                <button
                  onClick={() => setShowClassPopup(false)}
                  className="px-10 py-2 border border-[#2758B3] text-[#2758B3] rounded-full font-medium"
                >
                  Cancel
                </button>
                <button className="px-10 py-2 bg-[#2758B3] text-white rounded-full font-medium">
                  Create Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 border border-[#B0CBFE] rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/2">
              <h3 className="text-[#2758B3] font-semibold mb-4">
                Today’s Exams
              </h3>
              <div className="border border-dashed border-[#B0CBFE] rounded-xl p-6 space-y-6">
                {[
                  {
                    time: "10.00 AM",
                    title: "Physics Unit Test",
                    cls: "Class: 10A",
                  },
                  {
                    time: "11.00 AM",
                    title: "Chemistry Unit Test",
                    cls: "Class: 9A",
                  },
                  {
                    time: "03.00 PM",
                    title: "Chemistry Unit Test",
                    cls: "Class: 11A",
                  },
                ].map((e, i) => (
                  <div key={i} className="flex gap-6">
                    <p className="text-sm font-semibold text-[#2758B3] w-20">
                      {e.time}
                    </p>
                    <div>
                      <p className="text-sm font-semibold text-[#2758B3]">
                        {e.title}
                      </p>
                      <p className="text-sm text-gray-500">{e.cls}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/2 border border-[#B0CBFE] p-6 rounded-lg">
              <h3 className="text-[#2758B3] font-semibold mb-6">
                Upcoming Exams (This Week)
              </h3>
              <div className="space-y-6">
                {[
                  {
                    date: "Oct 18",
                    title: "Physics Unit Test",
                    info: "Class: 10A, Time: 10 AM",
                    days: "4 days",
                  },
                  {
                    date: "Oct 20",
                    title: "Chemistry Quiz",
                    info: "Class: 10B, Time: 10:30 AM",
                    days: "6 days",
                  },
                  {
                    date: "Oct 22",
                    title: "Biology Mock Exam",
                    info: "Class: 10C, Time: 9:00 AM",
                    days: "8 days",
                  },
                ].map((e, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <div className="bg-[#EEF4FF] rounded-lg px-4 py-2 text-[#2758B3] font-semibold">
                        {e.date}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#2758B3]">
                          {e.title}
                        </p>
                        <p className="text-xs text-gray-500">{e.info}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-red-50 text-red-500 px-4 py-1 rounded-full">
                      {e.days}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border border-[#B0CBFE] rounded-2xl p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-[#2758B3]">Exams Created</p>
                <p className="text-2xl font-semibold text-[#2758B3]">12</p>
                <p className="text-md text-blue-700 mb-3">Active Exams</p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ 15% vs last month
                </p>
              </div>
              <img src={clipboardIcon} className="w-8 h-8" alt="clipboard" />
            </div>
          </div>
          <div className="border border-[#B0CBFE] rounded-2xl p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-[#2758B3]">Students Enrolled</p>
                <p className="text-2xl font-semibold text-[#2758B3]">180</p>
                <p className="text-md text-blue-700 mb-3">Total Students</p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ 8% vs last month
                </p>
              </div>
              <img src={userIcon} className="w-8 h-8" alt="user" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= UPDATED PERFORMANCE OVERVIEW SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 border border-[#B0CBFE] rounded-2xl p-6 bg-white">
          <h3 className="text-[#2758B3] font-semibold mb-8 text-lg">
            Performance Overview
          </h3>

          <div className="relative h-72 flex items-end">
            {/* Y-AXIS LABELS AND GRID LINES */}
            <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400 pb-8">
              {yAxisValues.map((val) => (
                <div key={val} className="flex items-center w-full">
                  <span className="w-10 text-right pr-2">{val}%</span>
                  <div className="flex-1 border-t border-gray-100"></div>
                </div>
              ))}
              <div className="flex items-center w-full">
                <span className="w-10"></span>
                <div className="flex-1 border-t-2 border-[#45C6B5]"></div>
              </div>
            </div>

            {/* BARS CONTAINER */}
            <div className="relative flex-1 flex justify-around items-end ml-10 pb-8 h-full">
              {performanceData.map((d, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center group relative h-full justify-end"
                >
                  <div className="flex gap-2 items-end">
                    {/* Average Bar */}
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-[#45C6B5] font-medium mb-1">
                        {d.avg}%
                      </span>
                      <div
                        className="w-4 sm:w-6 bg-[#45C6B5] rounded-t-sm"
                        style={{ height: `${(d.avg / 100) * 200}px` }}
                      />
                    </div>
                    {/* Topper Bar */}
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-[#4A63E7] font-medium mb-1">
                        {d.top}%
                      </span>
                      <div
                        className="w-4 sm:w-6 bg-[#4A63E7] rounded-t-sm"
                        style={{ height: `${(d.top / 100) * 200}px` }}
                      />
                    </div>
                  </div>
                  {/* X-Axis Subject Labels */}
                  <p className="absolute -bottom-7 text-xs font-medium text-[#2758B3]">
                    {d.subject}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* LEGEND */}
          <div className="flex gap-8 ml-10 mt-10">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-[#4A63E7] rounded-md" />
              <p className="text-sm font-semibold text-[#2758B3]">
                Topper Percentage
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-[#45C6B5] rounded-md" />
              <p className="text-sm font-semibold text-[#2758B3]">
                Average Percentage
              </p>
            </div>
          </div>
        </div>

        {/* AI INSIGHT */}
        <div className="border border-[#B0CBFE] rounded-2xl p-6 bg-[#FFFEF4]">
          <div className="flex items-center gap-2 mb-4">
            <img src={bulbIcon} className="w-6 h-6" alt="bulb" />
            <h3 className="text-[#2758B3] font-semibold">AI Insight</h3>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-orange-500 leading-[32px] text-sm mb-2">
                Messages sent to parents improved class engagement by 12% this
                month.
              </p>
              <ul className="list-disc ml-4 text-[#2758B3] leading-[28px] space-y-2 text-sm">
                <li>
                  Students whose parents received performance updates showed
                  better attendance and homework completion.
                </li>
              </ul>
            </div>
            <div>
              <p className="text-orange-500 leading-[32px] text-sm mb-2">
                Messages sent to parents improved class engagement by 12% this
                month.
              </p>
              <ul className="list-disc ml-4 text-[#2758B3] leading-[28px] space-y-2 text-sm">
                <li>
                  Students whose parents received performance updates showed
                  better attendance and homework completion.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
