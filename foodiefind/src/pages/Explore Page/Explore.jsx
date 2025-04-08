import React, { useEffect } from "react";
import CuisineList from "./CuisineList";
import Blog from "./Blog";
import Dishes from "./Dishes"; // Import the Dishes component

function Explore() {
  const handleScroll = () => {
    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        el.classList.add("visible");
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      <div style={{ position: "relative" }}>
        <video
          className="w-full h-auto"
          autoPlay
          muted
          loop
          src="/explorevideo.mp4"
          type="video/mp4"
        ></video>
        <button
          onClick={() => {
            document
              .querySelector("#cuisine-list-section")
              .scrollIntoView({ behavior: "smooth" });
          }}
          className="absolute bottom-40 left-1/2 transform -translate-x-1/2 px-8 py-4 bg-orange-600 text-white text-xl rounded-lg hover:bg-blue-700 transition-colors animate-pulse hover:animate-none"
        >
          Explore Now!
        </button>
      </div>
      <div className="flex flex-col">
        <div id="cuisine-list-section" className="gap-4 justify-center items-center m-5 sm:m-10">
          <h2
            className="text-black text-4xl sm:text-6xl mb-10 text-center fade-in"
            style={{
              position: "sticky",
              top: "64px", // Adjusted to account for the navigation bar height
              backgroundColor: "white",
              zIndex: "1",
              padding: "20px 0",
              paddingTop: "64px", // Added padding to prevent overlap
              marginTop: "0",
            }}
          >
            Explore different cuisines
          </h2>
          <CuisineList />
        </div>
        <div id="blog-section" className="mt-10 m-5 sm:m-10">
          <h2
            className="text-black text-4xl sm:text-6xl mb-10 text-center fade-in"
            style={{
              position: "sticky",
              top: "64px", // Adjusted to account for the navigation bar height
              backgroundColor: "white",
              zIndex: "1",
              padding: "20px 0",
              paddingTop: "64px", // Added padding to prevent overlap
              marginTop: "0",
            }}
          >
            Share a restaurant recommendation
          </h2>
          <Blog />
        </div>
        <div className="mt-10 m-5 sm:m-10">
          <h2
            className="text-black text-4xl sm:text-6xl mb-10 text-center fade-in"
            style={{
              position: "sticky",
              top: "64px", // Adjusted to account for the navigation bar height
              backgroundColor: "white",
              zIndex: "1",
              padding: "20px 0",
              paddingTop: "64px", // Added padding to prevent overlap
              marginTop: "0",
            }}
          >
            Start a Food Trend
          </h2>
          <Dishes />
        </div>
      </div>
      <style>
        {`
          .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 1s ease-out, transform 2s ease-out;
          }
          .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
          }
          .animate-pulse {
            box-shadow: 0 0 15px rgba(255, 165, 0, 0.8), 0 0 30px rgba(255, 165, 0, 0.6);
            transition: box-shadow 0.3s ease-in-out;
          }
          .hover\\:animate-none:hover {
            box-shadow: 0 0 20px rgba(0, 0, 255, 0.8), 0 0 40px rgba(0, 0, 255, 0.6);
          }
        `}
      </style>
    </div>
  );
}

export default Explore;
