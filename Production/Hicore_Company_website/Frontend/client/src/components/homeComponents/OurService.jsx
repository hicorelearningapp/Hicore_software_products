import React from "react";
import { HiOutlineMail } from "react-icons/hi";
import { useNavigate } from "react-router-dom"; // ✅ import navigate
import softwareIcon from "../../assets/Code.png";
import cadIcon from "../../assets/cad.png";
import plmIcon from "../../assets/software.png";
import embeddedIcon from "../../assets/Embededsystems.png";
import aiIcon from "../../assets/Artificialintelligence.png";
import pmIcon from "../../assets/PLM.png";

const services = [
  {
    title: "Software Development",
    description:
      "Build scalable, secure, and custom software solutions tailored to your workflow.",
    icon: softwareIcon,
    points: [
      "Custom Web, Semiconductor Development & Desktop Application Development",
      "Expertise in .NET, React, C#, Python & MERN Stack",
      "Seamless API Integrations & Cross-Platform Solutions",
    ],
  },
  {
    title: "AI & Machine Learning",
    description:
      "Automate decisions, detect patterns, and extract value from your data.",
    icon: aiIcon,
    points: [
      "Predictive Analytics & Forecasting Models",
      "Natural Language Processing & Computer Vision Solutions",
      "AI-Powered Automation & Decision Support Systems",
    ],
  },
  {
    title: "CAD & Engineering Design",
    description:
      "Advanced modeling & drafting for mechanical, electrical, & electromechanical systems.",
    icon: cadIcon,
    points: [
      "3D Modeling & 2D Drafting for Mechanical and Electrical Components",
      "Product Design using CAD Tools (AutoCAD, SolidWorks, CATIA)",
      "Simulation, Analysis & Design Optimization for Engineering Projects",
    ],
  },
  {
    title: "Embedded Systems & IoT",
    description:
      "Design smart, connected products using reliable firmware and cloud integration.",
    icon: embeddedIcon,
    points: [
      "Firmware Development for Microcontrollers & Embedded Devices",
      "IoT Connectivity with Sensors, Gateways & Cloud Platforms",
      "Edge Computing, Real-Time Monitoring & Remote Control Solutions",
    ],
  },
  {
    title: "Product Lifecycle Management (PLM)",
    description: "Organize and control product data from concept to release.",
    icon: plmIcon,
    points: [
      "End-to-End Management of Product Data & Documentation",
      "Integration of CAD, ERP, and Supply Chain Systems",
      "Process Automation for Design, Change, and Release Workflows",
    ],
  },
  {
    title: "Project Management Support",
    description: "Engineering support beyond code and design.",
    icon: pmIcon,
    points: [
      "Project Planning, Scheduling & Resource Allocation",
      "Risk Assessment & Progress Tracking",
      "Collaboration, Reporting & Stakeholder Communication",
    ],
  },
];

const OurService = () => {
  const navigate = useNavigate(); // ✅ hook for navigation

  const handleGoToContact = () => {
    navigate("/contact"); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#100826] py-20 px-6 text-white">
      {/* Header Section */}
      <div className="text-center mb-20">
        <h2 className="text-5xl font-semibold text-yellow-500 mb-8">
          Our Services
        </h2>
        <p className="text-lg max-w-6xl mx-auto font-medium text-white/80">
          At HiCore Software, we deliver full-cycle solutions that blend
          engineering precision with digital innovation — helping businesses
          design, build, automate, and scale with confidence.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="group border border-white p-7 rounded-lg transition-all 
            duration-500 ease-in-out relative h-full 
            hover:h-[calc(100%+10px)] 
            hover:shadow-[0_10px_25px_rgba(0,191,255,0.4)]"
          >
            <img
              src={service.icon}
              alt={service.title}
              className="h-20 w-20 mb-6 transition-transform duration-300 group-hover:scale-[1.2]"
            />
            <h3 className="text-lg font-semibold text-yellow-400 mb-8 transition-all duration-300 group-hover:translate-y-1">
              {service.title}
            </h3>
            <p className="text-white/80 mb-6 transition-all duration-300 group-hover:translate-y-1">
              {service.description}
            </p>
            <ul className="text-white/70 list-disc ml-2 pl-6 space-y-2 transition-all duration-300 group-hover:translate-y-1">
              {service.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="w-full mt-20">
        <div
          className="max-w-7xl mx-auto bg-gradient-to-r from-[#f1f1f1] to-[#f8f4ff]
          border-[2px] border-yellow-400 rounded-md p-8 md:p-10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            {/* Text Block */}
            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-2xl mb-3 font-bold text-[#230970]">
                Have a Project in Mind? Let’s Make It Real.
              </h2>
              <p className="text-[#230970] mt-2 text-base md:text-lg">
                Share your vision with us – and we’ll bring it to life with
                precision, speed, and scalable tech.
              </p>
            </div>

            {/* Button Block */}
            <div className="w-full md:w-auto flex justify-center md:justify-start">
              <button
                onClick={handleGoToContact}
                className="group relative bg-[#230960] text-white px-6 py-4  
                  hover:bg-[#230970] transition-all duration-500 rounded-sm
                  w-[130px] hover:w-[150px] overflow-hidden flex md:mr-40 items-start justify-start"
              >
                <span className="text-base font-medium whitespace-nowrap">
                  Contact Us
                </span>
                <span
                  className="absolute right-3 pr-2 top-1/2 -translate-y-1/2 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-500"
                >
                  <HiOutlineMail className="w-5 h-5 text-white" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurService;
