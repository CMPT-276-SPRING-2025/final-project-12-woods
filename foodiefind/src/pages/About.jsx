import React from "react";

const teamMembers = [
  {
    name: "Ash Aung",
    role: "QA, Developer",
    image: "/profiles/Ash.jpg",
    description: "Ash is our project Manager, he is a real party animal",
  },
  {
    name: "Damon Yiu",
    role: "UI Designer, Developer",
    image: "/profiles/Damon.png",
    description: "Damon is our UI Designer, he likes to speak french",
  },
  {
    name: "Jim Chen",
    role: "Project Manager, QA, Developer",
    image: "/profiles/Jim.jpg",
    description: "Jim is our QA tester, he is a fun guy and a funny guy",
  },
  {
    name: "Amir Matianiu",
    role: "Scrum & GH Manager, Developer",
    image: "/profiles/Amir.JPG", // Ensure this path is correct
    description: "Amir is our GH Manager, he can also be funny, sometimes",
  },
];

function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Page Heading */}
      <h1 className="text-black text-4xl sm:text-6xl mb-10 text-center fade-in">
        About Us
      </h1>
      <p className="text-lg text-center text-gray-600 mb-12">
        Meet the team behind FoodieFind!
      </p>

      {/* Team Members Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="text-center">
            <img
              src={member.image}
              alt={member.name}
              className="w-40 h-40 object-cover rounded-full mx-auto mb-4 border-4 border-gray-300"
            />
            <h3 className="text-xl font-light">{member.name}</h3>
            <p className="text-gray-500 font-light">{member.role}</p>
            <p className="text-gray-600 mt-2 px-4 font-light">{member.description}</p>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-12 bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100 p-8 rounded-xl shadow-lg">
        <h2 className="text-5xl text-center text-orange-700 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <details className="bg-white p-5 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
            <summary className="font-light text-orange-700 cursor-pointer hover:text-orange-900 text-lg">
              What is FoodieFind?
            </summary>
            <p className="text-gray-700 mt-3 leading-relaxed font-light">
              FoodieFind is a web application designed to help users discover
              the best restaurants based on their budget, location, and dietary
              preferences. Focused initially on Vancouver, it uses interactive
              maps, AI-powered chat features, and personalized recommendations
              to make finding great dining options quick and easy. Whether
              you’re looking for hidden gems, trendy spots, or allergy-friendly
              places, FoodieFind simplifies the search so you can spend less
              time planning and more time enjoying good food.
            </p>
          </details>
          <details className="bg-white p-5 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
            <summary className="font-light text-orange-700 cursor-pointer hover:text-orange-900 text-lg">
              What inspired us to create FoodieFind?
            </summary>
            <p className="text-gray-700 mt-3 leading-relaxed font-light">
              We created FoodieFind out of a shared passion for discovering
              great food and a desire to make the dining experience easier and
              more accessible for everyone. Our motivation came from the
              challenges people often face when trying to find restaurants that
              match their budget, dietary needs, or culinary
              preferences—especially in a diverse and dynamic food city like
              Vancouver. Whether it's a busy parent, a broke student, someone
              with food allergies, or a trend-hunting foodie, we wanted to build
              a tool that cuts through the hassle of restaurant hunting and
              provides smart, personalized, and efficient recommendations.
            </p>
          </details>
          <details className="bg-white p-5 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
            <summary className="font-light text-orange-700 cursor-pointer text-lg">
              Is FoodieFind free to use?
            </summary>
            <p className="text-gray-700 mt-3 leading-relaxed font-light">
              Yes, FoodieFind is completely free to use. You can explore and
              discover dining options without any cost.
            </p>
          </details>
          <details className="bg-white p-5 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
            <summary className="font-light text-orange-700 cursor-pointer text-lg">
              How do I get food recommendations?
            </summary>
            <p className="text-gray-700 mt-3 leading-relaxed font-light">
              Just enter your location, preferred cuisine, and budget—our AI will instantly recommend places for you. 
              You can also chat with our AI assistant if you’re unsure of what you want.
            </p>
          </details>
          <details className="bg-white p-5 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
            <summary className="font-light text-orange-700 cursor-pointer text-lg">
              What if I don’t know what I feel like eating?
            </summary>
            <p className="text-gray-700 mt-3 leading-relaxed font-light">
              That’s where our chatbox AI comes in! Just ask for suggestions and it’ll recommend ideas based on your mood, cravings, or curiosity.
            </p>
          </details>
          <details className="bg-white p-5 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
            <summary className="font-light text-orange-700 cursor-pointer text-lg">
              Does it work outside of Vancouver?
            </summary>
            <p className="text-gray-700 mt-3 leading-relaxed font-light">
              We currently focus on Vancouver, but we plan to expand across Canada and eventually to other countries.
            </p>
          </details>
          <details className="bg-white p-5 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
            <summary className="font-light text-orange-700 cursor-pointer text-lg">
              How accurate is the info?
            </summary>
            <p className="text-gray-700 mt-3 leading-relaxed font-light">
              We do our best to provide up-to-date details using trusted APIs, but it's always good to double-check with the restaurant directly for the most accurate info.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

export default About;
