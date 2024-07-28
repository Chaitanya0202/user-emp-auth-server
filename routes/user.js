
const express = require('express');
const { signUp, login, logout } = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', auth, logout);

module.exports = router;
