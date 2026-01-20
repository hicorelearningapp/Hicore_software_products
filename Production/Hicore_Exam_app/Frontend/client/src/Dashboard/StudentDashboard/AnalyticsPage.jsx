import React, { useState } from "react";

/* ASSETS */
import medalsImg from "../../assets/StudentDashboard/medal.png";
import rocketIcon from "../../assets/StudentDashboard/Rocket.png";
import playIcon from "../../assets/StudentDashboard/play.png";
import alertIcon from "../../assets/StudentDashboard/difficulty.png";

/* ================= RECOMMENDATION CARD COMPONENT ================= */
const RecommendationCard = ({
  title,
  description,
  btnText,
  btnColor,
  borderColor,
  icon,
  secondaryBtnText,
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row items-stretch md:items-center justify-between p-10 rounded-2xl border ${borderColor} bg-white mb-4 last:mb-0 shadow-sm`}
    >
      {/* Content Section: 70% Width on desktop */}
      <div className="flex items-center gap-6 mb-4 md:mb-0 md:w-[70%]">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
          <img
            src={icon}
            alt="recommendation-icon"
            className="w-full h-auto object-contain"
          />
        </div>
        <div>
          <h4 className="font-bold text-[#2758B3] text-base">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>

      {/* Buttons Section: 30% Width on desktop, aligned straight */}
      <div className="flex flex-row gap-4 md:w-[30%] md:justify-end">
        <button
          className={`${btnColor} text-white flex-1 md:flex-initial w-40 px-4 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap`}
        >
          {btnText}
        </button>
        <button className="border border-[#2758B3] text-[#2758B3] flex-1 md:flex-initial md:min-w-[110px] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap">
          {secondaryBtnText}
        </button>
      </div>
    </div>
  );
};

/* ================= TOPIC CARD COMPONENT ================= */
const TopicCard = ({ title, progress }) => {
  let statusColor = "border-[#FCA5A5] bg-white text-[#F87171]"; // Not Started (Red)
  let statusText = "Click to start";
  let showButton = true;

  if (progress >= 85) {
    statusColor = "border-[#34D399] bg-white text-[#34D399]"; // Mastered (Green)
    statusText = `${progress}%`;
    showButton = false;
  } else if (progress > 0) {
    statusColor = "border-[#FBBF24] bg-white text-[#FBBF24]"; // In Progress (Yellow)
    statusText = `${progress}%`;
    showButton = false;
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${statusColor} min-h-[160px]`}
    >
      <h4 className="font-semibold mb-2 text-sm">{title}</h4>
      <p className="text-lg font-bold">{statusText}</p>
      {showButton && (
        <button className="mt-4 bg-[#0061FF] text-white px-6 py-1.5 rounded-lg text-xs font-medium">
          Start Learning
        </button>
      )}
    </div>
  );
};

/* ================= TOPICS MASTERY SECTION ================= */
const TopicsMasterySection = ({ title, data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayData = isExpanded ? data : data.slice(0, 5);

  return (
    <div className="mb-10 border border-[#B0CBFE] rounded-2xl p-6 bg-white last:mb-0">
      <h3 className="text-[#2758B3] font-semibold text-lg mb-6">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {displayData.map((topic, index) => (
          <TopicCard key={index} title={topic.name} progress={topic.progress} />
        ))}
      </div>

      {data.length > 5 && (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#2758B3] text-sm font-medium flex items-center gap-1 hover:underline"
          >
            {isExpanded ? "Show Less" : "View All"}
            <span className="text-lg">≫</span>
          </button>
        </div>
      )}
    </div>
  );
};

/* ================= PROGRESS CIRCLE ================= */
const ProgressCircle = ({ percent, color, subText }) => {
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#E5E7EB"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="font-semibold"
          fill={color}
        >
          {percent}%
        </text>
      </svg>
      <p className="mt-4 font-medium" style={{ color }}>
        {subText}
      </p>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
const AnalyticsPage = () => {
  const chartData = [
    { subject: "Physics", you: 90, topper: 95 },
    { subject: "Chemistry", you: 78, topper: 89 },
    { subject: "Biology", you: 85, topper: 95 },
    { subject: "Maths", you: 92, topper: 98 },
  ];

  const physicsTopics = [
    { name: "Mechanics", progress: 95 },
    { name: "Thermodynamics", progress: 72 },
    { name: "Optics", progress: 0 },
    { name: "Electricity", progress: 88 },
    { name: "Optics", progress: 0 },
    { name: "Modern Physics", progress: 40 },
  ];

  const chemistryTopics = [
    { name: "Mechanics", progress: 95 },
    { name: "Thermodynamics", progress: 72 },
    { name: "Optics", progress: 0 },
    { name: "Electricity", progress: 88 },
    { name: "Optics", progress: 0 },
  ];

  return (
    <div className="w-full px-6 py-8 space-y-10 bg-[#F8FAFC]">
      {/* 1. TOP ANALYTICS CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-[#B0CBFE] bg-[linear-gradient(90deg,#E6EEFF_0%,#FFFFFF_75%)] p-6 flex flex-col justify-center">
          <span className="text-2xl mb-3">🎉</span>
          <h2 className="text-xl font-semibold text-green-600">
            Congratulations!
          </h2>
          <p className="mt-3 text-green-700 leading-relaxed text-sm">
            You've completed 10 lessons in Chemistry this week. Keep up the
            great work!
          </p>
        </div>
        <div className="rounded-2xl border border-[#681ABC] p-10 text-center bg-white">
          <h3 className="text-purple-600 font-semibold mb-2">Exams</h3>
          <ProgressCircle
            percent={75}
            color="#6D28D9"
            subText="15 of 20 completed"
          />
        </div>
        <div className="rounded-2xl border border-[#1ABC7B] p-10 text-center bg-white">
          <h3 className="text-green-600 font-semibold mb-2">Lessons</h3>
          <ProgressCircle
            percent={60}
            color="#10B981"
            subText="30 of 50 completed"
          />
        </div>
        <div className="rounded-2xl border border-[#FF8000] p-10 text-center bg-white">
          <h3 className="text-orange-500 font-semibold mb-2">Revision</h3>
          <ProgressCircle
            percent={80}
            color="#F97316"
            subText="20 of 25 completed"
          />
        </div>
      </div>

      {/* 2. LEADERBOARD */}
      <div className="border border-[#B0CBFE] rounded-3xl p-8 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="border border-[#B0CBFE] rounded-2xl p-6 space-y-4">
            {[
              {
                rank: "🥇",
                name: "Arjun Sharma",
                points: "2,847",
                bg: "bg-[#FFF6E6]",
              },
              {
                rank: "🥈",
                name: "Priya Patel",
                points: "2,756",
                bg: "bg-[#F3F3F3]",
              },
              {
                rank: "🥉",
                name: "Rahul Kumar",
                points: "2,689",
                bg: "bg-[#FFF1E6]",
              },
              {
                rank: "4",
                name: "You",
                points: "2,634",
                bg: "bg-[#EAF0FF]",
                highlight: true,
              },
              { rank: "5", name: "Sneha Gupta", points: "2,598" },
              { rank: "6", name: "Sneha Gupta", points: "2,598" },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex justify-between px-4 py-3 rounded-xl border ${
                  item.highlight
                    ? "border-[#2758B3] text-[#2758B3] font-semibold"
                    : "border-[#B0CBFE]"
                } ${item.bg || ""}`}
              >
                <div className="flex gap-4">
                  <span className="w-6 text-center">{item.rank}</span>
                  <span>{item.name}</span>
                </div>
                <span className="text-sm">{item.points} points</span>
              </div>
            ))}
          </div>
          <div className="border border-[#B0CBFE] rounded-2xl p-6 flex">
            <div className="w-1/2 pr-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#2758B3] mb-4">
                  Leaderboard
                </h3>
                <div className="space-y-3 text-sm text-[#2758B3]">
                  <p className="flex justify-between">
                    <span>Your Rank:</span>{" "}
                    <span className="font-semibold">4</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Total Score:</span>{" "}
                    <span className="font-semibold">2,634</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Total students:</span>{" "}
                    <span className="font-semibold">247</span>
                  </p>
                </div>
              </div>
              <div className="mt-6 border border-[#B0CBFE] rounded-xl p-4">
                <p className="font-semibold text-[#2758B3] mb-2">Next Target</p>
                <p className="text-sm text-[#2758B3] leading-[32px] mb-4">
                  You need <strong>13 more points</strong> to pass Rahul Kumar
                  and reach <strong>#3</strong>.
                </p>
                <button className="bg-[#2758B3] text-white w-full py-2 rounded-full text-sm font-medium">
                  View Challenges
                </button>
              </div>
            </div>
            <div className="w-1/2 flex justify-end items-start h-full overflow-hidden">
              <img
                src={medalsImg}
                alt="medals"
                className="h-full w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. PERFORMANCE COMPARISON */}
      <div className="border border-[#B0CBFE] rounded-3xl p-8 bg-white">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[#2758B3] font-semibold">
            Performance Comparison
          </h3>
          <select className="border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm text-gray-500">
            <option>Select option</option>
          </select>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 relative pl-14">
            <div className="absolute left-0 top-0 h-[240px] flex flex-col justify-between text-xs text-[#2758B3]">
              {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10].map((v) => (
                <span key={v}>{v}%</span>
              ))}
            </div>
            <div className="absolute inset-0 left-14 h-[240px] flex flex-col justify-between">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="border-t border-[#EEF2FF]" />
              ))}
            </div>
            <div className="relative h-[240px] flex justify-between items-end px-10 z-10">
              {chartData.map((item, index) => {
                const youHeight = ((item.you - 10) / 90) * 100;
                const topperHeight = ((item.topper - 10) / 90) * 100;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center min-w-[100px]"
                  >
                    <div className="flex items-end gap-4 h-full">
                      <div className="relative flex flex-col items-center justify-end h-full">
                        <span className="absolute -top-6 text-xs text-[#6B5ED3]">
                          {item.you}%
                        </span>
                        <div
                          className="w-4 bg-[#6B5ED3] rounded-t-lg"
                          style={{ height: `${youHeight}%` }}
                        />
                      </div>
                      <div className="relative flex flex-col items-center justify-end h-full">
                        <span className="absolute -top-6 text-xs text-[#F2B6C1]">
                          {item.topper}%
                        </span>
                        <div
                          className="w-4 bg-[#F2B6C1] rounded-t-lg"
                          style={{ height: `${topperHeight}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-[#2758B3] mt-2">
                      {item.subject}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-10 mt-8 text-sm text-[#2758B3]">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-[#F2B6C1] rounded-lg" /> Topper
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-[#6B5ED3] rounded-lg" /> You
              </div>
            </div>
          </div>
          <div className="border border-[#F2B6C1] rounded-2xl bg-[#FFF7F9] p-8 flex flex-col justify-center items-center text-center">
            <h4 className="text-[#2758B3] font-semibold mb-6">Key Insights</h4>
            <p className="text-sm text-[#2758B3] leading-6 mb-8">
              You are <strong>15%</strong> ahead in Biology but{" "}
              <strong>5%</strong> behind in Chemistry compared to class average.
            </p>
            <button className="bg-[#2758B3] text-white px-8 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              Study Chemistry <span>≫</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. TOPICS MASTERY */}
      <div className="border border-[#B0CBFE] rounded-3xl p-8 bg-white">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#2758B3]">Topics Mastery</h2>
          <div className="flex gap-6 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#34D399]"></span>{" "}
              Mastered
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#FBBF24]"></span> In
              Progress
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#F87171]"></span> Not
              Started
            </div>
          </div>
        </div>
        <TopicsMasterySection title="Physics" data={physicsTopics} />
        <TopicsMasterySection title="Chemistry" data={chemistryTopics} />
      </div>

      {/* 5. AI RECOMMENDATIONS */}
      <div className="border border-[#B0CBFE] rounded-3xl p-8 bg-white">
        <h2 className="text-2xl font-bold text-[#2758B3] mb-8">
          AI Recommendations
        </h2>
        <div className="flex flex-col">
          <RecommendationCard
            title="Boost Your Algebra Score"
            description="Complete 1 more practice set to improve your score by an estimated 8%."
            btnText="Start Practice"
            btnColor="bg-[#22C55E]"
            borderColor="border-[#22C55E]"
            secondaryBtnText="Maybe Later"
            icon={rocketIcon}
          />
          <RecommendationCard
            title="Quick Video Suggestion"
            description="Watch a 5-min video on Thermodynamics - highly recommended for your weak area."
            btnText="Watch Video"
            btnColor="bg-[#0061FF]"
            borderColor="border-[#0061FF]"
            secondaryBtnText="Skip"
            icon={playIcon}
          />
          <RecommendationCard
            title="Performance Alert"
            description="Your Chemistry average fell by 10%. Want to review your recent mistakes?"
            btnText="Review Mistakes"
            btnColor="bg-[#EF4444]"
            borderColor="border-[#EF4444]"
            secondaryBtnText="Dismiss"
            icon={alertIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
