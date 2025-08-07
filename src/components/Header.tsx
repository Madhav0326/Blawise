import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 bg-white shadow-md"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-purple-600">
          Blawise
        </Link>
        <nav className="flex gap-6 text-gray-700 font-medium">
          <Link to="/" className={location.pathname === '/' ? 'text-purple-600' : ''}>Home</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'text-purple-600' : ''}>About</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'text-purple-600' : ''}>Contact</Link>
          <Link to="/consultants" className={location.pathname === '/consultants' ? 'text-purple-600' : ''}>Become a Consultant</Link>
        </nav>
        <div className="flex gap-4">
          <Link to="/signin" className="mt-2 px-5 text-sm font-medium">Sign In</Link>
          <Link to="/get-started" className="px-4 py-2 bg-gray-900 text-white rounded-md font-semibold text-sm shadow-md hover:bg-gray-700 transition">Get Started</Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;