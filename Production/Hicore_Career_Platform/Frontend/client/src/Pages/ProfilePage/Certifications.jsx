import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import workIcon from "../../assets/profile/step6.png";
import deleteIcon from "../../assets/profile/delete.png";
import uploadicon from "../../assets/profile/upload.png";

const Certifications = forwardRef(({ updateData, initialData }, ref) => {
  const [certifications, setCertifications] = useState(initialData || []);

  // ✅ Sync with parent
  useEffect(() => {
    if (updateData) {
      // Send clean data (remove preview URLs)
      const clean = certifications.map(({ file_preview, ...rest }) => rest);
      updateData(clean);
    }
  }, [certifications, updateData]);

  // ✅ Add new certificate
  const handleAddCertification = () => {
    setCertifications((prev) => [
      ...prev,
      {
        certificate_name: "",
        issuing_org: "",
        issue_year: "",
        expiry_year: "",
        credential_url: "",
      },
    ]);
  };

  // ✅ Delete certificate
  const handleDeleteCertification = (index) => {
    setCertifications((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Handle text input
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setCertifications((prev) => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };


  useImperativeHandle(ref, () => ({
    validate: () => {
      if (certifications.length === 0) {
        return true;
      }

      const currentYear = new Date().getFullYear();
      const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[a-z]{2,}(\/[\w\d#?&=.-]*)*\/?$/i;

      for (let i = 0; i < certifications.length; i++) {
        const cert = certifications[i];
        if (
          !cert.certificate_name?.trim() ||
          !cert.issuing_org?.trim() ||
          !cert.issue_year?.trim() ||
          !cert.credential_url?.trim()
        ) {
          alert(`⚠️ Please fill all required fields in Certificate ${i + 1}.`);
          return false;
        }

        const year = Number(cert.issue_year);
        if (year < 1970 || year > currentYear) {
          alert(
            `⚠️ Issue Year in Certificate ${i + 1} must be between 1970 and ${currentYear}.`
          );
          return false;
        }

        if (!urlRegex.test(cert.credential_url)) {
          alert(`⚠️ Invalid Credential URL in Certificate ${i + 1}.`);
          return false;
        }
      }
      return true;
    },
  }));

  return (
    <div className="w-full h-fit pt-4 pr-32 pb-4 pl-32 flex flex-col gap-5 max-md:px-4 font-inter">
      {/* Empty State */}
      {certifications.length === 0 && (
        <div className="w-full h-[450px] flex flex-col items-center justify-center gap-4">
          <img src={workIcon} alt="Certification Icon" className="w-12 h-12 opacity-25" />
          <p className="font-poppins font-semibold text-[20px] text-[#DAD8EE] text-center">
            No Certifications added yet.
          </p>
          <p className="font-poppins font-semibold text-[20px] text-[#DAD8EE] text-center">
            Click “Add Certificate” to get started.
          </p>
          <button
            onClick={handleAddCertification}
            className="w-[200px] h-[36px] bg-[#343079] text-white font-poppins font-semibold text-[20px] rounded-lg shadow-md hover:bg-[#2a276b] transition"
          >
            + Add Certificate
          </button>
        </div>
      )}

      {/* Add Button (when list exists) */}
      {certifications.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleAddCertification}
            className="w-[200px] h-[52px] px-4 py-2 bg-[#343079] text-white font-poppins font-semibold text-[20px] rounded-lg shadow-md hover:bg-[#2a276b] transition"
          >
            + Add Certificate
          </button>
        </div>
      )}

      {/* Certificate Cards */}
      {certifications.map((cert, index) => (
        <div
          key={index}
          className="w-full min-h-fit rounded-lg border border-[#AEADBE] p-9 flex flex-col gap-5 shadow-sm bg-white"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <p className="font-poppins font-semibold text-[20px] text-[#343079]">
              Certificate {index + 1}
            </p>
            <img
              src={deleteIcon}
              alt="Delete"
              onClick={() => handleDeleteCertification(index)}
              className="w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition"
            />
          </div>

          {/* Certificate Name & Issuing Org */}
          <div className="flex gap-4 max-md:flex-col">
            <div className="flex flex-col w-1/2 max-md:w-full gap-1">
              <label className="font-poppins text-[16px] text-[#343079]">
                Certificate Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="certificate_name"
                value={cert.certificate_name}
                onChange={(e) => handleChange(e, index)}
                placeholder="AWS Cloud Practitioner"
                className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079] outline-none focus:border-[#343079]"
              />
            </div>

            <div className="flex flex-col w-1/2 max-md:w-full gap-1">
              <label className="font-poppins text-[16px] text-[#343079]">
                Issuing Organization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="issuing_org"
                value={cert.issuing_org}
                onChange={(e) => handleChange(e, index)}
                placeholder="Amazon"
                className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079] outline-none focus:border-[#343079]"
              />
            </div>
          </div>

          {/* Issue Year & Expiry Year */}
          <div className="flex gap-4 max-md:flex-col">
            <div className="flex flex-col w-1/2 max-md:w-full gap-1">
              <label className="font-poppins text-[16px] text-[#343079]">
                Issue Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="issue_year"
                value={cert.issue_year}
                onChange={(e) => handleChange(e, index)}
                placeholder="2023"
                min="1970"
                max={new Date().getFullYear()}
                className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079] outline-none focus:border-[#343079]"
              />
            </div>

            <div className="flex flex-col w-1/2 max-md:w-full gap-1">
              <label className="font-poppins text-[16px] text-[#343079]">
                Expiry Year
              </label>
              <input
                type="number"
                name="expiry_year"
                value={cert.expiry_year}
                onChange={(e) => handleChange(e, index)}
                placeholder="2026"
                min="1980"
                max="2100"
                className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079] outline-none focus:border-[#343079]"
              />
            </div>
          </div>

          {/* Credential URL */}
          <div className="flex flex-col w-full gap-1">
            <label className="font-poppins text-[16px] text-[#343079]">
              Credential URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="credential_url"
              value={cert.credential_url}
              onChange={(e) => handleChange(e, index)}
              placeholder="https://example.com/certificate"
              className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079] outline-none focus:border-[#343079]"
            />
          </div>
        </div>
      ))}
    </div>
  );
});

export default Certifications;
