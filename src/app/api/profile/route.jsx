import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (!token) return null;
    try { return jwt.verify(token.value, process.env.JWT_SECRET); }
    catch { return null; }
}

export async function PATCH(req) {
    const session = await getSession();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    try {
        const body = await req.json();
        const { name, phone, address, profileImage } = body;
        const update = {};
        if (name) update.name = name;
        if (phone) update.phone = phone;
        if (address !== undefined) update.address = address;
        if (profileImage !== undefined) update.profileImage = profileImage;

        const user = await User.findByIdAndUpdate(session.userId, update, { new: true }).select("-password");
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
        return NextResponse.json({ message: "Profile updated", user });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
