import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { fetchUserById } from '../../api/userApi';
import { Link } from 'react-router-dom';
import Loader from '../utils/Loader';
import { fetchComments, postComment } from '../../api/blogService';
import { useAuth } from '../auth/AuthContext';

const BlogDetails = ({ selectedBlog, handleBackToBlogs }) => {
  const { isLoggedIn } = useAuth();
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const fetchedComments = await fetchComments(selectedBlog._id);
        setComments(fetchedComments);

        if (selectedBlog?.created_by) {
          const fetchedUser = await fetchUserById(selectedBlog.created_by);
          setUser(fetchedUser);
        }

        const commentsWithUserDetails = await Promise.all(
          fetchedComments.map(async (comment) => {
            const userDetails = await fetchUserById(comment.commented_by);
            return { ...comment, commented_by: userDetails.message };
          })
        );
        setComments(commentsWithUserDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [selectedBlog]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const profilePicture = localStorage.getItem('profilePicture');

    if (!userId) {
      setError("User not logged in");
      return;
    }

    try {
      const commentData = { comment: newComment, commented_by: userId };
      const result = await postComment(selectedBlog._id, commentData);

      const newCommentObj = {
        _id: result.blog.comments[result.blog.comments.length - 1]._id,
        comment: newComment,
        commented_by: {
          username: username || 'You',
          profile_picture: profilePicture || 'placeholder-image-url',
        },
        commented_on: new Date().toISOString(),
      };

      setComments([...comments, newCommentObj]);
      setNewComment('');
      setSuccessMessage('Comment added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) return <Loader text='Loading Blog' />;
  if (error) return <p className="text-red-500">{error}</p>;

  const userProfileLink = user ? `/user/${user.message._id}` : '#';

  return (
    <div className="flex flex-col items-center justify-start p-4">
      <div className="relative w-full max-w-3xl">
        <button
          onClick={handleBackToBlogs}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200"
        >
          <FaArrowLeft />
        </button>
        <img
          src={`data:image/jpeg;base64,${selectedBlog.image}`}
          alt={selectedBlog.title}
          className="w-full h-[450px] object-cover rounded-lg shadow-md"
        />
      </div>

      <div className="w-full mt-4 p-6 bg-white bg-opacity-90 text-left rounded-lg shadow-lg">
        <Link to={userProfileLink} className="flex items-center mb-3 justify-between">
          <div className="flex items-center">
            <img
              src={user ? `data:image/jpeg;base64,${user.message.profile_picture}` : 'placeholder-image-url'}
              alt={user ? user.message.username : 'Unknown'}
              className="w-8 h-8 rounded-full mr-2"
            />
            <p className="font-semibold">{user ? user.message.username : 'Unknown'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">
              <em>Created on: {new Date(selectedBlog.created_at).toLocaleDateString()}</em>
            </p>
          </div>
        </Link>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 font-serif">{selectedBlog.title}</h1>
        <p className="text-lg text-gray-700 mb-6">{selectedBlog.description}</p>
        <p className="text-sm text-gray-500 mb-6">
          <em>Created on: {new Date(selectedBlog.created_at).toLocaleDateString()}</em>
        </p>
      </div>

      {/* Comments and Input Form Section */}
      <div className="w-full p-6 bg-white bg-opacity-90 text-left rounded-lg shadow-lg mt-6">
        <h2 className="text-3xl font-bold mb-4">Comments</h2>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="flex items-start mb-4">
              <img
                src={comment.commented_by.profile_picture ? `data:image/jpeg;base64,${comment.commented_by.profile_picture}` : 'placeholder-image-url'}
                alt={comment.commented_by.username}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <p className="font-semibold">{comment.commented_by.username}</p>
                <p>{comment.comment}</p>
                <p className="text-gray-500 text-sm">
                  <em>Commented on: {new Date(comment.commented_on).toLocaleDateString()}</em>
                </p>
              </div>
            </div>
          ))
        )}

        {/* Comment Input Form */}
        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit} className="mt-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment..."
              required
              className="w-full p-2 border rounded mb-2 resize-none"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Post Comment</button>
          </form>
        ) : (
          <p className="mt-8 font-extrabold text-red-500 text-center">Kindly Log In to add a comment.</p>
        )}

        {/* Success and Error Messages */}
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default BlogDetails;
