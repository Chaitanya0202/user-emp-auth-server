const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Token = require('../models/Token');

// Load environment variables from .env file
dotenv.config();

module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'Authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

    // Check if the token exists in the database
    const tokenExists = await Token.findOne({ token: token.replace('Bearer ', '') });
    if (!tokenExists) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
