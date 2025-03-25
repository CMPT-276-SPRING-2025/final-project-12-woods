import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = ""; // Replace with your API key
const libraries = ["places", "geometry"];

const containerStyle = {
  width: "100%",
  height: "500px",
};

const circleOptions = {
  fillColor: "#AAD3DF",
  fillOpacity: 0.35,
  strokeColor: "#4285F4",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};

const GoogleMaps = () => {
  // Map and location state
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 49.2827, lng: -123.1207 });
  const [userLocation, setUserLocation] = useState(null);
  // Default radius is now 1km (1000 meters)
  const [radius, setRadius] = useState(1000);
  const [places, setPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  // Hovered place for info window
  const [hoveredPlace, setHoveredPlace] = useState(null);
  // Custom pins dropped on the map (as emojis)
  const [customPins, setCustomPins] = useState([]);
  // Searched restaurant markers (from the additional restaurant search)
  const [restaurantMarkers, setRestaurantMarkers] = useState([]);

  // Refs for Autocomplete inputs
  const userLocationAutocompleteRef = useRef(null);
  const foodAutocompleteRef = useRef(null);
  const restaurantAutocompleteRef = useRef(null);

  // On map load, get user location and fetch nearby places
  useEffect(() => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          setCenter(loc);
          map.panTo(loc);
          fetchNearbyPlaces(loc);
        },
        () => {
          alert("Geolocation failed. Using default location.");
          setUserLocation(center);
          fetchNearbyPlaces(center);
        }
      );
    }
  }, [map]);

  // Fetch nearby food-serving places
  const fetchNearbyPlaces = (location = center) => {
    if (!map || !window.google) return;
    setLoadingPlaces(true);
    const service = new window.google.maps.places.PlacesService(map);
    const searchCenter = userLocation || location;
    const request = {
      location: searchCenter,
      radius: radius,
      type: "establishment",
      // Broad keyword search for food-serving places
      keyword: "restaurant OR food OR cafe OR bakery OR diner",
    };

    let allResults = [];

    const processResults = (results, status, pagination) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        allResults = [...allResults, ...results];
        if (pagination && pagination.hasNextPage) {
          setTimeout(() => {
            pagination.nextPage();
          }, 1500);
        } else {
          const centerLatLng = new window.google.maps.LatLng(
            searchCenter.lat,
            searchCenter.lng
          );
          const filteredResults = allResults.filter((place) => {
            const placeLatLng = new window.google.maps.LatLng(
              place.geometry.location.lat(),
              place.geometry.location.lng()
            );
            const distance =
              window.google.maps.geometry.spherical.computeDistanceBetween(
                centerLatLng,
                placeLatLng
              );
            return distance <= radius;
          });
          setPlaces(filteredResults);
          setLoadingPlaces(false);
        }
      } else {
        console.error("Nearby search failed: ", status);
        setLoadingPlaces(false);
      }
    };

    service.nearbySearch(request, processResults);
  };

  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
    fetchNearbyPlaces();
  };

  // Autocomplete for user location change
  const onUserLocationAutocompleteLoad = (autocomplete) => {
    userLocationAutocompleteRef.current = autocomplete;
  };

  const onUserLocationChanged = () => {
    if (userLocationAutocompleteRef.current) {
      const place = userLocationAutocompleteRef.current.getPlace();
      if (place?.geometry) {
        const newLoc = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setUserLocation(newLoc);
        setCenter(newLoc);
        map.panTo(newLoc);
        fetchNearbyPlaces(newLoc);
      } else {
        //alert("No details available for the selected location.");
      }
    }
  };

  // Autocomplete for restaurant search
  const onRestaurantAutocompleteLoad = (autocomplete) => {
    restaurantAutocompleteRef.current = autocomplete;
  };

  const onRestaurantPlaceChanged = () => {
    if (restaurantAutocompleteRef.current) {
      const place = restaurantAutocompleteRef.current.getPlace();
      if (place?.geometry) {
        const newCenter = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setCenter(newCenter);
        map.panTo(newCenter);
        // Add a marker for the searched restaurant
        setRestaurantMarkers((prev) => [
          ...prev,
          {
            id: place.place_id || Date.now(),
            position: newCenter,
            name: place.name,
            vicinity: place.vicinity,
            rating: place.rating,
          },
        ]);
      } else {
        alert("No details available for the selected restaurant.");
      }
    }
  };

  const handleRadiusInputChange = (e) => {
    const kmValue = parseInt(e.target.value, 10);
    if (!isNaN(kmValue) && kmValue >= 1) {
      const newRadius = kmValue * 1000;
      setRadius(newRadius);
      fetchNearbyPlaces();
    }
  };

  const handleMapClick = (event) => {
    const emoji = window.prompt("Enter an emoji/text for your custom pin:");
    if (emoji && emoji.trim() !== "") {
      const newPin = {
        id: Date.now(),
        position: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        },
        emoji: emoji.trim(),
      };
      setCustomPins((prevPins) => [...prevPins, newPin]);
    }
  };

  // Simple hover logic: on mouse over, show info; on mouse out, hide info immediately.
  const handleMarkerMouseOver = (place) => {
    setHoveredPlace(place);
  };

  const handleMarkerMouseOut = () => {
    setHoveredPlace(null);
  };

  // Returns an emoji label based on rating for nearby places.
  const getMarkerLabel = (place) => {
    if (place.rating) {
      if (place.rating > 4.7) return "💎";
      if (place.rating < 4.0) return "😰";
      return "😊";
    }
    return "🤷‍♂️";
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <div style={{ marginBottom: "10px", display: "flex", gap: "20px" }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          Your Location:{" "}
          <Autocomplete
            onLoad={onUserLocationAutocompleteLoad}
            onPlaceChanged={onUserLocationChanged}
            options={{ types: ["geocode"] }}
          >
            <input
              type="text"
              placeholder="Enter your location"
              style={{ width: "300px", padding: "5px", marginLeft: "5px" }}
            />
          </Autocomplete>
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          Search Restaurants:{" "}
          <Autocomplete
            onLoad={onRestaurantAutocompleteLoad}
            onPlaceChanged={onRestaurantPlaceChanged}
            options={{ types: ["establishment"] }}
          >
            <input
              type="text"
              placeholder="Search for a restaurant..."
              style={{ width: "300px", padding: "5px", marginLeft: "5px" }}
            />
          </Autocomplete>
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <div>
          <span>
            Radius (km):{" "}
            <input
              type="number"
              min="1"
              value={(radius / 1000).toString()}
              onChange={handleRadiusInputChange}
              style={{ width: "60px", margin: "0 5px" }}
            />
          </span>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        {loadingPlaces && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              background: "rgba(255,255,255,0.9)",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            Loading places...
          </div>
        )}

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          onLoad={onMapLoad}
          onClick={handleMapClick}
        >
          {/* User location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            />
          )}

          {/* Circle overlay around user's location */}
          {userLocation && (
            <Circle
              center={userLocation}
              radius={radius}
              options={circleOptions}
            />
          )}

          {/* Markers for nearby food places */}
          {places.map((place) => (
            <Marker
              key={place.place_id}
              position={{
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              }}
              label={{ text: getMarkerLabel(place), fontSize: "24px" }}
              onMouseOver={() => handleMarkerMouseOver(place)}
              onMouseOut={handleMarkerMouseOut}
            />
          ))}

          {/* Markers for searched restaurants */}
          {restaurantMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              label={{ text: "🤤", fontSize: "24px" }}
              onMouseOver={() => setHoveredPlace(marker)}
              onMouseOut={() => setHoveredPlace(null)}
            />
          ))}

          {/* InfoWindow for hovered marker */}
          {hoveredPlace && (
           <InfoWindow
           position={{
             lat: hoveredPlace.geometry
               ? hoveredPlace.geometry.location.lat()
               : hoveredPlace.position.lat,
             lng: hoveredPlace.geometry
               ? hoveredPlace.geometry.location.lng()
               : hoveredPlace.position.lng,
           }}
           onCloseClick={() => setHoveredPlace(null)}
           options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
         >
           <div style={{ pointerEvents: "none" }}>
             <h4>{hoveredPlace.name || "Restaurant"}</h4>
             <p>{hoveredPlace.vicinity || ""}</p>
             {hoveredPlace.rating && <p>Rating: {hoveredPlace.rating}</p>}
           </div>
         </InfoWindow>
         
          )}

          {/* Custom pin markers as emojis */}
          {customPins.map((pin) => (
            <Marker
              key={pin.id}
              position={pin.position}
              label={{ text: pin.emoji, fontSize: "24px" }}
              onClick={() => {}}
            />
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default GoogleMaps;
