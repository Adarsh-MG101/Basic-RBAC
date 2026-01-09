const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Needed for seeding
const User = require('./models/User'); // Needed for seeding

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // Simplified connection for Mongoose 6+
        console.log('MongoDB Connected');

        // Seed Admin
        await seedAdmin();
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const seedAdmin = async () => {
    try {
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('No admin found, seeding default admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

            admin = new User({
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                role: 'admin'
            });

            await admin.save();
            console.log('Admin seeded!');
        } else {
            console.log('Admin already exists.');
        }
    } catch (err) {
        console.error('Seeding admin failed:', err.message);
    }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
