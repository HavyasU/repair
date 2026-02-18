'use client';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, useScrollTrigger, CircularProgress } from "@mui/material";
import Link from "next/link";
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { user, logout, loading } = useAuth();

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 10,
    });

    const dashboardHref = user?.role === 'admin'
        ? '/dashboard/admin'
        : user?.role === 'technician'
            ? '/dashboard/technician'
            : '/dashboard/user';

    return (
        <AppBar
            position="sticky"
            elevation={trigger ? 4 : 0}
            sx={{
                bgcolor: trigger ? 'rgba(255,255,255,0.92)' : 'transparent',
                backdropFilter: 'blur(10px)',
                borderBottom: trigger ? '1px solid rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.3s ease',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box
                    component={Link}
                    href="/"
                    sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 1 }}
                >
                    <BuildCircleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(45deg, #2563eb 30%, #ec4899 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.5px'
                        }}
                    >
                        Gadget Fix
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button component={Link} href="/" sx={{ color: 'text.primary', fontWeight: 500 }}>Home</Button>
                    <Button component={Link} href="/services" sx={{ color: 'text.primary', fontWeight: 500 }}>Services</Button>

                    {loading ? (
                        <CircularProgress size={22} sx={{ mx: 1 }} />
                    ) : user ? (
                        <>
                            <Button
                                component={Link}
                                href={dashboardHref}
                                variant="outlined"
                                startIcon={<DashboardIcon />}
                                sx={{ borderRadius: 2, fontWeight: 600, border: '1.5px solid', px: 3 }}
                            >
                                Dashboard
                            </Button>
                            <Button
                                onClick={logout}
                                variant="contained"
                                startIcon={<LogoutIcon />}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    background: 'linear-gradient(45deg, #ef4444 30%, #f97316 90%)',
                                    px: 3
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                component={Link}
                                href="/auth/login"
                                variant="outlined"
                                sx={{ borderRadius: 2, fontWeight: 600, border: '1.5px solid', px: 3 }}
                            >
                                Login
                            </Button>
                            <Button
                                component={Link}
                                href="/auth/register"
                                variant="contained"
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
                                    px: 3
                                }}
                            >
                                Book Now
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
