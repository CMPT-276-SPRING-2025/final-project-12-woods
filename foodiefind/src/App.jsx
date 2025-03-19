import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import your page components
import Home from './pages/Home';
import About from './pages/About';
import Plan from './pages/Plan';
import Explore from './pages/Explore';

function App() {
  return (
    <Router>
      <div>
        {/* Navigation */}
        <nav className="bg-gray-800 p-4">
          <ul className="flex space-x-4">
            <li><Link to="/" className="text-white hover:text-gray-300">Home</Link></li>
            <li><Link to="/explore" className="text-white hover:text-gray-300">Explore</Link></li>
            <li><Link to="/plan" className="text-white hover:text-gray-300">Plan</Link></li>
            <li><Link to="/about" className="text-white hover:text-gray-300">About</Link></li>
          </ul>
        </nav>

        {/* Page content */}
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;