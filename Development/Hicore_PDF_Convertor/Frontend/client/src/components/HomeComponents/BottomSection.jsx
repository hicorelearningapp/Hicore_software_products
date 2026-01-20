import React from "react";
import images from "../../assets/assets"; // adjust path as needed

const BottomSection = () => {
  return (
    <div className="bg-white py-16 px-4">
      <h2 className="text-3xl font-bold text-center text-red-700 mb-20">
        Why Choose HiPDF?
      </h2>

      {/* Section 1 */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center   mb-16">
        <div>
          <h3 className="font-semibold text-xl mb-4">
            All-in-One PDF Solution
          </h3>
          <p className="text-gray-800 text-lg leading-relaxed">
            No more juggling between tools. Edit, convert, compress, protect,
            collaborate, and sign PDFs—all from a single platform.
          </p>
        </div>
        <div className="flex justify-end">
          <img
            src={images.image_two}
            alt="PDF Tools"
            className="max-w-xs w-80 h-auto object-contain"
          />
        </div>
      </div>

      {/* Section 2 */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center mb-16 ">
        <div className="flex justify-start md:order-1 order-2">
          <img
            src={images.image_three}
            alt="AI Assistant"
            className="max-w-xs w-full h-auto object-contain"
          />
        </div>
        <div className="md:order-2 order-1">
          <h3 className="font-semibold text-lg mb-4">AI That Saves You Time</h3>
          <p className="text-gray-800 text-lg leading-relaxed">
            Summarize lengthy documents, auto-classify files, extract key info,
            and even chat with your PDFs. Let AI do the heavy lifting so you can
            focus on what matters.
          </p>
        </div>
      </div>

      {/* Section 3 */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center  mb-18">
        <div>
          <h3 className="font-semibold text-xl mb-4">
            Seamless Document Conversion
          </h3>
          <p className="text-gray-800 text-lg leading-relaxed">
            Convert DOCX, Excel, JPG/PNG and vice versa with zero formating
            issues. Built for resumes, reports, invoices, assignments, and more.
          </p>
        </div>
        <div className="flex justify-end">
          <img
            src={images.image_four}
            alt="PDF Tools"
            className="max-w-xs w-80 h-auto object-contain"
          />
        </div>
      </div>

      {/* Section 4 */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center mb-16 ">
        <div className="flex justify-start md:order-1 order-2">
          <img
            src={images.image_five}
            alt="AI Assistant"
            className="max-w-xs w-80 h-auto object-contain"
          />
        </div>
        <div className="md:order-2 order-1">
          <h3 className="font-semibold text-lg mb-4">Privacy-First & Secure</h3>
          <p className="text-gray-800 text-lg leading-relaxed">
            Your document stay safe with enterprise-grade encryption, file
            control options, and trusted verification for digital signatures.
          </p>
        </div>
      </div>

      {/* Section 5 */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center  mb-18">
        <div>
          <h3 className="font-semibold text-xl mb-4">
            Template & Smart Suggestions
          </h3>
          <p className="text-gray-800 text-lg leading-relaxed">
            Get professionally designed templates for legal forms, and business
            docs-with AI suggesting file names, cleanups, and formatting help.
          </p>
        </div>
        <div className="flex justify-end">
          <img
            src={images.image_six}
            alt="PDF Tools"
            className="max-w-xs w-80 h-auto object-contain"
          />
        </div>
      </div>

      {/* Section 6 */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center mb-18 ">
        <div className="flex justify-start md:order-1 order-2">
          <img
            src={images.image_seven}
            alt="AI Assistant"
            className="max-w-xs w-80 h-auto object-contain"
          />
        </div>
        <div className="md:order-2 order-1">
          <h3 className="font-semibold text-lg mb-4">
            Built for Collaboration
          </h3>
          <p className="text-gray-800 text-lg leading-relaxed">
            Work with your team in real-time, track changes, manage approvals
            and collect signatures-all in one smooth workflow.
          </p>
        </div>
      </div>

      {/* Section 7 */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center  mb-16">
        <div>
          <h3 className="font-semibold text-xl mb-4">Made for Everyone</h3>
          <p className="text-gray-800 text-lg leading-relaxed">
            Whether you're a student submitting assignments, a freelancer
            closing contracts, or an HR team managing approvals-this app is
            built to support your workflow.
          </p>
        </div>
        <div className="flex justify-end">
          <img
            src={images.image_eight}
            alt="PDF Tools"
            className="max-w-xs w-80 h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default BottomSection;
