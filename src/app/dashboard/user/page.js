'use client';
import { useEffect, useState } from 'react';
import { Typography, Grid, Paper, Box, Stack, Button, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const STATUS_COLOR = {
    'Pending': '#f59e0b',
    'Assigned': '#8b5cf6',
    'In Progress': '#3b82f6',
    'Completed': '#10b981',
    'Cancelled': '#ef4444',
};

export default function UserDashboard() {
    const { user } = useAuth();
    const [repairs, setRepairs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/bookings')
            .then((res) => setRepairs(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const total = repairs.length;
    const active = repairs.filter((r) => ['Pending', 'Assigned', 'In Progress'].includes(r.repairStatus)).length;
    const completed = repairs.filter((r) => r.repairStatus === 'Completed').length;

    const statCards = [
        { title: 'Total Repairs', value: total, icon: <BuildIcon sx={{ fontSize: 26, color: 'white' }} />, gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)', shadow: 'rgba(59,130,246,0.35)' },
        { title: 'Active', value: active, icon: <AccessTimeIcon sx={{ fontSize: 26, color: 'white' }} />, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', shadow: 'rgba(245,158,11,0.35)' },
        { title: 'Completed', value: completed, icon: <CheckCircleIcon sx={{ fontSize: 26, color: 'white' }} />, gradient: 'linear-gradient(135deg,#10b981,#059669)', shadow: 'rgba(16,185,129,0.35)' },
    ];

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="900">
                        Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                        Here's a summary of your repair activity.
                    </Typography>
                </Box>
                <Button
                    component={Link}
                    href="/dashboard/user/book"
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{
                        borderRadius: 50, px: 4, py: 1.5, fontWeight: 700,
                        background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                        boxShadow: '0 10px 20px -5px rgba(37,99,235,0.4)',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 30px -5px rgba(37,99,235,0.5)' },
                        transition: 'all 0.3s',
                    }}
                >
                    Book a Repair
                </Button>
            </Box>

            {/* Stat cards — always visible */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {statCards.map((stat, i) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={i}>
                        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                            <Paper sx={{
                                p: 3.5, borderRadius: 4,
                                boxShadow: loading ? '0 4px 6px -1px rgba(0,0,0,0.04)' : `0 10px 28px -5px ${stat.shadow}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                border: '1px solid rgba(0,0,0,0.04)',
                                transition: 'box-shadow 0.4s',
                                '&:hover': { boxShadow: `0 20px 40px -5px ${stat.shadow}` },
                            }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 0.5 }}>
                                        {stat.title}
                                    </Typography>
                                    {loading
                                        ? <Skeleton variant="text" width={60} height={52} />
                                        : <Typography variant="h4" fontWeight="900">{stat.value}</Typography>
                                    }
                                </Box>
                                <Box sx={{
                                    width: 52, height: 52, borderRadius: '50%',
                                    background: stat.gradient,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: `0 4px 12px ${stat.shadow}`,
                                    opacity: loading ? 0.4 : 1, transition: 'opacity 0.4s',
                                    flexShrink: 0,
                                }}>
                                    {stat.icon}
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Recent repairs */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="700">Recent Repairs</Typography>
                <Button component={Link} href="/dashboard/user/repairs" variant="text" sx={{ fontWeight: 600, borderRadius: 50 }}>
                    View All →
                </Button>
            </Box>

            {loading ? (
                <Stack spacing={2}>
                    {[1, 2, 3].map((n) => (
                        <Paper key={n} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'none' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width="40%" height={24} />
                                    <Skeleton variant="text" width="25%" height={18} />
                                </Box>
                                <Skeleton variant="rounded" width={80} height={28} sx={{ borderRadius: 50 }} />
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            ) : repairs.length === 0 ? (
                <Paper sx={{
                    p: 8, textAlign: 'center', borderRadius: 4,
                    border: '2px dashed', borderColor: 'divider',
                    bgcolor: 'transparent', boxShadow: 'none',
                }}>
                    <BuildIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" fontWeight="600" gutterBottom>
                        No repairs yet
                    </Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                        Book your first repair and track it here.
                    </Typography>
                    <Button component={Link} href="/dashboard/user/book" variant="outlined" sx={{ borderRadius: 50, px: 4 }}>
                        Book Now
                    </Button>
                </Paper>
            ) : (
                <Stack spacing={2}>
                    {repairs.slice(0, 4).map((r) => {
                        const color = STATUS_COLOR[r.repairStatus] || '#6b7280';
                        return (
                            <motion.div key={r._id} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                                <Paper sx={{
                                    p: 3, borderRadius: 4,
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
                                    transition: 'box-shadow 0.3s',
                                    '&:hover': { boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' },
                                }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="700">
                                                {r.brand} {r.model}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {r.issueType} · {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </Typography>
                                        </Box>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Typography variant="subtitle2" fontWeight="800" color="primary">
                                                ₹{r.priceEstimate || 0}
                                            </Typography>
                                            <Box sx={{
                                                px: 1.5, py: 0.4, borderRadius: 50,
                                                bgcolor: `${color}18`, color,
                                                fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap',
                                            }}>
                                                {r.repairStatus}
                                            </Box>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            </motion.div>
                        );
                    })}
                </Stack>
            )}
        </Box>
    );
}
