const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 10000;

const uri = 'mongodb+srv://amanmug23cs:T2MeQhO7LuKe81v5@cluster0.q7qv0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function startServer() {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB ');

        app.get('/', (req, res) => {
            res.send('MongoDB connection successful!');
        });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

startServer();
