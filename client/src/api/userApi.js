import axios from 'axios';

const TOKEN_KEY = 'authToken';
const USER_ID = 'userId';
const USERNAME_KEY = 'username';
const PROFILE_PICTURE_KEY = 'profilePicture';
const ADMIN = 'admin';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token, userId, username, profile_picture,admin } = response.data;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_ID, userId);
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(PROFILE_PICTURE_KEY, profile_picture);
    localStorage.setItem(ADMIN, admin);
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post('/api/auth/register', userData);
    const { token, userId, username, profile_picture } = response.data;
    
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_ID, userId);
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(PROFILE_PICTURE_KEY, profile_picture);
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const fetchUserById = async (id) => {
  try {
    const response = await fetch(`/api/auth/get-user-by-id/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const fetchUserBlogs = async (userId, page = 1, limit = 6) => {
  try {
    const responseData = await fetch(`/api/blog/get-blog-by-userid/${userId}?page=${page}&limit=${limit}`);
    if (!responseData.ok) {
      throw new Error('Failed to fetch user blogs');
    }
    const response = await responseData.json(); 
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};



export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(PROFILE_PICTURE_KEY);
  localStorage.removeItem(ADMIN);
};

export const updateUserById = async (id, updatedData) => {
  try {
    const token = getToken();
    const response = await axios.patch(`/api/auth/update/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update failed');
  }
};