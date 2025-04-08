import React, { useState, useEffect, useRef } from 'react';
import photo1 from '/src/assets/Home-images/Home-food-1.jpg';
import photo2 from '/src/assets/Home-images/Home-food-2.jpg';
import photo3 from '/src/assets/Home-images/Home-food-3.jpg';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import GoogleMaps from './GoogleMaps'; // Import the new GoogleMaps component
import Gemini from './Gemini'; // Import the new Gemini component

// Fixed FlipLink component borrowed from Hover.Dev
const DURATION = 0.25;
const STAGGER = 0.025;

const FlipLink = ({ children, href }) => {
  // Create an array of characters with spaces preserved
  const characters = children.split("");
  
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className="relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-9xl"
      style={{
        lineHeight: 1,
        textShadow: "4px 4px 10px rgba(0, 0, 0, 0.8)", // Ensure shadow is applied
      }}
    >
      <div>
        {characters.map((char, i) => (
          <motion.span
            variants={{
              initial: {
                y: 0,
                textShadow: "4px 4px 10px rgba(0, 0, 0, 0.8)", // Shadow for initial state
              },
              hovered: {
                y: "-100%",
                textShadow: "4px 4px 10px rgba(0, 0, 0, 0.8)", // Shadow for hovered state
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {characters.map((char, i) => (
          <motion.span
            variants={{
              initial: {
                y: "100%",
                textShadow: "4px 4px 10px rgba(251, 138, 0, 0.8)", // Shadow for initial state
              },
              hovered: {
                y: 0,
                textShadow: "4px 4px 10px rgba(254, 140, 0, 0.8)", // Shadow for hovered state
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};

//functionality for slideshow
function Home() {
  const slides = [
    { url: photo1 },
    { url: photo2 },
    { url: photo3 }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const chatAndMapRef = useRef(null); // Ref for the chatbot and maps section

  const handleScrollToFeatures = () => {
    chatAndMapRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to handle user interaction and pause auto-sliding
  const handleUserInteraction = () => {
    setIsPaused(true);
    // Resume auto-sliding after 10 seconds of inactivity
    setTimeout(() => setIsPaused(false), 10000);
  };

  // Auto-slide functionality
  useEffect(() => {
    if (!isPaused) {
      const intervalId = setInterval(() => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
      }, 5000); // Change slide every 5 seconds (5000ms)
      
      // Clean up the interval when component unmounts or isPaused changes
      return () => clearInterval(intervalId);
    }
  }, [currentIndex, slides.length, isPaused]);

  const prevSlide = () => {
    handleUserInteraction(); // Pause auto-sliding when user interacts
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    handleUserInteraction(); // Pause auto-sliding when user interacts
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    handleUserInteraction(); // Pause auto-sliding when user interacts
    setCurrentIndex(slideIndex);
  };
  
  return (
    <div className="w-full h-full relative group">
      <div className="w-full aspect-[16/9] relative overflow-hidden">
        <div
          style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
          className="w-full h-full bg-center bg-cover duration-500 absolute inset-0"
        ></div>
        <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white flex flex-col items-center">
          <FlipLink>
            Foodie Find
          </FlipLink>
          <TypeAnimation
            sequence={['Discover your inner Foodie', 2000, 'Explore new options', 2000, 'Try new spots never seen before', 2000]}
            wrapper="p"
            speed={1}
            className="mt-8 text-lg sm:text-2xl md:text-4xl font-bold text-center"
            style={{
              textShadow: "4px 4px 10px rgba(0, 0, 0, 0.8)", // Stronger shadow
            }}
            repeat={Infinity}
          />
          <button
            onClick={handleScrollToFeatures}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
            style={{
              boxShadow: "0 0 20px rgba(255, 106, 0, 0.78)", // Light orange glow
            }}
          >
            Click to Find
          </button>
        </div>

        <div
          onClick={prevSlide}
          className="hidden group-hover:flex absolute top-[50%] -translate-y-1/2 left-5 text-2xl rounded-full p-3 bg-black/30 text-white cursor-pointer hover:bg-black/50 transition-all duration-300"
        >
          <BsChevronCompactLeft size={30} />
        </div>

        <div
          onClick={nextSlide}
          className="hidden group-hover:flex absolute top-[50%] -translate-y-1/2 right-5 text-2xl rounded-full p-3 bg-black/30 text-white cursor-pointer hover:bg-black/50 transition-all duration-300"
        >
          <BsChevronCompactRight size={30} />
        </div>

        {/* Rectangles Navigation - Positioned near the bottom of the image */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center py-2">
          {slides.map((_, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`cursor-pointer mx-1 ${
                currentIndex === slideIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              style={{ width: '20px', height: '8px', borderRadius: '2px' }}
            />
          ))}
        </div>
      </div>

      <div ref={chatAndMapRef} className="flex flex-col md:flex-row gap-4 mt-20 mb-20 px-4">
        <div className="w-full md:w-1/2">
          <Gemini />
        </div>
        <div className="w-full md:w-1/2">
          <GoogleMaps />
        </div>
      </div>
    </div>
  );
}

export default Home;