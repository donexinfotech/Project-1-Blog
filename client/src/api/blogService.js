import axios from 'axios';

export const deleteBlogById = async (id) => {
    await axios.delete(`/api/blog/${id}`);
  };


export const updateBlogById = async (id, data) => {
  try {
    const response = await axios.patch(`https://blogs-donex-backend.vercel.app/api/blog/update-blog/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update blog: ' + error.response?.data?.message || error.message);
  }
};

export const fetchBlogs = async (page = 1, limit = 6) => {
  try {
      const response = await axios.get(`https://blogs-donex-backend.vercel.app/api/blog/get-blogs`, {
          params: { page, limit }
      });
      return response.data;
  } catch (error) {
      console.error('Error fetching blogs', error);
      throw error;
  }
};


export const getBlogById = async (id)=>{
    try {
        const response = await axios.get(`https://blogs-donex-backend.vercel.app/api/blog/get-blog-by-id/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
};

export const fetchBlogsByCategory = async (category, page = 1, limit = 6) => {
  try {
    const response = await fetch(`https://blogs-donex-backend.vercel.app/api/blog/get-blog-by-category/${category}?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch blogs for category ${category}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching blogs for category ${category}:`, error);
    throw error;
  }
};


export const searchBlogsByKey = async (key,page=1,limit=6) => {
  try {
    const response = await axios.get(`https://blogs-donex-backend.vercel.app/api/blog/search/${key}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error searching blogs', error);
    throw error;
  }
};

export const fetchComments = async (blogId) => {
  const response = await fetch(`https://blogs-donex-backend.vercel.app/api/comment/get/${blogId}`);
  if (!response.ok) throw new Error('Failed to fetch comments');
  return await response.json();
};

export const postComment = async (blogId, commentData) => {
  try {
      const response = await fetch(`https://blogs-donex-backend.vercel.app/api/comment/${blogId}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(commentData),
      });

      if (!response.ok) {
          throw new Error('Failed to add comment');
      }

      return await response.json();
  } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error(error.message);
  }
};
