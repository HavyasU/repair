'use client';
import { useEffect, useState } from 'react';
import {
    Typography, Paper, Box, Stack, Chip, Avatar, Button, Grid,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Switch, FormControlLabel, Alert, Skeleton,
    IconButton, Tooltip, InputAdornment, MenuItem, Select,
    FormControl, InputLabel, Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import LaptopIcon from '@mui/icons-material/Laptop';
import TabletIcon from '@mui/icons-material/Tablet';
import WatchIcon from '@mui/icons-material/Watch';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const CATEGORIES = ['Smartphone', 'Laptop', 'Tablet', 'Smartwatch', 'Other'];

const categoryMeta = {
    Smartphone: { icon: <SmartphoneIcon sx={{ fontSize: 28 }} />, color: '#3b82f6', bg: '#eff6ff' },
    Laptop: { icon: <LaptopIcon sx={{ fontSize: 28 }} />, color: '#8b5cf6', bg: '#f5f3ff' },
    Tablet: { icon: <TabletIcon sx={{ fontSize: 28 }} />, color: '#10b981', bg: '#ecfdf5' },
    Smartwatch: { icon: <WatchIcon sx={{ fontSize: 28 }} />, color: '#f59e0b', bg: '#fffbeb' },
    Other: { icon: <SmartphoneIcon sx={{ fontSize: 28 }} />, color: '#6b7280', bg: '#f3f4f6' },
};

const EMPTY_FORM = { deviceCategory: 'Smartphone', brand: '', model: '', issue: '', basePrice: '', discount: '0', active: true };

export default function AdminServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('All');

    // Add / Edit dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null); // null = add mode
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [formMsg, setFormMsg] = useState({ type: '', text: '' });

    // Delete dialog
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchServices = () => {
        setLoading(true);
        axios.get('/api/services')
            .then((res) => setServices(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchServices(); }, []);

    const openAdd = () => {
        setEditTarget(null);
        setForm(EMPTY_FORM);
        setFormMsg({ type: '', text: '' });
        setDialogOpen(true);
    };

    const openEdit = (svc) => {
        setEditTarget(svc);
        setForm({
            deviceCategory: svc.deviceCategory,
            brand: svc.brand,
            model: svc.model,
            issue: svc.issue,
            basePrice: String(svc.basePrice),
            discount: String(svc.discount ?? 0),
            active: svc.active,
        });
        setFormMsg({ type: '', text: '' });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.brand || !form.model || !form.issue || !form.basePrice) {
            setFormMsg({ type: 'error', text: 'Please fill all required fields.' });
            return;
        }
        setSaving(true);
        setFormMsg({ type: '', text: '' });
        try {
            const payload = {
                ...form,
                basePrice: Number(form.basePrice),
                discount: Number(form.discount || 0),
            };
            if (editTarget) {
                await axios.patch(`/api/services/${editTarget._id}`, payload);
                setFormMsg({ type: 'success', text: 'Service updated!' });
            } else {
                await axios.post('/api/services', payload);
                setFormMsg({ type: 'success', text: 'Service created!' });
            }
            fetchServices();
            setTimeout(() => setDialogOpen(false), 900);
        } catch (e) {
            setFormMsg({ type: 'error', text: e.response?.data?.message || 'Failed to save.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(`/api/services/${deleteTarget._id}`);
            setDeleteTarget(null);
            fetchServices();
        } catch {
            // silent
        } finally {
            setDeleting(false);
        }
    };

    const handleToggleActive = async (svc) => {
        try {
            await axios.patch(`/api/services/${svc._id}`, { active: !svc.active });
            fetchServices();
        } catch { /* silent */ }
    };

    const filtered = services.filter((s) => {
        const matchCat = filterCat === 'All' || s.deviceCategory === filterCat;
        const q = search.toLowerCase();
        const matchSearch = !q || [s.brand, s.model, s.issue, s.deviceCategory].some((v) => v?.toLowerCase().includes(q));
        return matchCat && matchSearch;
    });

    const meta = (cat) => categoryMeta[cat] || categoryMeta.Other;

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="900">Services</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                        Manage repair services and pricing.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={openAdd}
                    sx={{
                        borderRadius: 50, px: 4, py: 1.5, fontWeight: 700,
                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                        boxShadow: '0 10px 20px -5px rgba(37,99,235,0.4)',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 30px -5px rgba(37,99,235,0.5)' },
                        transition: 'all 0.3s',
                    }}
                >
                    Add Service
                </Button>
            </Box>

            {/* Filters */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <TextField
                    placeholder="Search by brand, model, issue…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 50 } }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.disabled' }} /></InputAdornment> }}
                />
                <Stack direction="row" spacing={1} flexWrap="wrap">
                    {['All', ...CATEGORIES].map((cat) => (
                        <Chip
                            key={cat}
                            label={cat}
                            onClick={() => setFilterCat(cat)}
                            sx={{
                                fontWeight: 700, borderRadius: 50, cursor: 'pointer',
                                bgcolor: filterCat === cat ? '#2563eb' : 'transparent',
                                color: filterCat === cat ? 'white' : 'text.secondary',
                                border: '1px solid',
                                borderColor: filterCat === cat ? '#2563eb' : 'divider',
                                '&:hover': { bgcolor: filterCat === cat ? '#1d4ed8' : 'action.hover' },
                            }}
                        />
                    ))}
                </Stack>
            </Stack>

            {/* Stats row */}
            {!loading && (
                <Stack direction="row" spacing={2} sx={{ mb: 4 }} flexWrap="wrap">
                    <Chip label={`${services.length} Total`} sx={{ fontWeight: 700, bgcolor: '#eff6ff', color: '#2563eb' }} />
                    <Chip label={`${services.filter(s => s.active).length} Active`} sx={{ fontWeight: 700, bgcolor: '#ecfdf5', color: '#10b981' }} />
                    <Chip label={`${services.filter(s => !s.active).length} Inactive`} sx={{ fontWeight: 700, bgcolor: '#fef2f2', color: '#ef4444' }} />
                </Stack>
            )}

            {/* Service cards */}
            {loading ? (
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map((n) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={n}>
                            <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.06)' }}>
                                <Skeleton variant="circular" width={56} height={56} sx={{ mb: 2 }} />
                                <Skeleton width="70%" height={24} />
                                <Skeleton width="50%" height={18} sx={{ mt: 1 }} />
                                <Skeleton width="40%" height={36} sx={{ mt: 2 }} />
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : filtered.length === 0 ? (
                <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 4, border: '2px dashed', borderColor: 'divider', bgcolor: 'transparent', boxShadow: 'none' }}>
                    <AddIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" fontWeight="600" gutterBottom>
                        {search || filterCat !== 'All' ? 'No services match your filter' : 'No services yet'}
                    </Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                        Click "Add Service" to create your first repair service.
                    </Typography>
                    <Button variant="outlined" onClick={openAdd} sx={{ borderRadius: 50, px: 4 }}>Add Service</Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {filtered.map((svc) => {
                        const m = meta(svc.deviceCategory);
                        const finalPrice = svc.discount > 0 ? svc.basePrice - svc.discount : svc.basePrice;
                        return (
                            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={svc._id}>
                                <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }} style={{ height: '100%' }}>
                                    <Paper sx={{
                                        p: 3.5, borderRadius: 4, height: '100%',
                                        border: `1px solid ${m.color}20`,
                                        boxShadow: `0 4px 20px ${m.color}10`,
                                        transition: 'all 0.3s',
                                        '&:hover': { boxShadow: `0 20px 40px ${m.color}20` },
                                        display: 'flex', flexDirection: 'column',
                                        opacity: svc.active ? 1 : 0.6,
                                    }}>
                                        {/* Top row */}
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2.5 }}>
                                            <Avatar sx={{ bgcolor: m.bg, color: m.color, width: 52, height: 52 }}>
                                                {m.icon}
                                            </Avatar>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Chip
                                                    label={svc.active ? 'Active' : 'Inactive'}
                                                    size="small"
                                                    onClick={() => handleToggleActive(svc)}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        bgcolor: svc.active ? '#ecfdf5' : '#fef2f2',
                                                        color: svc.active ? '#10b981' : '#ef4444',
                                                        fontWeight: 700, fontSize: '0.7rem',
                                                        '&:hover': { opacity: 0.8 },
                                                    }}
                                                />
                                            </Stack>
                                        </Stack>

                                        {/* Info */}
                                        <Typography variant="caption" color="text.disabled" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            {svc.deviceCategory}
                                        </Typography>
                                        <Typography variant="subtitle1" fontWeight="800" sx={{ mt: 0.3, mb: 0.3 }}>
                                            {svc.brand} {svc.model}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {svc.issue}
                                        </Typography>

                                        {/* Price */}
                                        <Box sx={{ mt: 'auto' }}>
                                            <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 0.5 }}>
                                                <Typography variant="h5" fontWeight="900" sx={{ color: m.color }}>
                                                    ₹{finalPrice}
                                                </Typography>
                                                {svc.discount > 0 && (
                                                    <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
                                                        ₹{svc.basePrice}
                                                    </Typography>
                                                )}
                                            </Stack>
                                            {svc.discount > 0 && (
                                                <Chip label={`₹${svc.discount} off`} size="small" sx={{ bgcolor: '#ecfdf5', color: '#10b981', fontWeight: 700, fontSize: '0.7rem', mb: 1.5 }} />
                                            )}

                                            <Divider sx={{ my: 1.5 }} />

                                            {/* Actions */}
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    size="small" variant="outlined" startIcon={<EditIcon />}
                                                    onClick={() => openEdit(svc)}
                                                    sx={{ flex: 1, borderRadius: 50, fontWeight: 600, borderColor: m.color, color: m.color, '&:hover': { bgcolor: m.bg } }}
                                                >
                                                    Edit
                                                </Button>
                                                <Tooltip title="Delete service">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setDeleteTarget(svc)}
                                                        sx={{ color: '#ef4444', border: '1px solid #fecaca', borderRadius: 2, '&:hover': { bgcolor: '#fef2f2' } }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Add / Edit Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
                    {editTarget ? 'Edit Service' : 'Add New Service'}
                </DialogTitle>
                <DialogContent>
                    {formMsg.text && (
                        <Alert severity={formMsg.type} sx={{ mb: 2, borderRadius: 2 }}>{formMsg.text}</Alert>
                    )}
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel>Device Category *</InputLabel>
                            <Select
                                value={form.deviceCategory}
                                label="Device Category *"
                                onChange={(e) => setForm({ ...form, deviceCategory: e.target.value })}
                                sx={{ borderRadius: 2 }}
                            >
                                {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                fullWidth label="Brand *" value={form.brand}
                                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                                placeholder="e.g. Apple, Samsung"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                fullWidth label="Model *" value={form.model}
                                onChange={(e) => setForm({ ...form, model: e.target.value })}
                                placeholder="e.g. iPhone 15, Galaxy S24"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Stack>
                        <TextField
                            fullWidth label="Issue / Service Type *" value={form.issue}
                            onChange={(e) => setForm({ ...form, issue: e.target.value })}
                            placeholder="e.g. Screen Replacement, Battery Replacement"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                fullWidth label="Base Price (₹) *" value={form.basePrice}
                                onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                                type="number" inputProps={{ min: 0 }}
                                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                fullWidth label="Discount (₹)" value={form.discount}
                                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                                type="number" inputProps={{ min: 0 }}
                                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                helperText="Flat discount off base price"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Stack>
                        {form.basePrice && (
                            <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                <Typography variant="body2" color="#16a34a" fontWeight="700">
                                    Final price: ₹{Math.max(0, Number(form.basePrice) - Number(form.discount || 0))}
                                    {Number(form.discount) > 0 && ` (₹${form.discount} off)`}
                                </Typography>
                            </Box>
                        )}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={form.active}
                                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                                    color="success"
                                />
                            }
                            label={<Typography variant="body2" fontWeight="600">Active (visible to customers)</Typography>}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={() => setDialogOpen(false)} variant="outlined" sx={{ borderRadius: 50, px: 3 }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={saving}
                        sx={{
                            borderRadius: 50, px: 4, fontWeight: 700,
                            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                        }}
                    >
                        {saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Create Service'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Delete Service?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        Are you sure you want to delete{' '}
                        <strong>{deleteTarget?.brand} {deleteTarget?.model} — {deleteTarget?.issue}</strong>?
                        This cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={() => setDeleteTarget(null)} variant="outlined" sx={{ borderRadius: 50, px: 3 }}>Cancel</Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={deleting}
                        startIcon={<DeleteIcon />}
                        sx={{ borderRadius: 50, px: 3, fontWeight: 700 }}
                    >
                        {deleting ? 'Deleting…' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
