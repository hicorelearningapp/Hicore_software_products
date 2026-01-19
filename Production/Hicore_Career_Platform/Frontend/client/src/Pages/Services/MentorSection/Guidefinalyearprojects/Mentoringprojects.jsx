// src/components/Mentoringprojects.js
import React, { useState, useRef, useEffect } from 'react';
import bannerBg from "../../../../assets/banner-bg.png";
import backArrow from "../../../../assets/GuideFinalyearproject/back.png";
import rightImg from "../../../../assets/GuideFinalyearproject/guideproject.png";
import { useNavigate, useLocation } from 'react-router-dom';
import ProjectGuidance from './ProjectGuidance';
import StudentRequest from './StudentRequest';
import ProjectPreview from './ProjectPreview';
import ConfirmationPopup from './ConfirmationPopup';

const Mentoringprojects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("guidance");
  const [formData, setFormData] = useState({
    projectType: '',
    projectDomain: '',
    groupSize: '',
    schedule: '',
    notes: ''
  });
  const [flexibleNotes, setFlexibleNotes] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dateInputRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
      
      
      if (location.state.activeTab === 'guidance') {
        setFormData({
          projectType: '',
          projectDomain: '',
          groupSize: '',
          schedule: '',
          notes: ''
        });
        setFlexibleNotes('');
      }
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleFlexibleNotesChange = (e) => {
    setFlexibleNotes(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", { ...formData, flexibleNotes });
    setShowConfirmation(true); 
  };

  const handlePreview = () => {
    setShowPreview(true); 
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };
  
  const handleCalendarClick = () => {
    dateInputRef.current.showPicker();
  };

  return (
    <div className="w-full h-auto opacity-100 relative"> 
      <div
        className="w-full h-[372px] opacity-100 bg-cover bg-center flex"
        style={{ backgroundImage: `url(${bannerBg})` }}>
        {/* Left side */}
        <div className="w-[800px] h-full flex flex-col gap-9 p-12">
          {/* Back button */}
          <div className="flex items-center gap-2 w-[66px] h-6">
            <img onClick={() => navigate("/guide-final-year-projects")}
              src={backArrow} alt="Back" className="w-5 h-5 cursor-pointer" />
            <span className="text-[#343079] text-sm font-poppins font-normal leading-6">
              Back
            </span>
          </div>
          {/* Title & description */}
          <div className="flex flex-col gap-4 w-full">
            <h2 className="w-full text-[#343079] text-[28px] font-poppins font-semibold leading-[56px]">
              Set Up Your Project Guidance
            </h2>
            <p className="w-full text-[#343079] text-[18px] font-poppins font-normal leading-[48px]">
              Set clear preferences for the type of projects, duration, and mentorship style you’d
              like to offer. This helps students find the right guidance while ensuring you mentor in
              areas aligned with your expertise and availability.
            </p>
          </div>
        </div>
        {/* Right side */}
        <div className="flex flex-1 justify-center h-full px-12">
          <img
            src={rightImg}
            alt="Right side illustration"
            className="w-[336px] h-full items-center object-contain"
          />
        </div>
      </div>
      <div className="w-full h-fit opacity-100 px-12 pt-9 pb-9">
        <div className="w-full h-12 flex gap-4 rotate-0 opacity-100">
          {/* Tab 1 */}
          {/*<button
            onClick={() => setActiveTab("guidance")}
            className={`w-[206px] h-12 flex items-center gap-[5px] px-4 py-2 rounded-t-lg
              ${activeTab === "guidance" ? "bg-[#343079] text-white" : "bg-white text-gray-800"}`}
          >
            <span className="w-[174px] h-8 font-poppins font-semibold text-sm leading-8">
              Create Project Guidance
            </span>
          </button>*/}
          {/* Tab 2 */}
          <button
            className="w-[195px] h-12 flex items-center gap-[5px] px-4 py-2 rounded-t-lg bg-[#343079] text-white"
          >
            <span className="font-poppins font-semibold text-sm leading-8">
              View Student Requests
            </span>
          </button>
        </div>
        
            <StudentRequest />
       
      </div>
      
      {/* Conditionally render the popups as overlays */}
      {showPreview && (
        <div className="absolute inset-0   flex items-center justify-center z-50">
          <ProjectPreview formData={{ ...formData, flexibleNotes }} onClose={closePreview} />
        </div>
      )}

      {showConfirmation && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <ConfirmationPopup onClose={closeConfirmation} />
        </div>
      )}
    </div>
  );
};

export default Mentoringprojects;