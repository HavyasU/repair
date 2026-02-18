'use client';
import { useEffect, useState } from 'react';
import { Typography, Paper, Box, Stack, Chip, Avatar, Button, Divider, CircularProgress, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import BuildIcon from '@mui/icons-material/Build';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import Link from 'next/link';
import axios from 'axios';


const statusConfig = {
    'Pending': { label: 'Pending', color: '#f59e0b', bg: '#fffbeb', icon: <PendingIcon sx={{ fontSize: 14 }} /> },
    'Assigned': { label: 'Assigned', color: '#8b5cf6', bg: '#f5f3ff', icon: <AccessTimeIcon sx={{ fontSize: 14 }} /> },
    'In Progress': { label: 'In Progress', color: '#3b82f6', bg: '#eff6ff', icon: <AccessTimeIcon sx={{ fontSize: 14 }} /> },
    'Completed': { label: 'Completed', color: '#10b981', bg: '#ecfdf5', icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
    'Cancelled': { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2', icon: <CancelIcon sx={{ fontSize: 14 }} /> },
};

const paymentConfig = {
    'Pending': { label: 'Payment Pending', color: '#f59e0b', bg: '#fffbeb' },
    'Paid': { label: 'Paid', color: '#10b981', bg: '#ecfdf5' },
    'Refunded': { label: 'Refunded', color: '#8b5cf6', bg: '#f5f3ff' },
};

export default function MyRepairs() {
    const [repairs, setRepairs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/bookings')
            .then((res) => setRepairs(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <Box>
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="900">My Repairs</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                        Track the status of all your repair requests.
                    </Typography>
                </Box>
                <Button
                    component={Link}
                    href="/dashboard/user/book"
                    variant="contained"
                    sx={{
                        borderRadius: 50, px: 4, py: 1.5, fontWeight: 700,
                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                        boxShadow: '0 10px 20px -5px rgba(37,99,235,0.4)',
                        '&:hover': { transform: 'translateY(-2px)' },
                        transition: 'all 0.3s',
                    }}
                >
                    + New Repair
                </Button>
            </Box>

            {loading ? (
                <Stack spacing={2}>
                    {[1, 2, 3].map((n) => (
                        <Paper key={n} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'none' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Skeleton variant="circular" width={48} height={48} />
                                    <Box><Skeleton width={160} height={22} /><Skeleton width={100} height={18} /></Box>
                                </Stack>
                                <Skeleton variant="rounded" width={90} height={28} sx={{ borderRadius: 50 }} />
                            </Stack>
                            <Divider sx={{ my: 2 }} />
                            <Skeleton width="60%" height={18} />
                        </Paper>
                    ))}
                </Stack>
            ) : repairs.length === 0 ? (
                <Box>
                    <Paper sx={{
                        p: 10, textAlign: 'center', borderRadius: 4,
                        border: '2px dashed', borderColor: 'divider',
                        bgcolor: 'transparent', boxShadow: 'none',
                    }}>
                        <BuildIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" fontWeight="600" gutterBottom>
                            No repair history yet
                        </Typography>
                        <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                            Once you book a repair, you can track its status here.
                        </Typography>
                        <Button component={Link} href="/dashboard/user/book" variant="outlined" sx={{ borderRadius: 50, px: 4 }}>
                            Book a Repair
                        </Button>
                    </Paper>
                </Box>
            ) : (
                <Stack spacing={2}>
                    {repairs.map((repair) => {
                        const status = statusConfig[repair.repairStatus] || statusConfig['Pending'];
                        const payment = paymentConfig[repair.paymentStatus] || paymentConfig['Pending'];
                        return (
                            <motion.div key={repair._id} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                                <Paper sx={{
                                    p: 3, borderRadius: 4,
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
                                    transition: 'box-shadow 0.3s',
                                    '&:hover': { boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' },
                                }}>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6', width: 48, height: 48 }}>
                                                <BuildIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="700">
                                                    {repair.brand} {repair.model}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {repair.deviceCategory} · {repair.issueType}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            <Chip
                                                icon={status.icon}
                                                label={status.label}
                                                size="small"
                                                sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, borderRadius: 2 }}
                                            />
                                            <Chip
                                                label={payment.label}
                                                size="small"
                                                sx={{ bgcolor: payment.bg, color: payment.color, fontWeight: 700, borderRadius: 2 }}
                                            />
                                        </Stack>
                                    </Stack>
                                    <Divider sx={{ my: 2 }} />
                                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1}>
                                        <Stack direction="row" spacing={3}>
                                            <Box>
                                                <Typography variant="caption" color="text.disabled">Booked</Typography>
                                                <Typography variant="body2" fontWeight="600">
                                                    {new Date(repair.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.disabled">Pickup</Typography>
                                                <Typography variant="body2" fontWeight="600">
                                                    {new Date(repair.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {repair.timeSlot}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.disabled">Payment</Typography>
                                                <Typography variant="body2" fontWeight="600">{repair.paymentMethod}</Typography>
                                            </Box>
                                        </Stack>
                                        <Typography variant="h6" fontWeight="900" color="primary">
                                            ₹{repair.priceEstimate || 0}
                                        </Typography>
                                    </Stack>

                                    {repair.images && repair.images.length > 0 && (
                                        <>
                                            <Divider sx={{ my: 2 }} />
                                            <Box>
                                                <Typography variant="caption" color="text.disabled" sx={{ mb: 1, display: 'block' }}>Device Photos</Typography>
                                                <Stack direction="row" spacing={1}>
                                                    {repair.images.map((img, i) => (
                                                        <Box
                                                            key={i}
                                                            component="img"
                                                            src={img}
                                                            sx={{
                                                                width: 50, height: 50, borderRadius: 1.5,
                                                                objectFit: 'cover', border: '1px solid rgba(0,0,0,0.08)',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => window.open(img, '_blank')}
                                                        />
                                                    ))}
                                                </Stack>
                                            </Box>
                                        </>
                                    )}
                                </Paper>
                            </motion.div>
                        );
                    })}
                </Stack>
            )}
        </Box>
    );
}
