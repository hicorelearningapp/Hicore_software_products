import React from "react";
import { Link } from "react-router-dom";
import knowledge from "../assets/knowledge.png";
import instagramIcon from "../assets/instagram.png";
import facebookIcon from "../assets/facebook.png";
import linkedinIcon from "../assets/linkedin.png";

const Footer = () => {
  return (
    <footer className="bg-[#343079] text-white pt-[64px] pb-[64px] px-6 sm:px-[100px] rounded-t-[64px] w-full">
      <div className="w-full flex flex-col lg:flex-row gap-[64px] flex-wrap">
        {/* Left Card */}
        <div className="w-full sm:w-[394px] h-auto sm:h-[216px] px-[36px] py-[24px] rounded-[24px] border-[4px] border-white border-dashed text-center">
          <div className="flex flex-col items-center gap-[8px]">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <img src={knowledge} alt="knowledges" className="w-[28px] h-[28px]" />
              <h3 className="font-poppins font-bold text-[16px] leading-[32px] text-white w-auto sm:w-[252px]">
                HiCore Career Project Platform
              </h3>
            </div>
            <p className="font-poppins text-[16px] leading-[32px] text-white text-center w-full sm:w-[322px]">
              We’re building a space<br />
              where <span className="font-bold">learning meets doing</span>,<br />
              where <span className="font-bold">knowledge becomes capability</span>,<br />
              and where <span className="font-bold">careers begin with confidence</span>.
            </p>
          </div>
        </div>

        {/* Footer Columns */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[64px] text-white text-center sm:text-left">
          {/* Quick Links */}
          <div>
            <h4 className="font-poppins font-semibold text-[14px] text-center leading-[32px] mb-2">
              Quick links
            </h4>
            <ul className="space-y-1 text-center">
              <li className="font-poppins text-[14px] leading-[24px]">
                <Link to="/aboutus">About Us</Link>
              </li>
              
              <li className="font-poppins text-[14px] leading-[24px]">
                <Link to="/course">Courses</Link>
              </li>
              <li className="font-poppins text-[14px] leading-[24px]">
                <Link to="/services">Services</Link>
              </li>
              <li className="font-poppins text-[14px] leading-[24px]">
                <Link to="/contact-us">Contact Us</Link>
               </li> 
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-poppins font-semibold text-[14px] text-center leading-[32px] mb-2">
              Explore
            </h4>
            <ul className="space-y-1 text-center">
              <li className="font-poppins text-[14px] leading-[24px]">
                <Link to="/course">Learn</Link></li>
              <li className="font-poppins text-[14px] leading-[24px]"> 
                <Link to="/globally-accepted-certifications">Certifications</Link></li>
              <li className="font-poppins text-[14px] leading-[24px]">
                <Link to="/internship-project">Projects</Link></li>
              <li className="font-poppins text-[14px] leading-[24px]">
                <Link to="/interview-preparation">Challenges</Link></li>
              <li className="font-poppins text-[14px] leading-[24px]">
                <Link to="/showcase-video-profile">Showcase</Link></li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="font-poppins font-semibold text-[14px] text-center leading-[32px] mb-2">
              Legal & Contact
            </h4>
            <ul className="space-y-1 text-center">
              <li className="font-poppins text-[14px] leading-[24px]">Terms & Conditions</li>
              <li className="font-poppins text-[14px] leading-[24px]">Privacy Policy</li>
              <li className="font-poppins text-[14px] leading-[24px]">Refund Policy</li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-poppins font-semibold text-[14px] sm:ml-14  sm:text-left leading-[32px]  mb-4">
              Follow Us
            </h4>
            <div className="flex w-[188px] h-[52px] justify-center items-center sm:justify-start lg:justify-center gap-[16px] mx-auto">
              {/* Instagram Icon */}
              <a 
                href="https://www.instagram.com/hicore_software?igsh=MTMxYXRiZDJkbzB0ZQ==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-[54px] h-[54px] p-2 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition"
              >
                <img src={instagramIcon} alt="Instagram" className="w-[36px] h-[36px] items-center" />
              </a>
              {/* Facebook Icon */}
              <a 
                href="https://www.facebook.com/share/16ynAXGqRV/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-[54px] h-[54px] p-2 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition"
              >
                <img src={facebookIcon} alt="Facebook" className="w-[36px] h-[36px] items-center" />
              </a>
              {/* LinkedIn Icon */}
              <a 
                href="https://www.linkedin.com/company/hicore-software-technologies-private-limited/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-[54px] h-[54px] p-2 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition"
              >
                <img src={linkedinIcon} alt="LinkedIn" className="w-[36px] h-[36px] items-center" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;