const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String, 
    address: String // ✅ Fixed typo (address)
});

const User = mongoose.model('User', userSchema);

module.exports = User;
