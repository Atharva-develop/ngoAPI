const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true }
});

const NGO = mongoose.model('NGO', ngoSchema);

module.exports = NGO;
