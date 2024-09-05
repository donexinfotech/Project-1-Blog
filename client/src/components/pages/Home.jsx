import React, { useEffect, useState } from 'react';
import { fetchBlogs, deleteBlog } from '../../api/blogService';
import { FaTrash } from 'react-icons/fa'; // Import the trash icon from react-icons

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const data = await fetchBlogs();
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id); // Call the deleteBlog function
      setBlogs(blogs.filter(blog => blog._id !== id)); // Remove the deleted blog from the state
    } catch (err) {
      setError('Failed to delete blog.');
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
              src={`data:image/jpeg;base64,${blog.image}`}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Delete Blog"
                >
                  <FaTrash />
                </button>
              </div>
              <p className="text-gray-700 mb-4">{blog.description}</p>
              <p className="text-gray-500 text-sm">
                <em>Created at: {new Date(blog.created_at).toLocaleDateString()}</em>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
