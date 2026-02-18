/**
 * Booking Seed Script
 */

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/gadget-fix';

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deviceCategory: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    issueType: { type: String, required: true },
    description: String,
    pickupAddress: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    repairStatus: {
        type: String,
        enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending',
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'Online'],
        default: 'COD',
    },
    priceEstimate: { type: Number, required: true },
}, { timestamps: true });

const UserSchema = new mongoose.Schema({ email: String });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

async function seedBookings() {
    try {
        await mongoose.connect(MONGODB_URI);
        const user = await User.findOne({ email: 'user@example.com' });
        if (!user) {
            console.log('User not found. Run seed-data.js first.');
            return;
        }

        await Booking.deleteMany({});

        const bookings = [
            {
                userId: user._id,
                deviceCategory: 'Smartphone',
                brand: 'Apple',
                model: 'iPhone 13',
                issueType: 'Screen Replacement',
                description: 'Dropped it yesterday, screen is shattered but touch works.',
                pickupAddress: '123, Tech Park, Bangalore',
                date: '2024-03-25',
                timeSlot: '11:00 AM – 1:00 PM',
                repairStatus: 'In Progress',
                paymentStatus: 'Pending',
                priceEstimate: 9699
            },
            {
                userId: user._id,
                deviceCategory: 'Laptop',
                brand: 'Dell',
                model: 'XPS 15',
                issueType: 'Battery Replacement',
                description: 'Battery dies in 10 minutes.',
                pickupAddress: '123, Tech Park, Bangalore',
                date: '2024-03-20',
                timeSlot: '2:00 PM – 4:00 PM',
                repairStatus: 'Completed',
                paymentStatus: 'Paid',
                priceEstimate: 8499
            },
            {
                userId: user._id,
                deviceCategory: 'Smartwatch',
                brand: 'Apple',
                model: 'Watch Series 8',
                issueType: 'Screen Crack',
                description: 'Small crack on the edge.',
                pickupAddress: '123, Tech Park, Bangalore',
                date: '2024-03-28',
                timeSlot: '9:00 AM – 11:00 AM',
                repairStatus: 'Pending',
                paymentStatus: 'Pending',
                priceEstimate: 14999
            }
        ];

        await Booking.insertMany(bookings);
        console.log('📅 Sample bookings seeded');

    } catch (err) {
        console.error('❌ Booking seed failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seedBookings();
