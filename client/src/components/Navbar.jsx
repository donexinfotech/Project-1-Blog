import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../api/userApi'; // Assuming userApi.js is in the same directory

const Navbar = () => {
  const { isLoggedIn, username, profilePicture, logout } = useAuth();

  return (
    <nav className="bg-red-500 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Name</h1>
        <div className="flex space-x-6 items-center">
          <Link to="/" className="text-white hover:font-bold">Home</Link>

          {/* Conditionally render Login/Logout and username/profile picture */}
          {isLoggedIn ? (
            <>
              <div className="flex items-center space-x-3">
              <Link to="/create-blog" className="text-white hover:font-bold">Create</Link>
                <button
                  onClick={logout}
                  className="text-white hover:font-bold"
                >
                  Logout
                </button>
                <img
                  src={`data:image/jpeg;base64,${profilePicture}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white font-medium">{username.toUpperCase()}</span>
              </div>
            </>
          ) : (
            <Link to="/login" className="text-white hover:font-bold">Login</Link>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
