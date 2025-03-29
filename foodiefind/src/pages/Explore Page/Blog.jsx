import React, { useState, useEffect } from "react";

function Blog() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        link: "",
        cuisine: "",
        price: "",
        hours: "",
        phone: "",
    });
    const [restaurants, setRestaurants] = useState(() => {
        const savedRestaurants = JSON.parse(localStorage.getItem("restaurants")) || [];
        return savedRestaurants;
    });

    useEffect(() => {
        const savedRestaurants = JSON.parse(localStorage.getItem("restaurants")) || [];
        setRestaurants(savedRestaurants);
    }, []);

    useEffect(() => {
        localStorage.setItem("restaurants", JSON.stringify(restaurants));
    }, [restaurants]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if all fields are filled
        const isFormValid = Object.values(formData).every((value) => value.trim() !== "");
        if (!isFormValid) {
            alert("Please fill in all fields before submitting.");
            return;
        }

        setRestaurants((prevRestaurants) => [...prevRestaurants, formData]);
        setFormData({
            name: "",
            location: "",
            link: "",
            cuisine: "",
            price: "",
            hours: "",
            phone: "",
        });
        setShowForm(false);
    };

    const handleRemove = (indexToRemove) => {
        setRestaurants((prevRestaurants) =>
            prevRestaurants.filter((_, index) => index !== indexToRemove)
        );
    };

    return (
        <div>
            <button
                onClick={() => setShowForm(true)}
                className="text-lg text-gray-200 border-gray-300 p-2 
                text-center block transition-transform duration-300 
                ease-in-out transform hover:scale-105 hover:bg-blue-600 
                hover:shadow-2xl rounded-lg text-white border -translate-y-1 shadow-lg"
            >
                Add a Restaurant
            </button>
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
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
                                    <option value="italian">Italian</option>
                                    <option value="american">American</option>
                                    <option value="korean">Korean</option>
                                    <option value="vietnamese">Vietnamese</option>
                                    <option value="middle-eastern">Middle Eastern</option>
                                    <option value="greek">Greek</option>
                                    <option value="spanish">Spanish</option>
                                    <option value="singaporean">Singaporean</option>
                                    <option value="brazilian">Brazilian</option>
                                    <option value="caribbean">Caribbean</option>
                                    <option value="german">German</option>
                                    <option value="british">British</option>
                                    <option value="chinese">Chinese</option>
                                    <option value="japanese">Japanese</option>
                                    <option value="indian">Indian</option>
                                    <option value="mexican">Mexican</option>
                                    <option value="thai">Thai</option>
                                    <option value="french">French</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Price</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Hours</label>
                                <input
                                    type="text"
                                    name="hours"
                                    value={formData.hours}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Contact Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
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
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-6">
                {restaurants.map((restaurant, index) => (
                    <div
                        key={index}
                        className="p-6 border rounded-xl shadow-lg bg-white text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{restaurant.name}</h3>
                        <p className="text-gray-600 mb-2"><strong>Location:</strong> {restaurant.location}</p>
                        <p className="text-gray-600 mb-2">
                            <strong>Link:</strong>{" "}
                            <a
                                href={restaurant.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline hover:text-blue-700"
                            >
                                {restaurant.link}
                            </a>
                        </p>
                        <p className="text-gray-600 mb-2"><strong>Cuisine:</strong> {restaurant.cuisine}</p>
                        <p className="text-gray-600 mb-2"><strong>Price:</strong> {restaurant.price}</p>
                        <p className="text-gray-600 mb-2"><strong>Hours:</strong> {restaurant.hours}</p>
                        <p className="text-gray-600 mb-4"><strong>Contact Phone:</strong> {restaurant.phone}</p>
                        <button
                            onClick={() => handleRemove(index)}
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

export default Blog;
