import React, { useEffect } from "react";
import CuisineList from "./CuisineList";
import Blog from "./Blog";

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
      <div className="flex flex-col  ">
        <div className="gap-4 justify-center items-center m-20">
          <h2 className="text-white text-6xl mb-10 text-left fade-in">
            Explore different cuisines
          </h2>
          <CuisineList />
        </div>
        <div className="gap-4 justify-center items-center m-20">
          <h2 className="text-white text-6xl mb-10 text-right fade-in">
          Save a list of your favourite restaurant
          </h2>
          <Blog />
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
