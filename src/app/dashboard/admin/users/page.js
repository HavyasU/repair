'use client';
import { useEffect, useState } from 'react';
import {
    Typography, Paper, Box, Stack, Chip, Avatar, Button,
    CircularProgress, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Select, MenuItem, FormControl,
    Alert, IconButton, Tooltip, Switch, FormControlLabel, Skeleton
} from '@mui/material';
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import axios from 'axios';


const roleColors = {
    admin: { bg: '#fce7f3', color: '#db2777' },
    technician: { bg: '#fff7ed', color: '#ea580c' },
    user: { bg: '#ecfdf5', color: '#059669' },
};

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', phone: '', role: 'user', isBlocked: false });
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [msg, setMsg] = useState('');
    const [search, setSearch] = useState('');

    const fetchUsers = () => {
        setLoading(true);
        axios.get('/api/users')
            .then((res) => setUsers(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchUsers(); }, []);

    const openEdit = (u) => {
        setEditUser(u);
        setEditForm({ name: u.name, phone: u.phone || '', role: u.role, isBlocked: u.isBlocked });
        setMsg('');
    };

    const handleSave = async () => {
        setSaving(true); setMsg('');
        try {
            await axios.patch(`/api/users/${editUser._id}`, editForm);
            setMsg('User updated!');
            fetchUsers();
            setTimeout(() => setEditUser(null), 1000);
        } catch (e) {
            setMsg(e.response?.data?.message || 'Error saving');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(`/api/users/${deleteId}`);
            setDeleteId(null);
            fetchUsers();
        } catch (e) {
            console.error(e);
        } finally {
            setDeleting(false);
        }
    };

    const filtered = users.filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.role?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="900">User Management</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                        View, edit, block, or remove users.
                    </Typography>
                </Box>
                <TextField
                    size="small"
                    placeholder="Search by name, email, role…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 50, minWidth: 260 } }}
                />
            </Box>

            {loading ? (
                <Stack spacing={2}>
                    {[1, 2, 3, 4].map((n) => (
                        <Paper key={n} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'none' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Skeleton variant="circular" width={48} height={48} />
                                    <Box><Skeleton width={160} height={22} /><Skeleton width={200} height={18} /></Box>
                                </Stack>
                                <Skeleton variant="rounded" width={70} height={28} sx={{ borderRadius: 2 }} />
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            ) : (
                <Stack spacing={2}>
                    {filtered.map((u) => {
                        const rc = roleColors[u.role] || roleColors.user;
                        return (
                            <motion.div key={u._id} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                                <Paper sx={{
                                    p: 3, borderRadius: 4,
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
                                    transition: 'box-shadow 0.3s',
                                    '&:hover': { boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' },
                                    opacity: u.isBlocked ? 0.65 : 1,
                                }}>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{
                                                width: 48, height: 48, fontWeight: 700,
                                                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                            }}>
                                                {u.name?.[0]?.toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="subtitle1" fontWeight="700">{u.name}</Typography>
                                                    {u.isBlocked && <Chip label="Blocked" size="small" sx={{ bgcolor: '#fef2f2', color: '#ef4444', fontWeight: 700, borderRadius: 1.5, fontSize: '0.65rem' }} />}
                                                </Stack>
                                                <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                                                <Typography variant="caption" color="text.disabled">{u.phone || 'No phone'}</Typography>
                                            </Box>
                                        </Stack>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Chip
                                                label={u.role?.toUpperCase()}
                                                size="small"
                                                sx={{ bgcolor: rc.bg, color: rc.color, fontWeight: 700, borderRadius: 2 }}
                                            />
                                            <Typography variant="caption" color="text.disabled">
                                                {new Date(u.createdAt).toLocaleDateString('en-IN')}
                                            </Typography>
                                            <Tooltip title="Edit User">
                                                <IconButton size="small" onClick={() => openEdit(u)} sx={{ color: '#3b82f6' }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete User">
                                                <IconButton size="small" onClick={() => setDeleteId(u._id)} sx={{ color: '#ef4444' }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            </motion.div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, border: '2px dashed', borderColor: 'divider', bgcolor: 'transparent', boxShadow: 'none' }}>
                            <Typography color="text.secondary">No users found.</Typography>
                        </Paper>
                    )}
                </Stack>
            )}

            {/* Edit Dialog */}
            <Dialog open={!!editUser} onClose={() => setEditUser(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Edit User</DialogTitle>
                <DialogContent>
                    {msg && <Alert severity={msg.includes('!') ? 'success' : 'error'} sx={{ mb: 2, borderRadius: 2 }}>{msg}</Alert>}
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        <TextField fullWidth label="Phone" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        <FormControl fullWidth>
                            <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1 }}>Role</Typography>
                            <Select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} sx={{ borderRadius: 2 }}>
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={<Switch checked={editForm.isBlocked} onChange={(e) => setEditForm({ ...editForm, isBlocked: e.target.checked })} color="error" />}
                            label={<Typography variant="body2" fontWeight="600">Block this user</Typography>}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={() => setEditUser(null)} variant="outlined" sx={{ borderRadius: 50, px: 3 }}>Cancel</Button>
                    <Button
                        onClick={handleSave} variant="contained" disabled={saving}
                        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                        sx={{ borderRadius: 50, px: 3, fontWeight: 700, background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Delete User?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        This action is permanent and cannot be undone. All data associated with this user will be removed.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={() => setDeleteId(null)} variant="outlined" sx={{ borderRadius: 50, px: 3 }}>Cancel</Button>
                    <Button
                        onClick={handleDelete} variant="contained" color="error" disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
                        sx={{ borderRadius: 50, px: 3, fontWeight: 700 }}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
