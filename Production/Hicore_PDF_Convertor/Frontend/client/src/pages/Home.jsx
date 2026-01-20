import React, { useRef } from "react";
import { FiArrowUp } from "react-icons/fi";

import HeroSection from "../components/HomeComponents/HeroSection";
import FeaturesGrid from "../components/HomeComponents/FeaturesGrid";
import ToolSection from "../components/HomeComponents/ToolSection";
import BottomSection from "../components/HomeComponents/BottomSection";
import PricingSlider from "../components/HomeComponents/PricingSlider";
import DownloadDesktop from "../components/HomeComponents/DownloadDesktop";
import Footer from "../components/Footer";

const Home = () => {
  const topRef = useRef(null);
  const toolsRef = useRef(null);

  const scrollToTools = () => {
    toolsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main ref={topRef} className="relative">
      <HeroSection onExploreTools={scrollToTools} />
      <FeaturesGrid />

      {/* 🔽 TOOL SECTION TARGET */}
      <div ref={toolsRef}>
        <ToolSection />
      </div>

      <BottomSection />
      <PricingSlider />
      <DownloadDesktop />
      <Footer />

      {/* 🔼 SCROLL TO TOP BUTTON */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="
          fixed bottom-6 right-6 z-50
          bg-red-700 hover:bg-red-800
          text-white p-3 rounded-full
          shadow-lg transition-all
          focus:outline-none focus:ring-2 focus:ring-red-700
        "
      >
        <FiArrowUp size={22} />
      </button>
    </main>
  );
};

export default Home;
