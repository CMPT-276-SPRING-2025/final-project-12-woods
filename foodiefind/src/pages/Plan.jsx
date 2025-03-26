import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function Plan() {
  // State for form inputs
  const [budget, setBudget] = useState('');
  const [restrictions, setRestrictions] = useState('');
  const [location, setLocation] = useState('');

  // State for the generated plan
  const [mealPlan, setMealPlan] = useState(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to generate meal plan using Gemini API
  const generateMealPlan = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // API key remains the same
      const API_KEY = "AIzaSyArPM7lrMXJlMJsHHVJEq08IpYPiX_hCmA";

      // Construct prompt (this part is fine)
      const prompt = `Create a realistic full day meal plan (breakfast, lunch, dinner) for someone in ${location} with a budget of ${budget}.
      Dietary restrictions: ${restrictions || 'None'}.
      For each meal, suggest ONLY real, currently operating restaurants in ${location} that you are confident exist.
      For each restaurant, provide:
      1. The restaurant's actual name
      2. Their accurate address
      3. A dish they're known for that matches any dietary restrictions
      4. A reasonable price estimate based on current prices
      
      Format the output using markdown with headers for Breakfast, Lunch, and Dinner.
      Be factual and only include restaurants you're confident exist in ${location}.`;

      // Updated API endpoint to use the current model name (gemini-1.5-pro instead of gemini-pro)
      // and updated API version (v1 instead of v1beta)
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=AIzaSyArPM7lrMXJlMJsHHVJEq08IpYPiX_hCmA`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate meal plan');
      }

      const data = await response.json();

      // Extract the text response
      const generatedText = data.candidates[0]?.content?.parts[0]?.text;

      if (!generatedText) {
        throw new Error('No meal plan was generated. Please try again.');
      }

      setMealPlan(generatedText);
    } catch (err) {
      console.error('Error generating meal plan:', err);
      setError(err.message || 'Failed to generate meal plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    generateMealPlan();
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Plan Your Perfect Food Day</h1>
      <p className="text-center mb-6 text-gray-600">Enter your preferences, and we'll create a personalized meal plan for you!</p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/3">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budget">
                Daily Budget
              </label>
              <input
                type="text"
                id="budget"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g. $100"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="restrictions">
                Dietary Restrictions
              </label>
              <input
                type="text"
                id="restrictions"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g. vegetarian, gluten-free"
                value={restrictions}
                onChange={(e) => setRestrictions(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                Location
              </label>
              <input
                type="text"
                id="location"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g. Vancouver, BC"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Your Plan...' : 'Generate Meal Plan'}
              </button>
            </div>
          </form>
        </div>

        {/* Right side - Results */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]">
            <h2 className="text-2xl font-bold mb-4 text-center">Your Customized Meal Plan</h2>

            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
                <p className="text-gray-600">Crafting your perfect food day...</p>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            ) : mealPlan ? (
              <div className="text-gray-700 p-4">
                <div className="mb-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  Note: Restaurant information is generated by AI and should be verified before visiting.
                </div>
                <ReactMarkdown>{mealPlan}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-gray-500 italic text-center h-64 flex items-center justify-center">
                <p>Fill out the form and generate a meal plan to see your personalized recommendations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Plan;