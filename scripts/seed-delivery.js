/**
 * Delivery Boy Seed Script
 * Run: node scripts/seed-delivery.js
 *
 * Creates or updates a delivery boy account in MongoDB.
 * Credentials:
 *   Email:    delivery@mail.com
 *   Password: delivery@123
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/gadget-fix';

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['user', 'admin', 'technician', 'delivery_boy'], default: 'user' },
        profileImage: { type: String, default: '' },
        address: { type: String, default: '' },
        isBlocked: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const hashedPassword = await bcrypt.hash('delivery@123', 10);

        const result = await User.findOneAndUpdate(
            { email: 'delivery@mail.com' },
            {
                name: 'Delivery Partner',
                email: 'delivery@mail.com',
                phone: '8778778778',
                password: hashedPassword,
                role: 'delivery_boy',
                isBlocked: false,
            },
            { upsert: true, new: true }
        );

        console.log('🎉 Delivery boy account ready!');
        console.log('   Email:    delivery@mail.com');
        console.log('   Password: delivery@123');
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seed();
