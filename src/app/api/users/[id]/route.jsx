import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function getAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (!token) return null;
    try {
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
        return decoded.role === "admin" ? decoded : null;
    } catch { return null; }
}

// PATCH — update user role or block status
export async function PATCH(req, { params }) {
    const admin = await getAdmin();
    if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await dbConnect();
    try {
        const { id } = await params;
        const body = await req.json();
        const allowed = ["role", "isBlocked", "name", "phone", "address"];
        const update = {};
        for (const key of allowed) {
            if (body[key] !== undefined) update[key] = body[key];
        }
        const user = await User.findByIdAndUpdate(id, update, { new: true }).select("-password");
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
        return NextResponse.json({ message: "Updated", user });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// DELETE — remove user
export async function DELETE(req, { params }) {
    const admin = await getAdmin();
    if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await dbConnect();
    try {
        const { id } = await params;
        await User.findByIdAndDelete(id);
        return NextResponse.json({ message: "User deleted" });
    } catch (e) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
