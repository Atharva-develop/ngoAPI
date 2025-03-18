const express = require('express');
const mongoose = require('mongoose');
const User = require('./model');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://Atharva:1am%40doctor@cluster0.oyxyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.log('❌ Error connecting to MongoDB:', err));

// Rest of your code remains the same


// ✅ Add user
app.post('/add-user', async (req, res) => {
    const { name, email, years, phone } = req.body; // Updated fields
    try {
        const user = await User.create({ name, email, years, phone }); // Updated fields
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add user' });
    }
});

// ✅ Get all users
app.get('/get-users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// ✅ Update user by ID
app.put('/update-user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Update request for ID:", id);
        console.log("Update data:", req.body);
        
        // Check if ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("Invalid ID format:", id);
            return res.status(400).json({ error: "Invalid user ID format" });
        }
        
        const { name, email, years, phone } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, years, phone },
            { new: true, runValidators: true }
        );
        
        console.log("Update result:", updatedUser);
        
        if (!updatedUser) {
            console.log("User not found with ID:", id);
            return res.status(404).json({ error: 'User not found' });
        }
        
        console.log("User updated successfully:", id);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: error.message });
    }
});


// ✅ Delete user by ID
app.delete('/delete-user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if the ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }
        
        const deletedUser = await User.findByIdAndDelete(id);
        
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: error.message });
    }
});


// ✅ Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
