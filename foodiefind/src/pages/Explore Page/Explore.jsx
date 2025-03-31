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
    <div className="bg-black">
      <div>
        <video
          className="w-full h-auto"
          autoPlay
          muted
          loop
          src="src/pages/Explore Page/Explore.mp4"
          type="video/mp4"
        ></video>
      </div>
      <div className="flex flex-col">
        <div className="gap-4 justify-center items-center m-20">
          <h2
            className="text-white text-6xl mb-20 text-center fade-in"
            style={{
              position: "sticky",
              top: "64px", // Adjusted to account for the navigation bar height
              backgroundColor: "black",
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
        <div className="mt-10 m-20">
          <h2
            className="text-white text-6xl mb-15 text-center fade-in"
            style={{
              position: "sticky",
              top: "64px", // Adjusted to account for the navigation bar height
              backgroundColor: "black",
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
        <div className="mt-10 m-20">
          <h2
            className="text-white text-6xl mb-15 text-center fade-in"
            style={{
              position: "sticky",
              top: "64px", // Adjusted to account for the navigation bar height
              backgroundColor: "black",
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
        `}
      </style>
    </div>
  );
}

export default Explore;
