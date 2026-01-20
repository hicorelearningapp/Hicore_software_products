import React from "react";

/* ICONS & IMAGES */
import examIcon from "../../assets/StudentDashboard/StudentDashHome/doctor.png";
import bagIcon from "../../assets/StudentDashboard/StudentDashHome/bag.png";
import calendarIcon from "../../assets/StudentDashboard/StudentDashHome/Calendar.png";
import clockIcon from "../../assets/StudentDashboard/StudentDashHome/Time.png";
import durationIcon from "../../assets/StudentDashboard/StudentDashHome/Timer.png";
import modeIcon from "../../assets/StudentDashboard/StudentDashHome/Topic.png";

const enrolledExamData = [
  {
    id: 1,
    examTitle: "NEET EXAM",
    icon: examIcon,
    subjects: "Physics, Chemistry, Biology",
    progress: 60,
    unitsCompleted: 9,
    unitsInProgress: 2,
    examYear: "NEET 2026",
    countdown: { days: 180, hours: 10, minutes: 12, seconds: "05" },
    examDate: "June 20, 2026",
    time: "10.00AM to 1.00PM IST",
    duration: "3 hour",
    mode: "Offline",
  },
  {
    id: 2,
    examTitle: "CBSE Class 12 Board",
    icon: bagIcon,
    subjects: "Physics, Chemistry, English, Maths",
    progress: 50,
    unitsCompleted: 6,
    unitsInProgress: 1,
    examYear: "CBSE Class 12 Board",
    countdown: { days: 219, hours: 22, minutes: 7, seconds: "00" },
    examDate: "May 14, 2026",
    time: "2.00PM to 5.00PM IST",
    duration: "3 hour",
    mode: "Offline",
  },
];

const EnrolledExams = () => {
  return (
    <div className="space-y-16">
      {enrolledExamData.map((exam, index) => {
        const isEven = (index + 1) % 2 === 0;

        return (
          <div key={exam.id} className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
              {/* LEFT CARD */}
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  border: isEven ? "1px solid #B0CBFE" : "1px solid #BFD6FF",
                  background: isEven
                    ? "linear-gradient(180deg, #F0EBFF 0%, #FFFFFF 100%)"
                    : "white",
                }}
              >
                {/* TOP BAR */}
                <div
                  className="flex items-center gap-3 justify-center py-6"
                  style={{
                    background: isEven
                      ? "linear-gradient(180deg, #F0EBFF 0%, #FFFFFF 100%)"
                      : "linear-gradient(180deg, #FFFAD4 0%, #FFFFFF 100%)",
                  }}
                >
                  <img
                    src={exam.icon}
                    alt={exam.examTitle}
                    className="w-10 h-10"
                  />
                  <h2 className="text-xl font-bold text-[#2758B3]">
                    {exam.examTitle}
                  </h2>
                </div>

                {/* CONTENT */}
                <div className="p-8 bg-white">
                  <p className="text-[#2758B3] mb-6">
                    <span className="font-semibold">Subjects:</span>{" "}
                    {exam.subjects}
                  </p>

                  <div className="mb-2 flex justify-between text-green-600 font-medium">
                    <span>Progress</span>
                    <span>{exam.progress}%</span>
                  </div>

                  <div className="w-full h-3 bg-[#E6EEFF] rounded-full mb-3">
                    <div
                      className="h-3 bg-green-600 rounded-full"
                      style={{ width: `${exam.progress}%` }}
                    />
                  </div>

                  <p className="text-green-700 text-sm mb-6">
                    {exam.unitsCompleted} units completed,{" "}
                    {exam.unitsInProgress} unit in-progress
                  </p>

                  <p className="text-orange-500 mb-8">
                    <span className="font-semibold">Quick links:</span>
                    <span className="ml-2 cursor-pointer hover:underline">
                      Notes
                    </span>
                    <span className="ml-3 cursor-pointer hover:underline">
                      Videos
                    </span>
                    <span className="ml-3 cursor-pointer hover:underline">
                      Resources
                    </span>
                    <span className="ml-3 cursor-pointer hover:underline">
                      Analytics
                    </span>
                  </p>

                  <button className="w-full bg-[#2B56B5] text-white py-2 rounded-full font-semibold text-lg hover:opacity-90">
                    Continue
                  </button>
                </div>
              </div>

              {/* RIGHT CARD */}
              <div className="border border-[#BFD6FF] rounded-3xl p-8 bg-white">
                <h2 className="text-xl font-bold text-[#2758B3] text-center mb-6">
                  {exam.examYear}
                </h2>

                {/* COUNTDOWN */}
                <div
                  className="grid grid-cols-4 gap-4 rounded-2xl p-6 mb-8 text-center"
                  style={{
                    background: isEven
                      ? "linear-gradient(180deg, #F0EBFF 0%, #FFFFFF 100%)"
                      : "linear-gradient(180deg, #FFFAD4 0%, #FFFFFF 100%)",
                    boxShadow: "0px 4px 4px 0px #00000040",
                  }}
                >
                  {[
                    { value: exam.countdown.days, label: "Days Left" },
                    { value: exam.countdown.hours, label: "Hours" },
                    { value: exam.countdown.minutes, label: "Minutes" },
                    { value: exam.countdown.seconds, label: "Seconds" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-2xl font-bold text-[#2758B3]">
                        {item.value}
                      </p>
                      <p className="text-sm text-[#2758B3]">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-8 items-center">
                  <div className="relative w-36 h-36">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(#4C1DFF ${exam.progress}%, #A3A3A3 0)`,
                      }}
                    />
                    <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
                      <span className="text-purple-600 font-bold">
                        {exam.progress}%
                      </span>
                      <span className="text-purple-600 text-sm">Completed</span>
                    </div>
                  </div>

                  <div className="space-y-4 text-[#2758B3]">
                    <div className="flex gap-3 items-center">
                      <img src={calendarIcon} className="w-5 h-5" />
                      <span>
                        Final Exam Date – <strong>{exam.examDate}</strong>
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <img src={clockIcon} className="w-5 h-5" />
                      <span>
                        Time – <strong>{exam.time}</strong>
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <img src={durationIcon} className="w-5 h-5" />
                      <span>
                        Duration: <strong>{exam.duration}</strong>
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <img src={modeIcon} className="w-5 h-5" />
                      <span>
                        Mode: <strong>{exam.mode}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CENTER ARROW */}
            <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-y-1/2">
              <div
                className="w-0 h-0"
                style={{
                  borderTop: "40px solid transparent",
                  borderBottom: "40px solid transparent",
                  borderLeft: "56px solid #B0CBFE",
                  marginLeft: "-28px",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EnrolledExams;
