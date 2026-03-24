'use client';
import { useEffect, useState } from 'react';
import { 
    Typography, Paper, Box, Stack, Button, CircularProgress, 
    Chip, Divider, Alert, Avatar, Grid, Menu, MenuItem, IconButton 
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion, AnimatePresence } from 'framer-motion';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

const STATUS_ACTIONS = {
    'Assigned': { 
        next: 'Out for Pickup', 
        label: 'Start Pickup Run', 
        color: '#f59e0b', 
        bg: '#fffbeb', 
        icon: <LocalShippingIcon /> 
    },
    'Out for Pickup': { 
        next: 'Picked Up', 
        label: 'Mark as Picked Up', 
        color: '#8b5cf6', 
        bg: '#f5f3ff', 
        icon: <CheckCircleOutlineIcon /> 
    },
    'Ready for Delivery': { 
        next: 'Out for Delivery', 
        label: 'Out for Delivery', 
        color: '#3b82f6', 
        bg: '#eff6ff', 
        icon: <LocalShippingIcon /> 
    },
    'Out for Delivery': { 
        next: 'Delivered', 
        label: 'Mark as Delivered', 
        color: '#10b981', 
        bg: '#ecfdf5', 
        icon: <CheckCircleOutlineIcon /> 
    },
};

const STATUS_STYLE = {
    'Out for Pickup': { color: '#f59e0b', bg: '#fffbeb' },
    'Picked Up': { color: '#8b5cf6', bg: '#f5f3ff' },
    'Ready for Delivery': { color: '#10b981', bg: '#ecfdf5' },
    'Out for Delivery': { color: '#3b82f6', bg: '#eff6ff' },
    'Delivered': { color: '#10b981', bg: '#ecfdf5' },
};

export default function DeliveryTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [success, setSuccess] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    const manualStatuses = ['Assigned', 'Out for Pickup', 'Picked Up', 'Ready for Delivery', 'Out for Delivery', 'Delivered'];

    const handleMenuOpen = (event, task) => {
        setAnchorEl(event.currentTarget);
        setSelectedTask(task);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedTask(null);
    };

    const fetchTasks = () => {
        setLoading(true);
        axios.get('/api/bookings')
            .then((res) => setTasks(res.data.filter(t => t.repairStatus !== 'Delivered')))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchTasks(); }, []);

    const handleUpdate = async (taskId, updates) => {
        setUpdating(taskId);
        try {
            await axios.patch(`/api/bookings/${taskId}`, updates);
            setSuccess(`Updated successfully!`);
            setTimeout(() => setSuccess(''), 3000);
            fetchTasks();
        } catch (e) {
            console.error(e);
        } finally {
            setUpdating(null);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" fontWeight="900">Active Tasks</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Manage your pickups and deliveries in real-time.
                </Typography>
            </Box>

            <AnimatePresence>
                {success && (
                    <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}>
                        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <Stack spacing={2}>
                    {[1, 2].map((n) => <Paper key={n} sx={{ p: 4, borderRadius: 4, height: 200 }}><CircularProgress /></Paper>)}
                </Stack>
            ) : tasks.length === 0 ? (
                <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 4, border: '2px dashed #cbd5e1' }}>
                    <LocalShippingIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">No active tasks assigned.</Typography>
                </Paper>
            ) : (
                <Stack spacing={3}>
                    {tasks.map((task) => {
                        const action = STATUS_ACTIONS[task.repairStatus];
                        const style = STATUS_STYLE[task.repairStatus] || { color: '#64748b', bg: '#f1f5f9' };
                        return (
                            <Paper key={task._id} sx={{ 
                                p: 3, borderRadius: 4, 
                                border: '1px solid rgba(0,0,0,0.05)',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
                                '&:hover': { boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' },
                                transition: '0.3s'
                            }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={8}>
                                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                            <Chip 
                                                label={task.repairStatus} 
                                                size="small" 
                                                sx={{ bgcolor: style.bg, color: style.color, fontWeight: 800, px: 1 }} 
                                            />
                                            <Typography variant="caption" color="text.disabled">
                                                Task ID: {task._id.slice(-6).toUpperCase()}
                                            </Typography>
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, task)} sx={{ p: 0.5 }}>
                                                <MoreVertIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                        
                                        <Typography variant="h6" fontWeight="800" gutterBottom>
                                            {task.brand} {task.model}
                                        </Typography>
                                        
                                        <Stack spacing={1.5} sx={{ mt: 2 }}>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#eff6ff', color: '#3b82f6' }}>
                                                    <LocationOnIcon sx={{ fontSize: 18 }} />
                                                </Avatar>
                                                <Typography variant="body2" fontWeight="600">{task.pickupAddress}</Typography>
                                            </Stack>
                                            
                                            {task.userId && (
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#f0fdf4', color: '#16a34a' }}>
                                                        <PhoneIcon sx={{ fontSize: 18 }} />
                                                    </Avatar>
                                                    <Typography variant="body2" fontWeight="600">
                                                        {task.userId.name} · {task.userId.phone || 'N/A'}
                                                    </Typography>
                                                </Stack>
                                            )}
                                        </Stack>
                                    </Grid>
                                    
                                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        {task.paymentStatus === 'Pending' && (
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="success"
                                                onClick={() => handleUpdate(task._id, { paymentStatus: 'Paid' })}
                                                disabled={updating === task._id}
                                                sx={{ borderRadius: 3, py: 1, fontWeight: 700 }}
                                            >
                                                Mark as Paid (COD)
                                            </Button>
                                        )}
                                        {task.paymentStatus === 'Paid' && (
                                            <Chip label="Paid" color="success" size="small" sx={{ fontWeight: 800, borderRadius: 1 }} />
                                        )}
                                        
                                        {action && (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={() => handleUpdate(task._id, { repairStatus: action.next })}
                                                disabled={updating === task._id}
                                                startIcon={updating === task._id ? <CircularProgress size={16} /> : action.icon}
                                                sx={{ 
                                                    borderRadius: 3, py: 1.5, fontWeight: 700,
                                                    bgcolor: action.color,
                                                    '&:hover': { bgcolor: action.color, opacity: 0.9 },
                                                    boxShadow: `0 8px 16px -4px ${action.color}40`
                                                }}
                                            >
                                                {action.label}
                                            </Button>
                                        )}
                                        {!action && (
                                            <Typography variant="caption" color="text.disabled" fontWeight="600">
                                                Awaiting next step from admin
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            </Paper>
                        );
                    })}
                </Stack>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}
            >
                <Typography variant="overline" sx={{ px: 2, fontWeight: 800, color: 'text.disabled' }}>Update Status</Typography>
                {manualStatuses.map((s) => (
                    <MenuItem key={s} onClick={() => {
                        handleUpdate(selectedTask._id, { repairStatus: s });
                        handleMenuClose();
                    }} sx={{ fontSize: '0.85rem' }}>
                        {s}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}
