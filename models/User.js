
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  f_userName: { type: String, required: true, unique: true },
  f_Pwd: { type: String, required: true },
});

module.exports = mongoose.model('users', UserSchema);
