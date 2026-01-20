// src/.../Medicines.jsx
import React, { useState } from "react";
import { medicineCategories, subCategories } from "./MedicinesData";
import MedicinesList from "./MedicinesList";

export const Medicines = () => {
  const [showSub, setShowSub] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  const openSub = (cat) => {
    // open sub-category page (keeps categories -> subcategories)
    setSelectedSub(null);
    setShowSub(true);
  };

  const openMedicineList = (sub) => {
    // open separate MedicinesList component by setting selectedSub
    setSelectedSub(sub);
  };

  const goBackToCategories = () => {
    setShowSub(false);
    setSelectedSub(null);
  };

  const goBackToSubCategories = () => {
    setSelectedSub(null);
  };

  return (
    <div className="w-full min-h-screen px-7 py-10">
      <h2 className="text-[#1B6D2B] text-[20px] font-semibold mb-1">
        Medicine Categories
      </h2>
      <p className="text-[#7D7D7D] text-[14px] mb-6">Browse by Category</p>

      {/* Categories view */}
      {!showSub && !selectedSub && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {medicineCategories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => openSub(cat)}
              className="cursor-pointer rounded-[8px] border border-[#115D29] overflow-hidden flex flex-col justify-between h-[294px] bg-gradient-to-b from-[#FFFFFF] via-[#C4D7CA] via-40% via-[#B5CCBC] via-60% via-[#A6C2AF] via-80% to-[#FFFFFF] transition-all duration-300 group"
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="w-full h-[186px] object-contain pt-2"
              />
              <div className="h-[108px] rounded-[8px] px-4 py-[36px] flex justify-center items-center bg-white group-hover:bg-[#115D29] transition-all">
                <p className="text-[16px] font-semibold text-[#1B6D2B] group-hover:text-white transition-all">
                  {cat.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subcategories view */}
      {showSub && !selectedSub && (
        <>
          <div className="flex gap-2 mb-4 items-center">
            <span
              className="text-[#2874BA] cursor-pointer hover:underline"
              onClick={goBackToCategories}
            >
              Medicines
            </span>
            <span className="text-gray-400">›</span>
            <span className="text-[#2874BA]">Medicine Category</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {subCategories.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => openMedicineList(item)}
                className="rounded-[8px] border border-[#115D29] overflow-hidden flex flex-col justify-between h-[294px] bg-gradient-to-b from-[#FFFFFF] via-[#C4D7CA] via-40% via-[#B5CCBC] via-60% via-[#A6C2AF] via-80% to-[#FFFFFF] transition-all duration-300 group"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-[186px] object-contain pt-2"
                />
                <div className="h-[108px] rounded-[8px] px-4 py-[20px] flex flex-col justify-center items-center bg-white group-hover:bg-[#115D29] transition-all">
                  <p className="text-[16px] font-semibold text-[#1B6D2B] group-hover:text-white">
                    {item.title}
                  </p>
                  <p className="text-[13px] text-gray-500 group-hover:text-gray-200">
                    {item.products}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Render separate MedicinesList component when a subcategory is selected */}
      {selectedSub && (
        <MedicinesList
          sub={selectedSub}
          onBackToCategories={goBackToCategories}
          onBackToSubCategories={goBackToSubCategories}
        />
      )}
    </div>
  );
};

export default Medicines;
