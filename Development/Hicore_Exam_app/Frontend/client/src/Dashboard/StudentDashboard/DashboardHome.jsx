import React from "react";

/* ASSETS */
import booksImg from "../../assets/StudentDashboard/StudentDashHome/book.png";
import neetIcon from "../../assets/StudentDashboard/StudentDashHome/doctor.png";
import cbseIcon from "../../assets/StudentDashboard/StudentDashHome/bag.png";
import playIcon from "../../assets/StudentDashboard/StudentDashHome/Play.png";
import reviseIcon from "../../assets/StudentDashboard/StudentDashHome/Revise.png";
import practiceIcon from "../../assets/StudentDashboard/StudentDashHome/Practice.png";

/* NEW ASSETS */
import clockIcon from "../../assets/StudentDashboard/StudentDashHome/Time.png";
import examIcon from "../../assets/StudentDashboard/StudentDashHome/quiz.png";
import weakIcon from "../../assets/StudentDashboard/StudentDashHome/Target.png";
import strongIcon from "../../assets/StudentDashboard/StudentDashHome/Idea.png";
import arrowRight from "../../assets/StudentDashboard/StudentDashHome/right-arrow.png";


const DashboardHome = () => {
  return (
    <div className="space-y-10">
      {/* ================= EXISTING UI (UNCHANGED) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* LEFT SECTION */}
        <div className="h-[470px] overflow-y-auto scrollbar-hide space-y-6">
          <div className="bg-gradient-to-r from-[#FFEDFC] to-white border border-[#B0CBFE] rounded-2xl p-6 flex justify-between items-center shadow-sm">
            <div>
              <h2 className="text-2xl font-semibold text-[#0B1C4D]">
                Welcome Back, Aashritha
              </h2>
              <p className="mt-2 text-[#4B5D8A]">
                Ready to ace your learning today?
              </p>
            </div>
            <img src={booksImg} alt="Books" className="w-28 object-contain" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* NEET */}
            <div className="bg-gradient-to-b from-[#FFFAD4] to-[#FFFFFF] rounded-2xl p-6 shadow-md shadow-gray-400">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <img src={neetIcon} alt="NEET" className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-[#0B1C4D]">
                  NEET EXAM
                </h3>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>50%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-1/2" />
                </div>
                <p className="mt-3 text-sm text-[#4B5D8A]">
                  6 units completed, 1 unit in-progress
                </p>
              </div>

              <button className="mt-6 w-full bg-[#2758B3] text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2">
                Continue Learning
                <img src={arrowRight} alt="arrow" className="w-4 h-4" />
              </button>
            </div>

            {/* CBSE */}
            <div className="bg-gradient-to-b from-[#F0EBFF] to-white rounded-2xl p-6 shadow-md shadow-gray-400">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <img src={cbseIcon} alt="CBSE" className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-[#0B1C4D]">
                  CBSE Class 12 Board
                </h3>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>50%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-1/2" />
                </div>
                <p className="mt-3 text-sm text-[#4B5D8A]">
                  6 units completed, 1 unit in-progress
                </p>
              </div>

              <button className="mt-6 w-full bg-[#2758B3] text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2">
                Continue Learning
                <img src={arrowRight} alt="arrow" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="h-[460px] bg-white rounded-2xl shadow border border-[#BFD1FF] flex flex-col">
          {/* FIXED HEADER */}
          <div className="p-6 border-b border-[#BFD1FF]">
            <h3 className="text-lg font-semibold text-[#2758B3]">
              Today’s Activities
            </h3>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="p-6 overflow-y-auto scrollbar-hide flex-1">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border border-[#BFD1FF] rounded-xl p-3">
                <img src={reviseIcon} alt="Revise" className="w-5 h-5" />
                <span className="text-[#2758B3]">
                  Revise Organic Chemistry – Alkanes
                </span>
              </div>

              <div className="flex items-center gap-3 border border-[#BFD1FF] rounded-xl p-3">
                <img src={playIcon} alt="Watch" className="w-5 h-5" />
                <span className="text-[#2758B3]">
                  Watch YouTube: Probability Basics (15 mins)
                </span>
              </div>

              <div className="flex items-center gap-3 border border-[#BFD1FF] rounded-xl p-3">
                <img src={practiceIcon} alt="Practice" className="w-5 h-5" />
                <span className="text-[#2758B3]">
                  Attempt AI Practice Test – Algebra (20 Qs)
                </span>
              </div>
            </div>

            <h4 className="mt-6 font-semibold text-[#2758B3]">
              Upcoming Activities (This Week)
            </h4>

            <ul className="mt-3 space-y-2 text-sm text-[#2758B3] list-disc list-inside">
              <li>Finish Biology Unit 3 Notes (PDF)</li>
              <li>Revise Physics Numerical Problems – Kinematics</li>
              <li>Finish Biology Unit 3 Notes (PDF)</li>
              <li>Revise Physics Numerical Problems – Kinematics</li>
              <li>Finish Biology Unit 3 Notes (PDF)</li>
              <li>Revise Physics Numerical Problems – Kinematics</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================= NEW FEATURE (ADDED BELOW) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ONGOING EXAMS */}
        <div className="bg-white rounded-2xl border border-[#BFD1FF] p-6 space-y-6">
          <h3 className="text-lg font-semibold text-[#2758B3]">
            Ongoing Exams
          </h3>

          <div
            className="rounded-xl p-4 flex items-center gap-4"
            style={{
              background: "linear-gradient(90deg, #E6EEFF 0%, #FFFFFF 75%)",
              border: "1px dotted #B0CBFE",
            }}
          >
            <div className="w-12 h-12 bg-[#F2F6FF] rounded-lg flex items-center justify-center">
              <img src={clockIcon} alt="Time" className="w-8 h-8" />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-[#2758B3]">Math Practice Test</p>

              <div className="flex justify-between text-sm mt-1 text-[#2758B3]">
                <span>Progress</span>
                <span>50%</span>
              </div>

              <div className="w-full bg-gray-300 h-2 rounded-full mt-1">
                <div className="bg-green-600 h-2 w-1/2 rounded-full" />
              </div>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-[#2758B3]">
            Upcoming Exams (This Week)
          </h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* ICON WITH BG */}
                <div className="w-14 h-14 rounded-lg bg-[#E9EEF7] flex items-center justify-center">
                  <img src={examIcon} className="w-8 h-8" />
                </div>

                <div>
                  <p className="font-medium text-[#2758B3] mb-1">Physics</p>
                  <p className="text-sm  text-[#2758B3]">Sep 30, 10 AM</p>
                </div>
              </div>

              <span className="text-xs bg-red-100 text-red-500 px-3 py-1 rounded-full">
                4 days
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* ICON WITH BG */}
                <div className="w-14 h-14 rounded-lg bg-[#E9EEF7] flex items-center justify-center">
                  <img src={examIcon} className="w-8 h-8" />
                </div>

                <div>
                  <p className="font-medium text-[#2758B3] mb-1">
                    Chemistry Quiz
                  </p>
                  <p className="text-sm  text-[#2758B3]">Oct 2, 1 PM</p>
                </div>
              </div>

              <span className="text-xs bg-red-100 text-red-500 px-3 py-1 rounded-full">
                6 days
              </span>
            </div>
          </div>
        </div>

        {/* ANALYTICS */}
        <div className="bg-white rounded-2xl border border-[#BFD1FF] p-6 space-y-6">
          <h3 className="text-lg font-semibold text-[#2758B3]">Analytics</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FFF3F3] rounded-xl p-6">
              <div className="flex items-center gap-2 font-semibold text-red-500">
                <img src={weakIcon} className="w-5 h-5" />
                Weak Areas
              </div>
              <ul className="mt-4 space-y-3 text-[#2758B3] text-sm">
                <li>• Dimensional Analysis</li>
                <li>• Significant Figures</li>
                <li>• Significant Figures</li>
                <li>• Significant Figures</li>
              </ul>
            </div>

            <div className="bg-[#EFFFF1] rounded-xl p-6">
              <div className="flex items-center gap-2 font-semibold text-green-600">
                <img src={strongIcon} className="w-5 h-5" />
                Strong Areas
              </div>
              <ul className="mt-4 space-y-3 text-[#2758B3] text-sm">
                <li>• Dimensional Analysis</li>
                <li>• Dimensional Analysis</li>
                <li>• Dimensional Analysis</li>
                <li>• Dimensional Analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
