const User = require('../models/user.model')
const jwt = require('jsonwebtoken');
require('dotenv').config();


const authMiddleware = async(req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if(!authorization || !authorization.startsWith('Bearer ')){
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authorization.split(' ')[1];

    if(!token){
      return res.status(401).json({
        message: 'Token not provided'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded || !decoded.userId){
      return res.status(401).json({
        message: 'Invalid token'
      })
    }

    const user = await User.findById(decoded.userId).select('-password');
    if(!user){
      return res.status(401).json({
        message: 'User not found'
      })
    }

    req.user = user;
    return next();

  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized',
      error: error.message
    })
  }
}

const generateToken = (userData) => {
  return jwt.sign({userId: userData._id}, process.env.JWT_SECRET, {expiresIn: '3d'});
}


module.exports = {authMiddleware, generateToken};