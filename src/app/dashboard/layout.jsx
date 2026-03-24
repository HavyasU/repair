import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from './DashboardLayoutClient';
import jwt from 'jsonwebtoken';

async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token) return null;
    try {
        return jwt.verify(token.value, process.env.JWT_SECRET);
    } catch (e) {
        return null;
    }
}

export default async function DashboardLayout({ children }) {
    const session = await getSession();

    if (!session) {
        redirect('/auth/login');
    }

    return (
        <DashboardLayoutClient role={session.role}>
            {children}
        </DashboardLayoutClient>
    );
}
