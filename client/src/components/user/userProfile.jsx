import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserById, fetchUserBlogs } from '../../api/userApi';
import { updateBlogById } from '../../api/blogService';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import Loader from '../utils/Loader';

const UserProfile = () => {
  const { id: userId } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (!userId) {
          throw new Error('User ID not found in URL');
        }

        const userData = await fetchUserById(userId);
        setUser(userData);

        const blogsData = await fetchUserBlogs(userId);
        setBlogs(blogsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [userId]);

  useEffect(() => {
    // Retrieve userId from localStorage
    const localStorageUserId = localStorage.getItem('userId');
    setCurrentUserId(localStorageUserId);
  }, []);

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setEditTitle(blog.title);
    setEditDescription(blog.description);
    setEditImage(blog.image);
    setEditCategory(blog.category || '');
    setIsEditing(false); 
  };

  const handleBackToProfile = () => {
    setSelectedBlog(null); 
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    const updatedBlog = {
      ...selectedBlog,
      title: editTitle,
      description: editDescription,
      image: editImage,
      category: editCategory,
    };
    
    try {
      await updateBlogById(selectedBlog._id, updatedBlog);
      const updatedBlogs = blogs.map(blog =>
        blog._id === selectedBlog._id ? updatedBlog : blog
      );
      setBlogs(updatedBlogs);
      setSelectedBlog(updatedBlog);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(selectedBlog.title);
    setEditDescription(selectedBlog.description);
    setEditImage(selectedBlog.image);
    setEditCategory(selectedBlog.category || '');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <Loader text='Loading User Profile'/>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <>
      {selectedBlog ? (
        <div className="p-6 max-w-4xl mx-20">
              <button
                onClick={handleBackToProfile}
                className="absolute z-1 mt-3 ml-3 text-blue-500 bg-white rounded-full p-2 hover:text-blue-700 mb-4"
              >
                <FaArrowLeft />
              </button>
          {currentUserId === userId && (
            <>
              <button
                onClick={handleEditClick}
                className="absolute z-1 mt-3 ml-[800px] p-2 bg-white rounded-full text-blue-500 hover:text-blue-700"
              >
                <FaEdit />
              </button>
            </>
          )}
          <div className="relative bg-white shadow-md rounded-lg overflow-hidden">
            <img
              src={`data:image/jpeg;base64,${selectedBlog.image}`}
              alt={selectedBlog.title}
              className="w-full h-full object-cover"
            />
            <div className="relative flex justify-center ml-10 w-[750px] -mt-4">
              <div className="w-[700px] p-10 bg-white bg-opacity-70 text-left rounded-lg shadow-lg">
                {isEditing ? (
                  <div>
                    <h1 className="text-5xl font-bold mb-4 font-serif">Edit Blog</h1>
                    <form>
                      <div className="mb-4">
                        <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          id="editTitle"
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          id="editDescription"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="editImage" className="block text-sm font-medium text-gray-700">Image</label>
                        <input
                          id="editImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="editCategory" className="block text-sm font-medium text-gray-700">Category</label>
                        <input
                          id="editCategory"
                          type="text"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={handleSaveChanges}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-5xl font-bold mb-4 font-serif">{selectedBlog.title}</h1>
                    <p className="text-lg text-gray-700 mb-6">{selectedBlog.description}</p>
                    <p className="text-sm text-gray-500 mb-6">
                      <em>Created on: {new Date(selectedBlog.created_at).toLocaleDateString()}</em>
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      <em>Category: {selectedBlog.category || 'N/A'}</em>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="p-6 max-w-4xl mx-20">
            {user && (
              <div className="flex items-center space-x-6 gap-10">
                <div className="flex-shrink-0">
                  <img
                    src={`data:image/jpeg;base64,${user.message.profile_picture}`}
                    alt={user.message.username}
                    className="w-64 h-64 object-cover border-2 border-gray-300"
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <h3 className="text-2xl font-bold font-mono text-gray-900">First name: {user.message.first_name.toUpperCase()}</h3>
                  <h3 className="text-2xl font-bold font-mono text-gray-900">Last name: {user.message.last_name.toUpperCase()}</h3>
                  <h3 className="text-2xl font-bold font-sans text-gray-900">Username: @{user.message.username.toUpperCase()}</h3>
                  <p className="text-blue-500 mt-2 font-bold font-sans text-2xl">Email: {user.message.email}</p>
                  <div className="mt-2">
                    <h2 className="text-2xl font-semibold text-gray-800">Number of Blog Posts: {blogs.length}</h2>
                  </div>
                </div>
              </div>
            )}
          </div>
          <hr />
          <div className="p-6 max-w-4xl mx-72">
            <h2 className="text-2xl font-bold mb-4">User's Blogs</h2>
            {blogs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
                    onClick={() => handleBlogClick(blog)}
                  >
                    <img
                      src={`data:image/jpeg;base64,${blog.image}`}
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-900">{blog.title}</h3>
                      <p className="text-gray-700 mt-2">{blog.description.slice(0, 100)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No blogs available.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
