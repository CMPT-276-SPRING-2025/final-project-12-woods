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
      const API_KEY = "AIzaSyBE85Q9TIxhP4hPlAMjAHeUXIb5oTfk9rI";

      // Improved Prompt for structured Markdown output with links
      const prompt = `Create a realistic full-day meal plan (breakfast, lunch, dinner) for someone in ${location} with a budget of ${budget}.
      Dietary restrictions: ${restrictions || 'None'}.

      IMPORTANT INSTRUCTIONS:
      1. Only suggest REAL, currently operating restaurants in ${location} that you are VERY confident exist
      2. If you're unsure about a restaurant's existence, choose a different well-known restaurant instead
      3. For Google Maps links, use EXACTLY this format: https://www.google.com/maps/search/?api=1&query=RESTAURANT+NAME+ADDRESS 
         (replace RESTAURANT+NAME+ADDRESS with the URL-encoded restaurant name and address)
      4. For website links, use direct URLs to the restaurant's homepage if you know it

      The output MUST be in the following Markdown format:

      ## Breakfast
      - **Restaurant Name:** [Restaurant Name 1]
        - **Address:** [Restaurant Address 1]
        - **Links:** [Google Maps](https://www.google.com/maps/search/?api=1&query=RESTAURANT+NAME+1+ADDRESS+1) | [Website](https://restaurantwebsite.com) (if available)
        - **Dish:** [Dish Name 1] (Suitable for: ${restrictions || 'No restrictions'})
        - **Price:** [Price Estimate 1]

      ## Lunch
      - **Restaurant Name:** [Restaurant Name 2]
        - **Address:** [Restaurant Address 2]
        - **Links:** [Google Maps](https://www.google.com/maps/search/?api=1&query=RESTAURANT+NAME+2+ADDRESS+2) | [Website](https://restaurant2website.com) (if available)
        - **Dish:** [Dish Name 2] (Suitable for: ${restrictions || 'No restrictions'})
        - **Price:** [Price Estimate 2]

      ## Dinner
      - **Restaurant Name:** [Restaurant Name 3]
        - **Address:** [Restaurant Address 3]
        - **Links:** [Google Maps](https://www.google.com/maps/search/?api=1&query=RESTAURANT+NAME+3+ADDRESS+3) | [Website](https://restaurant3website.com) (if available)
        - **Dish:** [Dish Name 3] (Suitable for: ${restrictions || 'No restrictions'})
        - **Price:** [Price Estimate 3]

      For each restaurant, prioritize accuracy over creativity. Do NOT use shortened URLs or goo.gl links. Use the specific Google Maps format shown above.`;

      // Updated API endpoint to use the current model name
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,     // Lower temperature for more factual results
            maxOutputTokens: 1024 // For a complete response
          }
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

      // Enhanced text cleaning function with link fixing
      const cleanedText = generatedText
        ? generatedText
            .replace(/\[.*?\]/g, (match) => match.trim()) // Clean spaces in brackets
            // Fix Google Maps links that may be using bad formats
            .replace(
              /\(https:\/\/maps\.app\.goo\.gl\/[^)]+\)/g, 
              (match) => {
                // Extract restaurant info from surrounding text
                const prevText = generatedText.substring(Math.max(0, generatedText.indexOf(match) - 100), generatedText.indexOf(match));
                const restaurantMatch = prevText.match(/\*\*Restaurant Name:\*\* \[(.*?)\]/);
                const addressMatch = prevText.match(/\*\*Address:\*\* \[(.*?)\]/);
                
                if (restaurantMatch && addressMatch) {
                  const query = `${restaurantMatch[1]} ${addressMatch[1]}`.replace(/ /g, '+');
                  return `(https://www.google.com/maps/search/?api=1&query=${query})`;
                }
                return '(https://www.google.com/maps)'; // Fallback to generic maps link
              }
            )
            .replace(/```markdown|```/g, '') // Remove markdown code block indicators
            .trim() // Trim extra whitespace
        : null;

      setMealPlan(cleanedText);
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
                  Note: Restaurant information is generated by Gemini AI and should be verified before visiting.
                </div>
                <ReactMarkdown
                  components={{
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-orange-500 mt-6 mb-4 border-b border-gray-200 pb-2" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-gray-800" {...props} />,
                    li: ({node, ...props}) => <li className="my-1" {...props} />,
                    a: ({node, children, href, ...props}) => {
                      const isGoogleMaps = 
                        href?.includes('maps.google.com') || 
                        href?.includes('goo.gl') || 
                        href?.includes('google.com/maps');
                        
                      return (
                        <a
                          href={href}
                          className={`underline ${isGoogleMaps 
                            ? 'text-blue-600 font-medium' 
                            : 'text-orange-500 font-medium'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        >
                          {isGoogleMaps ? '📍 ' : '🌐 '}{children}
                        </a>
                      );
                    }
                  }}
                >
                  {mealPlan}
                </ReactMarkdown>
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