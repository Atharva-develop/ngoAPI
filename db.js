const express = require('express');
const mongoose = require('mongoose');
const User = require('./model');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://Atharva:1am%40doctor@cluster0.oyxyq.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.log('❌ Error connecting to MongoDB:', err));

// ✅ Add user
app.post('/add-user', async (req, res) => {
    const { name, email, phone, password, address } = req.body;
    try {
        const user = await User.create({ name, email, phone, password, address });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Failed to add user' });
    }
});

// ✅ Get all users
app.get('/get-users', async (req, res) => {
    try {
        const users = await User.find();
        console.log('Fetched users:', users);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// ✅ Update user by ID
app.put('/update-user/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, password, address } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID format' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, phone, password, address },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete user by password
app.delete('/delete-user-by-password', async (req, res) => {
    const { password } = req.body;
    console.log('Delete request with password:', password);

    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    try {
        // First find the user to confirm it exists
        const user = await User.findOne({ password });
        console.log('Found user:', user);
        
        const deletedUser = await User.deleteOne({ password });
        console.log('Delete result:', deletedUser);
        
        if (deletedUser.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found with this password' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: error.message });
    }
});




// ✅ Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
