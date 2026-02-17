const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/boutique_shop');
        console.log('MongoDB Connected');

        const adminEmail = 'admin1@gmail.com';
        const adminPassword = '123';
        const adminName = 'Admin User';

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            const newAdmin = new User({
                name: adminName,
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });

            await newAdmin.save();
            console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding admin:', error);
        mongoose.disconnect();
    }
};

seedAdmin();
