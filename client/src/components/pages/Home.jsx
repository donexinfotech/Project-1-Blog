import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs, getBlogById } from '../../api/blogService';
import { FaSearch } from 'react-icons/fa';
import BlogDetails from '../blog/blogDetails';
import Loader from '../utils/Loader';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedTopPost, setSelectedTopPost] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [category, setCategory] = useState('all');
  const blogsPerPage = 6;

  const fetchUserData = async (blogsData) => {
    try {
      const updatedBlogs = await Promise.all(
        blogsData.map(async (blog) => {
          try {
            const response = await fetch(`/api/auth/get-user-by-id/${blog.created_by}`);
            const userData = await response.json();
            return {
              ...blog,
              user: {
                username: userData.message.username || 'Unknown',
                profile_picture: userData.message.profile_picture || 'default-pic-url',
                _id: userData.message._id || 'default-id'
              }
            };
          } catch (error) {
            return {
              ...blog,
              user: { username: 'Unknown', profile_picture: 'default-pic-url', _id: 'default-id' }
            };
          }
        })
      );
      setBlogs(updatedBlogs);
      applyCategoryFilter(category, updatedBlogs); 
    } catch (error) {
      setError(error.message);
    }
  };

  const applyCategoryFilter = (selectedCategory, blogsData) => {
    if (selectedCategory === 'all') {
      setFilteredBlogs(blogsData);
    } else {
      const filtered = blogsData.filter(blog => blog.category === selectedCategory);
      setFilteredBlogs(filtered);
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const blogsData = await fetchBlogs();
        await fetchUserData(blogsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

  const handleCategory = (selectedCategory) => {
    setCategory(selectedCategory);
    applyCategoryFilter(selectedCategory, blogs); 
  };

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    return sortOrder === 'desc'
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at);
  });

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = sortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const topPosts = [...filteredBlogs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handleBlogClick = async (id) => {
    try {
      const blogData = await getBlogById(id);
      if (blogData) {
        setSelectedBlog(blogData);
      } else {
        console.error('Blog data is null or undefined:', id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBackToBlogs = () => {
    setSelectedBlog(null);
    setSelectedTopPost(null);
  };

  const handleTopPostClick = async (id) => {
    try {
      const blogData = await getBlogById(id);
      if (blogData) {
        setSelectedTopPost(blogData);
      } else {
        console.error('Top post data is null or undefined:', id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'));
  };

  if (loading) return <Loader text='Loading Blogs Hang On'/>;

  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto flex">
        <div className="w-1/4 pr-1">
          <div className="mb-6 flex flex-row justify-center items-center w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500">
            <input
              type="text"
              placeholder="Search blogs..."
              className="bg-white focus:outline-none"
            />
            <button>
              <FaSearch />
            </button>
          </div>

          <div className="mb-6 rounded-lg bg-gray-100 pl-3">
            <h3 className="text-xl text-blue-700 mb-2 pt-2 font-bold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left p-2 font-bold ${category === 'all' ? 'text-blue-700' : 'text-red-600'}`}
                  onClick={() => handleCategory('all')}
                >
                  All Blogs
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-2 font-bold ${category === 'technology' ? 'text-blue-700' : 'text-red-600'}`}
                  onClick={() => handleCategory("technology")}
                >
                  Technology
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-2 font-bold ${category === 'health' ? 'text-blue-700' : 'text-red-600'}`}
                  onClick={() => handleCategory("health")}
                >
                  Health
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-2 font-bold ${category === 'finance' ? 'text-blue-700' : 'text-red-600'}`}
                  onClick={() => handleCategory("finance")}
                >
                  Finance
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-2 font-bold ${category === 'education' ? 'text-blue-700' : 'text-red-600'}`}
                  onClick={() => handleCategory("education")}
                >
                  Education
                </button>
              </li>
            </ul>
          </div>

          <div className="mb-6 rounded-lg bg-gray-100 pl-3">
            <h3 className="text-xl text-blue-700 font-semibold mb-2 pt-2">Top Posts</h3>
            <ul className="space-y-2">
              {topPosts.map((post) => (
                <li key={post._id}>
                  <button
                    onClick={() => handleTopPostClick(post._id)}
                    className="w-full text-left p-2 text-red-600 font-bold hover:bg-gray-200"
                  >
                    {post.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <button
              onClick={toggleSortOrder}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              {sortOrder === 'desc' ? 'Sort: Oldest First' : 'Sort: Latest First'}
            </button>
          </div>
        </div>

        <div className="w-3/5">
          {selectedBlog || selectedTopPost ? (
            <BlogDetails selectedBlog={selectedBlog || selectedTopPost} handleBackToBlogs={handleBackToBlogs} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {currentBlogs.map((blog) => {
                  if (!blog || !blog.user) {
                    console.error('Blog or user data is missing:', blog);
                    return null;
                  }

                  return (
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
                      <div className="flex items-center m-4 mb-0 justify-between">
                        <Link to={`/user/${blog.user._id}`} className="flex">
                          <img
                            src={`data:image/jpeg;base64,${blog.user.profile_picture}`}
                            alt={blog.user?.username || 'Unknown'}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <p>{blog.user?.username || 'Unknown'}</p>
                        </Link>
                        <div>
                          <p className="text-gray-500 text-sm">
                            <em>Created on: {new Date(blog.created_at).toLocaleDateString()}</em>
                          </p>
                        </div>
                      </div>
                      <div className="p-4">
                        <h2 className="text-xl font-semibold text-red-600">{blog.title}</h2>
                        <p className="text-gray-700 mb-4">{blog.description.slice(0, 100)}...</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center mt-6">
                <nav>
                  <ul className="flex">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <li key={index + 1}>
                        <button
                          onClick={() => paginate(index + 1)}
                          className={`px-4 py-2 mx-1 rounded-md ${
                            currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                          }`}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
