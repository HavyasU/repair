import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SupportTicket from "@/models/SupportTicket";
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

export async function PATCH(req, { params }) {
    const admin = await getAdmin();
    if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await dbConnect();
    try {
        const { id } = await params;
        const { status } = await req.json();
        const ticket = await SupportTicket.findByIdAndUpdate(id, { status }, { new: true });
        if (!ticket) return NextResponse.json({ message: "Ticket not found" }, { status: 404 });
        return NextResponse.json({ message: "Updated", ticket });
    } catch (e) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
