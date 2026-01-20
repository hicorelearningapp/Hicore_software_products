import React from "react";
import { Link } from "react-router-dom";

const FooterSection = () => {
  return (
    <footer className="bg-[#1A1232] text-white py-12 px-4 sm:px-8">
      {/* Top Section */}
      <div
        className="max-w-7xl mx-auto border border-white mt-8 
        rounded-lg p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-12
        text-center md:text-left"
      >
        {/* Company Info */}
        <div>
          <h3 className="text-xl text-center font-bold mb-8">
            HiCore Software Technologies Private Limited
          </h3>
          <p className="text-md text-center leading-loose text-white">
            Engineering smart, scalable, and future-ready solutions across CAD,
            software development, embedded systems, PLM, IoT, and AI.{" "}
            <strong className="text-white">
              We turn complex challenges into powerful results.
            </strong>
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl text-center font-bold mb-8">Quick Links</h4>
          <ul className="space-y-2 text-center text-md text-white">
            <li>
              <a href="#home" className="hover:text-white cursor-pointer">
                Home
              </a>
            </li>
            <li>
              <a href="#about-us" className="hover:text-white cursor-pointer">
                About Us
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-white cursor-pointer">
                Services
              </a>
            </li>
            <li>
              <Link to="/products" className="hover:text-white cursor-pointer">
                Products
              </Link>
            </li>

            <li>
              <Link to="/career" className="hover:text-white cursor-pointer">
                Careers
              </Link>
            </li>
            <li>
              <a href="/contact" className="hover:text-white cursor-pointer">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Office Address */}
        <div>
          <h4 className="text-xl text-center font-bold mb-8">
            Office Address:
          </h4>
          <p className="text-md text-center leading-relaxed text-white">
            1643B, 6th Cross Street, Ram Nagar South,
            <br />
            Madipakkam, Chennai, Tamil Nadu, India
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto mt-20 text-center text-md text-white mb-20 space-y-1">
        <p>© 2025 HiCore Software Technologies Pvt. Ltd.</p>
        <p>
          All rights reserved. |{" "}
          <span className="hover:text-white cursor-pointer">
            Privacy Policy
          </span>{" "}
          |{" "}
          <span className="hover:text-white cursor-pointer">
            Terms of Service
          </span>
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
