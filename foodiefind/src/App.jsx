import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes, FaHome, FaFileAlt, FaGlobe, FaUsers, FaGithub } from 'react-icons/fa';

// Import your page components
import Home from './pages/Home';
import About from './pages/About';
import Plan from './pages/Plan';
import Explore from './pages/Explore Page/Explore';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navigation with better distributed buttons */}
        <nav className="py-4 shadow-md fixed w-full top-0 z-10 bg-[#363636]">
          <div className="container mx-auto px-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-between">
              {/* Logo on left side */}
              <Link to="/" className="flex items-center hover:text-orange-500">
                <img src="/Foodie.png" alt="FoodieFind Logo" className="h-8 w-8 mr-3" />
                <span className="text-white text-lg sm:text-xl font-bold">FoodieFind</span>
              </Link>
              
              {/* Navigation links distributed across center - increased spacing and text size */}
              <div className="flex-1 flex justify-center space-x-24">
                <Link to="/" className="text-white hover:text-orange-500 transition-colors font-medium text-lg flex items-center">
                  <FaHome className="mr-2" /> Home
                </Link>
                <Link to="/plan" className="text-white hover:text-orange-500 transition-colors font-medium text-lg flex items-center">
                  <FaFileAlt className="mr-2" /> Plan
                </Link>
                <Link to="/explore" className="text-white hover:text-orange-500 transition-colors font-medium text-lg flex items-center">
                  <FaGlobe className="mr-2" /> Explore
                </Link>
                <Link to="/about" className="text-white hover:text-orange-500 transition-colors font-medium text-lg flex items-center">
                  <FaUsers className="mr-2" /> About Us
                </Link>
              </div>
              
              {/* Optional: right side element to balance layout */}
              <div className="w-32 flex justify-end">
                {/* You could add search, profile, or other icons here */}
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center justify-between">
              <Link to="/" className="flex items-center hover:text-orange-500 z-20">
                <img src="/Foodie.png" alt="FoodieFind Logo" className="h-8 w-8 mr-2" />
                <span className="text-white text-lg font-bold">FoodieFind</span>
              </Link>
              
              <button 
                className="text-white focus:outline-none z-20"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
            
            {/* Mobile menu overlay */}
            <div 
              className={`fixed inset-0 bg-[#363636] z-10 flex flex-col items-center justify-center space-y-8 transition-all duration-300 ease-in-out md:hidden ${
                isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            >
              <Link 
                to="/" 
                className="text-2xl text-white hover:text-orange-500 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaHome className="mr-3" size={24} /> Home
              </Link>
              <Link 
                to="/plan" 
                className="text-2xl text-white hover:text-orange-500 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaFileAlt className="mr-3" size={24} /> Plan
              </Link>
              <Link 
                to="/explore" 
                className="text-2xl text-white hover:text-orange-500 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaGlobe className="mr-3" size={24} /> Explore
              </Link>
              <Link 
                to="/about" 
                className="text-2xl text-white hover:text-orange-500 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUsers className="mr-3" size={24} /> About Us
              </Link>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <div className="flex-grow mt-16 mb-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="py-4 bg-[#363636] text-white mt-auto">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-4">
            <div className="flex items-center mb-4 sm:mb-0">
              <img src="/Foodie.png" alt="FoodieFind Logo" className="h-8 w-8" />
            </div>
            <div className="text-center flex flex-col items-center">
              <p>© 2025 FoodieFind.</p>
              <p className="text-xs mt-1">All rights reserved.</p>
            </div>
            <a
              href="https://github.com/CMPT-276-SPRING-2025/final-project-12-woods"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-orange-500"
              aria-label="GitHub Repository"
            >
              <FaGithub size={24} />
            </a>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;