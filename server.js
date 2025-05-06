const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 10000;
app.use(express.json());
app.use(cors());

// MongoDB URI
const uri = 'mongodb+srv://amanmug23cs:T2MeQhO7LuKe81v5@cluster0.q7qv0.mongodb.net/cf1?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB with Mongoose
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB using Mongoose');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Define Mongoose Schema and Model
const userTrackSchema = new mongoose.Schema({
    user: { type: String, required: true, unique: true },
    trackhandle: [String],
    tophandle: [String]
});

const UserTrack = mongoose.model('UserTrack', userTrackSchema);

// Base route
app.get('/', (req, res) => {
    res.send('MongoDB connection with Mongoose is successful!');
});

// Save or update user route
app.post('/api/usertrack', async (req, res) => {
    const { user, trackhandle, tophandle } = req.body;
    if (!user) return res.status(400).json({ error: 'user is required' });

    try {
        const update = {};
        if (trackhandle) {
            update.$addToSet = { ...(update.$addToSet || {}), trackhandle: trackhandle };
        }
        if (tophandle) {
            update.$addToSet = { ...(update.$addToSet || {}), tophandle: tophandle };
        }

        const result = await UserTrack.updateOne(
            { user },
            { $setOnInsert: { user }, ...update },
            { upsert: true }
        );

        res.json({ message: result.upsertedCount ? 'User created' : 'User updated' });
    } catch (err) {
        console.error('Error in usertrack API:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get usertrack by user (returns trackhandle and tophandle)
app.get('/api/usertrack', async (req, res) => {
    const { user } = req.query;
    if (!user) return res.status(400).json({ error: 'user is required' });

    try {
        const userTrack = await UserTrack.findOne({ user });
        if (!userTrack) {
            return res.json({ trackhandle: [], tophandle: [] });
        }
        res.json({
            trackhandle: userTrack.trackhandle || [],
            tophandle: userTrack.tophandle || []
        });
    } catch (err) {
        console.error('Error fetching usertrack:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
