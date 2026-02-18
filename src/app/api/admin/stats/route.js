import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Booking from "@/models/Booking";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function getAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (!token) return null;
    try {
        const d = jwt.verify(token.value, process.env.JWT_SECRET);
        return d.role === "admin" ? d : null;
    } catch { return null; }
}

export async function GET() {
    const admin = await getAdmin();
    if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await dbConnect();
    try {
        const [totalUsers, totalBookings, completedBookings, revenueAgg] = await Promise.all([
            User.countDocuments({ role: "user" }),
            Booking.countDocuments(),
            Booking.countDocuments({ repairStatus: "Completed" }),
            Booking.aggregate([
                { $match: { paymentStatus: "Paid" } },
                { $group: { _id: null, total: { $sum: "$priceEstimate" } } },
            ]),
        ]);

        const activeBookings = await Booking.countDocuments({
            repairStatus: { $in: ["Pending", "Assigned", "In Progress"] },
        });

        const totalRevenue = revenueAgg[0]?.total || 0;

        return NextResponse.json({
            totalUsers,
            totalBookings,
            completedBookings,
            activeBookings,
            totalRevenue,
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
