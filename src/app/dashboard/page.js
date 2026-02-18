import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) redirect('/auth/login');

    let role = 'user';
    try {
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
        role = decoded.role;
    } catch (e) {
        redirect('/auth/login');
    }

    if (role === 'admin') redirect('/dashboard/admin');
    if (role === 'technician') redirect('/dashboard/technician');
    redirect('/dashboard/user');
}
