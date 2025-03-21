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
        default: () => {
            let istTime = new Date();
            istTime.setHours(istTime.getHours() + 5); // Convert UTC to IST (Add 5 hours)
            istTime.setMinutes(istTime.getMinutes() + 30); // Add 30 minutes
            return istTime;
        } 
    }
});

// ✅ Models
const User = mongoose.model('User', userSchema, 'users');
const Food = mongoose.model('Food', foodSchema, 'foods');

// ✅ Export Both Models
module.exports = { User, Food };
