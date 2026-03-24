'use client';
import { useEffect, useState } from 'react';
import { Typography, Grid, Paper, Box, Stack, Button, Skeleton, Chip, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const STATUS_COLOR = {
    'Out for Pickup': { color: '#f59e0b', bg: '#fffbeb' },
    'Picked Up': { color: '#8b5cf6', bg: '#f5f3ff' },
    'Ready for Delivery': { color: '#10b981', bg: '#ecfdf5' },
    'Out for Delivery': { color: '#3b82f6', bg: '#eff6ff' },
    'Delivered': { color: '#10b981', bg: '#ecfdf5' },
};

export default function DeliveryDashboard() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/bookings')
            .then((res) => setTasks(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const total = tasks.length;
    const pending = tasks.filter((t) => ['Out for Pickup', 'Out for Delivery'].includes(t.repairStatus)).length;
    const completed = tasks.filter((t) => t.repairStatus === 'Delivered' || t.repairStatus === 'Picked Up').length;

    const statCards = [
        { title: 'Total Tasks', value: total, icon: <AssignmentIcon sx={{ fontSize: 26, color: 'white' }} />, gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)', shadow: 'rgba(59,130,246,0.35)' },
        { title: 'In Transit', value: pending, icon: <LocalShippingIcon sx={{ fontSize: 26, color: 'white' }} />, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', shadow: 'rgba(245,158,11,0.35)' },
        { title: 'Completed', value: completed, icon: <CheckCircleIcon sx={{ fontSize: 26, color: 'white' }} />, gradient: 'linear-gradient(135deg,#10b981,#059669)', shadow: 'rgba(16,185,129,0.35)' },
    ];

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" fontWeight="900">
                    Delivery Portal 🚀
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Welcome, {user?.name || 'Partner'}. You have {pending} pending tasks today.
                </Typography>
            </Box>

            {/* Stat cards */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {statCards.map((stat, i) => (
                    <Grid item xs={12} sm={4} key={i}>
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

            {/* Recent tasks */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="700">Recent Assignments</Typography>
                <Button component={Link} href="/dashboard/delivery/tasks" variant="text" sx={{ fontWeight: 600, borderRadius: 50 }}>
                    View All Tasks →
                </Button>
            </Box>

            {loading ? (
                <Stack spacing={2}>
                    {[1, 2, 3].map((n) => (
                        <Paper key={n} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'none' }}>
                            <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 2 }} />
                        </Paper>
                    ))}
                </Stack>
            ) : tasks.length === 0 ? (
                <Paper sx={{
                    p: 8, textAlign: 'center', borderRadius: 4,
                    border: '2px dashed', borderColor: 'divider',
                    bgcolor: 'transparent', boxShadow: 'none',
                }}>
                    <LocalShippingIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" fontWeight="600" gutterBottom>
                        No tasks assigned
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                        Relax! New delivery tasks will appear here.
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={2}>
                    {tasks.slice(0, 5).map((t) => {
                        const style = STATUS_COLOR[t.repairStatus] || { color: '#6b7280', bg: '#f3f4f6' };
                        return (
                            <motion.div key={t._id} whileHover={{ x: 5 }} transition={{ duration: 0.15 }}>
                                <Paper sx={{
                                    p: 3, borderRadius: 4,
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    gap: 2, flexWrap: 'wrap',
                                    '&:hover': { boxShadow: '0 8px 24px -5px rgba(0,0,0,0.08)' },
                                    transition: 'box-shadow 0.3s',
                                }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar sx={{ bgcolor: style.bg, color: style.color }}>
                                            <LocalShippingIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="700">{t.brand} {t.model}</Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                {t.pickupAddress}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <Chip 
                                        label={t.repairStatus} 
                                        size="small" 
                                        sx={{ 
                                            bgcolor: style.bg, 
                                            color: style.color, 
                                            fontWeight: 700,
                                            borderRadius: 2
                                        }} 
                                    />
                                </Paper>
                            </motion.div>
                        );
                    })}
                </Stack>
            )}
        </Box>
    );
}
