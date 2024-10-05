import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs, fetchBlogsByCategory, getBlogById, searchBlogsByKey } from '../../api/blogService';
import { FaSearch } from 'react-icons/fa';
import BlogDetails from '../blog/blogDetails';
import Loader from '../utils/Loader';

const categories = [
  'all',
  'Cyber Threats & Vulnerabilities',
  'Cybersecurity Best Practices',
  'Cybersecurity Tools & Solutions',
  'Cryptography and Encryption',
  'Compliance & Legal Aspects',
  'Emerging Technologies in Cybersecurity',
  'Incident Response & Management',
  'Data Privacy and Protection',
  'Security Awareness & Education'
];

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState(null);
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const fetchBlogsData = async (pageNumber = currentPage) => {
    setLoading(true);
    try {
      const blogsData = await fetchBlogs(pageNumber, limit);
      const updatedBlogs = await Promise.all(blogsData.blogs.map(async (blog) => {
        const userResponse = await fetch(`/api/auth/get-user-by-id/${blog.created_by}`);
        const userData = await userResponse.json();
        return {
          ...blog,
          user: {
            username: userData.message?.username || 'Unknown',
            profile_picture: userData.message?.profile_picture || 'default-pic-url',
            _id: userData.message?._id || 'default-id'
          }
        };
      }));
      setBlogs(updatedBlogs);
      setFilteredBlogs(updatedBlogs);
      setTotalPages(blogsData.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogsDataByCategory = async (selectedCategory, pageNumber = currentPage) => {
    setLoading(true);
    try {
      const blogsData = await fetchBlogsByCategory(selectedCategory, pageNumber, limit);
      const updatedBlogs = await Promise.all(blogsData.blogs.map(async (blog) => {
        const userResponse = await fetch(`/api/auth/get-user-by-id/${blog.created_by}`);
        const userData = await userResponse.json();
        return {
          ...blog,
          user: {
            username: userData.message?.username || 'Unknown',
            profile_picture: userData.message?.profile_picture || 'default-pic-url',
            _id: userData.message?._id || 'default-id'
          }
        };
      }));
      setBlogs(updatedBlogs);
      setFilteredBlogs(updatedBlogs);
      setTotalPages(blogsData.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyCategoryFilter = (selectedCategory) => {
    setCategory(selectedCategory);
    setCurrentPage(1);
    if (selectedCategory === 'all') {
      fetchBlogsData(1);
    } else {
      fetchBlogsDataByCategory(selectedCategory, 1);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setSearchError(null);
    try {
      const searchResults = await searchBlogsByKey(searchQuery);
      if (searchResults.length === 0) {
        setSearchError('No Blogs Found');
        setFilteredBlogs([]);
      } else {
        const updatedSearchResults = await Promise.all(searchResults.map(async (blog) => {
          const userResponse = await fetch(`/api/auth/get-user-by-id/${blog.created_by}`);
          const userData = await userResponse.json();
          return {
            ...blog,
            user: {
              username: userData.message?.username || 'Unknown',
              profile_picture: userData.message?.profile_picture || 'default-pic-url',
              _id: userData.message?._id || 'default-id'
            }
          };
        }));
        setFilteredBlogs(updatedSearchResults);
      }
    } catch (error) {
      setSearchError('No Blogs Found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category === 'all') {
      fetchBlogsData(currentPage);
    } else {
      fetchBlogsDataByCategory(category, currentPage);
    }
  }, [currentPage, category]);

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
  };

  const topPosts = [...filteredBlogs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);

  if (loading) return <Loader text='Loading Blogs, Hang On' />;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto flex">
        <div className="w-1/4 pr-3">
          <div className="mb-6 flex flex-row justify-center items-center w-full p-2 border border-gray-300 rounded-full">
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
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`w-full text-left p-2 font-bold ${category === cat ? 'text-red-600' : 'text-blue-700'}`}
                    onClick={() => applyCategoryFilter(cat)}
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
                    onClick={() => handleBlogClick(post._id)}
                    className="w-full text-left p-2 text-red-600 font-bold hover:bg-gray-200"
                  >
                    {post.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-3/5">
          {selectedBlog ? (
            <BlogDetails selectedBlog={selectedBlog} handleBackToBlogs={handleBackToBlogs} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
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
                ))
              ) : (
                <p className="text-center text-gray-500">{searchError || 'No Blogs Found'}</p>
              )}
            </div>
          )}
          {/* Conditional Pagination */}
          {!selectedBlog && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
