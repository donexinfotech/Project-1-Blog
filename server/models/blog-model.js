const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    commented_by: {
        type: String,
        required: true
    },
    commented_on: {
        type: Date,
        default: Date.now
    }
});
 
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
    category:{
        type:String,
        require:true
    },
    created_at:{
        type: Date,
        default: Date.now
    }, 
    created_by:{
        type: String,
        default: "User"
    },
    comments : [commentSchema]
})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;