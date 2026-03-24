'use client';
import { useEffect, useState } from 'react';
import {
    Typography, Paper, Box, Stack, Chip, Avatar, CircularProgress,
    Select, MenuItem, FormControl, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import axios from 'axios';


const statusConfig = {
    'Open': { color: '#f59e0b', bg: '#fffbeb' },
    'In Progress': { color: '#3b82f6', bg: '#eff6ff' },
    'Resolved': { color: '#10b981', bg: '#ecfdf5' },
    'Closed': { color: '#6b7280', bg: '#f3f4f6' },
};

export default function AdminSupportPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editTicket, setEditTicket] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const fetchTickets = () => {
        setLoading(true);
        axios.get('/api/support')
            .then((res) => setTickets(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchTickets(); }, []);

    const openEdit = (t) => { setEditTicket(t); setNewStatus(t.status); setMsg(''); };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.patch(`/api/support/${editTicket._id}`, { status: newStatus });
            setMsg('Updated!');
            fetchTickets();
            setTimeout(() => setEditTicket(null), 900);
        } catch { setMsg('Failed to update.'); }
        finally { setSaving(false); }
    };

    return (
        <Box>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" fontWeight="900">Support Tickets</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Manage all customer support requests.
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
            ) : tickets.length === 0 ? (
                <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 4, border: '2px dashed', borderColor: 'divider', bgcolor: 'transparent', boxShadow: 'none' }}>
                    <SupportAgentIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" fontWeight="600">No support tickets yet</Typography>
                </Paper>
            ) : (
                <Stack spacing={2}>
                    {tickets.map((t) => {
                        const sc = statusConfig[t.status] || statusConfig['Open'];
                        return (
                            <motion.div key={t._id} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                                <Paper sx={{
                                    p: 3, borderRadius: 4,
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
                                    transition: 'box-shadow 0.3s',
                                    '&:hover': { boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' },
                                }}>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2}>
                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                            <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6', mt: 0.5 }}>
                                                <SupportAgentIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="700">{t.subject}</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{t.message}</Typography>
                                                <Typography variant="caption" color="text.disabled">
                                                    From: {t.userId?.name || 'Unknown'} ({t.userId?.email}) ·{' '}
                                                    {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <Stack direction="row" spacing={1.5} alignItems="center" flexShrink={0}>
                                            <Chip label={t.status} size="small" sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 700, borderRadius: 2 }} />
                                            <Button size="small" variant="outlined" onClick={() => openEdit(t)} sx={{ borderRadius: 50, fontWeight: 600 }}>
                                                Update
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            </motion.div>
                        );
                    })}
                </Stack>
            )}

            <Dialog open={!!editTicket} onClose={() => setEditTicket(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Update Ticket Status</DialogTitle>
                <DialogContent>
                    {msg && <Alert severity={msg === 'Updated!' ? 'success' : 'error'} sx={{ mb: 2, borderRadius: 2 }}>{msg}</Alert>}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{editTicket?.subject}</Typography>
                    <FormControl fullWidth>
                        <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1 }}>Status</Typography>
                        <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} sx={{ borderRadius: 2 }}>
                            {Object.keys(statusConfig).map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={() => setEditTicket(null)} variant="outlined" sx={{ borderRadius: 50, px: 3 }}>Cancel</Button>
                    <Button
                        onClick={handleSave} variant="contained" disabled={saving}
                        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                        sx={{ borderRadius: 50, px: 3, fontWeight: 700, background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
