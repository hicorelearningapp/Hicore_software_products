import React, { useEffect, useMemo, useState } from "react";
import searchIcon from "../../../assets/Revision/Search.png";
import arrowIcon from "../../../assets/Revision/Chevron.png";

const FormulaSheets = ({ subject, unit }) => {
  const [expandedMap, setExpandedMap] = useState({});
  const [search, setSearch] = useState("");

  /* ---------- NORMALIZE FORMULA DATA ---------- */
  const formulaData = useMemo(() => {
    if (!unit || !Array.isArray(unit.formulas)) return [];

    // CASE 1: FLAT FORMAT
    if (unit.formulas.length && unit.formulas[0].expression) {
      return [
        {
          title: unit.chapterName,
          formulas: unit.formulas,
        },
      ];
    }

    // CASE 2: SECTIONED FORMAT (YOUR CURRENT DATA)
    if (unit.formulas[0]?.formulas) {
      return unit.formulas;
    }

    return [];
  }, [unit]);

  /* ---------- RESET ON UNIT CHANGE ---------- */
  useEffect(() => {
    setExpandedMap({});
    setSearch("");
  }, [unit]);

  const toggleSection = (index) => {
    setExpandedMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="w-full px-4 py-6 bg-white min-h-screen">
      {/* Search */}
      <div className="flex mb-8">
        <div className="relative w-[400px]">
          <input
            type="text"
            placeholder="Search formula here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-5 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <img
            src={searchIcon}
            alt="search"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-70"
          />
        </div>
      </div>

      {/* Formula Sections */}
      <div className="flex flex-col gap-5">
        {formulaData.length === 0 ? (
          <p className="text-center text-blue-700 font-medium">
            Formula sheets coming soon 🚧
          </p>
        ) : (
          formulaData.map((section, index) => (
            <div
              key={index}
              className={`border border-blue-200 rounded-lg ${
                expandedMap[index] ? "shadow-md" : ""
              }`}
            >
              {/* Header */}
              <div
                onClick={() => toggleSection(index)}
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-blue-50"
              >
                <div>
                  <h3 className="text-blue-800 font-semibold text-lg">
                    {section.title}
                  </h3>
                  <p className="text-blue-600 mt-1">
                    {section.formulas.length} formulas
                  </p>
                </div>
                <img
                  src={arrowIcon}
                  alt="arrow"
                  className={`w-4 h-4 transition-transform ${
                    expandedMap[index] ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Content */}
              {expandedMap[index] && (
                <div className="border-t border-blue-100 p-5 space-y-6">
                  {section.formulas
                    .filter((f) =>
                      f.name?.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((f, i) => (
                      <div key={i} className="p-5 rounded-xl bg-gray-100">
                        <h4 className="font-semibold text-blue-800 text-lg mb-3">
                          {f.name}
                        </h4>

                        <div className="mb-3">
                          <p className="font-semibold mb-1">Formula</p>
                          <div className="bg-blue-100 px-4 py-2 rounded-lg font-medium">
                            {f.expression}
                          </div>
                        </div>

                        <p>
                          <b>Derivation:</b> {f.derivation || "—"}
                        </p>
                        <p>
                          <b>Units:</b> {f.units || "—"}
                        </p>
                        <p>
                          <b>Variables:</b> {f.variables || "—"}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FormulaSheets;
