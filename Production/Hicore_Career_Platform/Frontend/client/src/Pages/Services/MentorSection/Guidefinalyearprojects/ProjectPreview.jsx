// src/components/ProjectPreview.js
import React from 'react';

const ProjectPreview = ({ formData, onClose }) => {
  return (
    <div className="w-[541px] h-[444px] p-9 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center">
      <div className="w-[469px] h-[372px] p-9 border border-[#EBEAF2] rounded-lg flex flex-col gap-9">
        {/* Project Details */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-poppins font-normal text-sm text-[#343079]">Domain:</span>
            <span className="font-poppins font-semibold text-sm text-[#343079]">{formData.projectDomain}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-poppins font-normal text-sm text-[#343079]">Type:</span>
            <span className="font-poppins font-semibold text-sm text-[#343079]">{formData.projectType}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-poppins font-normal text-sm text-[#343079]">Group Size:</span>
            <span className="font-poppins font-semibold text-sm text-[#343079]">{formData.groupSize}</span>
          </div>
          {formData.schedule && (
            <div className="flex gap-2">
              <span className="font-poppins font-normal text-sm text-[#343079]">Schedule:</span>
              <span className="font-poppins font-semibold text-sm text-[#343079]">{new Date(formData.schedule).toLocaleDateString()}</span>
            </div>
          )}
          {formData.notes && (
            <div className="flex items-center gap-2">
              <span className="font-poppins font-normal text-sm text-[#343079]">Notes:</span>
              <p className="font-poppins font-semibold text-sm text-[#343079]">{formData.notes}</p>
            </div>
          )}
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-[397px] h-10 px-4 py-2 mt-auto bg-[#343079] text-white font-semibold rounded-lg hover:bg-[#282562] transition-colors duration-300 border border-[#403B93]"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProjectPreview;