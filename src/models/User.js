import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true }, // Unique index might fail if user registers with email only first? Schema says Email & Phone required.
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["user", "admin", "technician"],
            default: "user",
        },
        profileImage: { type: String, default: "" },
        address: { type: String, default: "" }, // Simplified for now as String, can be Object later
        isBlocked: { type: Boolean, default: false },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true }
);

// Prevent re-compilation of model in hot reload
export default mongoose.models.User || mongoose.model("User", UserSchema);
