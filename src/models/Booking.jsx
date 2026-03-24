import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        deviceCategory: { type: String, required: true }, // Mobile, Laptop, etc.
        brand: { type: String, required: true },
        model: { type: String, required: true },
        issueType: { type: String, required: true },
        description: { type: String },
        images: [{ type: String }],
        pickupAddress: { type: String, required: true },
        date: { type: Date, required: true },
        timeSlot: { type: String, required: true },
        priceEstimate: { type: Number },
        paymentMethod: { type: String, enum: ["COD", "Online"], required: true },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Refunded"],
            default: "Pending",
        },
        repairStatus: {
            type: String,
            enum: ["Pending", "Assigned", "In Progress", "Completed", "Cancelled", "Out for Pickup", "Picked Up", "Ready for Delivery", "Out for Delivery", "Delivered"],
            default: "Pending",
        },
        technicianId: { type: mongoose.Schema.Types.ObjectId, ref: "Technician" },
        deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
