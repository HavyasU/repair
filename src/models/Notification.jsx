import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        type: { type: String, enum: ["Info", "Success", "Warning", "Error", "Booking"], default: "Info" },
        isRead: { type: Boolean, default: false },
        link: { type: String }, // Optional link to redirect
    },
    { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
