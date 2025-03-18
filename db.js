import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Food from './model.js';
import axios from 'axios';


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://cluster0.oyxyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    user: 'Atharva',
    pass: '1am@doctor'
  }) .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.log('❌ Error connecting to MongoDB:', err));

// ✅ Add food
app.post('/add-food', async (req, res) => {
    const { name, foodType, quantity, expiryDate, phone } = req.body;
    try {
        const food = await Food.create({ name, foodType, quantity, expiryDate, phone });
        res.status(201).json(food);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add food' });
    }
});

// ✅ Get all foods
app.get('/get-foods', async (req, res) => {  // Changed axios.get to app.get
    try {
        const foods = await Food.find();
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch foods' });
    }
});

// ✅ Update food by ID
app.put('/update-food/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid food ID format" });
        }

        const { name, foodType, quantity, expiryDate, phone } = req.body;

        const updatedFood = await Food.findByIdAndUpdate(
            id,
            { name, foodType, quantity, expiryDate, phone },
            { new: true, runValidators: true }
        );

        if (!updatedFood) {
            return res.status(404).json({ error: 'Food not found' });
        }

        res.status(200).json(updatedFood);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete food by ID
app.delete('/delete-food/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid food ID format" });
        }

        const deletedFood = await Food.findByIdAndDelete(id);

        if (!deletedFood) {
            return res.status(404).json({ error: "Food not found" });
        }

        res.status(200).json({ message: "Food deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
