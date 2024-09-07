import React, { useEffect, useState } from 'react';
import { fetchBlogs, getBlogById } from '../../api/blogService';
import { FaSearch } from 'react-icons/fa';
import BlogDetails from '../blog/blogDetails';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedTopPost, setSelectedTopPost] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const blogsPerPage = 6;

  const fetchUserData = async (blogsData) => {
    const updatedBlogs = await Promise.all(
      blogsData.map(async (blog) => {
        try {
          const response = await fetch(`/api/auth/get-user-by-id/${blog.created_by}`);
          const userData = await response.json();
          return {
            ...blog,
            user: {
              username: userData.message.username || 'Unknown',
              profile_picture: userData.message.profile_picture || 'default-pic-url'
            }
          };
        } catch (error) {
          return {
            ...blog,
            user: { username: 'Unknown', profile_picture: 'default-pic-url' }
          };
        }
      })
    );
    setBlogs(updatedBlogs);
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

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;

  const sortedBlogs = [...blogs].sort((a, b) => {
    return sortOrder === 'desc'
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at);
  });

  const currentBlogs = sortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const topPosts = [...blogs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);
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
    setSelectedTopPost(null);
  };

  const handleTopPostClick = async (id) => {
    try {
      const blogData = await getBlogById(id);
      setSelectedTopPost(blogData);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'));
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto flex">
        <div className="w-1/4 pr-1">
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

          <div className="mb-6 rounded-lg bg-gray-100 pl-3">
            <h3 className="text-xl text-blue-700 mb-2 pt-2 font-bold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <button className="w-full text-left p-2 text-red-600 font-bold">
                  Technology
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 text-red-600 font-bold">
                  Health
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 text-red-600 font-bold">
                  Finance
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 text-red-600 font-bold">
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
            <a
              onClick={toggleSortOrder}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              {sortOrder === 'desc' ? 'Sort: Oldest First' : 'Sort: Latest First'}
            </a>
          </div>
        </div>

        <div className="w-3/5">
          {selectedBlog || selectedTopPost ? (
            <BlogDetails selectedBlog={selectedBlog || selectedTopPost} handleBackToBlogs={handleBackToBlogs} />
            
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
                    <div className="flex items-center m-4 mb-0 justify-between">
                      <div className="flex">
                        <img
                          src={`data:image/jpeg;base64,${blog.user.profile_picture}`}
                          alt={blog.user?.username || 'Unknown'}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <p>{blog.user?.username || 'Unknown'}</p>
                      </div>
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
                ))}
              </div>
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
