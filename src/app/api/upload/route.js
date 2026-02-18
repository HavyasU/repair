import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token) return null;
    try {
        return jwt.verify(token.value, process.env.JWT_SECRET);
    } catch { return null; }
}

export async function POST(req) {
    const decoded = await getUser();
    if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get('image');
        if (!file) return NextResponse.json({ message: 'No file provided' }, { status: 400 });

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ message: 'Only JPG, PNG, WebP or GIF allowed' }, { status: 400 });
        }
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ message: 'File too large (max 5MB)' }, { status: 400 });
        }

        const ext = file.name.split('.').pop();
        const filename = `${decoded.userId}-${Date.now()}.${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        const bytes = await file.arrayBuffer();
        await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

        const imageUrl = `/uploads/${filename}`;

        return NextResponse.json({ imageUrl });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
    }
}
