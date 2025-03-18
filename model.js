import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
    name: String,
    foodType: String,
    quantity: Number,
    expiryDate: String,
    phone: String
});

const Food = mongoose.model('Food', foodSchema);

export default Food;
