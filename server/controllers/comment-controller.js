const Blog = require("../models/blog-model");


const addComment = async (req, res)=>{
    try {
        const id = req.params.blogid
        const {comment, commented_by} = req.body

        const blog = await Blog.findOne({_id : id})
        if(!blog){
            res.status(400).json({
                message : "No blog found"
            })
        }

        blog.comments.push({comment, commented_by})

        await blog.save()
        res.status(200).json({ message: 'Comment added successfully', blog });

    } catch (error) {
        console.log(error);
    }
}

const getComments = async (req, res)=>{
    try {
        const id = req.params.blogid

        const blog = await Blog.findOne({_id : id}).select('comments');

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        res.status(200).json(blog.comments);

    } catch (error) {
        console.log(error)
    }
}

module.exports = {addComment, getComments}