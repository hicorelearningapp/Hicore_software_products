import React from "react";
import { FaWindows, FaApple } from "react-icons/fa";

export default function DownloadDesktop() {
  return (
    <div className="bg-white py-20 px-6 text-center max-w-7xl mx-auto">
      <h2 className="text-4xl md:text-4xl font-bold text-red-700 mb-4">
        Download the Desktop Version
      </h2>
      <p className="text-gray-500 text-lg mb-12 max-w-3xl mx-auto">
        Designed for professionals, educators, legal teams, and anyone who
        values full data control.
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-16">
        {/* Left Card */}
        <div className="border border-red-200 rounded-lg p-8 w-full md:w-[500px] text-left">
          <h3 className="text-xl font-semibold mb-4">
            Your Documents, Your Device
          </h3>
          <p className="font-medium mb-4 text-base">
            The desktop app runs entirely on your local system, meaning:
          </p>
          <ul className="space-y-4 text-base">
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-xl">✔</span>
              No files are uploaded or stored online
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-xl">✔</span>
              Perfect for sensitive documents like contracts, HR files, and
              legal papers
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-xl">✔</span>
              Complete data privacy — nothing leaves your computer
            </li>
          </ul>
          <p className="mt-6 text-base">
            <strong>Available for:</strong> Windows, macOS
            <span className="text-red-500 ml-2 cursor-pointer hover:underline">
              Know More
            </span>
          </p>
        </div>

        {/* Right Buttons */}
        <div className="flex flex-col gap-5 w-full md:w-auto">
          <button className="bg-red-700 hover:bg-red-800 cursor-pointer text-white font-semibold px-6 py-4 text-lg rounded flex items-center justify-center gap-2 w-72">
            <FaWindows size={20} /> Download for Windows
          </button>
          <button className="bg-red-700 hover:bg-red-800 cursor-pointer text-white font-semibold px-6 py-4 text-lg rounded flex items-center justify-center gap-2 w-72">
            <FaApple size={20} /> Download for Mac
          </button>
        </div>
      </div>
    </div>
  );
}
