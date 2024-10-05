const Blog = require("../models/blog-model");

const createBlog = async (req, res)=>{
    try {
        const {title, image, description, category} = req.body;
    
        if(!title || !image || !description) {
            res.status(400).json({
                message: "All fields are required"
            });
        };

        const user_details = req.user;
    
        const newBlog = new Blog({ title, image, description, created_by:user_details._id.toString(), category });
        const savedBlog = await newBlog.save();
    
        res.status(200).json(savedBlog);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

const getAllBlogs = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
  
      const startIndex = (page - 1) * limit;
  
      const totalBlogs = await Blog.countDocuments();
  
      const blogs = await Blog.find()
        .skip(startIndex)
        .limit(limit);
  
      res.status(200).json({
        blogs,
        currentPage: page,
        totalPages: Math.ceil(totalBlogs / limit),
        totalBlogs
      });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
  };
  

const deleteBlog = async (req,res) => {
    try {
        const { id } = req.params;
    
        const blog = await Blog.findByIdAndDelete(id);
    
        if (!blog) {
          return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json({ message: "Blog deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Server Error", error });
      }
  };

  const updateBlog = async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;

        const updatedBlog = await Blog.updateOne(
            { _id: id },
            { $set: data }
        );

        if (updatedBlog.matchedCount === 0) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.status(200).json({ message: "Blog updated successfully", data });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error
        });
    }
}

const getBlogById = async (req, res)=>{
    try {
        const id = req.params.id
        if(!id){
            res.status(400).json({
                "message" : "Please provide the id"
            });
        }
        const blog = await Blog.findById(
            {_id : id},
        );
        res.status(200).json(blog);
    } catch (error) {
        console.log(error);
    }
}

const getBlogByUserId = async (req, res)=>{
    try {
        const id = req.params.id;
        const blog = await Blog.find({created_by: id});
        res.status(200).json(blog);
    } catch (error) {
        console.log(error);
    }
}

const getBlogByCategory = async (req, res) =>{
    try {
        const category = req.params.category;
        const blog = await Blog.find({category : category});
        res.status(200).json(blog);
    } catch (error) {
        console.log(error);
    }
}

const searchBlogs = async (req, res) => {
    try {
        const key = req.params.key;
        const result = await Blog.find({
            $or: [
                { title: { $regex: key, $options: 'i' } },
                { description: { $regex: key, $options: 'i' } },
                { category: { $regex: key, $options: 'i' } }
            ]
        });
        
        console.log(result);

        if (result.length === 0) {
            return res.status(200).json({
                message: "No blogs found"
            });
        }

        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {createBlog, getAllBlogs, updateBlog, deleteBlog, getBlogById, getBlogByUserId, getBlogByCategory, searchBlogs};