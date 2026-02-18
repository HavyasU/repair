/**
 * Admin Seed Script
 * Run: node scripts/seed-admin.js
 *
 * Creates or updates the default admin account in MongoDB.
 * Admin credentials:
 *   Email:    admin@gadgetfix.com
 *   Password: admin@1234
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
        role: { type: String, enum: ['user', 'admin', 'technician'], default: 'user' },
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

        const hashedPassword = await bcrypt.hash('admin@1234', 10);

        const result = await User.findOneAndUpdate(
            { email: 'admin@gadgetfix.com' },
            {
                name: 'Admin',
                email: 'admin@gadgetfix.com',
                phone: '9999999999',
                password: hashedPassword,
                role: 'admin',
                isBlocked: false,
            },
            { upsert: true, new: true }
        );

        console.log('🎉 Admin account ready!');
        console.log('   Email:    admin@gadgetfix.com');
        console.log('   Password: admin@1234');
        console.log('\n⚠️  Change the password after first login!');
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seed();
