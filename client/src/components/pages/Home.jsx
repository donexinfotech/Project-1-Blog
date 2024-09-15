import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs, getBlogById, fetchBlogsByCategory, searchBlogsByKey } from '../../api/blogService';
import { FaSearch } from 'react-icons/fa';
import BlogDetails from '../blog/blogDetails';
import Loader from '../utils/Loader';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedTopPost, setSelectedTopPost] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState(null);
  const blogsPerPage = 6;

  const fetchBlogsAndUsers = useCallback(async () => {
    setLoading(true);
    setLoadingUsers(true);
    try {
      const blogsData = await fetchBlogs();
      const updatedBlogs = await Promise.all(
        blogsData.map(async (blog) => {
          try {
            const response = await fetch(`/api/auth/get-user-by-id/${blog.created_by}`);
            const userData = await response.json();
            return {
              ...blog,
              user: {
                username: userData.message?.username || 'Unknown',
                profile_picture: userData.message?.profile_picture || 'default-pic-url',
                _id: userData.message?._id || 'default-id'
              }
            };
          } catch (error) {
            console.error('Failed to fetch user data for blog:', blog._id, error);
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
    } finally {
      setLoading(false);
      setLoadingUsers(false);
    }
  }, [category]);

  const applyCategoryFilter = (selectedCategory, blogsData) => {
    if (selectedCategory === 'all') {
      setFilteredBlogs(blogsData);
    } else {
      const filtered = blogsData.filter(blog => blog.category === selectedCategory);
      setFilteredBlogs(filtered);
    }
    setCurrentPage(1);
  };

  const handleSearch = async () => {
    setSelectedBlog(null)
    setLoading(true);
    setSearchError(null);
    setFilteredBlogs([]);
    try {
      const searchResults = await searchBlogsByKey(searchQuery);
      if (searchResults.length === 0) {
        setSearchError('No Blogs Found');
        setFilteredBlogs([]); // Ensure filteredBlogs is cleared
      } else {
        const updatedResults = await Promise.all(
          searchResults.map(async (blog) => {
            try {
              const response = await fetch(`/api/auth/get-user-by-id/${blog.created_by}`);
              const userData = await response.json();
              return {
                ...blog,
                user: {
                  username: userData.message?.username || 'Unknown',
                  profile_picture: userData.message?.profile_picture || 'default-pic-url',
                  _id: userData.message?._id || 'default-id'
                }
              };
            } catch (error) {
              console.error('Failed to fetch user data for blog:', blog._id, error);
              return {
                ...blog,
                user: { username: 'Unknown', profile_picture: 'default-pic-url', _id: 'default-id' }
              };
            }
          })
        );
        setFilteredBlogs(updatedResults);
      }
      setCurrentPage(1);
    } catch (error) {
      setSearchError('No Blogs Found')
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsAndUsers();
  }, [fetchBlogsAndUsers]);

  const handleCategory = async (selectedCategory) => {
    if (selectedCategory === category) return;
    setLoading(true);
    setCategory(selectedCategory);
    setSearchError(null);
    try {
      const blogsData = selectedCategory === 'all' ? await fetchBlogs() : await fetchBlogsByCategory(selectedCategory);
      applyCategoryFilter(selectedCategory, blogsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handleBlogClick = async (id) => {
    setLoading(true);
    try {
      const blogData = await getBlogById(id);
      if (blogData) {
        setSelectedBlog(blogData);
      } else {
        console.error('Blog data is null or undefined:', id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToBlogs = () => {
    setSelectedBlog(null);
    setSelectedTopPost(null);
  };

  const handleTopPostClick = async (id) => {
    setLoading(true);
    try {
      const blogData = await getBlogById(id);
      if (blogData) {
        setSelectedTopPost(blogData);
      } else {
        console.error('Top post data is null or undefined:', id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const hasBlogsForCategory = (category) => {
    if (category === 'all') return true;
    return blogs.some(blog => blog.category === category);
  };

  if (loading || loadingUsers) return <Loader text='Loading Blogs, Hang On' />;

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>
              <FaSearch />
            </button>
          </div>

          <div className="mb-6 rounded-lg bg-gray-100 pl-3">
            <h3 className="text-xl text-blue-700 mb-2 pt-2 font-bold">Categories</h3>
            <ul className="space-y-2">
              {['all', 'technology', 'health', 'finance', 'education'].map((cat) => (
                <li key={cat}>
                  <button
                    className={`w-full text-left p-2 font-bold ${category === cat && hasBlogsForCategory(cat) ? 'text-red-600' : 'text-blue-700'}`}
                    onClick={() => handleCategory(cat)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                </li>
              ))}
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
              {searchError && <p className="text-center text-black">{searchError}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredBlogs.length > 0 ? (
                  currentBlogs.map((blog) => (
                    blog ? (
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
                          <Link to={`/user/${blog.user?._id || 'default-id'}`} className="flex">
                            <img
                              src={`data:image/jpeg;base64,${blog.user?.profile_picture || 'default-pic-url'}`}
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
                    ) : null
                  ))
                ) : (
                  !searchError && <p className="text-center text-gray-500">No Blogs Found</p>
                )}
              </div>

              {filteredBlogs.length > 0 && (
                <div className="flex justify-center mt-6">
                  <nav>
                    <ul className="flex">
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <li key={index + 1}>
                          <button
                            onClick={() => paginate(index + 1)}
                            className={`px-4 py-2 mx-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
