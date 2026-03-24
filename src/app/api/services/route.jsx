import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Pricing from '@/models/Pricing';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function getAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token) return null;
    try {
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
        return decoded.role === 'admin' ? decoded : null;
    } catch { return null; }
}

// GET — fetch all services (public, used by booking form too)
export async function GET() {
    await dbConnect();
    const services = await Pricing.find().sort({ deviceCategory: 1, createdAt: -1 });
    return NextResponse.json(services);
}

// POST — create a new service (admin only)
export async function POST(req) {
    const admin = await getAdmin();
    if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    await dbConnect();
    try {
        const body = await req.json();
        const { deviceCategory, brand, model, issue, basePrice, discount, active } = body;
        if (!deviceCategory || !brand || !model || !issue || basePrice === undefined) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }
        const service = await Pricing.create({ deviceCategory, brand, model, issue, basePrice, discount: discount ?? 0, active: active ?? true });
        return NextResponse.json(service, { status: 201 });
    } catch (e) {
        if (e.code === 11000) return NextResponse.json({ message: 'This service already exists' }, { status: 409 });
        console.error(e);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
