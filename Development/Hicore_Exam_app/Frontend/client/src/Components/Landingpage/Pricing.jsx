import React, { useState } from "react";
import checkIcon from "../../assets/Landingpage/tick.png";

const pricingData = {
  Students: [
    {
      title: "Starter (Free)",
      price: "Free",
      features: [
        "Perfectly-aligned notes & limited quizzes",
        "Basic flashcards & formula sheets",
        "Weekly progress snapshot",
      ],
      buttonText: "Start Free Today",
    },
    {
      title: "Standard",
      price: "$20/month",
      features: [
        "Unlimited topic-wise quizzes & chapter tests",
        "Access to formula banks, mind maps & diagrams",
        "Basic AI revision suggestions",
      ],
      buttonText: "Boost Your Prep",
    },
    {
      title: "Premium",
      price: "$40/month",
      mostPopular: true,
      features: [
        "Full AI Smart Revision & weak-topic focus",
        "Mock tests & weekend exam simulations",
        "Detailed analytics, score predictions & trends",
        "Extras: daily challenges, voice mode, real-life demos",
      ],
      buttonText: "Unlock Exam Mastery",
    },
  ],
  Parents: [
    {
      title: "Starter (Free)",
      price: "Free",
      features: [
        "Weekly performance summaries",
        "Alerts for missed tests & low streaks",
        "Stay Connected Free",
      ],
      buttonText: "Stay Connected Free",
    },
    {
      title: "Standard",
      price: "$20/month",
      features: [
        "Detailed progress reports (strengths/weaknesses)",
        "AI recommendations for child’s improvement",
        "Activity tracking for revision & tests",
      ],
      buttonText: "Support Smarter",
    },
    {
      title: "Premium",
      price: "$40/month",
      mostPopular: true,
      features: [
        "Full history & trend analysis",
        "Access to progress insights & guided resources",
        "Multiple child accounts under one plan",
      ],
      buttonText: "Be Your Child’s Learning Partner",
    },
  ],
  "Teacher/Mentor": [
    {
      title: "Starter (Free)",
      price: "Free",
      features: ["Access to study notes & quizzes", "Track up to 5 students"],
      buttonText: "Start Free Today",
    },
    {
      title: "Standard",
      price: "$20/month",
      features: [
        "Create & assign custom quizzes/tests",
        "Basic class progress analytics",
        "Access to premium notes & resources",
      ],
      buttonText: "Upgrade Your Teaching",
    },
    {
      title: "Premium",
      price: "$40/month",
      mostPopular: true,
      features: [
        "Advanced analytics for groups & individuals",
        "AI-powered recommendations for improvement",
        "Manage multiple classes & cohorts",
        "Unlimited access to all content & reports",
      ],
      buttonText: "Mentor Like a Pro",
    },
  ],
};

const Pricing = () => {
  const [activeTab, setActiveTab] = useState("Students");

  return (
    <div className="w-full h-auto gap-[64px] pt-16 pr-24 pb-16 pl-24 opacity-100 flex flex-col">
      {/* ✅ Outside Heading with Arrow */}
      <h2 className="text-[#2758B3] text-[20px] font-semibold leading-[48px] tracking-[0.015em] flex items-center gap-6">
        {/* Arrow */}
        <div className="relative flex items-center ml-8 w-[300px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <div className="w-3 h-3 rounded-full bg-[#2758B3] z-10"></div>
          <div className="flex-1 h-[3px] bg-[#2758B3]"></div>
          <div className="border-t-[8px] border-b-[10px] border-l-[8px] border-t-transparent border-b-transparent border-l-[#2758B3]"></div>
        </div>
        Pricing
      </h2>

      {/* ✅ Blue Section */}
      <div className="pt-16 pr-1 pb-1 pl-1 rounded-[36px] bg-[#2758B3] opacity-100">
        <div id='pricing'
         className="w-full h-fit bg-[#2758B3] rounded-t-[36px] text-white">
          <h3 className="h-[40px] text-[20px] font-semibold text-center">
            Choose the Plan That Fits Your Journey
          </h3>
          <p className="text-regular text-[16px] text-center">
            Flexible plans for Students, Teachers, and Parents.
          </p>

          {/* Tabs Container - now inside the header */}
          <div className="w-full h-full flex mt-12">
            {Object.keys(pricingData).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full h-[70px] py-6 font-regular text-[16px] rounded-tl-[36px] rounded-tr-[36px] items-center ${
                  activeTab === tab
                    ? "bg-white text-[#2758B3] leading-[38px]"
                    : "bg-transparent text-white leading-[38px]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* White Content Area (Pricing Cards) */}
        <div className="w-full h-full flex bg-white rounded-b-[36px] p-[36px] gap-[36px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full h-fix">
            {pricingData[activeTab].map((plan, idx) => (
              <div
                key={idx}
                className={`border rounded-2xl p-6 flex flex-col justify-between relative h-fix ${
                  plan.mostPopular ? "border-[#008000] " : "border-[#E6EEFF]"
                }`}
              >
                {/* Premium Green Header */}
                {plan.mostPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-[#008000] text-white text-center py-3 rounded-t-2xl text-md font-medium">
                    (Most Popular)
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-[18px] text-[#2758B3] mb-2">
                    {plan.title}
                  </h4>
                  <p className="text-[24px] font-bold text-[#2758B3]">
                    {plan.price}
                  </p>

                  <ul className="mt-6 space-y-6 text-[#2758B3] font-regular text-[14px]">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-4">
                        <img src={checkIcon} alt="check" className="w-[16px] h-[16px] " />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={`w-full h-[48px] mt-10 px-4 py-1 rounded-[80px] font-medium text-[16px] transition ${
                    plan.mostPopular
                      ? "bg-[#2758B3] hover:bg-[#08265F] cursor-pointer text-white"
                      : "bg-[#2758B3] hover:bg-[#08265F] cursor-pointer text-white"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;