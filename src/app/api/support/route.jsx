import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SupportTicket from "@/models/SupportTicket";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (!token) return null;
    try { return jwt.verify(token.value, process.env.JWT_SECRET); }
    catch { return null; }
}

export async function POST(req) {
    const session = await getSession();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    try {
        const { subject, message } = await req.json();
        if (!subject || !message) return NextResponse.json({ message: "Subject and message required" }, { status: 400 });
        const ticket = await SupportTicket.create({ userId: session.userId, subject, message });
        return NextResponse.json({ message: "Ticket submitted", ticket }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await dbConnect();
    try {
        const tickets = await SupportTicket.find({}).sort({ createdAt: -1 }).populate("userId", "name email");
        return NextResponse.json(tickets);
    } catch (e) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
