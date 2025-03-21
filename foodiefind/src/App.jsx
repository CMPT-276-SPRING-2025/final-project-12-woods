import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaHome, FaGlobe, FaFileAlt, FaUsers, FaGithub } from 'react-icons/fa';

// Import your page components
import Home from './pages/Home';
import About from './pages/About';
import Plan from './pages/Plan';
import Explore from './pages/Explore';

function App() {
  return (
    <Router>
      <div>
        {/* Navigation - Changed to specific hex color #363636 */}
        <nav className="py-4 shadow-md fixed w-full top-0 z-10" style={{ backgroundColor: '#363636' }}>
          <div className="container mx-auto flex items-center justify-evenly px-4">
            {/* Logo/Brand as a homepage link */}
            <Link to="/" className="flex items-center hover:!text-orange-500">
              <img src="src/assets/Foodie.png" alt="FoodieFind Logo" className="h-8 w-8 mr-3" />
              <span className="text-white text-xl font-bold">FoodieFind</span>
            </Link>
            
            {/* Home */}
            <Link to="/" className="!text-white hover:!text-orange-500 flex items-center">
              <FaHome className="mr-2" /> Home
            </Link>
            
            {/* Plan */}
            <Link to="/plan" className="!text-white hover:!text-orange-500 flex items-center">
              <FaFileAlt className="mr-2" /> Plan
            </Link>
            
            {/* Explore */}
            <Link to="/explore" className="!text-white hover:!text-orange-500 flex items-center">
              <FaGlobe className="mr-2" /> Explore
            </Link>
            
            {/* About Us */}
            <Link to="/about" className="!text-white hover:!text-orange-500 flex items-center">
              <FaUsers className="mr-2" /> About Us
            </Link>
          </div>
        </nav>

        {/* Page content - add margin-top to account for fixed navbar and margin-bottom for footer spacing */}
        <div className="container mx-auto p-4 mt-20 mb-8 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;