// src/components/ScrollToAnchor.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToAnchor = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100); // slight delay ensures DOM is rendered
      }
    }
  }, [hash]);

  return null;
};

export default ScrollToAnchor;
