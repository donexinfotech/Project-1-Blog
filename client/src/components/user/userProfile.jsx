import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserById, fetchUserBlogs, updateUserById } from '../../api/userApi';
import { updateBlogById, deleteBlogById } from '../../api/blogService';
import { FaArrowLeft, FaEdit, FaTrashAlt } from 'react-icons/fa';
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
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (!userId) throw new Error('User ID not found in URL');

        const userData = await fetchUserById(userId);
        setUser(userData);
        setEditFirstName(userData.message.first_name);
        setEditLastName(userData.message.last_name);
        setEditUsername(userData.message.username);
        setEditEmail(userData.message.email);

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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlogById(selectedBlog._id);
        setBlogs(blogs.filter(blog => blog._id !== selectedBlog._id));
        setSelectedBlog(null);
        alert('Blog deleted successfully.');
      } catch (err) {
        alert('Failed to delete blog. Please try again.');
      }
    } else {
      alert('You are not authorized to delete this blog.');
    }
  };

  const handleProfileEditClick = () => {
    setIsEditingProfile(true);
  };

  const handleProfileSaveChanges = async () => {
    const updatedUser = {
      first_name: editFirstName,
      last_name: editLastName,
      username: editUsername,
      email: editEmail,
      profile_picture: newProfilePicture || user.message.profile_picture,
    };

    try {
      await updateUserById(userId, updatedUser);
      setUser({ ...user, message: updatedUser });
      localStorage.setItem('profilePicture', newProfilePicture || user.message.profile_picture);
      localStorage.setItem('username', editUsername);
      setIsEditingProfile(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProfileCancelEdit = () => {
    setIsEditingProfile(false);
    setEditFirstName(user.message.first_name);
    setEditLastName(user.message.last_name);
    setEditUsername(user.message.username);
    setEditEmail(user.message.email);
    setNewProfilePicture('');
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePicture(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <Loader text='Loading User Profile' />;
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
              <button
                onClick={handleDelete}
                className="absolute z-1 mt-3 ml-[756px] p-2 bg-white rounded-full text-red-500 hover:text-red-700"
              >
                <FaTrashAlt />
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
                  {isEditingProfile ? (
                    <div>
                      <h3 className="text-2xl font-bold font-mono text-gray-900">Edit Profile</h3>
                      <form>
                        <div className="mb-4">
                          <label htmlFor="editFirstName" className="block text-sm font-medium text-gray-700">First Name</label>
                          <input
                            id="editFirstName"
                            type="text"
                            value={editFirstName}
                            onChange={(e) => setEditFirstName(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="editLastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                          <input
                            id="editLastName"
                            type="text"
                            value={editLastName}
                            onChange={(e) => setEditLastName(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="editUsername" className="block text-sm font-medium text-gray-700">Username</label>
                          <input
                            id="editUsername"
                            type="text"
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="editEmail" className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            id="editEmail"
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="editProfilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                          <input
                            id="editProfilePicture"
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          />
                        </div>
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={handleProfileSaveChanges}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={handleProfileCancelEdit}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold font-mono text-gray-900">First name: {user.message.first_name.toUpperCase()}</h3>
                      <h3 className="text-2xl font-bold font-mono text-gray-900">Last name: {user.message.last_name.toUpperCase()}</h3>
                      <h3 className="text-2xl font-bold font-sans text-gray-900">Username: @{user.message.username.toUpperCase()}</h3>
                      <p className="text-blue-500 mt-2 font-bold font-sans text-2xl">Email: {user.message.email}</p>
                      {currentUserId === userId && (
                        <button
                          onClick={handleProfileEditClick}
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Edit Profile
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <hr />
          <div className="p-6 mx-40">
            <h2 className="text-2xl font-bold mb-4">User's Blogs</h2>
            {blogs.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
