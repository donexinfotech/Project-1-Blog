const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

const auth_middleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if(!token){
            return res.status(401).json({
                message:"Unauthorised HTTP, Token not provided"
            })
        }

        const jwtToken = token.replace("Bearer", "").trim();

        const isVerified =  jwt.verify(jwtToken, "DONEXBLOG")
        console.log(isVerified);

        const userData = await User.findOne({email:isVerified.email}).select({
            password:0,
        });

        console.log(userData);

        req.user = userData;
        req.token = token;
        req.userID = userData._id;

        next();

    } catch (error) {
        console.log(error);
    }
}

module.exports = auth_middleware;