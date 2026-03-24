'use client';
import { useEffect, useState } from 'react';
import { Typography, Paper, Box, Stack, Grid, CircularProgress, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';


export default function AdminReportsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/admin/stats')
            .then((res) => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const summaryStats = stats ? [
        { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: <MonetizationOnIcon sx={{ fontSize: 28, color: 'white' }} />, gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', shadow: 'rgba(16,185,129,0.4)' },
        { label: 'Total Orders', value: stats.totalBookings, icon: <BuildIcon sx={{ fontSize: 28, color: 'white' }} />, gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', shadow: 'rgba(59,130,246,0.4)' },
        { label: 'Total Users', value: stats.totalUsers, icon: <PeopleIcon sx={{ fontSize: 28, color: 'white' }} />, gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', shadow: 'rgba(245,158,11,0.4)' },
        { label: 'Completed', value: stats.completedBookings, icon: <CheckCircleIcon sx={{ fontSize: 28, color: 'white' }} />, gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', shadow: 'rgba(236,72,153,0.4)' },
    ] : [];

    const completionRate = stats && stats.totalBookings > 0
        ? ((stats.completedBookings / stats.totalBookings) * 100).toFixed(1)
        : 0;

    return (
        <Box>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" fontWeight="900">Reports & Analytics</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Live business performance overview.
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
            ) : (
                <>
                    {/* Summary stats */}
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        {summaryStats.map((stat, i) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                                <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
                                    <Paper sx={{
                                        p: 3.5, borderRadius: 4,
                                        boxShadow: `0 10px 30px -5px ${stat.shadow}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        border: '1px solid rgba(0,0,0,0.04)',
                                        transition: 'box-shadow 0.3s',
                                        '&:hover': { boxShadow: `0 20px 40px -5px ${stat.shadow}` },
                                    }}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 0.5 }}>
                                                {stat.label}
                                            </Typography>
                                            <Typography variant="h4" fontWeight="900">{stat.value}</Typography>
                                        </Box>
                                        <Box sx={{
                                            width: 56, height: 56, borderRadius: '50%',
                                            background: stat.gradient,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: `0 4px 12px ${stat.shadow}`,
                                            flexShrink: 0,
                                        }}>
                                            {stat.icon}
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Breakdown */}
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Box>
                                <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)' }}>
                                    <Typography variant="h6" fontWeight="700" gutterBottom>Order Status Breakdown</Typography>
                                    <Divider sx={{ mb: 3 }} />
                                    <Stack spacing={2.5}>
                                        {[
                                            { label: 'Active (Pending + In Progress)', value: stats?.activeBookings ?? 0, color: '#3b82f6', bg: '#eff6ff', pct: stats?.totalBookings ? ((stats.activeBookings / stats.totalBookings) * 100).toFixed(1) : 0 },
                                            { label: 'Completed', value: stats?.completedBookings ?? 0, color: '#10b981', bg: '#ecfdf5', pct: completionRate },
                                            { label: 'Total Bookings', value: stats?.totalBookings ?? 0, color: '#8b5cf6', bg: '#f5f3ff', pct: 100 },
                                        ].map((s) => (
                                            <Box key={s.label}>
                                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                                    <Typography variant="body2" fontWeight="600">{s.label}</Typography>
                                                    <Stack direction="row" spacing={1}>
                                                        <Typography variant="body2" fontWeight="800" sx={{ color: s.color }}>{s.value}</Typography>
                                                        <Typography variant="body2" color="text.disabled">({s.pct}%)</Typography>
                                                    </Stack>
                                                </Stack>
                                                <Box sx={{ height: 8, borderRadius: 4, bgcolor: s.bg, overflow: 'hidden' }}>
                                                    <Box sx={{
                                                        height: '100%', borderRadius: 4,
                                                        bgcolor: s.color,
                                                        width: `${s.pct}%`,
                                                        transition: 'width 1s ease',
                                                    }} />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Paper>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)' }}>
                                    <Typography variant="h6" fontWeight="700" gutterBottom>Key Metrics</Typography>
                                    <Divider sx={{ mb: 3 }} />
                                    <Stack spacing={3}>
                                        {[
                                            { label: 'Completion Rate', value: `${completionRate}%`, color: '#10b981' },
                                            { label: 'Total Revenue', value: `₹${stats?.totalRevenue?.toLocaleString('en-IN') ?? 0}`, color: '#3b82f6' },
                                            { label: 'Avg. Order Value', value: stats?.totalBookings > 0 ? `₹${Math.round(stats.totalRevenue / stats.totalBookings)}` : '₹0', color: '#8b5cf6' },
                                            { label: 'Registered Users', value: stats?.totalUsers ?? 0, color: '#f59e0b' },
                                        ].map((m) => (
                                            <Stack key={m.label} direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="body2" color="text.secondary">{m.label}</Typography>
                                                <Typography variant="subtitle1" fontWeight="900" sx={{ color: m.color }}>{m.value}</Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
}
