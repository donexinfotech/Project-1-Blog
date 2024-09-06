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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <img
        src={`data:image/jpeg;base64,${blog.image}`}
        alt={blog.title}
        className="w-full h-64 object-cover mb-4"
      />
      <p className="text-gray-700 mb-4">{blog.description}</p>
      <p className="text-gray-500 text-sm">
        <em>Created at: {new Date(blog.created_at).toLocaleDateString()}</em>
      </p>
    </div>
  );
};

export default BlogDetails;
