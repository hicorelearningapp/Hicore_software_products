import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi"; // ✅ Chevron icons

// ✅ Import icons from assets folder
import emailIcon from "../../../assets/Help/Message.png";
import chatIcon from "../../../assets/Help/Chat.png";
import phoneIcon from "../../../assets/Help/Phonecall.png";

const faqs = [
  {
    question: "How do I enroll in a course?",
    answer:
      "To enroll, simply browse our courses, click on your preferred course, and follow the payment steps.",
  },
  {
    question: "Can I get a refund if I’m not satisfied?",
    answer:
      "Yes! We offer a 7-day money-back guarantee for all our courses. Just contact support.",
  },
  {
    question: "Are the certificates recognized by employers?",
    answer:
      "Yes, our certificates are widely recognized and help showcase your skills to employers.",
  },
  {
    question: "Can I access courses on mobile devices?",
    answer:
      "Absolutely! Our platform is fully optimized for mobile, tablet, and desktop devices.",
  },
  {
    question: "How long do I have access to a course?",
    answer: "You get lifetime access to the course materials once you enroll.",
  },
  {
    question: "Do you offer group discounts for organizations?",
    answer:
      "Yes, we offer special pricing for teams and organizations. Contact support for details.",
  },
];

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-8 border border-gray-300 p-5 m-4 rounded-lg">
      {/* Header */}
      <div className="text-center mt-10 mb-8">
        <h2 className="text-2xl font-semibold text-[#343079]">
          How Can We Help You?
        </h2>
        <p className="text-blue-900 mt-2">
          Find answers to your questions, get support, and make the most of your
          learning experience.
        </p>
      </div>

      {/* Support Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-6xl mx-auto shadow-sm">
        <h3 className="text-lg font-semibold text-[#343079] mb-6">
          Get Support
        </h3>
        <p className="text-blue-900 mb-8">
          Choose the best way to reach our support team
        </p>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Email Support */}
          <div className="flex flex-col items-center text-center  rounded-xl p-6 bg-[#F4F7FF] shadow-sm">
            <img src={emailIcon} alt="Email" className="w-12 h-12 mb-4" />
            <h4 className="text-lg font-semibold text-[#343079]">
              Email Support
            </h4>
            <p className="text-blue-900 mt-2">Send us your questions anytime</p>
            <p className="text-sm font-medium text-[#343079] mt-2">
              Response within 24hrs
            </p>
            <button className="mt-6 px-5 w-full py-2 bg-[#343079] text-white rounded-lg shadow hover:bg-[#2a2466] transition">
              Send Email
            </button>
          </div>

          {/* Live Chat */}
          <div className="flex flex-col items-center text-center  rounded-xl p-6 bg-[#F2FFF5] shadow-sm">
            <img src={chatIcon} alt="Live Chat" className="w-12 h-12 mb-4" />
            <h4 className="text-lg font-semibold text-[#28A745]">Live Chat</h4>
            <p className="text-blue-900 mt-2">Get instant help from our team</p>
            <p className="text-sm font-medium text-blue-900 mt-2">24/7</p>
            <button className="mt-6 w-full px-5 py-2 bg-[#343079] text-white rounded-lg shadow hover:bg-[#2a2466] transition">
              Start Chat
            </button>
          </div>

          {/* Phone Support */}
          <div className="flex flex-col items-center text-center  rounded-xl p-6 bg-[#FFFEEB] shadow-sm">
            <img src={phoneIcon} alt="Phone" className="w-12 h-12 mb-4" />
            <h4 className="text-lg font-semibold text-[#FFC107]">
              Phone Support
            </h4>
            <p className="text-blue-900 mt-2">Talk directly with our experts</p>
            <p className="text-sm font-medium text-[#343079] mt-2">
              Mon-Fri 9AM-6PM
            </p>
            <button className="mt-6 w-full px-5 py-2 bg-[#343079] text-white rounded-lg shadow hover:bg-[#2a2466] transition">
              Call Now
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-6xl mx-auto shadow-sm mt-10">
        <h3 className="text-lg font-semibold text-[#343079] mb-6">
          Frequently Asked Questions
        </h3>
        <p className="text-blue-900 mb-6">
          Quick answers to the most common questions
        </p>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-5 py-4 flex justify-between items-center text-blue-900 font-medium hover:bg-gray-50 transition"
              >
                {faq.question}
                {openIndex === index ? (
                  <FiChevronUp className="text-blue-900 text-xl" />
                ) : (
                  <FiChevronDown className="text-blue-900 text-xl" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-5 pb-4 text-blue-900">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help;
