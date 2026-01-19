import React from "react";
import PencilIcon from "../../../../assets/Employer/PostJobs/pencil.png";
import BulbIcon from "../../../../assets/Employer/PostJobs/bulb.png";

const fields = [
  { label: "Company Details", placeholder: "Type the company details...", rows: 4 },
  { label: "Job Title Input", placeholder: "Type the job title...", rows: 3 },
  { label: "Job Summary", placeholder: "Describe the job in 1–2 lines...", rows: 4 },
];

const Field = ({ label, placeholder, rows }) => (
  <div>
    <label className="block text-[#2D2C8D] font-medium mb-2">{label}</label>
    <textarea
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none border border-[#E6E4F4] rounded-lg p-4 text-sm placeholder:text-[#CFC6E9] focus:outline-none focus:ring-0"
    />
  </div>
);

const EmployersPrompt = () => (
<div className="bg-white rounded-xl shadow border border-[#E1E0EB] p-6 w-full h-full box-border">
    {/* Title */}
    <div className="flex items-center gap-3 mb-4">
      <img src={PencilIcon} alt="Pencil" className="w-7 h-7" />
      <h2 className="text-xl font-semibold text-[#2D2C8D]">Employer’s Prompt</h2>
    </div>

    {/* Inner Panel */}
    <div className="rounded-lg border-1 border-[#2D2C8D] overflow-hidden">
      <div className="bg-[#F2F2FF] text-[#2D2C8D] font-semibold px-5 py-3 border-b-1 border-[#2D2C8D]">
        Let’s Create Your Next Great Job Post!
      </div>
      <div className="p-5 space-y-6">
        {fields.map((f, i) => (
          <Field key={i} {...f} />
        ))}
        <button className="bg-[#2D2C8D] text-white px-4 py-2 rounded-md text-sm hover:bg-[#1f1f6b] transition">
          Create a New Job Posting
        </button>
      </div>
    </div>

    {/* Info Box */}
    <div className="mt-6 bg-[#F3FFF0] border border-[#DFF7D9] rounded-lg p-4 flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5 w-8 h-8 bg-[#FFF6D6] rounded-full flex items-center justify-center">
        <img src={BulbIcon} alt="Bulb" className="w-4 h-4" />
      </div>
      <p className="text-sm text-[#2D2C8D]">
        All AI suggestions are fully editable — customize them to match your needs.
      </p>
    </div>
  </div>
);

export default EmployersPrompt;
