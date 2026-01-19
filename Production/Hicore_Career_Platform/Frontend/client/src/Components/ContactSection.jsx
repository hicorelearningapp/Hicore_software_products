import React, { useState } from "react";
import {
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import bgImage from "../assets/careerbg.jpg";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(
        "https://hicore2000.pythonanywhere.com/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setStatus(result?.message || "Message sent successfully");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus(result?.message || "Something went wrong on the server");
      }
    } catch (error) {
      setStatus("Error connecting to server");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div
      className="w-full py-25 bg-cover px-4 sm:px-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-6xl mx-auto relative flex flex-col md:flex-row gap-10 items-start">
        {/* Form Container */}
        <div className="flex-1 w-full bg-white/20 rounded-xl p-6 sm:p-10 shadow-lg shadow-gray-500 relative z-10">
          <h2 className="mt-10 text-2xl sm:text-3xl font-bold text-[#2B2160] text-center mb-4 sm:mb-8">
            Send Us a Message
          </h2>
          <p className="text-center text-base sm:text-lg text-[#2B2160] mb-6 sm:mb-10">
            Let’s Build Something Great Together!!
          </p>
          <form
            onSubmit={handleSubmit}
            className="md:m-10 sm:m-5 space-y-4 sm:space-y-6"
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full p-3 rounded border text-blue-900 bg-white border-gray-300"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="flex-1 bg-white p-3 text-blue-900 rounded border border-gray-300"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number (optional)"
                className="flex-1 bg-white p-3 text-blue-900 rounded border border-gray-300"
              />
            </div>
            <textarea
              rows="4"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message / Inquiry / Request"
              required
              className="w-full p-4 rounded border text-blue-900 bg-white border-gray-300"
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#230960] text-white px-6 py-3 hover:bg-[#230970] rounded font-semibold
               w-full sm:w-48 mx-auto block"
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </form>
          {status && (
            <p className="text-center mt-4 font-medium text-[#2B2160]">
              {status}
            </p>
          )}
        </div>

        {/* Info Tabs using React Icons */}
        <div className="w-full md:w-[400px] md:-ml-25 md:mt-35 flex flex-col gap-6 z-20">
          {[
            {
              icon: <FaClock className="text-white text-xl" />,
              text: "Office Hours: Monday–Friday, 9 AM – 6 PM IST",
            },
            {
              icon: <FaMapMarkerAlt className="text-white text-xl" />,
              text: "https://www.google.com/maps?q=12.960221,80.207497",
            },
            {
              icon: <FaPhoneAlt className="text-white text-xl" />,
              text: "+91 4448645349",
            },
            {
              icon: <FaEnvelope className="text-white text-xl" />,
              text: "mramkumar@hicoresoft.com",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start sm:items-center gap-4 bg-[#230970] text-white p-3 rounded-lg shadow-md"
            >
              <div className="w-10 h-10 flex justify-center items-center bg-white rounded">
                <div className="bg-[#230970] w-8 h-8 flex justify-center items-center rounded">
                  {item.icon}
                </div>
              </div>
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Cards Section (Locations) */}
      <div className="max-w-7xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
        {[
          {
            location: "Chennai",
            company: "HICORE SOFTWARE TECHNOLOGIES PRIVATE LTD",
            address:
              "1643B, 6th Cross Street, Ram Nagar South, Madipakkam, Chennai, Tamil Nadu, India",
            email: "mramkumar@hicoresoft.com",
          },
          {
            location: "US",
            company: "HICORE SOFTWARE TECHNOLOGIES, LLC",
            address: "Coming Soon!",
            email: "mramkumar@hicoresoft.com",
          },
          {
            location: "Canada",
            company: "HICORE SOFTWARE TECHNOLOGIES LTD",
            address: "Coming Soon!",
            email: "mramkumar@hicoresoft.com",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white text-[#230970] rounded-lg shadow-md border border-yellow-400 p-8 hover:shadow-lg transition"
          >
            <h4 className="flex items-center text-lg font-bold mb-3 text-[#230970]">
              <FaMapMarkerAlt className="w-5 h-5 mr-3 text-[#230970]" />
              <span className="text-[#230970] font-extrabold">
                {item.location}
              </span>
            </h4>
            <p className="text-yellow-500 font-bold mb-3 leading-loose">
              {item.company}
            </p>
            <p className="text-md text-[#230970] mb-3">{item.address}</p>
            <p className="text-md text-[#230970] mb-2">{item.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactSection;
