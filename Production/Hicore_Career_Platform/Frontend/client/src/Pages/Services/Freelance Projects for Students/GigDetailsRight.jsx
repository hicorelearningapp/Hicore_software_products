import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clockIcon from "../../../assets/Freelance/clock.png";
import rupeeIcon from "../../../assets/Freelance/rupee.png";
import levelIcon from "../../../assets/Freelance/level.png";
import calendarIcon from "../../../assets/Freelance/calendar.png";
import websiteIcon from "../../../assets/Freelance/website.png";
import locationIcon from "../../../assets/Freelance/location.png";
import rocketIcon from "../../../assets/Freelance/rocket.png";
import saveIcon from "../../../assets/Freelance/save.png";
import saveIconBlue from "../../../assets/Freelance/save-blue.png";
import starIcon from "../../../assets/Freelance/star.png";

const GigDetailsRight = ({ gig }) => {
  if (!gig) return <div className="w-4/5 p-6">Loading...</div>;
  const [saved, setSaved] = useState(false);
  const [selectedSkillsMap, setSelectedSkillsMap] = useState({});
  const navigate = useNavigate();

  const {
    id,
    title,
    company,
    posted,
    duration,
    pay,
    location,
    logo,
    eligibility,
    applyBefore,
    website,
    skills = {},
    companyInfo = {},
    icons = {},
  } = gig;

  const tickIcon = icons?.tick;
  const selectedSkills = selectedSkillsMap[id] || [];

  const toggleSkill = (skill) => {
    setSelectedSkillsMap((prev) => {
      const current = prev[id] || [];
      const updated = current.includes(skill)
        ? current.filter((s) => s !== skill)
        : [...current, skill];
      return { ...prev, [id]: updated };
    });
  };

  useEffect(() => {
    if (id && !selectedSkillsMap[id]) {
      setSelectedSkillsMap((prev) => ({ ...prev, [id]: [] }));
    }
  }, [id]);

  return (
    <div className="w-4/5 p-6 bg-white rounded-xl shadow border border-[#343079] h-fit">
      <div className="mb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <img src={logo} alt="company logo" className="w-10 h-10" />
            <div>
              <h2 className="text-xl font-semibold text-[#343079]">{title}</h2>
              <p className="text-[#0072FF] font-medium">{company}</p>
              <p className="text-xs text-gray-400 mt-1">{posted}</p>
            </div>
          </div>
          <img
            src={saved ? saveIconBlue : saveIcon}
            alt="save"
            className="w-5 h-5 cursor-pointer"
            onClick={() => setSaved(!saved)}
          />
        </div>

        <div className="text-sm text-[#343079] mt-4 space-y-2">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1">
              <img src={clockIcon} alt="clock" className="w-4 h-4" /> {duration}
            </div>
            <div className="flex items-center gap-1">
              <img src={rupeeIcon} alt="rupee" className="w-4 h-4" /> {pay}
            </div>
            <div className="flex items-center gap-1">
              <img src={levelIcon} alt="level" className="w-4 h-4" /> Eligibility: {eligibility}
            </div>
            <div className="flex items-center gap-1">
              <img src={calendarIcon} alt="calendar" className="w-4 h-4" /> Apply Before: {applyBefore}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <img src={websiteIcon} alt="website" className="w-4 h-4" /> {website}
          </div>

          <div className="flex items-center gap-1">
            <img src={locationIcon} alt="remote" className="w-4 h-4" /> {location}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="bg-[#E5EDFF] text-[#466AFF] text-xs px-3 py-1 rounded-full">Recommended</span>
          <span className="bg-[#DFFFD8] text-[#2A983C] text-xs px-3 py-1 rounded-full">80% Profile Match</span>
          <div className="flex items-center gap-2 ml-auto">
            <button 
            onClick={() =>navigate("/freelance/apply", { state: { gigId: gig.id, gig } })
}
            className="bg-[#343079] text-white px-4 py-2 rounded-lg text-sm">Quick Apply</button>
          </div>
        </div>
      </div>

      <hr className="my-4 border-[#343079]" />

      <div className="mt-4">
        <h3 className="text-[#343079] font-bold mb-2">Required Skills Set</h3>
        <p className="text-sm text-[#343079] mb-3 flex items-center gap-1">
          <img src={starIcon} alt="star" className="w-4 h-4" />
          {selectedSkills.length} out of {skills.allSkills?.length || 0} preferred skills are a match
        </p>
        <div className="flex gap-2 flex-wrap">
          {skills.allSkills?.map((skill) => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                selectedSkills.includes(skill)
                  ? "bg-[#DFFFD8] text-[#2A983C]"
                  : "bg-gray-100 text-[#343079]"
              }`}
            >
              {selectedSkills.includes(skill) && (
                <img src={tickIcon} className="w-4 h-4" alt="tick" />
              )}
              {skill}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-[#FFE7F5] text-[#C71B74] px-4 py-3 mt-4 rounded-md justify-between">
          <div className="flex items-center gap-2">
            <img src={rocketIcon} alt="rocket" className="w-10 h-10" />
            <span>Missing Some Skills? Enroll & Level Up Today!</span>
          </div>
          <button
            onClick={() => navigate("/courses")}
            className="bg-[#343079] text-white text-sm px-4 py-1.5 rounded-md"
          >
            Enroll Now
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6 text-[#343079]">
        <Section title={`About ${company}`} content={companyInfo.about} />
        <Section title="Freelance Gig Overview" content={companyInfo.overview} />
        <ListSection title="Who can apply" items={companyInfo.whoCanApply || []} />
        <ListSection title="Responsibilities" items={companyInfo.responsibilities || []} />
        <ListSection title="Deliverables" items={companyInfo.deliverables || []} />
        <ListSection title="Important Notes" items={companyInfo.notes || []} />
        <div>
          <h3 className="font-bold">Perks</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {companyInfo.perks?.map((perk) => (
              <span
                key={perk}
                className="bg-[#DFFFD8] text-[#2A983C] px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                <img src={tickIcon} className="w-4 h-4" alt="tick" /> {perk}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold">How to Apply</h3>
          <p className="text-sm mt-1">
            Click on <strong>Quick Apply</strong>. Shortlisted candidates will be contacted within 48 hours.
          </p>
          <button
          onClick={() =>navigate("/freelance/apply", { state: { gigId: gig.id, gig } })
}
          className="mt-2 bg-[#343079] text-white px-4 py-2 rounded-lg text-sm">Quick Apply</button>
        </div>

        <div>
          <h3 className="text-red-500 font-semibold">Report Gig</h3>
          <textarea
            placeholder="Type your problem here and submit it."
            className="w-full border border-gray-300 rounded-md p-3 mt-2 text-sm"
            rows={3}
          />
          <div className="flex justify-end">
            <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, content }) => (
  <div>
    <h3 className="font-bold">{title}</h3>
    <p className="text-sm mt-1">{content}</p>
  </div>
);

const ListSection = ({ title, items }) => (
  <div>
    <h3 className="font-bold">{title}</h3>
    <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
      {items.map((item, i) => (
        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
      ))}
    </ul>
  </div>
);

export default GigDetailsRight;
