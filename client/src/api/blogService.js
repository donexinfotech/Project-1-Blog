import axios from 'axios';

export const deleteBlog = async (id) => {
    await axios.delete(`/api/blog/${id}`);
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
