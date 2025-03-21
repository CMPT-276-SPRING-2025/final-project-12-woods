import React, { useEffect, useCallback } from 'react';

function GoogleMaps() {
  const loadGoogleMapsAPI = useCallback(() => {
    const script = document.createElement("script");
    // Consider moving this API key to an environment variable for security
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

        const markerInfoWindow = new window.google.maps.InfoWindow({
          content: `<div><h3>${title}</h3><p>Additional information can go here.</p></div>`,
        });

        marker.addListener("click", () => {
          // Close any previously opened info window
          if (infoWindow) {
            infoWindow.close();
          }
          markerInfoWindow.open(map, marker);
          infoWindow = markerInfoWindow;
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

          const newInfoWindow = new window.google.maps.InfoWindow({
            content: `<div><h3>${placeName}</h3><p>Additional information can go here.</p></div>`,
          });

          marker.addListener("click", () => {
            if (infoWindow) {
              infoWindow.close();
            }
            newInfoWindow.open(map, marker);
            infoWindow = newInfoWindow;
          });

          // Save marker to local storage
          savedMarkers.push({
            position: event.latLng.toJSON(),
            title: placeName,
          });
          localStorage.setItem("markers", JSON.stringify(savedMarkers));
        }
      });
    };

    return () => {
      const scriptElement = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
      delete window.initMap;
    };
  }, []);

  // Handle window resize for map
  useEffect(() => {
    const handleResize = () => {
      const mapElement = document.getElementById("map");
      if (mapElement && window.google && window.google.maps) {
        const maps = window.google.maps;
        const mapInstance = maps.Map.instance ? maps.Map.instance[mapElement.getAttribute("id")] : null;
        
        if (mapInstance) {
          google.maps.event.trigger(mapInstance, 'resize');
          // Maintain center point after resize
          const currentCenter = mapInstance.getCenter();
          mapInstance.setCenter(currentCenter);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize Google Maps
  useEffect(() => {
    const cleanup = loadGoogleMapsAPI();
    return cleanup;
  }, [loadGoogleMapsAPI]);
  
  return (
    <div id="map" className="w-full h-full"></div>
  );
}

export default GoogleMaps;