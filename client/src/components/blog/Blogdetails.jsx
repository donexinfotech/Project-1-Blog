import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { fetchUserById } from '../../api/userApi';
import { Link } from 'react-router-dom';
import Loader from '../utils/Loader';

const BlogDetails = ({ selectedBlog, handleBackToBlogs }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedBlog?.created_by) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const fetchedUser = await fetchUserById(selectedBlog.created_by);
          setUser(fetchedUser);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [selectedBlog]);

  if (loading) return <Loader/>;
  if (error) return <p>Error loading user data.</p>;

  const userProfileLink = user ? `/user/${user.message._id}` : '#';

  return (
    <div className="h-screen flex flex-col items-center justify-start ml-32">
      <div className="absolute w-full max-w-3xl">
        <button
          onClick={handleBackToBlogs}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200"
        >
          <FaArrowLeft />
        </button>
        <img
          src={`data:image/jpeg;base64,${selectedBlog.image}`}
          alt={selectedBlog.title}
          className="w-full h-[450px] object-cover rounded-lg shadow-md"
        />
      </div>

      <div className="relative w-[700px] mt-[400px]">
        <div className="w-full p-10 bg-white bg-opacity-90 text-left rounded-lg shadow-lg">
          <Link to={userProfileLink} className="flex items-center mb-3 justify-between">
            <div className="flex">
              <img
                src={user ? `data:image/jpeg;base64,${user.message.profile_picture}` : 'placeholder-image-url'} // Fallback image URL
                alt={user ? user.message.username : 'Unknown'}
                className="w-8 h-8 rounded-full mr-2"
              />
              <p>{user ? user.message.username : 'Unknown'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">
                <em>Created on: {new Date(selectedBlog.created_at).toLocaleDateString()}</em>
              </p>
            </div>
          </Link>
          <h1 className="text-5xl font-bold mb-4 font-serif">{selectedBlog.title}</h1>
          <p className="text-lg text-gray-700 mb-6">{selectedBlog.description}</p>
          <p className="text-sm text-gray-500 mb-6">
            <em>Created on: {new Date(selectedBlog.created_at).toLocaleDateString()}</em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
