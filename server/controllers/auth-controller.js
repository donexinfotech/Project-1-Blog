const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcryptjs");

const Register = async (req,res)=>{
    try {
        const {first_name, last_name, profile_picture, username, email, phone, password} = req.body;

        const userExist = await User.findOne({email : email});

        if(userExist){
            return res.status(400).json({
                message : "User already exists",
            });
        }

        const userCreated = await User.create({first_name, last_name, profile_picture, username, email, phone, password})

        res.status(200).json({
            message :  `${username} Registered Sucessfully`,
            token : await userCreated.generateToken(),
            userId : userCreated._id.toString()
        });

    } catch (error) {
        console.log(error);
    }
}

const Login = async (req, res)=>{
    try {
        const {email, password} = req.body;

        const userExist = await User.findOne({email : email});

        if(!userExist){
            res.status(400).json({
                message : "Invalid email"
            });
        }

        const user = await bycrypt.compare(password, userExist.password);

        if(user){
            res.status(200).json({
                "Message": "Loggedin Successfully", 
                "token": await userExist.generateToken(),
                "userId" : userExist._id.toString(),
            });
        } else{
            res.status(401).json({
                "message": "Invalid password"});
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = {Register, Login};