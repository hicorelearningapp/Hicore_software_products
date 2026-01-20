import React, { useState } from "react";

// Icons
import backIcon from "../../../../assets/Customers/ConsultDoctors/back.png";
import searchIcon from "../../../../assets/Customers/ConsultDoctors/search.png";

import doctorImg from "../../../../assets/Customers/ConsultDoctors/doctor1.jpg";
import heartIcon from "../../../../assets/Customers/ConsultDoctors/heart.png";
import heartFilledIcon from "../../../../assets/Customers/ConsultDoctors/heart-filled.png";

import expIcon from "../../../../assets/Customers/ConsultDoctors/experience.png";
import feeIcon from "../../../../assets/Customers/ConsultDoctors/fee.png";
import starIcon from "../../../../assets/Customers/ConsultDoctors/star.png";
import timeIcon from "../../../../assets/Customers/ConsultDoctors/time.png";
import locationIcon from "../../../../assets/Customers/ConsultDoctors/location.png";

// NEW ASSETS
import aiIcon from "../../../../assets/Customers/ConsultDoctors/ai-assist.png";
import uploadIcon from "../../../../assets/Customers/ConsultDoctors/upload.png";

// IMPORT BOOK APPOINTMENT PAGE (OVERLAY)
import BookAppointment from "./BookAppointment";


// Dummy doctors list
const doctors = [
  {
    id: 1,
    image: doctorImg,
    name: "Dr. Priya Mehta (Dermatologist)",
    speciality: "Specializes in acne & allergy treatment",
    experience: "10+ Years Experience",
    fee: "₹600",
    rating: "4.8",
    reviews: "210",
    timing: "4 PM – 8 PM",
    location: "SkinCare Clinic, Sector 14, Gurugram",
  },
  {
    id: 2,
    image: doctorImg,
    name: "Dr. Rohan Shah (General Physician)",
    speciality: "Specializes in fever, infections & general care",
    experience: "8+ Years Experience",
    fee: "₹500",
    rating: "4.7",
    reviews: "180",
    timing: "5 PM – 9 PM",
    location: "City Health Clinic, Sector 21, Gurugram",
  },
  {
    id: 3,
    image: doctorImg,
    name: "Dr. Priya Mehta (Dermatologist)",
    speciality: "Specializes in acne & allergy treatment",
    experience: "10+ Years Experience",
    fee: "₹600",
    rating: "4.8",
    reviews: "210",
    timing: "4 PM – 8 PM",
    location: "SkinCare Clinic, Sector 14, Gurugram",
  },
];


// DOCTOR CARD COMPONENT
const DoctorCard = ({ doctor, isFav, onFavToggle, onBook }) => {
  return (
    <div className="border border-[#B5CDBD] rounded-[8px] p-4 flex flex-col gap-4">

      {/* TOP */}
      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-start">
          <img
            src={doctor.image}
            className="w-[64px] h-[64px] object-cover rounded-[8px]"
          />

          <div>
            <p className="text-[#115D29] font-semibold">{doctor.name}</p>
            <p className="text-[#115D29] text-sm opacity-80">
              {doctor.speciality}
            </p>
          </div>
        </div>

        <img
          src={isFav ? heartFilledIcon : heartIcon}
          onClick={onFavToggle}
          className="w-6 h-6 cursor-pointer"
        />
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">

        <div className="flex items-center gap-2">
          <img src={expIcon} className="w-4 h-4" />
          <span className="text-[#115D29] text-sm">{doctor.experience}</span>
        </div>

        <div className="flex items-center gap-2">
          <img src={feeIcon} className="w-4 h-4" />
          <span className="text-[#115D29] text-sm">
            {doctor.fee} <span className="opacity-70">/consultation</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <img src={starIcon} className="w-4 h-4" />
          <span className="text-[#115D29] text-sm">
            {doctor.rating} ({doctor.reviews} Reviews)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <img src={timeIcon} className="w-4 h-4" />
          <span className="text-[#115D29] text-sm">
            Available Today: <b>{doctor.timing}</b>
          </span>
        </div>

        <div className="flex items-center gap-2 col-span-2">
          <img src={locationIcon} className="w-4 h-4" />
          <span className="text-[#115D29] text-sm">{doctor.location}</span>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4">
        <button
          onClick={onBook}
          className="flex-1 bg-[#115D29] text-white rounded-[6px] h-[44px] font-medium"
        >
          Book Appointment
        </button>

        <button className="flex-1 border border-[#115D29] text-[#115D29] bg-white rounded-[6px] h-[44px] font-medium">
          Video Consultant
        </button>
      </div>
    </div>
  );
};



// MAIN SEARCH DOCTORS PAGE
const SearchDoctors = ({ open, onClose }) => {
  const [filters, setFilters] = useState({
    experience: false,
    ratings: false,
    fee: false,
  });

  const [fav, setFav] = useState(false);

  // NEW STATE FOR OVERLAY
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-white px-10 py-8 z-[9999] scrollbar-hide overflow-y-auto">

      {/* BACK */}
      <div
        className="flex items-center gap-2 text-[#115D29] mb-4 cursor-pointer"
        onClick={onClose}
      >
        <img src={backIcon} className="w-4 h-4" />
        <span className="font-medium">Back</span>
      </div>

      <h1 className="text-2xl font-semibold text-[#115D29]">
        Search Doctors & Book Appointment
      </h1>


      {/* SEARCH + SORT */}
      <div className="flex items-center gap-4 mt-6">

        {/* SEARCH BAR */}
        <div
          className="flex items-center border border-[#B5CDBD] rounded-[8px] bg-white pl-4 pr-2 flex-1"
          style={{ height: "48px" }}
        >
          <input
            type="text"
            placeholder="Search by Doctor Name, Specialty, or Clinic"
            className="w-full outline-none text-sm text-[#115D29]"
          />

          <div className="flex items-center justify-center pl-3 pr-3 border-l border-[#B5CDBD] h-full">
            <img src={searchIcon} className="w-5 h-5 opacity-80 cursor-pointer" />
          </div>
        </div>

        {/* SORT */}
        <div
          className="flex items-center gap-4 border border-[#B5CDBD] rounded-[8px] px-4 bg-white"
          style={{ height: "48px" }}
        >
          <span className="text-sm font-medium text-[#115D29]">Sort by :</span>

          <label className="flex items-center gap-2 text-sm text-[#115D29]">
            <input
              type="checkbox"
              checked={filters.experience}
              onChange={() =>
                setFilters((p) => ({ ...p, experience: !p.experience }))
              }
              className="w-4 h-4 accent-[#115D29]"
            />
            Experience
          </label>

          <label className="flex items-center gap-2 text-sm text-[#115D29]">
            <input
              type="checkbox"
              checked={filters.ratings}
              onChange={() =>
                setFilters((p) => ({ ...p, ratings: !p.ratings }))
              }
              className="w-4 h-4 accent-[#115D29]"
            />
            Ratings
          </label>

          <label className="flex items-center gap-2 text-sm text-[#115D29]">
            <input
              type="checkbox"
              checked={filters.fee}
              onChange={() => setFilters((p) => ({ ...p, fee: !p.fee }))}
              className="w-4 h-4 accent-[#115D29]"
            />
            Consultation Fee
          </label>
        </div>
      </div>


      {/* FILTER ROW */}
      <div className="flex flex-nowrap items-center gap-6 mt-6 w-full">

        <div className="flex items-center gap-2 flex-1 min-w-[250px]">
          <span className="text-[#115D29] text-sm whitespace-nowrap">Specialty:</span>
          <select className="border border-[#B5CDBD] rounded-[8px] px-4 bg-white text-sm text-[#115D29] w-full" style={{ height: "44px" }}>
            <option>Select option</option>
          </select>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[250px]">
          <span className="text-[#115D29] text-sm whitespace-nowrap">Availability:</span>
          <select className="border border-[#B5CDBD] rounded-[8px] px-4 bg-white text-sm text-[#115D29] w-full" style={{ height: "44px" }}>
            <option>Select option</option>
          </select>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[250px]">
          <span className="text-[#115D29] text-sm whitespace-nowrap">Consultation Type:</span>
          <select className="border border-[#B5CDBD] rounded-[8px] px-4 bg-white text-sm text-[#115D29] w-full" style={{ height: "44px" }}>
            <option>Select option</option>
          </select>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[250px]">
          <span className="text-[#115D29] text-sm whitespace-nowrap">Gender Preference:</span>
          <select className="border border-[#B5CDBD] rounded-[8px] px-4 bg-white text-sm text-[#115D29] w-full" style={{ height: "44px" }}>
            <option>Select option</option>
          </select>
        </div>
      </div>


      {/* DOCTOR LIST */}
      <div className="w-full mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((doc) => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            isFav={fav}
            onFavToggle={() => setFav(!fav)}
            onBook={() => setAppointmentOpen(true)}   // OPEN APPOINTMENT PAGE
          />
        ))}
      </div>


      {/* AI HEALTH BOX */}
      <div
        className="w-full mt-10 border border-[#2874BA] rounded-[8px] p-4 flex items-center justify-between"
        style={{ background: "#2874BA0D" }}
      >
        <div className="flex items-center gap-4">

          <div
            className="w-[100px] h-[100px] rounded-[8px] flex items-center justify-center"
            style={{ background: "#2874BA" }}
          >
            <img src={aiIcon} className="w-[64px] h-[64px]" />
          </div>

          <div className="flex flex-col">
            <p className="text-[#2874BA] font-semibold text-lg mb-2">AI Health Assistant</p>
            <p className="text-[#2874BA] text-sm cursor-pointer mb-2">Need help choosing a doctor?</p>
            <p className="text-[#2874BA] text-sm opacity-80 mt-1">
              Suggests best doctors based on uploaded prescription.
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-[#2874BA] text-white px-4 py-2 rounded-[6px] h-[40px]">
          <img src={uploadIcon} className="w-[20px] h-[20px]" />
          Upload prescription
        </button>
      </div>


      {/* OVERLAY BOOK APPOINTMENT */}
      {appointmentOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[99999]">
          <BookAppointment onClose={() => setAppointmentOpen(false)} />
        </div>
      )}

    </div>
  );
};

export default SearchDoctors;
