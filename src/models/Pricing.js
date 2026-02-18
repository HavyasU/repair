import mongoose from "mongoose";

const PricingSchema = new mongoose.Schema(
    {
        deviceCategory: { type: String, required: true }, // e.g. Smartphone
        brand: { type: String, required: true }, // e.g. Apple
        model: { type: String, required: true }, // e.g. iPhone 13
        issue: { type: String, required: true }, // e.g. Screen Replacement
        basePrice: { type: Number, required: true },
        discount: { type: Number, default: 0 }, // percentage or flat amount? usually percentage makes sense or flat off
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Compound index for uniqueness
PricingSchema.index({ deviceCategory: 1, brand: 1, model: 1, issue: 1 }, { unique: true });

export default mongoose.models.Pricing || mongoose.model("Pricing", PricingSchema);
