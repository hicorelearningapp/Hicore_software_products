import React, { useState, useMemo } from "react";

import iconAZ from "../../../assets/Customers/storeavail/az.png";
import iconZA from "../../../assets/Customers/storeavail/za.png";
import searchIcon from "../../../assets/Customers/storeavail/search.png";
import mapImg from "../../../assets/Customers/storeavail/map.jpg";
import tabletImg from "../../../assets/Customers/storeavail/tablet.jpg";
import checkIcon from "../../../assets/Customers/storeavail/checkAvaiability.png";
import heartGrey from "../../../assets/Customers/storeavail/heartGrey.png";
import heartRed from "../../../assets/Customers/storeavail/heartRed.png";

export default function StoreAvailability() {
  const [sortToggle, setSortToggle] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [favorites, setFavorites] = useState({});
  const [hoverIndex, setHoverIndex] = useState(null);

  const [filters, setFilters] = useState({
    km1: false,
    km3: false,
    km10: false,
    inStockOnly: false,
  });

  const handleFilterChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFavorite = (name) => {
    setFavorites((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const storeData = [
    {
      name: "Apollo Pharmacy",
      distance: 0.8,
      medicines: ["Paracetamol 650mg", "Dolo 650", "Vitamin D3"],
    },
    {
      name: "MedPlus Store",
      distance: 1.2,
      medicines: ["Paracetamol 650mg", "Vitamin D3"],
    },
    {
      name: "Wellness Pharmacy",
      distance: 2.5,
      medicines: ["Dolo 650", "Vitamin D3"],
    },
    {
      name: "Apollo ",
      distance: 0.8,
      medicines: ["Paracetamol 650mg", "Dolo 650", "Vitamin D3"],
    },
    {
      name: "MedPlus ",
      distance: 1.2,
      medicines: ["Paracetamol 650mg", "Vitamin D3"],
    },
    {
      name: "Wellness ",
      distance: 2.5,
      medicines: ["Dolo 650", "Vitamin D3"],
    },
  ];

  const processedData = useMemo(() => {
    let data = [...storeData];

    data.sort((a, b) =>
      sortToggle ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

    if (filters.km1) data = data.filter((item) => item.distance <= 1);
    if (filters.km3) data = data.filter((item) => item.distance <= 3);
    if (filters.km10) data = data.filter((item) => item.distance <= 10);

    if (filters.inStockOnly) {
      data = data.filter((item) => item.medicines.length > 0);
    }

    if (searchText.trim() !== "") {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return data;
  }, [sortToggle, filters, searchText]);

  return (
    <div className="w-full px-4 sm:px-6 py-6">
      <style>{`
        input, textarea, button, select, [contenteditable="true"] {
          user-select: text !important;
        }
      `}</style>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-9 gap-4">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#115D29" }}>
            Store & Availability
          </h1>
          <p className="text-sm mt-1" style={{ color: "#115D29" }}>
            Find which pharmacies near you have your medicines in stock
          </p>
        </div>
      </div>

      {/*  SORT FILTER SEARCH SECTION */}
      <div className="w-full flex flex-col xl:flex-row items-center gap-4 bg-[#F7F9F7] p-4 rounded-xl border border-[#D4E5D9] mb-10">

        {/* Sort */}
        <div className="flex items-center gap-3 border border-[#B5CDBD] rounded-xl px-4 py-2">
          <img src={iconAZ} alt="A-Z" className="w-5 h-5" />

          <div
            onClick={() => setSortToggle(!sortToggle)}
            className="w-12 h-6 bg-gray-200 rounded-full flex items-center px-1 cursor-pointer"
          >
            <div
              className={`w-5 h-5 rounded-full transition-all ${
                sortToggle ? "translate-x-6 bg-green-600" : "bg-green-600"
              }`}
            ></div>
          </div>

          <img src={iconZA} alt="Z-A" className="w-5 h-5" />
        </div>

        {/* Filter */}
        <div className="flex flex-wrap items-center gap-4 border border-[#B5CDBD] rounded-xl px-6 py-2 text-[#115D29]">
          <span className="text-sm font-medium">Filter by :</span>

          {["km1", "km3", "km10", "inStockOnly"].map((key, i) => (
            <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={() => handleFilterChange(key)}
                className="w-4 h-4 accent-green-600"
              />
              {key === "km1"
                ? "1 km"
                : key === "km3"
                ? "3 km"
                : key === "km10"
                ? "10 km"
                : "In Stock Only"}
            </label>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center justify-between flex-1 border border-[#B5CDBD] rounded-xl px-4 py-2 w-full xl:w-auto">
          <input
            type="text"
            placeholder="Search your medicines by name or scan barcode..."
            className="w-full outline-none text-sm text-[#115D29] placeholder-[#9FB8A7]"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <img src={searchIcon} alt="search" className="w-6 h-6 opacity-80 cursor-pointer" />
        </div>
      </div>

      {/*  STORE CARDS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedData.map((store, index) => (
          <div
            key={index}
            className="border border-[#E7EFEA] rounded-lg p-4 flex flex-col transition-all duration-200 hover:border-[#B5CDBD] hover:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            style={{ cursor: "pointer" }}
          >
            <div className="border border-[#E7EFEA] rounded-lg overflow-hidden mb-2">
              <img
                src={hoverIndex === index ? tabletImg : mapImg}
                alt="map"
                className="w-full h-44 object-cover transition-all duration-200"
              />
            </div>

            {/*  HEART BELOW IMAGE */}
            <div
              className="flex justify-end mb-2 cursor-pointer"
              onClick={() => toggleFavorite(store.name)}
            >
              <img
                src={favorites[store.name] ? heartRed : heartGrey}
                className="w-6 h-6"
                alt="heart"
              />
            </div>

            <h3 className="font-semibold text-[#115D29] text-lg">
              {store.name}
            </h3>

            <p className="text-sm text-gray-600">{store.distance} km away</p>

            <p className="font-semibold mt-3 text-[#115D29]">
              Always Available Medicines:
            </p>

            <ul className="text-sm text-gray-700 mt-1 flex-1 mb-5">
              {store.medicines.map((med, i) => (
                <li key={i}>{med}</li>
              ))}
            </ul>

            <button className="w-full bg-[#115D29] text-white rounded-lg flex items-center justify-center gap-2 py-2 mt-auto text-[14px]">
              <img src={checkIcon} alt="check" className="w-4 h-4" />
              Check the Medicine Availability
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
