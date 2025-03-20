const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // 👈 User name
    email: { type: String, required: true, unique: true }, // 👈 User email (unique)
    phone: { type: String, required: true }, // 👈 User phone
    password: { type: String, required: true }, // 👈 User password
    address: { type: String }, // 👈 User address (optional)
    type: { type: String, enum: ['Restaurant', 'NGO'] }
});

// 👇 Use the 'users' collection explicitly
const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
