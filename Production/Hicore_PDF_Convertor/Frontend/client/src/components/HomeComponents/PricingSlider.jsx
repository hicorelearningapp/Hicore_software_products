import React from "react";
import { plans } from "../../data/pricingPlans";

export default function PricingSlider() {
  return (
    <div className="py-12 bg-white text-center relative w-full max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-4xl font-bold text-red-700 mb-6">
        Choose the Plan That Fits You
      </h2>
      <p className="text-gray-500 text-xl mb-10">
        Flexible pricing for every need — from casual users to business
        powerhouses.
      </p>

      {/* 2 CARDS PER ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan, idx) => (
          <PricingCard key={idx} plan={plan} />
        ))}
      </div>
    </div>
  );
}

/* 🔹 Card – SAME SIZE GUARANTEED */
const PricingCard = ({ plan }) => (
  <div className="w-full h-[560px] border rounded-xl shadow-lg p-8 flex flex-col justify-between bg-white">
    <div>
      {/* Outer Circle */}
      <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-red-700 flex items-center justify-center">
        {/* Inner Circle */}
        <div className="w-20 h-20 rounded-full bg-red-700 text-white flex items-center justify-center text-lg font-bold">
          {plan.price}
        </div>
      </div>

      <h3 className="text-2xl text-center font-bold mb-2">{plan.title}</h3>
      <p className="text-gray-500 text-lg mb-4 text-center">{plan.subtitle}</p>

      <ul className="text-left space-y-2 text-sm mb-6">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-4 text-lg">
            <span className="text-green-600">✔</span> {feature}
          </li>
        ))}
      </ul>
    </div>

    <button className="mt-6 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded">
      {plan.button}
    </button>
  </div>
);
