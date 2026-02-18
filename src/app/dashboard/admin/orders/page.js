'use client';
import { useEffect, useState } from 'react';
import {
    Typography, Paper, Box, Stack, Chip, Avatar, Button,
    Divider, CircularProgress, MenuItem, Select, FormControl,
    Dialog, DialogTitle, DialogContent, DialogActions, Alert, Skeleton
} from '@mui/material';
import { motion } from 'framer-motion';
import BuildIcon from '@mui/icons-material/Build';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const repairStatuses = ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'];
const paymentStatuses = ['Pending', 'Paid', 'Refunded'];

const repairColors = {
    'Pending': { color: '#f59e0b', bg: '#fffbeb' },
    'Assigned': { color: '#8b5cf6', bg: '#f5f3ff' },
    'In Progress': { color: '#3b82f6', bg: '#eff6ff' },
    'Completed': { color: '#10b981', bg: '#ecfdf5' },
    'Cancelled': { color: '#ef4444', bg: '#fef2f2' },
};

const paymentColors = {
    'Pending': { color: '#f59e0b', bg: '#fffbeb' },
    'Paid': { color: '#10b981', bg: '#ecfdf5' },
    'Refunded': { color: '#8b5cf6', bg: '#f5f3ff' },
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editOrder, setEditOrder] = useState(null);
    const [editRepairStatus, setEditRepairStatus] = useState('');
    const [editPaymentStatus, setEditPaymentStatus] = useState('');
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const fetchOrders = () => {
        setLoading(true);
        axios.get('/api/bookings')
            .then((res) => setOrders(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchOrders(); }, []);

    const openEdit = (order) => {
        setEditOrder(order);
        setEditRepairStatus(order.repairStatus);
        setEditPaymentStatus(order.paymentStatus);
        setSuccessMsg('');
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.patch(`/api/bookings/${editOrder._id}`, {
                repairStatus: editRepairStatus,
                paymentStatus: editPaymentStatus,
            });
            setSuccessMsg('Order updated successfully!');
            fetchOrders();
            setTimeout(() => { setEditOrder(null); setSuccessMsg(''); }, 1200);
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" fontWeight="900">Orders</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Manage all repair orders and update their status.
                </Typography>
            </Box>

            {loading ? (
                <Stack spacing={2}>
                    {[1, 2, 3].map((n) => (
                        <Paper key={n} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'none' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Skeleton variant="circular" width={48} height={48} />
                                    <Box><Skeleton width={180} height={22} /><Skeleton width={120} height={18} /></Box>
                                </Stack>
                                <Skeleton variant="rounded" width={100} height={32} sx={{ borderRadius: 50 }} />
                            </Stack>
                            <Divider sx={{ my: 2 }} />
                            <Skeleton width="70%" height={18} />
                        </Paper>
                    ))}
                </Stack>
            ) : orders.length === 0 ? (
                <Paper sx={{
                    p: 10, textAlign: 'center', borderRadius: 4,
                    border: '2px dashed', borderColor: 'divider',
                    bgcolor: 'transparent', boxShadow: 'none',
                }}>
                    <BuildIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" fontWeight="600" gutterBottom>
                        No orders yet
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                        Repair orders will appear here once customers start booking.
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={2}>
                    {orders.map((order) => {
                        const rs = repairColors[order.repairStatus] || repairColors['Pending'];
                        const ps = paymentColors[order.paymentStatus] || paymentColors['Pending'];
                        return (
                            <motion.div key={order._id} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
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
                                                    {order.brand} {order.model}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {order.deviceCategory} · {order.issueType}
                                                </Typography>
                                                {order.userId && (
                                                    <Typography variant="caption" color="text.disabled">
                                                        Customer: {order.userId.name} ({order.userId.email})
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Stack>
                                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                            <Chip label={order.repairStatus} size="small" sx={{ bgcolor: rs.bg, color: rs.color, fontWeight: 700, borderRadius: 2 }} />
                                            <Chip label={order.paymentStatus} size="small" sx={{ bgcolor: ps.bg, color: ps.color, fontWeight: 700, borderRadius: 2 }} />
                                            <Typography variant="subtitle1" fontWeight="900" color="primary">₹{order.priceEstimate || 0}</Typography>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<EditIcon />}
                                                onClick={() => openEdit(order)}
                                                sx={{ borderRadius: 50, fontWeight: 600, ml: 1 }}
                                            >
                                                Update
                                            </Button>
                                        </Stack>
                                    </Stack>
                                    <Divider sx={{ my: 2 }} />
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                        <Box>
                                            <Typography variant="caption" color="text.disabled">Booked</Typography>
                                            <Typography variant="body2" fontWeight="600">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.disabled">Pickup</Typography>
                                            <Typography variant="body2" fontWeight="600">
                                                {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {order.timeSlot}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.disabled">Address</Typography>
                                            <Typography variant="body2" fontWeight="600">{order.pickupAddress}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.disabled">Payment Method</Typography>
                                            <Typography variant="body2" fontWeight="600">{order.paymentMethod}</Typography>
                                        </Box>
                                    </Stack>

                                    {order.images && order.images.length > 0 && (
                                        <>
                                            <Divider sx={{ my: 2 }} />
                                            <Box>
                                                <Typography variant="caption" color="text.disabled" sx={{ mb: 1, display: 'block' }}>Device Photos</Typography>
                                                <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 0.5 }}>
                                                    {order.images.map((img, i) => (
                                                        <Box
                                                            key={i}
                                                            component="img"
                                                            src={img}
                                                            sx={{
                                                                width: 80, height: 80, borderRadius: 2,
                                                                objectFit: 'cover', border: '1px solid rgba(0,0,0,0.08)',
                                                                cursor: 'pointer',
                                                                '&:hover': { transform: 'scale(1.05)', transition: '0.2s' }
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

            {/* Edit Dialog */}
            <Dialog open={!!editOrder} onClose={() => setEditOrder(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Update Order Status</DialogTitle>
                <DialogContent>
                    {successMsg && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{successMsg}</Alert>}
                    {editOrder && (
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    {editOrder.brand} {editOrder.model} — {editOrder.issueType}
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    ₹{editOrder.priceEstimate || 0} · {editOrder.paymentMethod}
                                </Typography>
                            </Box>
                            <FormControl fullWidth>
                                <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1 }}>Repair Status</Typography>
                                <Select value={editRepairStatus} onChange={(e) => setEditRepairStatus(e.target.value)} sx={{ borderRadius: 2 }}>
                                    {repairStatuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1 }}>Payment Status</Typography>
                                <Select value={editPaymentStatus} onChange={(e) => setEditPaymentStatus(e.target.value)} sx={{ borderRadius: 2 }}>
                                    {paymentStatuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={() => setEditOrder(null)} variant="outlined" sx={{ borderRadius: 50, px: 3 }}>Cancel</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                        sx={{ borderRadius: 50, px: 3, fontWeight: 700, background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
