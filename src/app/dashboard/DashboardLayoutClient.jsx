'use client';
import { Box, Container, Typography } from '@mui/material';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayoutClient({ children, role }) {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f1f5f9' }}>
            <Sidebar role={role} />
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: { sm: `calc(100% - 240px)` } }}>
                <Container maxWidth="xl">
                    {children}
                </Container>
            </Box>
        </Box>
    );
}
