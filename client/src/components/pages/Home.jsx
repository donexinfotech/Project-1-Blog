import React, { useEffect, useState } from 'react';
import { fetchBlogs, getBlogById } from '../../api/blogService';
import { FaSearch } from 'react-icons/fa';
import BlogDetails from '../blog/Blogdetails';  

const Home = () => {

  const API = "http://localhost:5000";

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    profile_picture : "",
    username : ""
  })
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const blogsPerPage = 6;

  const getUser = async (id)=>{
    const response = await fetch(`${API}/api/auth/get-user-by-id/${id}`);
    const user_data = await response.json();
    setUser({
      ...user,
      profile_picture : user_data.profile_picture,
      username : user_data.username
    })
    console.log(user);
  }

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

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handleBlogClick = async (id) => {
    try {
      const blogData = await getBlogById(id);
      setSelectedBlog(blogData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBackToBlogs = () => {
    setSelectedBlog(null);
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto flex">
        {/* Left Sidebar for Search and Categories */}
        <div className="w-1/4 pr-1">
          {/* Search Bar */}
          <div className="mb-6 flex flex-row justify-center items-center w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500">
            <input
              type="text"
              placeholder="Search blogs..."
              className="focus:outline-none"
            />
            <button>
              <FaSearch />
            </button>
          </div>

          {/* Categories */}
          <div className="mb-6 rounded-lg bg-gray-100 pl-3">
            <h3 className="text-xl text-blue-700 font-semibold mb-2 pt-2">Categories</h3>
            <ul className="space-y-2">
              <li>
                <button className="w-full text-left p-2 text-blue-700 hover:text-blue-900 font-bold">
                  Technology
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 text-blue-700 hover:text-blue-900 font-bold">
                  Health
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 text-blue-700 hover:text-blue-900 font-bold">
                  Finance
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 text-blue-700 hover:text-blue-900 font-bold">
                  Education
                </button>
              </li>
            </ul>
          </div>
          {/* Top Posts */}
          <div className="mb-6 rounded-lg bg-gray-100 pl-3">
            <h3 className="text-xl text-blue-700 font-semibold mb-2 pt-2">Top Posts</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-blue-700">Post Title 1</span>
              </li>
              <li>
                <span className="text-blue-700">Post Title 2</span>
              </li>
              <li>
                <span className="text-blue-700">Post Title 3</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-3/5">
          {selectedBlog ? (
            <BlogDetails selectedBlog={selectedBlog} handleBackToBlogs={handleBackToBlogs} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {currentBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    onClick={() => handleBlogClick(blog._id)}
                    className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={`data:image/jpeg;base64,${blog.image}`}
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-xl font-semibold text-blue-600">{blog.title}</h2>
                      <p className="text-gray-700 mb-4">{blog.description.slice(0, 100)}...</p>
                      <p className="text-gray-500 text-sm">
                        <em>Created on: {new Date(blog.created_at).toLocaleDateString()}</em>
                      </p>
                        <p>Created by: {user.username}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination */}
              <div className="flex justify-center items-center mt-3 mb-10 space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 border-2 border-blue-800 rounded-md hover:bg-blue-900 hover:text-white transition ${
                      currentPage === index + 1 ? 'bg-blue-900 text-white' : 'bg-white text-blue-500'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
