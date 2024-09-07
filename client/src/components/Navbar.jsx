import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../api/userApi';
import { FaUserCircle, FaSignOutAlt, FaChevronRight } from 'react-icons/fa';

const Navbar = () => {
  const { isLoggedIn, username, profilePicture, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <nav className="bg-gray-300 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">Name</h1>
        <div className="flex space-x-6 items-center">

          <ul class="nav nav-underline">
            <li class="nav-item">
              <Link to="/" className="hover:font-bold hover:text-red-600 nav-link active text-red-600">HOME</Link>
            </li>
            <li class="nav-item">
              <Link to="#" className="hover:font-bold hover:text-red-600 nav-link">ABOUT US</Link>
            </li>
            <li class="nav-item">
              {isLoggedIn ? (
              <Link to="/create-blog" className="hover:font-bold hover:text-red-600 nav-link">CREATE</Link>
              ) : null}
            </li>
            <li class="nav-item">
              <Link to="#" className="hover:font-bold nav-link hover:text-red-600">CONTACT US</Link>
            </li>
          </ul>

          
          
          
          
        </div>
        <div className="relative">
          {isLoggedIn ? (
            <>
              <button
                onClick={handleDropdownToggle}
                className="flex items-center space-x-3 bg-transparent border-none cursor-pointer"
              >
                <img
                  src={`data:image/jpeg;base64,${profilePicture}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{username.toUpperCase()}</span>
                <FaChevronRight
                  className={`ml-2 transition-transform duration-300 ${showDropdown ? 'rotate-90' : 'rotate-0'}`}
                />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-300 rounded">
                  <Link
                    to="/user-profile"
                    className="flex items-center p-2 hover:bg-gray-100 border-b border-gray-200"
                  >
                    <FaUserCircle className="mr-2" />
                    User Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center p-2 hover:bg-gray-100 w-full text-left"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/login" className="hover:font-bold hover:text-red-600">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
