import React from "react";
import { ArrowUp } from "lucide-react";
import Beginjourney from "./Beginjourney";
import Examcard from "./Examcard";
import Whychooseus from "./Whychooseus";
import Appforwhom from "./Appforwhom";
import Roadmap from "./Roadmap";
import Features from "./Features";
import Pricing from "./Pricing";
import Successstart from "./Successstart";

const Home = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Beginjourney />
      <Examcard />
      <Whychooseus />
      <Appforwhom />
      <Roadmap />
      <Features />
      <Pricing />
      <Successstart />

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#2758B3",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
};

export default Home;
