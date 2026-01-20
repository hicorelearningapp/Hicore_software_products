import React from "react";
import { HiOutlineDocumentText } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="bg-gray-200 py-16 px-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex flex-col 
      md:flex-row justify-between items-start md:items-center gap-10">
        {/* Left Section - Logo + Description */}
        <div className="flex flex-col items-start ml-8">
          <div className="flex items-center text-red-700 text-xl font-bold mb-2">
            <HiOutlineDocumentText className="text-2xl mr-1" />
            HiPDF
          </div>
          <p className="text-gray-800 text-base">
            Smart. Simple. All-in-One PDF Tools.
          </p>
        </div>

        {/* Middle Section - Company */}
        <div>
          <h4 className="text-red-700 font-semibold mb-2">Company</h4>
          <ul className="space-y-1 text-sm mb-2">
            <li className="mb-2">
              <a href="#" className="hover:underline">
                About Us
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Right Section - Resources */}
        <div>
          <h4 className="text-red-700 font-semibold mr-8 mb-2">Resources</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Help
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
