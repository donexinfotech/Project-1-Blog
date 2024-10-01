const mongoose = require('mongoose');

const URI = "mongodb+srv://donexinfotech:2311@cluster0.j4oac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

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