import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role");
        const query = role ? { role } : {};
        const users = await User.find(query).sort({ createdAt: -1 }).select("-password");
        return NextResponse.json(users);
    } catch (e) {
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
