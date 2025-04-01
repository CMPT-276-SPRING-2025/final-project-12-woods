import React, { useState, useEffect } from "react";
import { database } from "./firebase";
import { ref, push, onValue, remove } from "firebase/database";

function Dishes() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cuisine: "",
    photo: null,
  });
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const dishesRef = ref(database, "dishes");
    onValue(dishesRef, (snapshot) => {
      const data = snapshot.val();
      const dishesArray = data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];
      setDishes(dishesArray);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevData) => ({
          ...prevData,
          photo: reader.result, // Store the base64 string of the image
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isFormValid =
      formData.name &&
      formData.description &&
      formData.cuisine &&
      formData.photo;
    if (!isFormValid) {
      alert("Please fill in all fields and attach a photo.");
      return;
    }

    const dishesRef = ref(database, "dishes");
    push(dishesRef, formData);

    setFormData({
      name: "",
      description: "",
      cuisine: "",
      photo: null,
    });
    setShowForm(false);
  };

  const handleRemove = (idToRemove) => {
    const dishRef = ref(database, `dishes/${idToRemove}`);
    remove(dishRef);
  };

  return (
    <div>
      <div className="flex justify-center">
        <button
          onClick={() => setShowForm(true)}
          className="text-lg border-gray-300 
                w-30 h-30 flex items-center justify-center 
                text-center transition-transform duration-300 
                ease-in-out transform hover:scale-105 hover:bg-black hover:text-white 
                hover:shadow-[0_0_10px_5px_rgba(0,0,0,0.5)] rounded-[50%] text-black border shadow-lg"
        >
          Add Dish
        </button>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
            <h2 className="text-xl font-bold mb-4">Add a Dish</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Dish Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
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
                <label className="block text-gray-700">Photo</label>
                <div className="flex items-center">
                  <label
                    htmlFor="fileInput"
                    className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                  >
                    Choose File
                  </label>
                  <span className="ml-2 text-gray-500">
                    {formData.photo ? "File selected" : "No file selected"}
                  </span>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
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
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-6">
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="p-6 border rounded-xl shadow-lg bg-black text-white text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
          >
            <h3 className="text-xl font-semibold text-white mb-3">
              {dish.name}
            </h3>
            <p className="text-gray-300 mb-2">{dish.description}</p>
            <p className="text-gray-300 mb-2">{dish.cuisine}</p>
            {dish.photo && (
              <img
                src={dish.photo}
                alt={dish.name}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
            )}
            <button
              onClick={() => handleRemove(dish.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dishes;
