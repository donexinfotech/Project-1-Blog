const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        require : true
    },
    image:{
        type:String,
        require: true
    },
    description:{
        type:String,
        require:true
    },
    created_at:{
        type: Date,
        default: Date.now
    } 
})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;