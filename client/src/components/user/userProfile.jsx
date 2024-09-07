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
    <>
    <div className="p-6 max-w-4xl mx-20">
      {user && (
        <div className="flex items-center space-x-6 gap-10">
          <div className="flex-shrink-0">
            <img
              src={`data:image/jpeg;base64,${user.message.profile_picture}`}
              alt={user.username}
              className="w-64 h-64 object-cover border-2 border-gray-300"
            />
          </div>
          {/* User Details */}
          <div className='flex flex-col gap-2'>
            <h1 className="text-5xl font-bold font-mono text-gray-900">{user.message.first_name.toUpperCase()}</h1>
            <h1 className="text-5xl font-bold font-mono text-gray-900">{user.message.last_name.toUpperCase()}</h1>
            <h1 className="text-4xl font-bold font-sans text-gray-900">@{user.message.username.toUpperCase()}</h1>
            <p className="text-blue-500 mt-2 font-bold font-sans text-2xl">Email:- {user.message.email}</p>
            {/* Add more user details here */}
            <div className="mt-2">
              <h2 className="text-2xl font-semibold text-gray-800">Number of Blog Posts :{user.message.posts}</h2>
            </div>
          </div>
        </div>
      )}
    </div>
      <hr />
    </>
  );
};

export default UserProfile;
