import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getToken } from '../../api/userApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      setUsername(localStorage.getItem('username'));
      setProfilePicture(localStorage.getItem('profilePicture'));
    } else {
      setIsLoggedIn(false);
      setUsername(null);
      setProfilePicture(null);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      setIsLoggedIn(true);
      setUsername(data.username);
      setProfilePicture(data.profile_picture);
    } catch (error) {
      setIsLoggedIn(false);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerUser(userData);
      setIsLoggedIn(true);
      setUsername(data.username);
      setProfilePicture(data.profile_picture);
    } catch (error) {
      setIsLoggedIn(false);
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setUsername(null);
    setProfilePicture(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, profilePicture, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
