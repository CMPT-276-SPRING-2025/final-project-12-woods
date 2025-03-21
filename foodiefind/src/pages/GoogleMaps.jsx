import React, { useEffect, useCallback, useState } from "react";

function GoogleMaps() {
  const [userLocation, setUserLocation] = useState(null);

  const loadGoogleMapsAPI = useCallback(() => {
    const script = document.createElement("script");
    // Consider moving this API key to an environment variable for security
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCXbaN0ucHnZJ62qBzAonPJtYYuWvP0Pjw&libraries=places&callback=initMap`;
    script.async = true;
    document.head.appendChild(script);

    window.initMap = function () {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 49.2827, lng: -123.1207 },
        zoom: 10,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.business",
            stylers: [{ visibility: "on" }],
          },
          {
            featureType: "poi.government",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.medical",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.park",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.place_of_worship",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.school",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.sports_complex",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.attraction",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      let infoWindow = null;

      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(pos);
            map.setCenter(pos); // Center the map on the user's location
            map.setZoom(15); // Zoom in a bit

            // Add a blue circle for the user's location
            new window.google.maps.Circle({
              strokeColor: "#0000FF",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#0000FF",
              fillOpacity: 0.35,
              map,
              center: pos,
              radius: 100, // Radius in meters
            });

            // Limit the map to show only restaurants and cafes
            const request = {
              location: pos,
              radius: "5000",
              type: ["restaurant", "cafe"],
            };

            const service = new window.google.maps.places.PlacesService(map);
            service.nearbySearch(request, (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                results.forEach((place) => {
                  const marker = new window.google.maps.Marker({
                    map,
                    position: place.geometry.location,
                    title: place.name,
                    icon: {
                      url: "src/assets/cutlery.png",
                      scaledSize: new window.google.maps.Size(30, 30), // Set the size of the icon
                    },
                  });

                  const infoWindow = new window.google.maps.InfoWindow({
                    content: `<div><h3>${place.name}</h3><p>${place.vicinity}</p></div>`,
                  });

                  marker.addListener("mouseover", () => {
                    infoWindow.open(map, marker);
                  });

                  marker.addListener("mouseout", () => {
                    infoWindow.close();
                  });
                });
              }
            });
          },
          () => {
            console.error("Error: The Geolocation service failed.");
          }
        );
      } else {
        console.error("Error: Your browser doesn't support geolocation.");
      }

      // Load saved markers from local storage
      const savedMarkers = JSON.parse(localStorage.getItem("markers")) || [];
      savedMarkers.forEach(({ position, title, description }) => {
        const marker = new window.google.maps.Marker({
          position,
          map,
          title,
          icon: {
            url: "src/assets/cutlery.png",
            scaledSize: new window.google.maps.Size(30, 30), // Set the size of the icon
          },
        });

        const markerInfoWindow = new window.google.maps.InfoWindow({
          content: `<div><h3>${title}</h3><p>${description}</p></div>`,
        });

        marker.addListener("mouseover", () => {
          markerInfoWindow.open(map, marker);
        });

        marker.addListener("mouseout", () => {
          markerInfoWindow.close();
        });

        marker.addListener("rightclick", () => {
          marker.setMap(null);
          const index = savedMarkers.findIndex(
            (m) =>
              m.position.lat === position.lat && m.position.lng === position.lng
          );
          if (index > -1) {
            savedMarkers.splice(index, 1);
            localStorage.setItem("markers", JSON.stringify(savedMarkers));
          }
        });
      });

      map.addListener("click", (event) => {
        const placeName = prompt("Enter the name of the place:");
        const placeDescription = prompt("Enter a description for the place:");
        if (placeName && placeDescription) {
          const marker = new window.google.maps.Marker({
            position: event.latLng,
            map: map,
            title: placeName,
            icon: {
              url: "src/assets/cutlery.png",
              scaledSize: new window.google.maps.Size(30, 30), // Set the size of the icon
            },
          });

          const newInfoWindow = new window.google.maps.InfoWindow({
            content: `<div><h3>${placeName}</h3><p>${placeDescription}</p></div>`,
          });

          marker.addListener("mouseover", () => {
            newInfoWindow.open(map, marker);
          });

          marker.addListener("mouseout", () => {
            newInfoWindow.close();
          });

          marker.addListener("rightclick", () => {
            marker.setMap(null);
            const index = savedMarkers.findIndex(
              (m) =>
                m.position.lat === event.latLng.lat() &&
                m.position.lng === event.latLng.lng()
            );
            if (index > -1) {
              savedMarkers.splice(index, 1);
              localStorage.setItem("markers", JSON.stringify(savedMarkers));
            }
          });

          // Save marker to local storage
          savedMarkers.push({
            position: event.latLng.toJSON(),
            title: placeName,
            description: placeDescription,
          });
          localStorage.setItem("markers", JSON.stringify(savedMarkers));
        }
      });
    };

    return () => {
      const scriptElement = document.querySelector(
        `script[src*="maps.googleapis.com"]`
      );
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
        const mapInstance = maps.Map.instance
          ? maps.Map.instance[mapElement.getAttribute("id")]
          : null;

        if (mapInstance) {
          google.maps.event.trigger(mapInstance, "resize");
          // Maintain center point after resize
          const currentCenter = mapInstance.getCenter();
          mapInstance.setCenter(currentCenter);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize Google Maps
  useEffect(() => {
    const cleanup = loadGoogleMapsAPI();
    return cleanup;
  }, [loadGoogleMapsAPI]);

  return <div id="map" className="w-full h-full"></div>;
}

export default GoogleMaps;