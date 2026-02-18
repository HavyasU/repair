/**
 * Comprehensive Seed Script
 * Run: node scripts/seed-data.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/gadget-fix';

// Schemas
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'technician'], default: 'user' },
    profileImage: { type: String, default: '' },
    address: { type: String, default: '' },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true });

const PricingSchema = new mongoose.Schema({
    deviceCategory: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    issue: { type: String, required: true },
    basePrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
}, { timestamps: true });

PricingSchema.index({ deviceCategory: 1, brand: 1, model: 1, issue: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Seed Users
        const hashedPassword = await bcrypt.hash('admin@123', 10);
        const userPassword = await bcrypt.hash('user@123', 10);

        await User.deleteMany({}); // Clear existing users for a fresh seed

        await User.create([
            {
                name: 'System Admin',
                email: 'admin@gadgetfix.com',
                phone: '9999999999',
                password: hashedPassword,
                role: 'admin'
            },
            {
                name: 'John Doe',
                email: 'user@example.com',
                phone: '8888888888',
                password: userPassword,
                role: 'user',
                address: '123, Tech Park, Bangalore'
            }
        ]);
        console.log('👥 Users seeded');

        // 2. Seed Services (Pricing)
        await Pricing.deleteMany({});

        const services = [
            // Smartphones - Apple
            { deviceCategory: 'Smartphone', brand: 'Apple', model: 'iPhone 14', issue: 'Screen Replacement', basePrice: 12999, discount: 500 },
            { deviceCategory: 'Smartphone', brand: 'Apple', model: 'iPhone 14', issue: 'Battery Replacement', basePrice: 4599, discount: 200 },
            { deviceCategory: 'Smartphone', brand: 'Apple', model: 'iPhone 13', issue: 'Screen Replacement', basePrice: 9999, discount: 300 },
            { deviceCategory: 'Smartphone', brand: 'Apple', model: 'iPhone 13', issue: 'Charging Port Repair', basePrice: 2499, discount: 0 },

            // Smartphones - Samsung
            { deviceCategory: 'Smartphone', brand: 'Samsung', model: 'Galaxy S23', issue: 'Screen Replacement', basePrice: 14999, discount: 1000 },
            { deviceCategory: 'Smartphone', brand: 'Samsung', model: 'Galaxy S23', issue: 'Battery Replacement', basePrice: 3599, discount: 0 },
            { deviceCategory: 'Smartphone', brand: 'Samsung', model: 'Galaxy A54', issue: 'Screen Replacement', basePrice: 5999, discount: 200 },

            // Laptops - Dell
            { deviceCategory: 'Laptop', brand: 'Dell', model: 'XPS 15', issue: 'Battery Replacement', basePrice: 8999, discount: 500 },
            { deviceCategory: 'Laptop', brand: 'Dell', model: 'XPS 15', issue: 'Keyboard Repair', basePrice: 3499, discount: 0 },
            { deviceCategory: 'Laptop', brand: 'Dell', model: 'Inspiron 15', issue: 'Screen Replacement', basePrice: 6599, discount: 300 },

            // Laptops - Apple (MacBook)
            { deviceCategory: 'Laptop', brand: 'Apple', model: 'MacBook Air M2', issue: 'Screen Replacement', basePrice: 24999, discount: 1500 },
            { deviceCategory: 'Laptop', brand: 'Apple', model: 'MacBook Air M2', issue: 'Keyboard Sticky Keys', basePrice: 7999, discount: 0 },

            // Tablets
            { deviceCategory: 'Tablet', brand: 'Apple', model: 'iPad Air 5', issue: 'Screen Replacement', basePrice: 11999, discount: 600 },
            { deviceCategory: 'Tablet', brand: 'Samsung', model: 'Galaxy Tab S8', issue: 'Charging Issue', basePrice: 2999, discount: 100 },

            // Smartwatches
            { deviceCategory: 'Smartwatch', brand: 'Apple', model: 'Watch Series 8', issue: 'Screen Crack', basePrice: 15999, discount: 1000 },
            { deviceCategory: 'Smartwatch', brand: 'Samsung', model: 'Galaxy Watch 6', issue: 'Battery Drain', basePrice: 3999, discount: 0 },

            // Other
            { deviceCategory: 'Other', brand: 'Sony', model: 'PS5 Controller', issue: 'Stick Drift', basePrice: 1499, discount: 0 },
        ];

        await Pricing.insertMany(services);
        console.log('🛠️  Services seeded (' + services.length + ' items)');

        console.log('\n🚀 Seeding completed successfully!');
        console.log('---------------------------------');
        console.log('Admin Email: admin@gadgetfix.com');
        console.log('Admin Pass : admin@123');
        console.log('User Email : user@example.com');
        console.log('User Pass  : user@123');
        console.log('---------------------------------');

    } catch (err) {
        console.error('❌ Seed failed:', err);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seed();
