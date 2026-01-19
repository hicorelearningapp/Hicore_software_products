import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const ProgramDuration = ({
  onBack,
  selectedCareer,
  setSelectedDuration,
}) => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  if (!selectedCareer || !selectedCareer.plans) {
    return (
      <p className="text-center text-red-500">
        No duration plans available.
      </p>
    );
  }

  // ✅ Dynamically convert plans object to array
  const durationPlans = useMemo(() => {
    return Object.entries(selectedCareer.plans).map(([key, value]) => ({
      key,
      ...value,
    }));
  }, [selectedCareer]);

  // ✅ Directly start journey from here
  const handleStartJourney = () => {
    if (!selected) return;

    const chosenPlan = durationPlans.find(
      (item) => item.key === selected
    );

    if (!chosenPlan?.path && !chosenPlan?.route) {
      console.error("❌ No navigation path found", chosenPlan);
      return;
    }

    setSelectedDuration(chosenPlan); // keep for global state if needed
    navigate(chosenPlan.path || chosenPlan.route);
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col justify-between px-6 md:px-16 py-10">
      <div>
        <h2 className="text-2xl font-bold text-[#343079] text-center mb-2">
          How much time can you invest?
        </h2>

        <p className="text-gray-500 text-center mb-8">
          Choose the program duration that works best for you
        </p>

        {/* ✅ Duration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          {durationPlans.map((item) => (
            <div
              key={item.key}
              onClick={() => setSelected(item.key)}
              className={`cursor-pointer border rounded-2xl p-6 w-full max-w-[420px] flex items-center transition-all duration-200 ${
                selected === item.key
                  ? "border-[#343079] shadow-md"
                  : "border-gray-200 hover:border-[#A5A4C1]"
              }`}
            >
              {item.img && (
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-16 h-16 object-contain mr-5"
                />
              )}

              <div className="text-left">
                <h3 className="font-semibold text-[#343079] text-lg mb-1">
                  {item.title}
                </h3>
                {item.desc && (
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Buttons */}
      <div className="flex justify-between mt-12">
        <button
          onClick={onBack}
          className="border border-[#343079] text-[#343079] px-6 py-2 rounded-md hover:bg-[#343079] hover:text-white transition"
        >
          Back
        </button>

        <button
          disabled={!selected}
          onClick={handleStartJourney}
          className={`px-6 py-2 rounded-md text-white font-semibold transition ${
            selected
              ? "bg-[#343079] hover:bg-[#292467]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Start My Journey
        </button>
      </div>
    </div>
  );
};

export default ProgramDuration;
