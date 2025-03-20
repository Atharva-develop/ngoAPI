const express = require('express');
const mongoose = require('mongoose');
const NGO = require('./model'); // Updated model import

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://Atharva:1am@doctor@cluster0.oyxyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.log('❌ Error connecting to MongoDB:', err));


// ✅ Register NGO
app.post('/register-ngo', async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        const ngo = await NGO.create({ name, email, phone, password });
        res.status(201).json(ngo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to register NGO' });
    }
});

// ✅ Get all registered NGOs
app.get('/get-ngos', async (req, res) => {
    try {
        const ngos = await NGO.find();
        res.status(200).json(ngos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch NGOs' });
    }
});

// ✅ Update NGO by ID
app.put('/update-ngo/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, password } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid NGO ID format' });
        }

        const updatedNGO = await NGO.findByIdAndUpdate(
            id,
            { name, email, phone, password },
            { new: true, runValidators: true }
        );

        if (!updatedNGO) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        res.status(200).json(updatedNGO);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update NGO' });
    }
});

// ✅ Delete NGO by ID
app.delete('/delete-ngo/:id', async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid NGO ID format' });
        }

        const deletedNGO = await NGO.findByIdAndDelete(id);

        if (!deletedNGO) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        res.status(200).json({ message: 'NGO deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete NGO' });
    }
});

// ✅ Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
