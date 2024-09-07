import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const BlogDetails = ({ selectedBlog, handleBackToBlogs }) => {
  return (
    <div className="h-screen flex flex-col items-center justify-start ml-48"> {/* Added ml-64 for left margin */}
      {/* Image at the top */}
      <div className="absolute w-full max-w-3xl">
      <button
        onClick={handleBackToBlogs}
        className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200"
      >
        <FaArrowLeft/>
      </button>
        <img
          src={`data:image/jpeg;base64,${selectedBlog.image}`}
          alt={selectedBlog.title}
          className="w-full h-[450px] object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Blog details below the image */}
      <div className="relative w-[700px] mt-[400px]"> {/* Adjusted margin-top to be more consistent */}
        <div className="w-full p-10 bg-white bg-opacity-90 text-left rounded-lg shadow-lg">
          <h1 className="text-5xl font-bold mb-4 font-serif">{selectedBlog.title}</h1>
          <p className="text-lg text-gray-700 mb-6">{selectedBlog.description}</p>
          <p className="text-sm text-gray-500 mb-6">
            <em>Created on: {new Date(selectedBlog.created_at).toLocaleDateString()}</em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
