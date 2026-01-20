import React from "react";
import backIcon from "../../../assets/Customers/Emergency/Back.png";
import ambulanceIcon from "../../../assets/Customers/Emergency/Ambulance.png";
import hospitalIcon from "../../../assets/Customers/Emergency/Hospital.png";
import pharmacyIcon from "../../../assets/Customers/Emergency/medicine.png";
import doctorIcon from "../../../assets/Customers/Emergency/Doctor.png";

/* NEW imports - map + right column icons + card icons */
import mapImg from "../../../assets/Customers/Emergency/map.png";
import refreshIcon from "../../../assets/Customers/Emergency/replay.png";
import phoneIcon from "../../../assets/Customers/Emergency/phone.png";
import trackingIcon from "../../../assets/Customers/Emergency/location.png";
import cardHospitalIcon from "../../../assets/Customers/Emergency/clinic.png";
import cardPoliceIcon from "../../../assets/Customers/Emergency/police.png";
import cardFireIcon from "../../../assets/Customers/Emergency/fire.png";
import cardAmbulanceIcon from "../../../assets/Customers/Emergency/vechile.png";

/* Emergency Contacts icon */
import contactIcon from "../../../assets/Customers/Emergency/mobile.png";

/* Health Profile icon (add this image file to assets) */
import healthIcon from "../../../assets/Customers/Emergency/health.png";

/* Helplines images - add these into assets */
import hlAmbulance from "../../../assets/Customers/Emergency/medical-vechile.png";
import hlHealth from "../../../assets/Customers/Emergency/help-line.png";
import hlPolice from "../../../assets/Customers/Emergency/patrol.png";
import hlFire from "../../../assets/Customers/Emergency/fire-service.png";
import hlMental from "../../../assets/Customers/Emergency/mental-health.png";
import hlWomen from "../../../assets/Customers/Emergency/womens.png";
import hlChild from "../../../assets/Customers/Emergency/students.png";
import hlSenior from "../../../assets/Customers/Emergency/older.png";
import hlSuide from "../../../assets/Customers/Emergency/suside.png";
import hlblood from "../../../assets/Customers/Emergency/blood.png";
import hldisater from "../../../assets/Customers/Emergency/volunter.png";
import hlroad from "../../../assets/Customers/Emergency/accident.png";

const EmergencyHelp = ({ open, onClose }) => {
  if (!open) return null;

  /* Dynamic helplines data - edit / extend as needed */
  const helplines = [
    {
      id: "ambulance",
      title: "Ambulance",
      desc: "Emergency medical assistance",
      number: "108",
      img: hlAmbulance,
    },
    {
      id: "health",
      title: "Health Helpline",
      desc: "General health advice & medical guidance",
      number: "104",
      img: hlHealth,
    },
    {
      id: "police",
      title: "Police",
      desc: "Report crimes, thefts, or emergencies",
      number: "100",
      img: hlPolice,
    },
    {
      id: "fire",
      title: "Fire & Rescue",
      desc: "Fire accidents, gas leaks, or hazards",
      number: "101",
      img: hlFire,
    },
    {
      id: "mental",
      title: "Mental Health Support",
      desc: "24×7 mental health & emotional support",
      number: "1800-599-0019",
      img: hlMental,
    },
    {
      id: "women",
      title: "Women Helpline (National)",
      desc: "Assistance for women in distress",
      number: "1091",
      img: hlWomen,
    },
    {
      id: "child",
      title: "Child Helpline",
      desc: "Protection & help for children in need",
      number: "1098",
      img: hlChild,
    },
    {
      id: "senior",
      title: "Senior Citizen Helpline",
      desc: "Support for elderly citizens",
      number: "14567",
      img: hlSenior,
    },
    {
      id: "Suicide Prevention",
      title: "Suicide Prevention (AASRA)",
      desc: "Confidential support for suicidal thoughts",
      number: "91-9820466726",
      img: hlSuide,
    },
    {
      id: "women",
      title: "Women Helpline (National)",
      desc: "Assistance for women in distress",
      number: "1910",
      img: hlblood,
    },
    {
      id: "child",
      title: "Child Helpline",
      desc: "Protection & help for children in need",
      number: "1078",
      img: hldisater,
    },
    {
      id: "senior",
      title: "Senior Citizen Helpline",
      desc: "Support for elderly citizens",
      number: "1033",
      img: hlroad,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start bg-black/90 p-5 pt-0 pb-0 justify-center scrollbar-hide overflow-y-auto"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full bg-white rounded-lg shadow-lg p-6"
        style={{ minHeight: 220 }}
      >
        {/* Back row */}
        <div className="mb-4">
          <button
            onClick={onClose}
            aria-label="Back"
            className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-gray-50 transition"
          >
            <span className="flex items-center justify-center rounded-full">
              <img src={backIcon} alt="back" className="w-5 h-5" />
            </span>
            <span className="text-sm font-medium text-[#115D29]">Back</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#115D29]">
            Emergency Help
          </h2>
          <p className="text-sm text-[#3F8B4F] mt-2">
            Get instant access to nearby hospitals, ambulances, and emergency
            hotlines
          </p>
        </div>

        {/* Action buttons */}
        <div className="w-full mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {/* Call Ambulance */}
            <button
              onClick={() => {}}
              className="flex items-center justify-center gap-3 py-4 px-5 rounded-md text-white font-medium"
              style={{
                background: "#E54040",
                minHeight: 48,
              }}
            >
              <img src={ambulanceIcon} alt="ambulance" className="w-5 h-5" />
              <span>Call Ambulance</span>
            </button>

            {/* Nearest Hospital */}
            <button
              onClick={() => {}}
              className="flex items-center justify-center gap-3 py-4 px-5 rounded-md text-white font-medium"
              style={{
                background: "#2874BA",
                minHeight: 48,
              }}
            >
              <img src={hospitalIcon} alt="hospital" className="w-5 h-5" />
              <span>Nearest Hospital</span>
            </button>

            {/* Pharmacy Open */}
            <button
              onClick={() => {}}
              className="flex items-center justify-center gap-3 py-4 px-5 rounded-md text-white font-medium"
              style={{
                background: "#30B130",
                minHeight: 48,
              }}
            >
              <img src={pharmacyIcon} alt="pharmacy" className="w-5 h-5" />
              <span>Pharmacy Open</span>
            </button>

            {/* Emergency Doctor */}
            <button
              onClick={() => {}}
              className="flex items-center justify-center gap-3 py-4 px-5 rounded-md text-white font-medium"
              style={{
                background: "#AF840D",
                minHeight: 48,
              }}
            >
              <img src={doctorIcon} alt="doctor" className="w-5 h-5" />
              <span>Emergency Doctor</span>
            </button>
          </div>
        </div>

        {/* ---------- NEW OUTER BORDER CONTAINER (map + right column + helplines) ---------- */}
        <div className="w-full mt-8 border border-[#B5CDBD] rounded-lg p-5">
          {/* Map + Right action column */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Map card */}
            <div className="flex-1 bg-[#F8FAFB] rounded-md overflow-hidden">
              <div
                style={{ height: 300 }}
                className="rounded-md overflow-hidden"
              >
                <img
                  src={mapImg}
                  alt="map"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </div>

            {/* Right: stacked action buttons */}
            <div className="w-full lg:w-[260px] flex flex-col gap-8">
              <button
                type="button"
                className="flex items-center gap-3 py-6 bg-[#2874BA]/[0.10] px-6 rounded-md border border-[#2B79C9] text-[#0B66B2] justify-center"
              >
                <img src={refreshIcon} alt="refresh" className="w-5 h-5" />
                <span className="font-medium">Refresh Location</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-3 py-6 px-6 rounded-md border border-[#2EA94B] text-[#178C3A] bg-[#088908]/[0.10] justify-center"
              >
                <img src={phoneIcon} alt="call" className="w-5 h-5" />
                <span className="font-medium">Call Support</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-3 py-6 px-6 rounded-md border border-[#C59A2A] text-[#A77D09] bg-[#AF840D]/[0.10] justify-center"
              >
                <img src={trackingIcon} alt="tracking" className="w-5 h-5" />
                <span className="font-medium">Live Tracking</span>
              </button>
            </div>
          </div>

          {/* Local Helplines Section */}
          <div className="w-full mt-6">
            <h3 className="text-[#1F5EA8] font-semibold mb-4">
              Local Helplines (Based on User Location)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card - Nearest Hospital */}
              <div className="flex items-center gap-4 p-4 border border-[#2874BA] rounded-md">
                <div className="flex items-center justify-center w-20 h-20 bg-[#F3FBFF] rounded-md">
                  <img
                    src={cardHospitalIcon}
                    alt="hospital"
                    className="w-15 h-15"
                  />
                </div>
                <div>
                  <div className="text-[#1F67A8] font-semibold">
                    Nearest Hospital
                  </div>
                  <div className="text-sm text-[#1B6FB2] font-medium mt-1">
                    0124-4411223
                  </div>
                  <div className="text-xs text-[#9AA8B4] mt-1">
                    CityCare Emergency, Sector 45
                  </div>
                </div>
              </div>

              {/* Card - Local Police Station */}
              <div className="flex items-center gap-4 p-4 border border-[#2874BA] rounded-md">
                <div className="flex items-center justify-center w-20 h-20 bg-[#F3FBFF] rounded-md">
                  <img
                    src={cardPoliceIcon}
                    alt="police"
                    className="w-15 h-15"
                  />
                </div>
                <div>
                  <div className="text-[#1F67A8] font-semibold">
                    Local Police Station
                  </div>
                  <div className="text-sm text-[#1B6FB2] font-medium mt-1">
                    0124-2727789
                  </div>
                  <div className="text-xs text-[#9AA8B4] mt-1">
                    Sector 43 Police Post
                  </div>
                </div>
              </div>

              {/* Card - Local Fire Station */}
              <div className="flex items-center gap-4 p-4 border border-[#2874BA] rounded-md">
                <div className="flex items-center justify-center w-20 h-20 bg-[#F3FBFF] rounded-md">
                  <img src={cardFireIcon} alt="fire" className="w-15 h-15" />
                </div>
                <div>
                  <div className="text-[#1F67A8] font-semibold">
                    Local Fire Station
                  </div>
                  <div className="text-sm text-[#1B6FB2] font-medium mt-1">
                    0124-2330001
                  </div>
                  <div className="text-xs text-[#9AA8B4] mt-1">
                    Gurugram Central Fire HQ
                  </div>
                </div>
              </div>

              {/* Card - Local Ambulance */}
              <div className="flex items-center gap-4 p-4 border border-[#2874BA] rounded-md">
                <div className="flex items-center justify-center w-20 h-20 bg-[#F3FBFF] rounded-md">
                  <img
                    src={cardAmbulanceIcon}
                    alt="ambulance"
                    className="w-15 h-15"
                  />
                </div>
                <div>
                  <div className="text-[#1F67A8] font-semibold">
                    Local Ambulance
                  </div>
                  <div className="text-sm text-[#1B6FB2] font-medium mt-1">
                    +91 98765 43210
                  </div>
                  <div className="text-xs text-[#9AA8B4] mt-1">
                    Apollo Ambulance Services
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- NEW: Emergency Contacts block (matches provided image) ---------- */}
        <div className="w-full mt-6 border border-[#B5CDBD] rounded-lg p-6">
          {/* Row with icon + title (title area only) */}
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="w-12 h-12 rounded-md bg-[#0D5E2B] flex items-center justify-center">
              <img src={contactIcon} alt="contacts" className="w-12 h-12" />
            </div>

            {/* Title + description */}
            <div className="flex-1">
              <div>
                <div className="text-[#0D5E2B] font-semibold">
                  Emergency Contacts
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Add family, friends, or guardians who will be notified during
                  emergencies.
                </div>
              </div>
            </div>
          </div>

          {/* Form row: Contact Name & Contact Number - full width aligned to container left */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-[#115D29] block mb-2">
                Contact Name
              </label>
              <input
                type="text"
                placeholder="Enter Full Name"
                className="w-full border border-[#B5CDBD] rounded-md px-3 py-3 text-sm placeholder:text-[#9DB69A] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-[#2E6E3E] block mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                placeholder="+91 Enter 10 digit Number"
                className="w-full border border-[#B5CDBD] rounded-md px-3 py-3 text-sm placeholder:text-[#9DB69A] focus:outline-none"
              />
            </div>
          </div>

          {/* Add Emergency Contact link */}
          <div className="mt-3">
            <button
              type="button"
              className="text-[#2874BA] text-sm font-medium"
            >
              Add Emergency Contact <span className="text-[#2874BA]">+</span>
            </button>
          </div>

          {/* Checkbox and buttons */}
          <div className="mt-6 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                id="autoAlert"
                type="checkbox"
                className="w-4 h-4 border border-[#CFE8D6] rounded-sm text-[#0D5E2B]"
              />
              <label htmlFor="autoAlert" className="text-sm text-[#356C40]">
                Auto-alert emergency contact when help is requested
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-[#2D6A3E] rounded-md text-sm text-[#2D6A3E]">
                Edit
              </button>
              <button className="px-4 py-2 rounded-md text-sm bg-[#145C2C] text-white">
                Save
              </button>
            </div>
          </div>
        </div>
        {/* ---------- END Emergency Contacts block ---------- */}

        {/* ---------- NEW: Health Profile block (matches provided image) ---------- */}
        <div className="w-full mt-6 border border-[#B5CDBD] rounded-lg p-6">
          {/* Row with icon + title + description */}
          <div className="flex items-start gap-4">
            {/* Icon square */}
            <div className="w-12 h-12 rounded-md bg-[#0D5E2B] flex items-center justify-center">
              <img src={healthIcon} alt="health" className="w-12 h-12" />
            </div>

            {/* Title + description */}
            <div className="flex-1">
              <div>
                <div className="text-[#0D5E2B] font-semibold">
                  Health Profile
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Add your health problems for the emergency responders who will
                  be notified during emergencies.
                </div>
              </div>
            </div>
          </div>

          {/* Form fields - grid with two columns (left/right) */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column fields */}
            <div>
              <label className="text-sm text-[#115D29] block mb-2">
                Blood Group
              </label>
              <input
                type="text"
                placeholder="e.g., B+"
                className="w-full border border-[#B5CDBD] rounded-md px-3 py-3 text-sm placeholder:text-[#9DB69A] focus:outline-none"
              />

              <label className="text-sm text-[#115D29] block mb-2 mt-4">
                Existing Conditions
              </label>
              <input
                type="text"
                placeholder="e.g., Asthma, Diabetes"
                className="w-full border border-[#B5CDBD] rounded-md px-3 py-3 text-sm placeholder:text-[#9DB69A] focus:outline-none"
              />
            </div>

            {/* Right column fields */}
            <div>
              <label className="text-sm text-[#115D29] block mb-2">
                Allergies
              </label>
              <input
                type="text"
                placeholder="eg., Penicillin"
                className="w-full border border-[#B5CDBD] rounded-md px-3 py-3 text-sm placeholder:text-[#9DB69A] focus:outline-none"
              />

              <label className="text-sm text-[#115D29] block mb-2 mt-4">
                Current Medications
              </label>
              <input
                type="text"
                placeholder="eg., Metformin 500mg"
                className="w-full border border-[#B5CDBD] rounded-md px-3 py-3 text-sm placeholder:text-[#9DB69A] focus:outline-none"
              />
            </div>
          </div>

          {/* Share checkbox */}
          <div className="mt-4">
            <label className="flex items-center gap-3 text-sm text-[#356C40]">
              <input
                type="checkbox"
                className="w-4 h-4 border border-[#CFE8D6] rounded-sm text-[#0D5E2B]"
              />
              Share this info automatically with emergency responders.
            </label>
          </div>

          {/* Edit / Save buttons aligned to the right like screenshot */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button className="px-4 py-2 border border-[#2D6A3E] rounded-md text-sm text-[#2D6A3E]">
              Edit
            </button>
            <button className="px-4 py-2 rounded-md text-sm bg-[#145C2C] text-white">
              Save
            </button>
          </div>
        </div>
        {/* ---------- END Health Profile block ---------- */}

        {/* ---------- NEW: National & Local Helplines (dynamic grid, matches your screenshot) ---------- */}
        <div className="w-full mt-6 border border-[#B5CDBD] rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-md bg-[#0D5E2B] flex items-center justify-center">
              <img src={healthIcon} alt="helplines" className="w-12 h-12" />
            </div>
            <div className="flex-1">
              <div className="text-[#0D5E2B] font-semibold">
                National & Local Helplines
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Quick dial list of all helplines
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {helplines.map((h) => (
                <div
                  key={h.id}
                  className={`rounded-md border p-6 border-blue-200 border-2 hover:shadow-md shadow-gray-500 bg-gradient-to-br from-white to-blue-50 hover:border-[#2B79C9] hover:shadow-lg transition-colors transition-shadow duration-200`}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <div className="w-full flex justify-center mb-4">
                        <div className="w-40 h-28 rounded-md flex items-center justify-center overflow-hidden bg-white/60">
                          <img
                            src={h.img}
                            alt={h.title}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </div>

                      <div className="text-[#1F6F3F] font-semibold text-lg mb-2">
                        {h.title}
                      </div>
                      <div className="text-sm text-gray-500 mb-4">{h.desc}</div>
                    </div>

                    <div className="mt-4">
                      <div className="text-[#0F6A34] font-bold text-2xl">
                        {h.number}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* ---------- END Helplines ---------- */}
      </div>
    </div>
  );
};

export default EmergencyHelp;
