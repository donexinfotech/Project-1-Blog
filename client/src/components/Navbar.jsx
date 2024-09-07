import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../api/userApi'; // Assuming userApi.js is in the same directory

const Navbar = () => {
  const { isLoggedIn, username, profilePicture, logout } = useAuth();

  return (
    <nav className="bg-gray-300 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Name</h1>
        <div className="flex space-x-6 items-center">
          <div></div>
          <Link to="/" className="hover:font-bold">HOME</Link>
          <Link to="#" className="hover:font-bold">ABOUT US</Link>
          {isLoggedIn ? (
            <Link to="/create-blog" className="hover:font-bold">CREATE</Link>
          ): ""}
          <Link to="#" className="hover:font-bold">CONTACT US</Link>
        </div>
        <div className="account">
          {/* Conditionally render Login/Logout and username/profile picture */}
          {isLoggedIn ? (
            <>
              <div className="flex items-center space-x-3">
                <button
                  onClick={logout}
                  className="hover:font-bold"
                >
                  LOGOUT
                </button>
                <img
                  src={`data:image/jpeg;base64,${profilePicture}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{username.toUpperCase()}</span>
              </div>
            </>
          ) : (
            <Link to="/login" className="hover:font-bold">Login</Link>
          )}
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
