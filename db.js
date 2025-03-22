const express = require('express');
const mongoose = require('mongoose');
const {User, Food} = require('./model');

const app = express();
app.use(express.json());

const allowedOrigins = ['http://localhost:5173','http://localhost:5174', 'https://atharva-develop.github.io'];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

mongoose.connect('mongodb+srv://Atharva:1am%40doctor@cluster0.oyxyq.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.log('❌ Error connecting to MongoDB:', err));

// ✅ Add user
app.post('/add-user', async (req, res) => {
    const { name, email, phone, password, address, type } = req.body;
    try {
        const user = await User.create({ name, email, phone, password, address, type });
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

// ✅ Get user by email and password
app.post('/get-user-by-credentials', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(404).json({ error: 'User not found with these credentials' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by credentials:', error);
        res.status(500).json({ error: error.message });
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
app.delete('/delete-user-by-email', async (req, res) => {
    const { email } = req.body;
    console.log('Delete request with email:', email);

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // First find the user to confirm it exists
        const user = await User.findOne({ email });
        console.log('Found user:', user);
    
        const deletedUser = await User.deleteOne({ email});
        console.log('Delete result:', deletedUser);
        
        if (deletedUser.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found with this email' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: error.message });
    }
});


app.post('/add-food', async (req, res) => {
    const { name, email, phone, foodDescription, quantity, address } = req.body;
    try {
        const food = await Food.create({ name, email, phone, foodDescription, quantity, address });
        res.status(201).json(food);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Failed to add Food' });
    }
});

// ✅ Get all users
app.get('/get-food', async (req, res) => {
    try {
        const foods = await User.find();
        console.log('Fetched users:', foods);
        res.status(200).json(foods);
    } catch (error) {
        console.error('Error fetching foods:', error);
        res.status(500).json({ error: 'Failed to fetch foods' });
    }
});

app.post('/get-food-by-email', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const food = await Food.find({ email });

        if (!food) {
            return res.status(404).json({ error: 'Food not found with these email' });
        }

        res.status(200).json(food);
    } catch (error) {
        console.error('Error fetching food by email:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/delete-food-by-id', async (req, res) => {
    const { id } = req.body;
    console.log('Delete request with id:', id);

    if (!id) {
        return res.status(400).json({ error: 'id is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid food ID format' });
    }

    try {
        // Check if food exists
        const food = await Food.findOne({ _id: id });
        if (!food) {
            return res.status(404).json({ error: 'Food not found' });
        }

        // Delete food by ObjectId
        const deletedFood = await Food.deleteOne({ _id: id });

        if (deletedFood.deletedCount === 0) {
            return res.status(404).json({ error: 'Food not found with this id' });
        }

        res.status(200).json({ message: 'Food deleted successfully' });
    } catch (error) {
        console.error('Error deleting food:', error);
        res.status(500).json({ error: error.message });
    }
});


// ✅ Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
