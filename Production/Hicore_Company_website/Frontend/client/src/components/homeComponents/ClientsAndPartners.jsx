// 📂 src/components/ClientsAndPartners.jsx
import React from "react";
import clientLogos from "../../assets/clientLogos";
import partnerLogo from "../../assets/partner-image-one.jpeg";

const ClientsAndPartners = () => {
  return (
    <div>
      {/* 🔹 Clients Section */}
      <div className="mt-20 bg-white py-10 px-4 text-center">
        <h2 className="text-4xl font-bold text-[#E09F2b] mb-6">Our Clients</h2>
        <p className="text-xl text-[#230970] mx-auto mb-20 font-semibold">
          We’ve had the privilege of working with forward-thinking companies
          across semiconductor, automation, engineering, and software domains.
          Through both direct collaborations and the prior experience of our
          engineers, our solutions power real-world systems – from factories to
          digital platforms.
        </p>

        <div className="logo-marquee">
          <div className="logo-track">
            {[...clientLogos, ...clientLogos, ...clientLogos].map(
              (client, index) => (
                <img
                  key={index}
                  src={client.src}
                  alt={client.name}
                  className="logo"
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* 🔹 Partners Section */}
      <div className="bg-white py-8 px-4 text-center">
        <h2 className="text-4xl font-bold text-[#E09F2b] mb-6">Our Partners</h2>
        <p className="text-xl text-[#230970] mx-auto mb-4 font-semibold">
          Our partners and we collaborate to advance AI technologies, combining
          expertise in development, automation, and intelligent systems to
          deliver real-world impact.
        </p>

        <div className="flex justify-center">
          <img
            src={partnerLogo}
            alt="Partner Logo"
            className="h-50 w-50 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientsAndPartners;
