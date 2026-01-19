import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DownloadIcon from "../../../../../assets/Download.png";
import UploadIcon from "../../../../../assets/Upload.png";

const JobSeekerResumebuilder = () => {
  const [progress, setProgress] = useState(0);
  const [importing, setImporting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (importing) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    let timer;
    if (importing && progress < 100) {
      timer = setTimeout(() => {
        setProgress((prev) => prev + 10);
      }, 300);
    } else if (progress === 100) {
      setTimeout(() => {
        setImporting(false);
        setProgress(0);
        navigate("/resume-editor");
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
      document.body.classList.remove("overflow-hidden");
    };
  }, [importing, progress, navigate]);

  const handleImportClick = () => {
    setImporting(true);
    setProgress(0);
  };

  return (
    <section className="max-w-7xl h-auto border rounded min-h-screen border-blue-900 m-4 bg-white relative">
      {importing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
          <div className="bg-white border border-gray-300 shadow-xl rounded-[16px] p-[36px] w-[1107px] h-[144px] flex flex-col justify-center items-center mt-24">
            <div className="w-[1000px] bg-gray-200 rounded-full h-[20px] overflow-hidden mb-4">
              <div
                className="bg-[#5B3CFF] h-[20px] rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="w-[1000px] flex justify-between">
              <p className="text-md font-medium text-gray-800">
                {progress === 100 ? "Upload Completed!" : "Importing..."}
              </p>
              <p className="text-md font-bold text-blue-700">{progress}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1  rounded-[8px] px-10 py-12 flex flex-col justify-start items-center relative">
        <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-10 text-center">
          Welcome to AI Resume Builder
        </h2>

        <div className="bg-white border border-[#E0E0E0]  rounded-[8px] p-[36px] w-full max-w-[718px] text-center ">
          <h4 className="text-xl font-semibold text-blue-900 mb-6">
            Craft a Smarter Resume — Instantly
          </h4>
          <p className="text-md text-blue-900 mb-10">
            Build or enhance your resume with the power of AI. Whether you're
            starting from scratch or refining an existing one, our builder helps
            you:
          </p>
          <p className="text-sm text-blue-900 mb-10">
            • PDF format only &nbsp; • Maximum file size: 10MB
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleImportClick}
              className="flex items-center gap-2 border border-[#2D3A63] bg-blue-800 text-white py-3 px-6 rounded-md font-medium text-md"
            >
              <img
                src={DownloadIcon}
                alt="download"
                className="w-6 h-6 text-white"
              />
              Import Profile
            </button>
            <button className="flex items-center gap-2 border border-[#2D3A63] text-[#2D3A63] py-3 px-6 rounded-md font-medium text-md">
              <img src={UploadIcon} alt="upload" className="w-6 h-6" />
              Upload Resume
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobSeekerResumebuilder;
