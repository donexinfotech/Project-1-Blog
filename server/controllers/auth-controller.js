const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const Register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      profile_picture,
      username,
      email,
      phone,
      password,
    } = req.body;

    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const userCreated = await User.create({
      first_name,
      last_name,
      profile_picture,
      username,
      email,
      phone,
      password,
    });

    res.status(200).json({
      message: `${username} Registered Sucessfully`,
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    console.log(error);
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email: email });

    if (!userExist) {
      res.status(400).json({
        message: "Invalid email",
      });
    }

    const user = await bycrypt.compare(password, userExist.password);

    if (user) {
      res.status(200).json({
        Message: "Loggedin Successfully",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
        username: userExist.username,
        profile_picture: userExist.profile_picture,
      });
    } else {
      res.status(401).json({
        message: "Invalid password",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });

    res.status(200).json({
      message: user,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const updatedUser = await User.updateOne({ _id: id }, { $set: data });

    res.status(200).json({ message: "User updated successfully", data });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating the user",
      error: error.message,
    });
  }
};

const sendResetMail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({
      message: `${email} is not registered`,
    });
  }

  const token = jwt.sign(
    {
      email: email,
    },
    "DONEXBLOG",
    {
      expiresIn: "1d",
    }
  );

  try {
    const resetLink = `http://localhost:3000/password-reset/${email}/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "donexinfotech@gmail.com",
        pass: "dtzb viow nozw xqyy",
      },
    });

    const mailOptions = {
      from: "donexinfotech@gmail.com",
      to: email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}`,
      html: `
        <div style="text-align: center;">
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" style="text-decoration: none;">
            <button style="
            background-color: #007BFF; 
            color: white; 
            padding: 10px 20px; 
            border: none; 
            border-radius: 5px; 
            font-size: 16px; 
            cursor: pointer;">
            Reset Password
            </button>
        </a>
        </div>
  `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send({ message: "Reset email sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "something went wrong",
      error: error,
    });
  }
};

const passwordReset = async (req, res) => {
  try {
    const email = req.params.email;
    const data = req.body;

    const salt = await bycrypt.genSalt(10);
    const password_hash = await bycrypt.hash(data.password, salt);
    data.password = password_hash;

    const user = await User.updateOne({ email: email }, { $set: data });

    if (!user) {
      res.status(400).json({
        message: "Enter the correct email",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something has gone wrong",
      error: error,
    });
  }
};

module.exports = {
  Register,
  Login,
  getUserById,
  updateUser,
  passwordReset,
  sendResetMail,
};
