const mongoose = require('mongoose');

const URI = "mongodb+srv://Shyam:qwertyuiop@cluster0.ivwwfxx.mongodb.net/Blogs_DoneX?retryWrites=true&w=majority&appName=Cluster0"

const connectDb = async ()=>{
    try {
        await mongoose.connect(URI);
        console.log("Connection succesfull");
    } catch (error) {
        console.log(error);
        process.exit(0);
    }
}

module.exports = connectDb;