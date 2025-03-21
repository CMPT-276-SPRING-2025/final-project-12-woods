import React, { useEffect, useRef } from "react";
import restaurantIcon from "../assets/restaurant.png";

function loadGoogleMapsAPI() {
  const script = document.createElement("script");
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

    // Add autocomplete input
    const input = document.getElementById("autocomplete");
    const autocomplete = new window.google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        return;
      }

      map.setCenter(place.geometry.location);
      map.setZoom(15);

      const marker = new window.google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name,
        icon: restaurantIconConfig,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div><h3>${place.name}</h3><p>${place.formatted_address}</p></div>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    });

    const placesService = new window.google.maps.places.PlacesService(map);

    const restaurantIconConfig = {
      url: restaurantIcon,
      scaledSize: new window.google.maps.Size(24, 24),
    };

    // Restrict the map to show only restaurants
    const request = {
      location: map.getCenter(),
      radius: "5000",
      type: ["restaurant"],
    };

    placesService.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((place) => {
          const marker = new window.google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name,
            icon: restaurantIconConfig,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div><h3>${place.name}</h3><p>${place.vicinity}</p></div>`,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });

          // Show info window on hover
          marker.addListener("mouseover", () => {
            infoWindow.open(map, marker);
          });

          marker.addListener("mouseout", () => {
            infoWindow.close();
          });
        });
      }
    });

    let infoWindow = null;

    // Load saved markers from local storage
    const savedMarkers = JSON.parse(localStorage.getItem("markers")) || [];
    savedMarkers.forEach(({ position, title, description }) => {
      const marker = new window.google.maps.Marker({
        position,
        map,
        title,
        icon: restaurantIconConfig,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div><h3>${title}</h3><p>${description}</p></div>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      // Add right-click listener to delete marker
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
      if (placeName) {
        const placeDescription = prompt("Enter a description for the place:");
        const marker = new window.google.maps.Marker({
          position: event.latLng,
          map: map,
          title: placeName,
          icon: restaurantIconConfig,
        });

        infoWindow = new window.google.maps.InfoWindow({
          content: `<div><h3>${placeName}</h3><p>${placeDescription}</p></div>`,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        // Add right-click listener to delete marker
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

    map.addListener("click", () => {
      if (infoWindow) {
        infoWindow.close();
      }
    });

    window.deleteMarker = function (lat, lng) {
      const marker = savedMarkers.find(
        (m) => m.position.lat === lat && m.position.lng === lng
      );
      if (marker) {
        marker.setMap(null);
        const index = savedMarkers.findIndex(
          (m) => m.position.lat === lat && m.position.lng === lng
        );
        if (index > -1) {
          savedMarkers.splice(index, 1);
          localStorage.setItem("markers", JSON.stringify(savedMarkers));
        }
        if (infoWindow) {
          infoWindow.close();
        }
      }
    };
  };

  return () => {
    document.head.removeChild(script);
    delete window.initMap;
    delete window.deleteMarker;
  };
}

function Home() {
  const inputRef = useRef(null);

  useEffect(() => {
    const cleanup = loadGoogleMapsAPI();
    return cleanup;
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to FoodieFind!</p>
      <input
        id="autocomplete"
        ref={inputRef}
        type="text"
        placeholder="Enter a location"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <div id="map" style={{ height: "600px", width: "100%" }}></div>
    </div>
  );
}

export default Home;
