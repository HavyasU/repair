import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (!token) return null;
    try {
        return jwt.verify(token.value, process.env.JWT_SECRET);
    } catch {
        return null;
    }
}

// GET — user gets their own bookings, admin gets all
export async function GET(req) {
    const session = await getSession();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();

    try {
        const query = session.role === "admin" ? {} : { userId: session.userId };
        const bookings = await Booking.find(query)
            .sort({ createdAt: -1 })
            .populate("userId", "name email phone");

        return NextResponse.json(bookings);
    } catch (e) {
        console.error("GET /api/bookings error:", e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// POST — create a new booking
export async function POST(req) {
    const session = await getSession();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();

    try {
        const body = await req.json();
        const {
            deviceCategory, brand, model, issueType,
            description, images, pickupAddress, date, timeSlot,
            paymentMethod, priceEstimate,
        } = body;

        if (!deviceCategory || !brand || !model || !issueType || !pickupAddress || !date || !timeSlot || !paymentMethod) {
            return NextResponse.json({ message: "All required fields must be filled" }, { status: 400 });
        }

        const booking = await Booking.create({
            userId: session.userId,
            deviceCategory,
            brand,
            model,
            issueType,
            description,
            images: images || [],
            pickupAddress,
            date: new Date(date),
            timeSlot,
            paymentMethod,
            priceEstimate: priceEstimate || 0,
        });

        return NextResponse.json({ message: "Booking created", booking }, { status: 201 });
    } catch (e) {
        console.error("POST /api/bookings error:", e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
