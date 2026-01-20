// src/.../MedicineInfo.jsx
import React from "react";
import tabletImg from "../../../../assets/Customers/Medicines/dolo.jpg";
import backIcon from "../../../../assets/Customers/Medicines/back-icon.png";
import warningIcon from "../../../../assets/Customers/Medicines/danger.png"; 

const MedicineInfo = ({ medicine = {}, onClose }) => {
  const defaultNotes = [
    "Do not exceed the recommended dose. Overdose can cause serious liver damage.",
    "Check all medicines you take: many cold/flu, pain relief products contain paracetamol. Taking them together can risk overdose.",
    "Pregnancy / Breast-feeding: Paracetamol is generally considered safe at recommended doses for short durations, but consult your doctor first.",
    "Children & Elderly: Extra caution is required—use only under medical advice.",
    "Storage: Store in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  ];

  const defaultQuickFacts = {
    Classification: "Analgesic / Antipyretic",
    Manufacturer: "Various (multiple generic brands)",
    Prescription: "OTC (Over-the-Counter) in many jurisdictions",
    "Common Uses": "Fever reduction, mild/moderate pain relief",
    "Typical Duration":
      "Use for shortest time necessary; seek advice if longer than 3-4 days",
    "Warning Symbols": "Liver risk, allergic reactions",
  };

  // new defaults for Uses / Substitutes
  const defaultUses = [
    "Relief of fever (antipyretic) and mild to moderate pain (analgesic) including headache, toothache, muscle aches, back pain, joint pain.",
    "Pain associated with cold/flu symptoms.",
    "Post-vaccination fever or body aches (when prescribed) in some cases.",
  ];

  const defaultSubstitutes = [
    "If Paracetamol 650 mg is unavailable or if a substitute is needed (under medical/pharmacist supervision), some alternatives include:",
    "Dolo 650 Tablet (Paracetamol 650 mg, Micro Labs)",
    "Crocin 650 Tablet (Paracetamol 650 mg, GSK)",
    "Panacip 650 Tablet (Paracetamol 650 mg, Cipla)",
    "Pacimol 650 Tablet, Paracip 650 Tablet etc.",
    "Note: Use of alternate brand/generic must be approved by pharmacist/doctor.",
  ];

  // defaults for Precautions & How It Works
  const defaultPrecautions = [
    "Avoid if you have severe liver disease or severe kidney impairment.",
    "Avoid alcohol or large amounts of alcohol while using as it increases risk of liver toxicity.",
    "If pain/fever persists more than 3-4 days, or worsens, consult a doctor.",
  ];

  const defaultHowItWorks = [
    "Paracetamol reduces the intensity of pain signals to the brain and helps block release of prostaglandins (chemicals responsible for pain and fever).",
  ];

  // defaults for Dosage & Side-effects
  const defaultDosage = [
    "Adults: One 650 mg tablet every 4 to 6 hours as needed, do not exceed 6 tablets (3.9 g) per 24 hours unless advised by a physician.",
    "May be taken with or without food. If stomach upset occurs, taking with food can help.",
    "Children: Use only under medical supervision. Paracetamol 650 mg is generally not recommended for young children without prescription.",
    "Important: Never take multiple medicines that contain paracetamol simultaneously (risk of overdose).",
  ];

  const defaultSideEffects = [
    "Common / Mild side-effects: Nausea, vomiting, indigestion, stomach pain, diarrhoea.",
    "Skin rash, itching, blisters (rare).",
    "Serious / Rare side-effects: Allergic reactions (swelling of face/lips/throat, difficulty breathing).",
    "Liver damage (especially with overdose or chronic high use), kidney problems, blood disorders (very rare).",
  ];

  const notes =
    Array.isArray(medicine.notes) && medicine.notes.length > 0
      ? medicine.notes
      : defaultNotes;

  const quickFacts = {
    ...defaultQuickFacts,
    ...(medicine.quickFacts || {}),
  };

  const quickFactRows = Object.entries(quickFacts);

  const uses =
    Array.isArray(medicine.uses) && medicine.uses.length > 0
      ? medicine.uses
      : defaultUses;
  const substitutes =
    Array.isArray(medicine.substitutes) && medicine.substitutes.length > 0
      ? medicine.substitutes
      : defaultSubstitutes;

  const precautions =
    Array.isArray(medicine.precautions) && medicine.precautions.length > 0
      ? medicine.precautions
      : defaultPrecautions;

  const howItWorks =
    Array.isArray(medicine.howItWorks) && medicine.howItWorks.length > 0
      ? medicine.howItWorks
      : defaultHowItWorks;

  const dosage =
    Array.isArray(medicine.dosage) && medicine.dosage.length > 0
      ? medicine.dosage
      : defaultDosage;

  const sideEffects =
    Array.isArray(medicine.sideEffects) && medicine.sideEffects.length > 0
      ? medicine.sideEffects
      : defaultSideEffects;

  return (
    <div
      className="fixed inset-0 z-60 flex items-start justify-center overflow-auto scrollbar-hide"
      role="dialog"
      aria-modal="true"
      aria-label="Medicine Information"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative z-10 w-full bg-white rounded-2xl border border-[#E6F0EA] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Back button */}
        <div className="flex items-center justify-between px-6 pt-4">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-3 text-[#115D29] text-sm font-medium hover:underline"
            aria-label="Back"
          >
            <span className="w-7 h-7 flex items-center justify-center bg-white ">
              <img src={backIcon} alt="back" className="w-5 h-5" />
            </span>
            <span>Back</span>
          </button>

          <div className="hidden" />
        </div>

        {/* Header */}
        <div className="px-6 pb-6">
          <div className="flex items-start gap-6 mt-4">
            <div className="w-40 h-40 flex-shrink-0">
              <img
                src={tabletImg}
                alt={medicine?.title || "Medicine"}
                className="w-full h-full object-cover rounded-md border border-[#F0F6F0] bg-white"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-xl lg:text-2xl font-semibold text-[#115D29]">
                {medicine?.title || "Paracetamol 650 mg Tablet"}
              </h1>

              <div className="mt-4 text-md text-[#2F6F3B] space-y-5">
                <div>
                  <span className="font-semibold text-[#115D29]">
                    Generic Name:{" "}
                  </span>
                  <span>
                    {medicine?.brand || "Paracetamol"}{" "}
                    <span className="text-gray-600">
                      (also known as Acetaminophen)
                    </span>
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-[#115D29]">
                    Strength:{" "}
                  </span>
                  <span className="text-[#2F6F3B]">
                    {medicine?.count || "650 mg per tablet"}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-[#115D29]">
                    Therapeutic Class:{" "}
                  </span>
                  <span className="text-[#2F6F3B]">
                    Analgesic & Antipyretic
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- TWO COLUMN SECTION ---------------- */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* -------- LEFT: Important Notes -------- */}
            <div className="rounded-lg overflow-hidden border border-[#F1EAEA] bg-white">
              <div className="bg-[#FBF6F6] px-6 py-4 border-b border-[#E7EFEA]">
                <h2 className="text-lg font-semibold text-[#115D29]">
                  Important Notes for Users
                </h2>
              </div>

              <div className="p-6 bg-[#FEFEFE]">
                <ul className="text-[#115D29] space-y-6  list-disc list-inside">
                  {notes.map((n, idx) => (
                    <li key={idx} className="text-sm">
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* -------- RIGHT: Quick Facts Table (FIXED) -------- */}
            <div className="rounded-lg overflow-hidden border border-[#E7EFEA] bg-white">
              <div className="bg-[#FFF9EE] px-6 py-4 border-b border-[#E7EFEA]">
                <h2 className="text-lg font-semibold text-[#115D29]">
                  Quick Facts Table
                </h2>
              </div>

              <div className="p-6 bg-[#FEFEFE]">
                <div className="overflow-hidden rounded-md border border-[#E8EFE6]">
                  <table className="min-w-full table-auto ">
                    <thead>
                      <tr>
                        <th className="text-left  text-[#115D29] text-md font-bold px-4 py-3 border-b border-[#E8EFE6]">
                          Item
                        </th>
                        <th className="text-left  text-[#115D29] text-md font-bold px-4 py-3 border-b border-[#E8EFE6]">
                          Details
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {quickFactRows.map(([label, value], idx) => (
                        <tr key={label}>
                          <td
                            className={`px-4 py-4 text-[#115D29] text-sm font-medium ${
                              idx !== quickFactRows.length - 1
                                ? "border-b border-[#E8EFE6]"
                                : ""
                            }`}
                          >
                            {label}
                          </td>
                          <td
                            className={`px-4 py-4 text-[#2F6F3B] ${
                              idx !== quickFactRows.length - 1
                                ? "border-b border-[#E8EFE6]"
                                : ""
                            }`}
                          >
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- NEW: Uses & Substitutes (two-column) ---------------- */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Uses panel */}
            <div className="rounded-lg overflow-hidden border border-[#E7EFEA] bg-white">
              <div className="bg-[#F7FFEF] px-6 py-4 border-b border-[#E7EFEA]">
                <h2 className="text-lg font-semibold text-[#115D29]">Uses</h2>
              </div>

              <div className="p-6 bg-[#FEFEFE]">
                <ul className="text-[#115D29] space-y-4 list-disc list-inside">
                  {uses.map((u, i) => (
                    <li key={i} className="text-sm">
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Alternate Medicines / Substitutes panel */}
            <div className="rounded-lg overflow-hidden border border-[#E7EFEA] bg-white">
              <div className="bg-[#EEFEF1] px-6 py-4 border-b border-[#E7EFEA]">
                <h2 className="text-lg font-semibold text-[#115D29]">
                  Alternate Medicines / Substitutes
                </h2>
              </div>

              <div className="p-6 bg-[#FEFEFE]">
                <ul className="text-[#115D29] space-y-4 list-disc list-inside">
                  {substitutes.map((s, i) => (
                    <li key={i} className="text-sm">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ---------------- NEW: Precautions & How It Works (two-column) ---------------- */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Precautions */}
            <div className="rounded-lg overflow-hidden border border-[#E7EFEA] bg-white">
              <div className="bg-[#F0FFFE] px-6 py-4 border-b border-[#E7EFEA]">
                <h2 className="text-lg font-semibold text-[#115D29]">
                  Precautions:
                </h2>
              </div>

              <div className="p-6 bg-[#FEFEFE]">
                <ul className="text-[#115D29] space-y-4 list-disc list-inside">
                  {precautions.map((p, i) => (
                    <li key={i} className="text-sm">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* How It Works */}
            <div className="rounded-lg overflow-hidden border border-[#E7EFEA] bg-white">
              <div className="bg-[#F0F2FF] px-6 py-4 border-b border-[#E7EFEA]">
                <h2 className="text-lg font-semibold text-[#115D29]">
                  How It Works?
                </h2>
              </div>

              <div className="p-6 bg-[#FEFEFE]">
                <ul className="text-[#115D29] space-y-4 list-disc list-inside">
                  {howItWorks.map((h, i) => (
                    <li key={i} className="text-sm">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ---------------- NEW: Dosage & Side-effects (two-column) ---------------- */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dosage & Administration */}
            <div className="rounded-lg overflow-hidden border border-[#E7EFEA] bg-white">
              <div className="bg-[#FCF2FF] px-6 py-4 border-b border-[#E7EFEA]">
                <h2 className="text-lg font-semibold text-[#115D29]">
                  Dosage & Administration (General Guide)
                </h2>
              </div>

              <div className="p-6 bg-[#FEFEFE]">
                <ul className="text-[#115D29] space-y-4 list-disc list-inside">
                  {dosage.map((d, i) => (
                    <li key={i} className="text-sm">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Side-Effects & Warnings */}
            <div className="rounded-lg overflow-hidden border border-[#E7EFEA] bg-white">
              <div className="bg-[#FFEDF3] px-6 py-4 border-b border-[#E7EFEA]">
                <h2 className="text-lg font-semibold text-[#115D29]">
                  Side-Effects & Warnings
                </h2>
              </div>

              <div className="p-6 bg-[#FEFEFE]">
                <ul className="text-[#115D29] space-y-4 list-disc list-inside">
                  {sideEffects.map((s, i) => (
                    <li key={i} className="text-sm">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* === DISCLAIMER BAR (added exactly like your image) === */}
          <div className="mt-6">
            <div
              className="w-full rounded-xl border border-[#D2CDCD] bg-[#FDF0F0] px-6 py-6 shadow-gray-400 shadow-lg flex items-center gap-4"
              role="status"
              aria-live="polite"
            >
              <img
                src={warningIcon}
                alt="Disclaimer"
                className="w-5 h-5 flex-shrink-0"
              />
              <div className="text-sm text-[#B72828]">
                <strong className="mr-1">Disclaimer:</strong>
                This content is for informational purposes only. Always use
                medicines under the supervision of a qualified physician or
                pharmacist. Individual needs may vary.
              </div>
            </div>
          </div>
          {/* === end disclaimer === */}

          <div className="mt-6" />
        </div>
      </div>
    </div>
  );
};

export default MedicineInfo;
