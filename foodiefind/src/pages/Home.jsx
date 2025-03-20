import React, { useEffect } from "react";

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

function Home() {
  useEffect(() => {
    const cleanup = loadGoogleMapsAPI();
    return cleanup;
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to FoodieFind!</p>
      <div id="map" style={{ height: "600px", width: "100%" }}></div>
    </div>
  );
}

export default Home;
