const express = require('express');
const route = express.Router();
const {registerUser, loginUser, logoutUser} = require('../controllers/user.controller')

// api/user/register
route.post('/register', registerUser);

// api/user/login
route.post('/login', loginUser);

// api/user/logout
route.post('/logout', logoutUser);


module.exports = route;