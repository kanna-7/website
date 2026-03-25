const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['https://praveenswebsite.vercel.app', 'http://localhost:3000', 'http://localhost:5000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// MongoDB Setup
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}
connectDB();

// Email Setup (Nodemailer)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Routes
app.get('/', (req, res) => {
    res.send('ProjectPraveen Backend is running');
});

// Analytics: Track Page Visit
app.post('/api/visit', async (req, res) => {
    try {
        const database = client.db('portfolio');
        const analytics = database.collection('analytics');
        
        // Increment visitor count (using a single document with id: 'site_stats')
        await analytics.updateOne(
            { id: 'site_stats' },
            { $inc: { visitor_count: 1 } },
            { upsert: true }
        );
        
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error tracking visit:', err);
        res.status(500).json({ success: false });
    }
});

// Analytics: Get Visitor Count
app.get('/api/visit-count', async (req, res) => {
    try {
        const database = client.db('portfolio');
        const analytics = database.collection('analytics');
        const stats = await analytics.findOne({ id: 'site_stats' });
        
        res.status(200).json({ count: stats ? stats.visitor_count : 0 });
    } catch (err) {
        console.error('Error fetching visit count:', err);
        res.status(500).json({ success: false });
    }
});

// Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // 1. Save to MongoDB
        const database = client.db('portfolio');
        const collection = database.collection('messages');
        await collection.insertOne({ name, email, message, date: new Date() });

        // 2. Send Email Notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: `New Message from ${name} (ProjectPraveen)`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Message sent and saved!' });
    } catch (err) {
        console.error('Error handling contact form:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// APK Download Endpoint
app.get('/download/ramsethu', async (req, res) => {
    try {
        const database = client.db('portfolio');
        const analytics = database.collection('analytics');
        
        // Increment download count
        await analytics.updateOne(
            { id: 'site_stats' },
            { $inc: { download_count: 1 } },
            { upsert: true }
        );

        const filePath = path.join(__dirname, 'ramsethu.apk');
        res.download(filePath, 'ramsethu.apk');
    } catch (err) {
        console.error('Error tracking download:', err);
        res.status(500).send('Error downloading file');
    }
});

// Analytics: Get Download Count
app.get('/api/download-count', async (req, res) => {
    try {
        const database = client.db('portfolio');
        const analytics = database.collection('analytics');
        const stats = await analytics.findOne({ id: 'site_stats' });
        
        res.status(200).json({ count: stats ? stats.download_count : 0 });
    } catch (err) {
        console.error('Error fetching download count:', err);
        res.status(500).json({ success: false });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
