import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext'; // Adjust the import path
import { FaUserCircle, FaSignOutAlt, FaChevronRight, FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { isLoggedIn, username, profilePicture, logout } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showSidebar, setShowSidebar] = React.useState(false);
  const location = useLocation();

  const handleDropdownToggle = () => {
    setShowDropdown(prev => !prev);
  };

  const handleSidebarToggle = () => {
    setShowSidebar(prev => !prev);
  };

  const Id = localStorage.getItem('userId');
  const profileLink = `/user/${Id}`;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="p-4 bg-gradient-to-br from-lightskyblue via-rebeccapurple to-sandybrown">
      <div className="flex justify-between items-center">
        <Link to="/">
          <h1 className="text-2xl font-bold text-white">Cybi-Aware</h1>
        </Link>
        <button onClick={handleSidebarToggle} className="text-white md:hidden">
          {showSidebar ? <FaTimes /> : <FaBars />}
        </button>
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6 items-center">
            <li>
              <Link to="/" className={`text-white font-bold border-b-2 transition ${isActive('/') ? 'border-white' : 'border-transparent'} hover:border-white pb-2`}>HOME</Link>
            </li>
            <li>
              <Link to="/about-us" className={`text-white font-bold border-b-2 transition ${isActive('/about-us') ? 'border-white' : 'border-transparent'} hover:border-white pb-2`}>ABOUT US</Link>
            </li>
            {isLoggedIn && (
              <div className='flex pt-2 gap-6'>
                <Link to="/create-blog" className={`text-white font-bold border-b-2 transition ${isActive('/create-blog') ? 'border-white' : 'border-transparent'} hover:border-white pb-2`}>CREATE</Link>
                <Link to="/quiz" className={`text-white font-bold border-b-2 transition ${isActive('/quiz') ? 'border-white' : 'border-transparent'} hover:border-white pb-2`}>QUIZ</Link>
              </div>
            )}
          </ul>
        </div>
        <div className="relative">
          {isLoggedIn ? (
            <>
              <button onClick={handleDropdownToggle} className="flex items-center space-x-3 bg-transparent border-none cursor-pointer">
                <img src={`data:image/jpeg;base64,${profilePicture}`} alt="Profile" className="w-8 h-8 rounded-full" />
                <span className="text-white font-medium">{username.toUpperCase()}</span>
                <FaChevronRight className={`text-white ml-2 transition-transform duration-300 ${showDropdown ? 'rotate-90' : 'rotate-0'}`} />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-300 rounded">
                  <Link to={profileLink} className="flex items-center p-2 hover:bg-gray-100 border-b border-gray-200">
                    <FaUserCircle className="mr-2" /> User Profile
                  </Link>
                  <button onClick={() => { logout(); setShowDropdown(false); }} className="flex items-center p-2 hover:bg-gray-100 w-full text-left">
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <FaSignInAlt className="text-white" />
              <Link to="/login" className="text-white font-bold hover:underline">Login</Link>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity ${showSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'} md:hidden`}>
        <div className={`fixed top-0 left-0 bg-white bg-opacity-90 w-64 h-full shadow-lg transition-transform ${showSidebar ? 'transform translate-x-0' : 'transform -translate-x-full'}`}>
          <button onClick={handleSidebarToggle} className="p-4">
            <FaTimes />
          </button>
          <ul className="flex flex-col p-4 space-y-2">
            <li>
              <Link to="/" className={`text-black ${isActive('/') ? 'font-bold' : ''}`}>Home</Link>
            </li>
            <li>
              <Link to="/about-us" className={`text-black ${isActive('/about-us') ? 'font-bold' : ''}`}>About Us</Link>
            </li>
            {isLoggedIn && (
              <>
                <li>
                  <Link to="/create-blog" className={`text-black ${isActive('/create-blog') ? 'font-bold' : ''}`}>Create Blog</Link>
                </li>
                <li>
                  <Link to="/quiz" className={`text-black ${isActive('/quiz') ? 'font-bold' : ''}`}>Quiz</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
