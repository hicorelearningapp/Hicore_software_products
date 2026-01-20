import React from "react";
import FeatureCard from "./FeatureCard";
import features from "../../data/features";

const FeaturesGrid = () => {
  return (
    <section className="px-6 py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-red-700">
          All-in-One Toolkit. Endless Possibilities.
        </h2>
        <p className="mt-2 text-gray-500 text-md">
          From editing and AI to real-time teamwork—every feature built for
          productivity.
        </p>
      </div>

      <div className="grid gap-10 grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default FeaturesGrid;
