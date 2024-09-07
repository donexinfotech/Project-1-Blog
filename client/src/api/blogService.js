import axios from 'axios';

export const deleteBlogById = async (id) => {
    await axios.delete(`/api/blog/${id}`);
  };


export const updateBlogById = async (id, data) => {
  try {
    const response = await axios.patch(`/api/blog/update-blog/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update blog: ' + error.response?.data?.message || error.message);
  }
};

export const fetchBlogs = async () => {
    try {
        const response = await axios.get(`/api/blog/get-blogs`);
        return response.data;
    } catch (error) {
        console.error('Error fetching blogs', error);
        throw error;
    }
};


export const getBlogById = async (id)=>{
    try {
        const response = await axios.get(`/api/blog/get-blog-by-id/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
};
