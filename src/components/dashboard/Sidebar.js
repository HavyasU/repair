'use client';
import {
    Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    Divider, Box, IconButton, useMediaQuery, useTheme,
    Typography, Avatar
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

const drawerWidth = 260;

export default function Sidebar({ role }) {
    const { logout, user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = {
        user: [
            { text: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard/user' },
            { text: 'Book Repair', icon: <AddCircleOutlineIcon />, href: '/dashboard/user/book' },
            { text: 'My Bookings', icon: <BuildIcon />, href: '/dashboard/user/repairs' },
            { text: 'Profile', icon: <PersonIcon />, href: '/dashboard/user/profile' },
        ],
        admin: [
            { text: 'Overview', icon: <DashboardIcon />, href: '/dashboard/admin' },
            { text: 'Orders', icon: <BuildIcon />, href: '/dashboard/admin/orders' },
            { text: 'Users', icon: <PeopleIcon />, href: '/dashboard/admin/users' },
            { text: 'Services', icon: <MiscellaneousServicesIcon />, href: '/dashboard/admin/services' },
            { text: 'Reports', icon: <AssessmentIcon />, href: '/dashboard/admin/reports' },
        ],
    };

    const links = menuItems[role] || menuItems.user;

    const drawerContent = (
        <Box sx={{
            height: '100%', display: 'flex', flexDirection: 'column',
            background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
            color: 'white',
        }}>
            {/* Logo */}
            <Box sx={{ px: 3, pt: 3, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <BuildIcon sx={{ fontSize: 30, color: '#60a5fa' }} />
                <Typography variant="h6" fontWeight="900" sx={{ letterSpacing: -0.5 }}>Gadget Fix</Typography>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2 }} />

            {/* User profile */}
            <Box sx={{ px: 3, py: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                    src={user?.profileImage}
                    sx={{
                        bgcolor: 'transparent',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        width: 44, height: 44, fontWeight: 700, fontSize: 18,
                    }}
                >
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <Box sx={{ overflow: 'hidden' }}>
                    <Typography variant="subtitle2" fontWeight="700" noWrap>{user?.name || 'User'}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>
                        {role}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2, mb: 1 }} />

            {/* Nav links */}
            <List sx={{ px: 2, flexGrow: 1 }}>
                {links.map((item) => {
                    const isSelected = pathname === item.href;
                    return (
                        <motion.div key={item.text} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                            <ListItemButton
                                component={Link}
                                href={item.href}
                                selected={isSelected}
                                sx={{
                                    mb: 0.5, borderRadius: 2.5,
                                    bgcolor: isSelected ? 'rgba(59,130,246,0.2) !important' : 'transparent',
                                    color: isSelected ? '#60a5fa' : 'rgba(255,255,255,0.55)',
                                    border: isSelected ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                    },
                                    transition: 'all 0.2s',
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}>{item.icon}</ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{ fontWeight: isSelected ? 700 : 500, fontSize: '0.9rem' }}
                                />
                            </ListItemButton>
                        </motion.div>
                    );
                })}
            </List>

            {/* Logout */}
            <Box sx={{ p: 2 }}>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2 }} />
                <ListItemButton
                    onClick={logout}
                    sx={{
                        borderRadius: 2.5,
                        color: 'rgba(239,68,68,0.8)',
                        '&:hover': { bgcolor: 'rgba(239,68,68,0.1)', color: '#f87171' },
                        transition: 'all 0.2s',
                    }}
                >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <>
            {isMobile && (
                <IconButton
                    onClick={() => setMobileOpen(!mobileOpen)}
                    sx={{
                        position: 'fixed', top: 12, left: 12, zIndex: 1300,
                        bgcolor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        '&:hover': { bgcolor: '#f8fafc' },
                    }}
                >
                    <MenuIcon />
                </IconButton>
            )}
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant={isMobile ? 'temporary' : 'permanent'}
                    open={isMobile ? mobileOpen : true}
                    onClose={() => setMobileOpen(false)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            border: 'none',
                            boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            </Box>
        </>
    );
}
