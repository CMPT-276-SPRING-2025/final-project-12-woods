import React, { useState, useEffect } from 'react';
import photo1 from '/src/assets/Home-images/Home-food-1.jpg';
import photo2 from '/src/assets/Home-images/Home-food-2.jpg';
import photo3 from '/src/assets/Home-images/Home-food-3.jpg';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';

//adding map function
function loadGoogleMapsAPI() {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAZbkQiYGY81HUVJ4dgX9YJZAr_kS_Lvfo&callback=initMap`;
  script.async = true;
  document.head.appendChild(script);

  window.initMap = function () {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 49.2827, lng: -123.1207 },
      zoom: 10,
    });

    let infoWindow = null;

    // Load saved markers from local storage
    const savedMarkers = JSON.parse(localStorage.getItem("markers")) || [];
    savedMarkers.forEach(({ position, title }) => {
      const marker = new window.google.maps.Marker({
        position,
        map,
        title,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div><h3>${title}</h3><p>Additional information can go here.</p></div>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    });

    map.addListener("click", (event) => {
      const placeName = prompt("Enter the name of the place:");
      if (placeName) {
        const marker = new window.google.maps.Marker({
          position: event.latLng,
          map: map,
          title: placeName,
        });

        infoWindow = new window.google.maps.InfoWindow({
          content: `<div><h3>${placeName}</h3><p>Additional information can go here.</p></div>`,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        // Save marker to local storage
        savedMarkers.push({
          position: event.latLng.toJSON(),
          title: placeName,
        });
        localStorage.setItem("markers", JSON.stringify(savedMarkers));
      }
    });

    map.addListener("click", () => {
      if (infoWindow) {
        infoWindow.close();
      }
    });
  };

  return () => {
    document.head.removeChild(script);
    delete window.initMap;
  };
}

//functionality for slideshow
function Home() {
  const slides = [
    { url: photo1 },
    { url: photo2 },
    { url: photo3 }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
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
        // Move to the next slide automatically
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

  // useEffect for Google Maps
  useEffect(() => {
    const cleanup = loadGoogleMapsAPI();
    return cleanup;
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Slideshow and content */}
      <div className="flex-grow">
        <div className="w-full h-[700px] m-0 px-0 relative group">
          {/* Background image */}
          <div
            style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
            className="w-full h-full bg-center bg-cover duration-500"
          ></div>

          {/* Left Arrow */}
          <div
            onClick={prevSlide}
            className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'
          >
            <BsChevronCompactLeft size={30} />
          </div>

          {/* Right Arrow */}
          <div
            onClick={nextSlide}
            className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'
          >
            <BsChevronCompactRight size={30} />
          </div>

          {/* Dots Navigation */}
          <div className='flex justify-center py-2'>
            {slides.map((_, slideIndex) => (
              <div
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`text-2xl cursor-pointer ${currentIndex === slideIndex ? 'text-blue-500' : 'text-gray-500'}`}
              >
                <RxDotFilled />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center py-4 mt-10">
          <h1>Find your next favorite spot!</h1>
          <p>Checkout the hidden gems</p>
        </div>

        {/* Google Maps */}
        <div id="map" class="h-[700px] w-1/2 ml-auto"></div>
      </div>
    </div>
  );
}

export default Home;