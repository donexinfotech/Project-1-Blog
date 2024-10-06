import React, { useState } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';

const BlogCreate = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const Token = localStorage.getItem('authToken');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1000,
          useWebWorker: true,
          initialQuality: 0.8,
          maxIteration: 5,
        };

        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result.split(',')[1]);
          setImagePreview(URL.createObjectURL(compressedFile));
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        setError('Failed to compress image.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post(
        '/api/blog/create',
        {
          title,
          image,
          description,
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccess('Blog post created successfully!');
      setTitle('');
      setImage('');
      setDescription('');
      setCategory('');
      setImagePreview('');
    } catch (err) {
      setError('Failed to create blog post.');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'font': [] }, { 'size': ['normal', 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['code-block'],
      ['link', 'image' ,'video'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-gray-800">Create a New Blog Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block text-lg font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="bg-white mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="image" className="block text-lg font-medium text-gray-700">Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full md:w-1/3 h-auto object-cover rounded-md border border-gray-300"
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="category" className="block text-lg font-medium text-gray-700">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="bg-white mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          >
            <option value="" disabled>Select a category</option>
            <option value="Cyber Threats & Vulnerabilities">Cyber Threats & Vulnerabilities</option>
            <option value="Cybersecurity Best Practices">Cybersecurity Best Practices</option>
            <option value="Cybersecurity Tools & Solutions">Cybersecurity Tools & Solutions</option>
            <option value="Cryptography and Encryption">Cryptography and Encryption</option>
            <option value="Compliance & Legal Aspects">Compliance & Legal Aspects</option>
            <option value="Emerging Technologies in Cybersecurity">Emerging Technologies in Cybersecurity</option>
            <option value="Incident Response & Management">Incident Response & Management</option>
            <option value="Data Privacy and Protection">Data Privacy and Protection</option>
            <option value="Security Awareness & Education">Security Awareness & Education</option>
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">Description</label>
          <ReactQuill
            id="description"
            value={description}
            onChange={setDescription}
            required
            modules={modules}
            className="border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center px-6 py-3 text-lg border border-transparent font-medium rounded-md shadow-sm text-white ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {loading ? 'Submitting...' : 'Create Blog'}
          </button>
        </div>

        {success && <p className="mt-4 text-green-600">{success}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default BlogCreate;
