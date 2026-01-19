import React, { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300); // Show after scrolling 300px
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      title="Scroll to top"
      className="fixed bottom-6 right-4 z-[9999] 
                 w-10 h-10 flex items-center justify-center 
                 rounded-full bg-[#343079] text-white 
                 shadow-lg hover:bg-indigo-800 
                 transition-all duration-300"
    >
      <FiArrowUp size={24} />
    </button>
  );
};

export default ScrollToTopButton;
