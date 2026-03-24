import mongoose from "mongoose";

const TechnicianSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        commissionRate: { type: Number, default: 0 },
        assignedBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
        completedBookings: { type: Number, default: 0 },
        specializations: [String], // Extra: Categories they can repair basically
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    },
    { timestamps: true }
);

export default mongoose.models.Technician || mongoose.model("Technician", TechnicianSchema);
