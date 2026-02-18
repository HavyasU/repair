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

// PATCH — update booking status (admin only)
export async function PATCH(req, { params }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (session.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await dbConnect();

    try {
        const { id } = await params;
        const body = await req.json();
        const { repairStatus, paymentStatus, technicianId } = body;

        const update = {};
        if (repairStatus) update.repairStatus = repairStatus;
        if (paymentStatus) update.paymentStatus = paymentStatus;
        if (technicianId) update.technicianId = technicianId;

        const booking = await Booking.findByIdAndUpdate(id, update, { new: true });
        if (!booking) return NextResponse.json({ message: "Booking not found" }, { status: 404 });

        return NextResponse.json({ message: "Updated", booking });
    } catch (e) {
        console.error("PATCH /api/bookings/[id] error:", e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// DELETE — cancel booking (user can cancel their own, admin can cancel any)
export async function DELETE(req, { params }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();

    try {
        const { id } = await params;
        const booking = await Booking.findById(id);
        if (!booking) return NextResponse.json({ message: "Booking not found" }, { status: 404 });

        // Users can only cancel their own bookings
        if (session.role !== "admin" && booking.userId.toString() !== session.userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await Booking.findByIdAndUpdate(id, { repairStatus: "Cancelled" });
        return NextResponse.json({ message: "Booking cancelled" });
    } catch (e) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
