import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getToken, updateUserById } from '../../api/userApi';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);

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
      setIsProfileUpdated(false);
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
      setIsProfileUpdated(false);
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
    setIsProfileUpdated(false); 
  };

  const updateProfile = async (userId, updatedUser) => {
    try {
      await updateUserById(userId, updatedUser);
      setUsername(updatedUser.username);
      setProfilePicture(updatedUser.profile_picture);
      setIsProfileUpdated(true); 
      localStorage.setItem('username', updatedUser.username);
      localStorage.setItem('profilePicture', updatedUser.profile_picture);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      username, 
      profilePicture, 
      isProfileUpdated, 
      login, 
      register, 
      logout, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
