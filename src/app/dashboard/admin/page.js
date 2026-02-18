'use client';
import { useEffect, useState } from 'react';
import { Typography, Grid, Paper, Box, Stack, Skeleton, Divider, Link as MuiLink } from '@mui/material';
import { motion } from 'framer-motion';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NextLink from 'next/link';
import axios from 'axios';

const CARD_DEFS = [
    { title: 'Total Revenue', key: 'totalRevenue', format: (v) => `₹${Number(v).toLocaleString('en-IN')}`, icon: <MonetizationOnIcon sx={{ fontSize: 26, color: 'white' }} />, gradient: 'linear-gradient(135deg,#10b981,#059669)', shadow: 'rgba(16,185,129,0.35)', sub: 'From paid orders' },
    { title: 'Active Repairs', key: 'activeBookings', icon: <BuildIcon sx={{ fontSize: 26, color: 'white' }} />, gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)', shadow: 'rgba(59,130,246,0.35)', sub: 'Pending + In Progress' },
    { title: 'Total Users', key: 'totalUsers', icon: <PeopleIcon sx={{ fontSize: 26, color: 'white' }} />, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', shadow: 'rgba(245,158,11,0.35)', sub: 'Registered customers' },
    { title: 'Completed', key: 'completedBookings', icon: <CheckCircleIcon sx={{ fontSize: 26, color: 'white' }} />, gradient: 'linear-gradient(135deg,#ec4899,#db2777)', shadow: 'rgba(236,72,153,0.35)', sub: 'Successfully repaired' },
];

function StatCard({ def, value, loading }) {
    return (
        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} style={{ height: '100%' }}>
            <Paper sx={{
                p: 3, borderRadius: 4, height: '100%',
                boxShadow: loading ? '0 4px 6px -1px rgba(0,0,0,0.04)' : `0 10px 28px -5px ${def.shadow}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2,
                border: '1px solid rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.3s',
                '&:hover': { boxShadow: `0 20px 40px -5px ${def.shadow}` },
            }}>
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 0.5 }} noWrap>
                        {def.title}
                    </Typography>
                    {loading
                        ? <Skeleton variant="text" width={80} height={48} />
                        : <Typography variant="h4" fontWeight="900">{def.format ? def.format(value) : value}</Typography>
                    }
                    <Typography variant="caption" color="text.disabled">{def.sub}</Typography>
                </Box>
                <Box sx={{
                    width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                    background: def.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 4px 12px ${def.shadow}`,
                    opacity: loading ? 0.4 : 1, transition: 'opacity 0.4s',
                }}>
                    {def.icon}
                </Box>
            </Paper>
        </motion.div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/admin/stats')
            .then((res) => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const completionRate = stats && stats.totalBookings > 0
        ? ((stats.completedBookings / stats.totalBookings) * 100).toFixed(1)
        : '0.0';

    return (
        <Box>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" fontWeight="900">Admin Overview</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Welcome back. Here's what's happening today.
                </Typography>
            </Box>

            {/* Stat cards — always visible, skeleton while loading */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                {CARD_DEFS.map((def) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 'grow' }} key={def.key}>
                        <StatCard def={def} value={stats?.[def.key] ?? 0} loading={loading} />
                    </Grid>
                ))}
            </Grid>

            {/* Bottom row */}
            <Grid container spacing={4}>
                {/* Order breakdown */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)' }}>
                        <Typography variant="h6" fontWeight="700" gutterBottom>Order Status Breakdown</Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Stack spacing={2.5}>
                            {[
                                { label: 'Active (Pending + In Progress)', key: 'activeBookings', color: '#3b82f6', bg: '#eff6ff' },
                                { label: 'Completed', key: 'completedBookings', color: '#10b981', bg: '#ecfdf5' },
                                { label: 'Total Bookings', key: 'totalBookings', color: '#8b5cf6', bg: '#f5f3ff' },
                            ].map((s) => {
                                const val = stats?.[s.key] ?? 0;
                                const total = stats?.totalBookings || 1;
                                const pct = s.key === 'totalBookings' ? 100 : ((val / total) * 100).toFixed(1);
                                return (
                                    <Box key={s.label}>
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                            <Typography variant="body2" fontWeight="600">{s.label}</Typography>
                                            <Stack direction="row" spacing={1}>
                                                {loading
                                                    ? <Skeleton width={40} />
                                                    : <>
                                                        <Typography variant="body2" fontWeight="800" sx={{ color: s.color }}>{val}</Typography>
                                                        <Typography variant="body2" color="text.disabled">({pct}%)</Typography>
                                                    </>
                                                }
                                            </Stack>
                                        </Stack>
                                        <Box sx={{ height: 8, borderRadius: 4, bgcolor: s.bg, overflow: 'hidden' }}>
                                            <Box sx={{
                                                height: '100%', borderRadius: 4, bgcolor: s.color,
                                                width: loading ? '0%' : `${pct}%`,
                                                transition: 'width 0.8s ease',
                                            }} />
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Paper>
                </Grid>

                {/* Key metrics */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)' }}>
                        <Typography variant="h6" fontWeight="700" gutterBottom>Key Metrics</Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Stack spacing={2.5}>
                            {[
                                { label: 'Completion Rate', value: `${completionRate}%`, color: '#10b981' },
                                { label: 'Total Revenue', value: `₹${Number(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`, color: '#3b82f6' },
                                { label: 'Avg. Order Value', value: stats?.totalBookings > 0 ? `₹${Math.round(stats.totalRevenue / stats.totalBookings)}` : '₹0', color: '#8b5cf6' },
                            ].map((m) => (
                                <Stack key={m.label} direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" color="text.secondary">{m.label}</Typography>
                                    {loading
                                        ? <Skeleton width={60} />
                                        : <Typography variant="subtitle1" fontWeight="900" sx={{ color: m.color }}>{m.value}</Typography>
                                    }
                                </Stack>
                            ))}
                        </Stack>
                        <Divider sx={{ my: 2.5 }} />
                        <Stack spacing={1}>
                            <MuiLink component={NextLink} href="/dashboard/admin/orders" underline="hover" sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#3b82f6' }}>→ View All Orders</MuiLink>
                            <MuiLink component={NextLink} href="/dashboard/admin/reports" underline="hover" sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981' }}>→ Full Reports</MuiLink>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
