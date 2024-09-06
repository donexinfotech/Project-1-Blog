import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogById } from '../../api/blogService'; 

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBlog = async () => {
      try {
        const data = await getBlogById(id);
        setBlog(data);
      } catch (err) {
        setError('Failed to fetch blog details.');
      } finally {
        setLoading(false);
      }
    };
    getBlog();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!blog) return <p className="text-center text-gray-500">Blog not found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="relative mb-6">
        <img
          src={`data:image/jpeg;base64,${blog.image}`}
          alt={blog.title}
          className="w-full h-96 object-cover rounded-lg shadow-md"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">{blog.title}</h1>
        </div>
      </div>
      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        {blog.description}
      </p>
      <p className="text-gray-500 text-sm">
        <em>Created at: {new Date(blog.created_at).toLocaleDateString()}</em>
      </p>
    </div>
  );
};

export default BlogDetails;
