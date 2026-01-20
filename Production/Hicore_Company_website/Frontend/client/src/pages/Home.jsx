import React from "react";
import HeroSection from "../components/homeComponents/HeroSection";
import MainSection from "../components/homeComponents/MainSection";
import OurService from "../components/homeComponents/OurService";
import ContactSection from "../components/homeComponents/ContactSection";
import FooterSection from "../components/homeComponents/FooterSection";
import ClientsAndPartners from "../components/homeComponents/ClientsAndPartners";

const Home = () => {
  return (
    <div>
      <div id="home">
        <HeroSection />
      </div>

      <div id="about-us">
        <MainSection />
      </div>

      <div id="services">
        <OurService />
      </div>
      <ClientsAndPartners />

      <FooterSection />
    </div>
  );
};

export default Home;
