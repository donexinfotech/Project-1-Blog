import React, { useEffect, useState } from 'react';
import {fetchUserById} from '../../api/userApi'; // Adjust the import path as needed

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the userId from localStorage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (!userId) {
          throw new Error('User ID not found in localStorage');
        }
        const userData = await fetchUserById(userId);
        console.log(userData);
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [userId]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-20">
      {user && (
        <div className="flex items-start space-x-6 gap-10">
          <div className="flex-shrink-0">
            <img
              src={`data:image/jpeg;base64,${user.message.profile_picture}`}
              alt={user.username}
              className="w-64 h-64 object-cover border-2 border-gray-300"
            />
          </div>
          {/* User Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.message.first_name.toUpperCase()}</h1>
            <h1 className="text-3xl font-bold text-gray-900">@{user.message.username.toUpperCase()}</h1>
            <p className="text-blue-500 mt-2">Email:- {user.message.email}</p>
            {/* Add more user details here */}
            <div className="mt-2">
              <h2 className="text-xl font-semibold text-gray-800">Number of Blog Posts :{user.message.posts}</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
