import React, { useState, useEffect } from 'react';
import bgImage from "../../../../assets/For Mentor/ReviewLandingPage/banner-bg.png";
import rightImg from "../../../../assets/For Mentor/ReviewLandingPage/reviewbanner.png";
import backArrow from "../../../../assets/For Mentor/ReviewLandingPage/back.png";
import { useNavigate, useLocation } from 'react-router-dom';
import InviteReview from './InviteReview';
import RequestedReview from './RequestedReview';

const Reviewproject = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("invite");

    useEffect(() => {
        if (location.state && location.state.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    return (
        <div className='w-full h-fit opacity-100 rotate-0'>
            <div
                className="w-full h-[300px] bg-cover bg-center gap-4 py-16 px-6 md:px-20 md:pt-10 md:pb-10 flex justify-between items-center"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                {/* Left side */}
                <div className="w-[800px] h-full flex flex-col gap-9">
                    {/* Back button */}
                    <div className="flex items-center gap-2 w-[66px] h-6">
                        <img
                            onClick={() => navigate("/student-review")}
                            src={backArrow}
                            alt="Back"
                            className="w-5 h-5 cursor-pointer"
                        />
                        <span className="text-[#343079] text-sm font-poppins font-normal leading-6">
                            Back
                        </span>
                    </div>
                    {/* Title & description */}
                    <div className="flex flex-col gap-4 w-full">
                        <h2 className="w-full text-[#343079] text-[28px] font-poppins font-semibold leading-[56px]">
                            Review Student Projects
                        </h2>
                        <p className="w-full text-[#343079] text-[18px] font-poppins font-normal leading-[48px]">
                            Evaluate proposals, share actionable feedback, and endorse projects that reflect high standards.
                        </p>
                    </div>
                </div>
                {/* Right side */}
                <div className="flex flex-1 justify-center h-full px-12">
                    <img
                        src={rightImg}
                        alt="Right side illustration"
                        className="w-[400px] h-full items-center object-contain"
                    />
                </div>
            </div>
            <div className='w-full h-fit p-16 opacity-100'>
                <div className="w-full h-12 flex gap-4 rotate-0 opacity-100">
                    {/* Tab 1 */}
                    <button
                        onClick={() => setActiveTab("invite")}
                        className={`h-12 flex items-center gap-[5px] px-4 py-2 rounded-t-lg
                            ${activeTab === "invite" ? "bg-[#343079] text-white" : "bg-white text-[#343079]"}`}
                    >
                        <span className="font-poppins font-semibold text-[14px] leading-8">
                            Invite for Project Review
                        </span>
                    </button>
                    {/* Tab 2 */}
                    <button
                        onClick={() => setActiveTab("completed")}
                        className={`h-12 flex items-center gap-[5px] px-4 py-2 rounded-t-lg
                            ${activeTab === "completed" ? "bg-[#343079] text-white" : "bg-white text-[#343079]"}`}
                    >
                        <span className="font-poppins font-semibold text-[14px] leading-8">
                            Student Requested Review
                        </span>
                    </button>
                </div>
                {/* Content based on active tab */}
                {activeTab === "invite" ? <InviteReview /> : <RequestedReview />}
            </div>
        </div>
    );
}

export default Reviewproject;