import React, { useState } from "react";
import clockIcon from "../../../assets/Freelance/clock.png";
import rupeeIcon from "../../../assets/Freelance/rupee.png";
import locationIcon from "../../../assets/Freelance/location.png";
import saveIcon from "../../../assets/Freelance/save.png";
import savedBlueIcon from "../../../assets/Freelance/save-blue.png";

const GigListLeft = ({ gigs, onSelectGig, selectedGig }) => {
  const [savedStates, setSavedStates] = useState({});
  const [filterToggle, setFilterToggle] = useState(false);

  const toggleSave = (index) => {
    setSavedStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="w-full lg:w-[30%] space-y-4">
      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-[#343079] font-medium">
          Filter by My Profile Preferences
        </label>
        <label className="relative inline-flex items-center cursor-pointer w-12 h-6">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={filterToggle}
            onChange={() => setFilterToggle(!filterToggle)}
          />
          <div className="w-full h-full bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
          <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6"></div>
        </label>
      </div>

      {/* Gig Cards */}
      {gigs.map((gig, index) => {
        const isSelected = gig.id === selectedGig?.id;
        return (
          <div
            key={gig.id}
            onClick={() => onSelectGig(gig)}
            className={`border rounded-xl p-4 relative transition cursor-pointer 
              ${isSelected ? "bg-[#F9F9FC] border-[#343079]" : "border-gray-200 hover:bg-[#F9F9FC] hover:border-[#343079]"}`}
          >
            {/* Title + Logo */}
            <div className="flex justify-between items-start mb-1">
              <div>
                <h2 className="font-semibold text-[#343079] text-sm">{gig.title}</h2>
                <p className="text-xs text-[#0072FF] mt-[2px]">{gig.company}</p>
              </div>
              <img src={gig.logo} alt="logo" className="w-6 h-6 rounded-full mt-1" />
            </div>

            {/* Duration + Pay */}
            <div className="flex items-center text-xs text-[#343079] gap-4 flex-wrap mt-2">
              <span className="flex items-center gap-1">
                <img src={clockIcon} alt="clock" className="w-4 h-4" /> {gig.duration}
              </span>
              <span className="flex items-center gap-1">
                <img src={rupeeIcon} alt="rupee" className="w-4 h-4" /> {gig.pay}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-xs text-[#343079] mt-1">
              <img src={locationIcon} alt="location" className="w-4 h-4" />
              <span>{gig.location}</span>
            </div>

            {/* Posted Time */}
            <p className="text-[11px] text-gray-400 mt-1">{gig.posted}</p>

            {/* Save Button */}
            <img
              src={savedStates[index] ? savedBlueIcon : saveIcon}
              alt="save"
              className="w-5 h-5 absolute bottom-3 right-3 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggleSave(index);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default GigListLeft;
