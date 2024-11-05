const mongoose = require('mongoose');

const URI = "mongodb+srv://nishanvr2003:M3UTWnbIAfKVFfgs@cluster0.cchp9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

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