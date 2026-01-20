import React from "react";

// Support icons
import chatIcon from "../../../assets/Help/Chat.png";
import phoneIcon from "../../../assets/Help/Contact.png";
import emailIcon from "../../../assets/Help/Email.png";

const Help = () => {
  const helpCards = [
    {
      title: "Orders & Delivery",
      desc: "Accepting/Declining Orders, Route Optimization",
      btn: "View Guides",
    },
    {
      title: "Inventory Management",
      desc: "Upload CSV, Edit Batch, Set Discount",
      btn: "Learn More",
    },
    {
      title: "Reports & Analytics",
      desc: "Demand Forecasting, GST Summary",
      btn: "Explore Tips",
    },
  ];

  return (
    <div className="px-6 py-4">
      {/* Heading */}
      <h2 className="text-xl font-semibold text-[#115D29]">Help</h2>

      {/* Subtext */}
      <p className="text-sm text-gray-600 mt-4">
        Find quick answers, reach out to support, or learn how to use your
        dashboard efficiently.
      </p>

      {/* Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {helpCards.map((item, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-xl p-5 flex flex-col justify-between"
          >
            {/* Title */}
            <h3 className="text-[#115D29] text-lg font-semibold">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-[#115D29] mt-5 text-sm">{item.desc}</p>

            {/* Button */}
            <button className="mt-8 w-full bg-[#1C6BA0] text-white py-2 rounded-md font-medium hover:bg-blue-700 transition">
              {item.btn}
            </button>
          </div>
        ))}
      </div>

      {/* Support Section */}
      <div className="mt-10 border border-[#C7DECF] rounded-xl p-6">
        <p className="text-[#115D29] text-lg font-medium mb-6">
          Need help with something? We can assist you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Live Chat */}
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl p-3">
            <img src={chatIcon} alt="Chat" className="w-6 h-6" />
            <p className="text-[#115D29] text-sm">
              Live Chat:{" "}
              <span className="font-semibold">Available 9AM–9PM IST</span>
            </p>
          </div>

          {/* Phone Support */}
          <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-100 rounded-xl p-3">
            <img src={phoneIcon} alt="Phone" className="w-6 h-6" />
            <p className="text-[#115D29] text-sm">
              Phone Support:{" "}
              <span className="font-semibold">+91-XXXXXXXXXX</span>
            </p>
          </div>

          {/* Email Support */}
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
            <img src={emailIcon} alt="Email" className="w-6 h-6" />
            <p className="text-[#115D29] text-sm">
              Support Email:{" "}
              <span className="font-semibold">support@pharmalink.ai</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
