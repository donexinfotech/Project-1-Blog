const Blog = require("../models/blog-model");
const nodemailer = require("nodemailer");

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
        const blogs = await Blog.findById(
            {_id : id},
        );
        res.status(200).json(blogs);
    } catch (error) {
        console.log(error);
    }
}

const getBlogByUserId = async (req, res) => {
    try {
        const id = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6; 
        const skip = (page - 1) * limit; 
        const [blog, total] = await Promise.all([
            Blog.find({ created_by: id }).skip(skip).limit(limit), 
            Blog.countDocuments({ created_by: id })
        ]);

        res.status(200).json({
            blog,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const getBlogByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit; 

        const blogs = await Blog.find({ category: category })
            .skip(skip)
            .limit(limit);
        
        const totalBlogs = await Blog.countDocuments({ category: category });

        res.status(200).json({
            totalBlogs,
            totalPages: Math.ceil(totalBlogs / limit),
            currentPage: page,
            blogs,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const searchBlogs = async (req, res) => {
    try {
        const key = req.params.key;
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const result = await Blog.find({
            $or: [
                { title: { $regex: key, $options: 'i' } },
                { description: { $regex: key, $options: 'i' } },
                { category: { $regex: key, $options: 'i' } }
            ]
        })
        .skip(skip)
        .limit(limit);

        const total = await Blog.countDocuments({
            $or: [
                { title: { $regex: key, $options: 'i' } },
                { description: { $regex: key, $options: 'i' } },
                { category: { $regex: key, $options: 'i' } }
            ]
        });

        const totalPages = Math.ceil(total / limit);

        if (result.length === 0) {
            return res.status(200).json({
                message: "No blogs found",
                totalPages,
                currentPage: page,
                blogs: []
            });
        }

        res.status(200).json({
            totalPages,
            currentPage: page,
            blogs: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const reportBlog = async (req, res)=>{
    try {

        const id = req.params.blogID

        const blog = await Blog.findOne({_id : id})
        const adminEmail = "syb26633@gmail.com"

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "donexinfotech@gmail.com",
              pass: "dtzb viow nozw xqyy",
            },
          });
      
          const mailOptions = {
            from: "donexinfotech@gmail.com",
            to: adminEmail,
            subject: "Someone Reported a blog",
            text: `A blog with was reported`,
            html:`
            <p>A blog with was reported</p>
            <h1>blogID: ${blog._id}</h1>
            <h2>${blog.title}</h2>
             `,
          };
      
          await transporter.sendMail(mailOptions);

        res.status(200).json({
            message : "Blog reported Succesfully"
        })
    } catch (error) {
        console.log(error)
    }
}



module.exports = {createBlog, getAllBlogs, updateBlog, deleteBlog, getBlogById, getBlogByUserId, getBlogByCategory, searchBlogs, reportBlog};