const mongoose = require('mongoose');


// ✅ User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },  // 👈 User name
    email: { type: String, required: true, unique: true },  // 👈 Unique user email
    phone: { type: String, required: true },  // 👈 User phone
    password: { type: String, required: true },  // 👈 User password
    address: { type: String },  // 👈 Optional address
    type: { type: String, enum: ['Restaurant', 'NGO'], required: true }  // 👈 Role type
});

// ✅ Food Schema
const foodSchema = new mongoose.Schema({
  
    name: { type: String, required: true },  // 👈 User name
    email: { type: String, required: true },  // ❌ Removed `unique: true` (multiple entries per email allowed)
    phone: { type: String, required: true },  // 👈 User phone
    address: { type: String },  // 👈 Optional address
    foodDescription: { type: String, required: true },  // 👈 Food details
    quantity: { type: String, required: true },  // 👈 Quantity
    postedOn: { 
    type: Date, 
    default: Date.now // This stores the correct UTC time
}
});

// ✅ Models
const User = mongoose.model('User', userSchema, 'users');
const Food = mongoose.model('Food', foodSchema, 'foods');

// ✅ Export Both Models
module.exports = { User, Food };
