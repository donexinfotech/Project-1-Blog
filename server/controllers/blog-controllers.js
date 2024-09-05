const Blog = require("../models/blog-model");

const createBlog = async (req, res)=>{
    try {
        const {title, image, description} = req.body;
    
        if(!title || !image || !description) {
            res.send(400).json({
                message: "All fields are required"
            });
        };
    
        const newBlog = new Blog({ title, image, description });
        const savedBlog = await newBlog.save();
    
        res.status(200).json(savedBlog);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

const getAllBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find();
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
  };

module.exports = {createBlog, getAllBlogs};