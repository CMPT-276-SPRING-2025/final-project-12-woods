import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaHome, FaGlobe, FaFileAlt, FaUsers, FaGithub } from 'react-icons/fa';

// Import your page components
import Home from './pages/Home';
import About from './pages/About';
import Plan from './pages/Plan';
import Explore from './pages/Explore Page/Explore';

function App() {
  return (
    <Router>
      {/* Add flex container and ensure it fills the viewport */}
      <div className="flex flex-col min-h-screen">
        {/* Navigation - Changed to specific hex color #363636 */}
        <nav className="py-4 shadow-md fixed w-full top-0 z-10 bg-gray-800">
          <div className="container mx-auto flex flex-wrap items-center justify-between px-4">
            <Link to="/" className="flex items-center hover:text-orange-500">
              <img src="/Foodie.png" alt="FoodieFind Logo" className="h-8 w-8 mr-3" />
              <span className="text-white text-lg sm:text-xl font-bold">FoodieFind</span>
            </Link>
            <div className="flex flex-wrap gap-4 mt-2 sm:mt-0">
              <Link to="/" className="text-white hover:text-orange-500 text-sm sm:text-base">Home</Link>
              <Link to="/plan" className="text-white hover:text-orange-500 text-sm sm:text-base">Plan</Link>
              <Link to="/explore" className="text-white hover:text-orange-500 text-sm sm:text-base">Explore</Link>
              <Link to="/about" className="text-white hover:text-orange-500 text-sm sm:text-base">About Us</Link>
            </div>
          </div>
        </nav>

        {/* Page content - Add flex-grow to push footer to the bottom */}
        <div className="flex-grow mt-16 mb-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>

        {/* Footer - Matching navigation bar style */}
        <footer className="py-4 bg-gray-800 text-white mt-auto">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-4">
            <div className="flex items-center mb-4 sm:mb-0">
              <img src="/Foodie.png" alt="FoodieFind Logo" className="h-8 w-8" />
            </div>
            <div className="text-center sm:text-left">
              <p>© 2025 FoodieFind. All rights reserved.</p>
            </div>
            <a
              href="https://github.com/CMPT-276-SPRING-2025/final-project-12-woods"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-orange-500"
            >
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;