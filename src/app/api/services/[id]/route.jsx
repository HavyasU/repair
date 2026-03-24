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

// PATCH — update a service
export async function PATCH(req, { params }) {
    const admin = await getAdmin();
    if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    await dbConnect();
    try {
        const { id } = await params;
        const body = await req.json();
        const allowed = ['deviceCategory', 'brand', 'model', 'issue', 'basePrice', 'discount', 'active'];
        const update = {};
        for (const key of allowed) {
            if (body[key] !== undefined) update[key] = body[key];
        }
        const service = await Pricing.findByIdAndUpdate(id, update, { new: true });
        if (!service) return NextResponse.json({ message: 'Not found' }, { status: 404 });
        return NextResponse.json(service);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

// DELETE — remove a service
export async function DELETE(req, { params }) {
    const admin = await getAdmin();
    if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    await dbConnect();
    try {
        const { id } = await params;
        await Pricing.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Deleted' });
    } catch (e) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
