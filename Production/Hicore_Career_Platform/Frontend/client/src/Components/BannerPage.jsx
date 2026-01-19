import React, { useEffect, useRef, useState } from "react";
import BannerData from "../assets/BannerData";

const BannerPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const slides = [...BannerData, BannerData[0]];
  const intervalRef = useRef(null);

  // Start slider (5s speed)
  const startSlider = () => {
    stopSlider();
    intervalRef.current = setInterval(() => {
      setIsAnimating(true);
      setCurrentIndex((prev) => prev + 1);
    }, 5000); // ⬅️ 5 seconds
  };

  const stopSlider = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopSlider();
      } else {
        startSlider();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    startSlider();

    return () => {
      stopSlider();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleTransitionEnd = () => {
    if (currentIndex === slides.length - 1) {
      setIsAnimating(false);
      setCurrentIndex(0);
    }
  };

  // Pause slider on mouse down / resume on mouse up
  const handleMouseDown = () => {
    stopSlider();
  };

  const handleMouseUp = () => {
    startSlider();
  };

  return (
    <div
      className="relative w-full h-auto"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown} // mobile support
      onTouchEnd={handleMouseUp}
    >
      <div
        className="flex"
        style={{
          transform: `translateX(-${currentIndex * 100}vw)`,
          transition: isAnimating ? "transform 1s ease-in-out" : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-screen h-full flex-shrink-0"
          >
            <img
              src={slide.image}
              alt={`slide-${index}`}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerPage;
