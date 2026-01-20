import { useState } from "react";

export default function DoctorVerification({ open, onClose }) {
  const [screen, setScreen] = useState("role"); // "role" or "form"
  const [role, setRole] = useState("");

  if (!open) return null;

  /* ------------------------------
      FIRST SCREEN → ROLE CONFIRMATION
  ------------------------------ */
  const RoleScreen = () => (
    <>
      {/* Title */}
      <h2 className="text-[#115D29] text-[24px] font-semibold">
        Doctor Verification
      </h2>

      {/* INNER BOX */}
      <div className="w-full border border-[#E7EFEA] rounded-[10px] overflow-hidden">

        {/* Header */}
        <div className="h-[52px] bg-[#FAF9F9] border-b border-[#E7EFEA] px-4 flex items-center">
          <span className="text-[#115D29] font-semibold text-[16px]">
            Confirm Your Role
          </span>
        </div>

        {/* Content */}
        <div className="px-6 py-6 flex flex-col gap-5">
          <p className="text-[#115D29] font-medium text-[15px]">
            Are you a registered medical professional (Doctor)?
          </p>

          <label className="flex items-center gap-3 text-[#115D29] text-[15px] cursor-pointer">
            <input
              type="radio"
              name="role"
              value="doctor"
              onChange={(e) => setRole(e.target.value)}
              className="w-5 h-5"
            />
            Yes, I am a Doctor
          </label>

          <label className="flex items-center gap-3 text-[#115D29] text-[15px] cursor-pointer">
            <input
              type="radio"
              name="role"
              value="customer"
              onChange={(e) => setRole(e.target.value)}
              className="w-5 h-5"
            />
            No, I am a Customer
          </label>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-6 pt-2">
        <button
          className="w-full h-[52px] bg-[#115D29] text-white rounded-[10px] text-[16px] font-semibold"
          onClick={() => {
            if (role === "doctor") setScreen("form");
          }}
        >
          Confirm
        </button>

        <button
          onClick={onClose}
          className="w-full h-[52px] bg-white border border-[#115D29] text-[#115D29] rounded-[10px] text-[16px] font-semibold"
        >
          Cancel
        </button>
      </div>
    </>
  );

  /* ------------------------------
      SECOND SCREEN → DOCTOR CREDENTIAL FORM
  ------------------------------ */
  const CredentialForm = () => (
    <>
      {/* Title */}
      <h2 className="text-[#115D29] text-[20px] font-semibold">
        Please verify your credentials to proceed.
      </h2>

      {/* INNER FORM BOX */}
      <div className="w-full border border-[#B5CDBD] rounded-[8px] p-4 flex flex-col gap-6">

        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="text-[#115D29] text-[14px] font-medium">
            Full Name (as per registration)
          </label>
          <input
            className="border border-[#E7EFEA] rounded-[6px] h-[44px] px-3 text-[14px]"
            placeholder="Enter Full Name"
          />
        </div>

        {/* Medical Reg Number */}
        <div className="flex flex-col gap-1">
          <label className="text-[#115D29] text-[14px] font-medium">
            Medical Registration Number
          </label>
          <input
            className="border border-[#E7EFEA] rounded-[6px] h-[44px] px-3 text-[14px]"
            placeholder="e.g., MCI / State Council ID"
          />
        </div>

        {/* Clinic Name */}
        <div className="flex flex-col gap-1">
          <label className="text-[#115D29] text-[14px] font-medium">
            Clinic / Hospital Name
          </label>
          <input
            className="border border-[#E7EFEA] rounded-[6px] h-[44px] px-3 text-[14px]"
            placeholder="Enter Clinic / Hospital Name"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-[#115D29] text-[14px] font-medium">
            Official Email / Clinic Email
          </label>
          <input
            className="border border-[#E7EFEA] rounded-[6px] h-[44px] px-3 text-[14px]"
            placeholder="name@email.com"
          />
        </div>

        {/* Upload Field */}
        <div className="flex flex-col gap-1">
          <label className="text-[#115D29] text-[14px] font-medium">
            Upload ID Proof / Registration Certificate
          </label>

          <div className="border border-[#E7EFEA] rounded-[6px] h-[44px] px-3 flex items-center text-[14px] text-[#8CA394] gap-3 cursor-pointer">
             Upload Document
          </div>
        </div>
         {/* BUTTONS */}
      <div className="flex gap-6 pt-2">
        <button
          className="w-full h-[52px] bg-[#115D29] text-white rounded-[10px] text-[16px] font-semibold"
        >
          Verify & Continue
        </button>

        <button
          onClick={onClose}
          className="w-full h-[52px] border border-[#115D29] text-[#115D29] rounded-[10px] text-[16px] font-semibold"
        >
          Cancel
        </button>
      </div>
      </div>

     
    </>
  );

  /* ------------------------------
      MAIN RETURN → wrapper + conditional screen
  ------------------------------ */
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="w-[650px] bg-white rounded-[12px] p-8 shadow-xl flex flex-col gap-6">
        {screen === "role" ? <RoleScreen /> : <CredentialForm />}
      </div>
    </div>
  );
}
