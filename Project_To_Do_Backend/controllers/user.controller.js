const User = require('../models/user.model');
const jwt = require('jsonwebtoken')
const {generateToken} = require('../middlewares/auth.middleware')

const registerUser = async(req, res) => {
  try {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
      return res.status(400).json({message: "All the credentials are required(name, email and password)"})
    }

    const isExist = await User.findOne({email: email})
    if(isExist) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    const newUser = await User.create({
      name, 
      email,
      password
    })


    const token = await generateToken(newUser);
    newUser.token = token;
    await newUser.save()

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    })
  }
}

const loginUser = async(req, res) => {
  try {
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(400).json({
        success: false,
        message: "Login credentials not provided(email & password)"
      })
    }

    const user = await User.findOne({email}).select('+password');
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User doesn't exist with this email"
      })
    }

    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch){
      return res.status(403).json({
        success: false,
        message: "Invalid credentials"
      })
    }

    const token = await generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login Successfully",
      token
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    })
  }
}

const logoutUser = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0)
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};

module.exports = {registerUser, loginUser, logoutUser};