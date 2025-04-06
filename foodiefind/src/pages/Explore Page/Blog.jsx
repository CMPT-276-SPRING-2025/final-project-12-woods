import React, { useState, useEffect } from "react";
import { database } from "./firebase"; 
import { ref, push, onValue, remove, update } from "firebase/database"; 

// Generate or retrieve a unique identifier for the current user
const getCurrentUserId = () => {
  let userId = localStorage.getItem("creatorId");
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("creatorId", userId);
  }
  return userId;
};

const currentUserId = getCurrentUserId(); // Use this as the creatorId

function Blog() {
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    link: "",
    cuisine: "",
    price: "",
    author: "", 
  });
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const restaurantsRef = ref(database, "restaurants");
    onValue(restaurantsRef, (snapshot) => {
      const data = snapshot.val();
      const restaurantsArray = data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];
      setRestaurants(restaurantsArray);
    });
  }, []);

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }
    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [showForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const isFormValid = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
  
    const isGoogleMapsLink = /^https:\/\/(www\.)?google\.[a-z]+\/maps/.test(formData.link);
  
    if (!isFormValid) {
      alert("Please fill in all fields before submitting.");
      return;
    }
  
    if (!isGoogleMapsLink) {
      alert("Please enter a valid Google Maps link.");
      return;
    }
  
    const restaurantsRef = ref(database, "restaurants");
    push(restaurantsRef, { ...formData, userId: currentUserId, creatorId: currentUserId }); 
  
    setFormData({
      name: "",
      location: "",
      link: "",
      cuisine: "",
      price: "",
      author: "",
    });
    setShowForm(false);
  };

  const handleRemove = (idToRemove, creatorId) => {
    if (creatorId !== currentUserId) {
      alert("You can only delete your own blog posts.");
      return;
    }
    const blogRef = ref(database, `blogs/${idToRemove}`);
    remove(blogRef);
  };

  const handleLike = (id) => {
    const restaurantRef = ref(database, `restaurants/${id}`);
    const restaurant = restaurants.find((r) => r.id === id);
  
    const userVotes = restaurant.userVotes || {};
    const currentUserVote = userVotes[currentUserId];
  
    if (currentUserVote === "like") {
      // Remove the like
      const updatedLikes = Math.max((restaurant.likes || 0) - 1, 0);
      delete userVotes[currentUserId];
      update(restaurantRef, { likes: updatedLikes, userVotes });
    } else {
      // Add the like and remove unlike if it exists
      const updatedLikes = (restaurant.likes || 0) + 1;
      const updatedUnlikes = Math.max((restaurant.unlikes || 0) - (currentUserVote === "unlike" ? 1 : 0), 0);
      userVotes[currentUserId] = "like";
      update(restaurantRef, { likes: updatedLikes, unlikes: updatedUnlikes, userVotes });
    }
  };
  
  const handleUnlike = (id) => {
    const restaurantRef = ref(database, `restaurants/${id}`);
    const restaurant = restaurants.find((r) => r.id === id);
  
    const userVotes = restaurant.userVotes || {};
    const currentUserVote = userVotes[currentUserId];
  
    if (currentUserVote === "unlike") {
      // Remove the unlike
      const updatedUnlikes = Math.max((restaurant.unlikes || 0) - 1, 0);
      delete userVotes[currentUserId];
      update(restaurantRef, { unlikes: updatedUnlikes, userVotes });
    } else {
      // Add the unlike and remove like if it exists
      const updatedUnlikes = (restaurant.unlikes || 0) + 1;
      const updatedLikes = Math.max((restaurant.likes || 0) - (currentUserVote === "like" ? 1 : 0), 0);
      userVotes[currentUserId] = "unlike";
      update(restaurantRef, { unlikes: updatedUnlikes, likes: updatedLikes, userVotes });
    }
  };

  return (
    <div>

      {/* ////////////////////////////////// TESTING BUTTONS ////////////////////////////////// */}
      <div className="flex justify-center space-x-4 mb-4">
        {/* Simulate New User */}
        <button
          onClick={() => {
            localStorage.removeItem("creatorId");
            window.location.reload();
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Simulate New User
        </button>

        {/* Set Specific User ID */}
        <button
          onClick={() => {
            const newUserId = prompt("Enter a new user ID:", "user-12345");
            if (newUserId) {
              localStorage.setItem("creatorId", newUserId);
              window.location.reload();
            }
          }}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Set Specific User ID
        </button>
      </div>

      {/* ////////////////////////////////// TESTING BUTTONS ////////////////////////////////// */}


      {/* Existing Add Restaurant Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowForm(true)}
          className="text-lg border-gray-300 
                w-30 h-30 flex items-center justify-center 
                text-center transition-transform duration-300 
                ease-in-out transform hover:scale-105 hover:bg-black hover:text-white 
                hover:shadow-[0_0_10px_5px_rgba(0,0,0,0.5)] rounded-[50%] text-black border shadow-lg"
        >
          Add Restaurant
        </button>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
            <h2 className="text-xl font-bold mb-4">Add a Restaurant</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Restaurant Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Location</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="">Select Location</option>
                  <option value="Vancouver">Vancouver</option>
                  <option value="Surrey">Surrey</option>
                  <option value="Burnaby">Burnaby</option>
                  <option value="Richmond">Richmond</option>
                  <option value="New Westminster">New Westminster</option>
                  <option value="Coquitlam">Coquitlam</option>
                  <option value="Delta">Delta</option>
                  <option value="Langley">Langley</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Link</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Cuisine</label>
                <select
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="">Select Cuisine</option>
                  <option value="American">American</option>
                  <option value="Brazilian">Brazilian</option>
                  <option value="British">British</option>
                  <option value="Caribbean">Caribbean</option>
                  <option value="Chinese">Chinese</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Greek">Greek</option>
                  <option value="Indian">Indian</option>
                  <option value="Italian">Italian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Middle Eastern">Middle Eastern</option>
                  <option value="Singaporean">Singaporean</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Thai">Thai</option>
                  <option value="Vietnamese">Vietnamese</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Price</label>
                <select
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="">Select Price</option>
                  <option value="$">$</option>
                  <option value="$$">$$</option>
                  <option value="$$$">$$$</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="p-6 border rounded-xl shadow-lg bg-black text-white text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
            style={{
              width: "100%", // Let the width take up the grid cell
              height: "0", // Maintain a square shape using aspect ratio
              paddingBottom: "100%", // This will enforce a square ratio for the card
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              <div
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "normal",
                }}
              >
                <h3 className="text-xl font-semibold text-white mb-3 break-words">
                  {restaurant.name}
                </h3>
                <p className="text-gray-300 mb-2 break-words">
                  <strong>Author:</strong> {restaurant.author}
                </p>
                <p className="text-gray-300 mb-2 break-words">
                  <strong>Location:</strong> {restaurant.location}
                </p>
                <p className="text-gray-300 mb-2 break-words">
                  <strong>Cuisine:</strong> {restaurant.cuisine}
                </p>
                <p className="text-gray-300 mb-2 break-words">
                  <strong>Price:</strong> {restaurant.price}
                </p>
                <button
                  onClick={() => window.open(restaurant.link, "_blank")}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Visit Link
                </button>
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleLike(restaurant.id)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    restaurant.userVote === "like" ? "bg-green-600 text-white" : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  👍 <span className="ml-2">{restaurant.likes || 0}</span>
                </button>
                <button
                  onClick={() => handleUnlike(restaurant.id)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    restaurant.userVote === "unlike" ? "bg-yellow-600 text-white" : "bg-yellow-500 text-white hover:bg-yellow-600"
                  }`}
                >
                  👎 <span className="ml-2">{restaurant.unlikes || 0}</span>
                </button>
              </div>
              {restaurant.creatorId === currentUserId && ( // Only show the remove button for the creator
                <button
                  onClick={() => handleRemove(restaurant.id, restaurant.creatorId)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors mt-4"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;
