import React from "react";

const teamMembers = [
  {
    name: "Ash Aung",
    role: "Project Manager, Developer",
    image: "../src/assets/profiles/Ash.jpg",
    description: "Ash is our project Manager, he is a real party animal",
  },
  {
    name: "Damon Yiu",
    role: "UI Designer, Developer",
    image: "../src/assets/profiles/Damon.png",
    description: "Damon is our UI Designer, he likes to speak french",
  },
  {
    name: "Jim Chen",
    role: "QA, Developer",
    image: "../src/assets/profiles/Jim.jpg",
    description: "Jim is our QA tester, he is a fun guy and a funny guy",
  },
  {
    name: "Amir Matianiu",
    role: "Scrum & GH Manager, Developer",
    image: "../src/assets/profiles/Amir.jpg",
    description: "Amir is our GH Manager, he can also be funny, sometimes",
  },
];

function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Page Heading */}
      <h1 className="text-4xl font-bold text-center mb-6">About Us</h1>
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
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-gray-500 font-medium">{member.role}</p>
            <p className="text-gray-600 mt-2 px-4">{member.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
