import React from "react";
import { Check, X } from "lucide-react";

const plans = [
  {
    title: "Free Plan (Starter)",
    price: "Free",
    features: [
      { text: "Access to basic courses", included: true },
      { text: "Limited project submissions (2/month)", included: true },
      { text: "Resume Builder (basic templates)", included: true },
      { text: "No certifications", included: false },
      { text: "No mentor connect", included: false },
    ],
    button: "Choose Basic",
  },
  {
    title: "Standard Plan (Growth)",
    price: "$19/month",
    features: [
      { text: "Access to all courses", included: true },
      { text: "Unlimited project submissions", included: true },
      { text: "Resume Builder (AI-assisted)", included: true },
      { text: "Certifications (1 included)", included: true },
      { text: "Mentor Connect (2 sessions/month)", included: true },
      { text: "No study abroad guidance", included: false },
    ],
    button: "Upgrade Now",
  },
  {
    title: "Pro Plan (Career Launch)",
    price: "$49/month",
    features: [
      { text: "Access to all courses & live classes", included: true },
      { text: "Unlimited project submissions", included: true },
      { text: "AI Resume Builder + Custom Templates", included: true },
      { text: "Certifications (unlimited)", included: true },
      { text: "Mentor Connect (unlimited)", included: true },
      { text: "Study Abroad Guidance", included: true },
      { text: "Interview Success Program (8 weeks)", included: true },
    ],
    button: "Start Pro Today",
  },
];

const Subscriptions = () => {
  return (
    <div className="bg-white p-10 rounded-xl border m-4 border-gray-300 shadow-md">
      <h2 className="text-2xl font-bold text-[#343079] mb-2 ">
        Invest in Your Future
      </h2>
      <p className="text-[#343079] mb-8 ">
        Flexible plans to match your career goals. Start free and upgrade as you
        grow.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className="p-6 rounded-xl border border-gray-300 shadow-sm flex flex-col justify-between transition-all duration-300 hover:border-blue-900 hover:shadow-lg"
          >
            <div>
              <h3 className="text-lg font-semibold text-[#343079]  mb-4">
                {plan.title}
              </h3>
              <p className="text-lg  text-[#343079] mb-4">
                Price: <span className="font-bold">{plan.price}</span>
              </p>
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-[#343079]">
                    {feature.included ? (
                      <Check className="text-green-500 w-5 h-5" />
                    ) : (
                      <X className="text-red-500 w-5 h-5" />
                    )}
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="mt-6 py-2 px-4 rounded-lg font-medium bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white">
              {plan.button}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
