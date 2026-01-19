import React, { useState } from "react";
import collegeImg from "../../assets/CarrerChoose/college.png";
import graduateImg from "../../assets/CarrerChoose/graduate.png";
import professionalImg from "../../assets/CarrerChoose/professional.png";

const IdentifyYourself = ({ onNext }) => {
  const [selected, setSelected] = useState(null);

  const options = [
    {
      id: 1,
      title: "College Students",
      desc: "I just started studying and want to learn skills early.",
      img: collegeImg,
    },
    {
      id: 2,
      title: "Job Seeker",
      desc: "I just graduated and want to become job-ready.",
      img: graduateImg,
    },
    {
      id: 3,
      title: "Working Professionals",
      desc: "I'm working but want to switch or upskill into tech.",
      img: professionalImg,
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-indigo-900 text-center mb-2">
        Tell us who you are
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Choose the option that best describes your current situation
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={`cursor-pointer border rounded-2xl p-6 text-center transition duration-200
              ${
                selected === opt.id
                  ? "border-indigo-600 shadow-md"
                  : "border-gray-200 hover:border-indigo-300"
              }`}
          >
            <img
              src={opt.img}
              alt={opt.title}
              className="w-full h-56 object-contain mb-4 rounded-md"
            />
            <h3 className="font-semibold text-indigo-800 text-lg mb-2">
              {opt.title}
            </h3>
            <p className="text-gray-500 text-sm">{opt.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <button
          disabled={!selected}
          onClick={onNext}
          className={`px-6 py-2 rounded-lg text-white font-semibold
            ${
              selected
                ? "bg-indigo-700 hover:bg-indigo-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default IdentifyYourself;
