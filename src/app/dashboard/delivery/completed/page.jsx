'use client';
import { useEffect, useState } from 'react';
import { Typography, Paper, Box, Stack, Avatar, Chip, Divider, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import axios from 'axios';

export default function DeliveryCompletedPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/bookings')
            .then((res) => setTasks(res.data.filter(t => t.repairStatus === 'Delivered' || t.repairStatus === 'Picked Up')))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <Box>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" fontWeight="900">Task History</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Your completed pickups and deliveries.
                </Typography>
            </Box>

            {loading ? (
                <Stack spacing={2}>
                    <CircularProgress />
                </Stack>
            ) : tasks.length === 0 ? (
                <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 4, border: '2px dashed #cbd5e1' }}>
                    <AssignmentTurnedInIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">No completed tasks yet.</Typography>
                </Paper>
            ) : (
                <Stack spacing={2}>
                    {tasks.map((task) => (
                        <motion.div key={task._id} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                            <Paper sx={{ 
                                p: 3, borderRadius: 4, 
                                border: '1px solid rgba(0,0,0,0.05)',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                gap: 2, flexWrap: 'wrap',
                                '&:hover': { boxShadow: '0 8px 24px -5px rgba(0,0,0,0.08)' },
                                transition: 'box-shadow 0.3s',
                            }}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="800">{task.brand} {task.model}</Typography>
                                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
                                        {task._id.slice(-6).toUpperCase()} · {new Date(task.updatedAt).toLocaleDateString('en-IN')}
                                    </Typography>
                                </Box>
                                <Chip 
                                    label={task.repairStatus} 
                                    size="small" 
                                    sx={{ 
                                        bgcolor: task.repairStatus === 'Delivered' ? '#ecfdf5' : '#f5f3ff', 
                                        color: task.repairStatus === 'Delivered' ? '#10b981' : '#8b5cf6', 
                                        fontWeight: 800,
                                        borderRadius: 2
                                    }} 
                                />
                            </Paper>
                        </motion.div>
                    ))}
                </Stack>
            )}
        </Box>
    );
}
