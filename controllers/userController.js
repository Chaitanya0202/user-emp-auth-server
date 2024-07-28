
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');

const JWT_SECRET = process.env.JWT_SECRET ;


exports.signUp = async (req, res) => {
  const { f_userName, f_Pwd } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ f_userName });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // password  Hashing Did
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(f_Pwd, salt);

    
    const newUser = new User({
      f_userName,
      f_Pwd: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.login = async (req, res) => {
  const { f_userName, f_Pwd } = req.body;

  try {
    // User Exist Or Not
    const user = await User.findOne({ f_userName });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

  
    const isMatch = await bcrypt.compare(f_Pwd, user.f_Pwd);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        username: user.f_userName,
      },
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, async (err, token) => {
      if (err) throw err;

      // Code for Store the token in the database
      const newToken = new Token({ token });
      await newToken.save();

      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// User Logout
exports.logout = async (req, res) => {
  try {
   
    const token = req.header('Authorization').replace('Bearer ', '');
    await Token.findOneAndDelete({ token });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
