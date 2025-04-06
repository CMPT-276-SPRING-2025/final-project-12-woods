import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyAMzfBeyQP2K2i-0yDQ-7DCVzRUAprg5vM"; // Replace with your API key
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
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 49.2827, lng: -123.1207 });
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(1000);
  const [places, setPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const [restaurantMarkers, setRestaurantMarkers] = useState([]);
  const [geoError, setGeoError] = useState(null);

  // useRef to track if the component is still mounted
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Get user location on map load
  useEffect(() => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!isMountedRef.current) return;
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          setCenter(loc);
          map.panTo(loc);
          fetchNearbyPlaces(loc);
          setGeoError(null);
        },
        () => {
          if (!isMountedRef.current) return;
          setGeoError("Geolocation failed. Using default location.");
          setUserLocation(center);
          fetchNearbyPlaces(center);
        }
      );
    }
  }, [map]);

  // Fetch nearby food-serving places with safe async handling
  const fetchNearbyPlaces = (location = center) => {
    if (!map || !window.google) return;
    setLoadingPlaces(true);
    const service = new window.google.maps.places.PlacesService(map);
    const searchCenter = userLocation || location;
    const request = {
      location: searchCenter,
      radius: radius,
      type: "establishment",
      keyword: "restaurant OR food OR cafe OR bakery OR diner",
    };

    let allResults = [];
    const processResults = (results, status, pagination) => {
      if (!isMountedRef.current) return;
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        allResults = [...allResults, ...results];
        if (pagination && pagination.hasNextPage) {
          setTimeout(() => {
            if (isMountedRef.current && pagination.hasNextPage) {
              pagination.nextPage();
            }
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
          if (isMountedRef.current) {
            setPlaces(filteredResults);
            setLoadingPlaces(false);
          }
        }
      } else {
        if (isMountedRef.current) {
          console.error("Nearby search failed: ", status);
          setLoadingPlaces(false);
        }
      }
    };

    service.nearbySearch(request, processResults);
  };

  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
    fetchNearbyPlaces();
  };

  // Rest of your component logic and rendering
  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <div className="flex flex-wrap items-center gap-4 mb-4 px-4">
        <label className="flex items-center gap-2 flex-1">
          <span className="text-sm sm:text-base font-medium text-gray-700">
            Search Restaurants:
          </span>
          <Autocomplete
            onLoad={(autocomplete) => {
              // save autocomplete ref if needed
            }}
            onPlaceChanged={() => {
              // handle restaurant autocomplete changes
            }}
            options={{ types: ["establishment"] }}
          >
            <input
              type="text"
              placeholder="Search for any restaurant..."
              className="border border-gray-300 rounded-md p-2 w-full max-w-[200px] focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </Autocomplete>
        </label>
        <label className="flex items-center gap-2 flex-1">
          <span className="text-sm sm:text-base font-medium text-gray-700">
            Your Location:
          </span>
          <Autocomplete
            onLoad={(autocomplete) => {
              // save autocomplete ref if needed
            }}
            onPlaceChanged={() => {
              // handle user location autocomplete changes
            }}
            options={{ types: ["geocode"] }}
          >
            <input
              type="text"
              placeholder="Enter your location"
              className="border border-gray-300 rounded-md p-2 w-full max-w-[200px] focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </Autocomplete>
        </label>
        <label className="flex items-center gap-2 flex-1">
          <span className="text-sm sm:text-base font-medium text-gray-700">
            Radius (km):
          </span>
          <input
            type="number"
            min="1"
            value={(radius / 1000).toString()}
            onChange={(e) => {
              const kmValue = parseInt(e.target.value, 10);
              if (!isNaN(kmValue) && kmValue >= 1) {
                const newRadius = kmValue * 1000;
                setRadius(newRadius);
                fetchNearbyPlaces();
              }
            }}
            className="border border-gray-300 rounded-md p-2 w-full max-w-[80px] text-center focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </label>
      </div>

      <div className="flex justify-between text-gray-600 text-sm mb-2 px-4">
        <span>1. Click on a pin to view more details.</span>
        <span>
          2. Click anywhere on the map to drop a custom pin with an emoji.
        </span>
      </div>

      <div className="relative w-full h-[300px] sm:h-[500px]">
        {loadingPlaces && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-md shadow-md z-10">
            Loading places...
          </div>
        )}

        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={center}
          zoom={14}
          onLoad={onMapLoad}
          options={{ clickableIcons: false }}
        >
          {userLocation && (
            <Marker
              position={userLocation}
              icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            />
          )}

          {userLocation && (
            <Circle
              center={userLocation}
              radius={radius}
              options={circleOptions}
            />
          )}

          {places.map((place) => (
            <Marker
              key={place.place_id}
              position={{
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              }}
              label={{
                text: place.rating
                  ? place.rating > 4.7
                    ? "💎"
                    : place.rating < 4.0
                    ? "😰"
                    : "😊"
                  : "🤷‍♂️",
                fontSize: "24px",
              }}
              onClick={() => setHoveredPlace(place)}
            />
          ))}

          {restaurantMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              label={{ text: "🤤", fontSize: "24px" }}
              onClick={() => setHoveredPlace(marker)}
            />
          ))}

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
              <div>
                <h4>{hoveredPlace.name || "Restaurant"}</h4>
                <p>{hoveredPlace.vicinity || ""}</p>
                {hoveredPlace.rating && (
                  <p>Rating: {hoveredPlace.rating} ⭐</p>
                )}
                {hoveredPlace.place_id && (
                  <a
                    href={`https://www.google.com/maps/place/?q=place_id:${hoveredPlace.place_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#4285F4",
                      textDecoration: "underline",
                      fontWeight: "bold",
                    }}
                  >
                    View on Google Maps
                  </a>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {geoError && (
          <div
            style={{
              marginTop: "10px",
              textAlign: "center",
              color: "red",
              fontWeight: "lighter",
            }}
          >
            {geoError}
          </div>
        )}
      </div>
    </LoadScript>
  );
};

export default GoogleMaps;
