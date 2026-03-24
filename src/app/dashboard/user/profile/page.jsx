'use client';
import { useState, useEffect, useRef } from 'react';
import {
    Typography, Paper, Box, Stack, TextField, Button, Avatar,
    Divider, Grid, Alert, CircularProgress, Chip, IconButton
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const roleChipStyle = {
    admin: { bg: '#fce7f3', color: '#db2777' },
    technician: { bg: '#fff7ed', color: '#ea580c' },
    user: { bg: '#eff6ff', color: '#2563eb' },
};

export default function ProfilePage() {
    const { user, checkUser } = useAuth();
    const [form, setForm] = useState({ name: '', phone: '', address: '' });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setForm({ name: user.name || '', phone: user.phone || '', address: user.address || '' });
        }
    }, [user]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        setSaving(true); setError(''); setSuccess('');
        try {
            await axios.patch('/api/profile', form);
            setSuccess('Profile updated successfully!');
            await checkUser();
            setTimeout(() => setSuccess(''), 3000);
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to save. Try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true); setError(''); setSuccess('');
        const formData = new FormData();
        formData.append('image', file);

        try {
            const { data } = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Update user profile in DB
            await axios.patch('/api/profile', { profileImage: data.imageUrl });
            await checkUser();
            setSuccess('Profile picture updated!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (e) {
            setError(e.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const roleStyle = roleChipStyle[user?.role] || roleChipStyle.user;

    return (
        <Box>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" fontWeight="900">My Profile</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Manage your personal information.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Avatar card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Box>
                        <Paper sx={{ p: 5, borderRadius: 4, textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)' }}>
                            <Box sx={{ position: 'relative', width: 110, height: 110, mx: 'auto', mb: 3 }}>
                                <Avatar
                                    src={user?.profileImage}
                                    sx={{
                                        width: '100%', height: '100%',
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                        fontSize: 44, fontWeight: 700,
                                    }}
                                >
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </Avatar>
                                <input
                                    type="file"
                                    hidden
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                <IconButton
                                    disabled={uploading}
                                    onClick={() => fileInputRef.current.click()}
                                    sx={{
                                        position: 'absolute', bottom: -5, right: -5,
                                        bgcolor: 'white', border: '1px solid #ddd',
                                        '&:hover': { bgcolor: '#f5f5f5' },
                                        width: 32, height: 32,
                                    }}
                                >
                                    {uploading ? <CircularProgress size={16} /> : <PhotoCameraIcon sx={{ fontSize: 18 }} />}
                                </IconButton>
                            </Box>

                            <Typography variant="h6" fontWeight="800">{user?.name || 'User'}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{user?.email}</Typography>
                            <Chip
                                label={user?.role?.toUpperCase() || 'USER'}
                                size="small"
                                sx={{ bgcolor: roleStyle.bg, color: roleStyle.color, fontWeight: 700, borderRadius: 2 }}
                            />
                            <Divider sx={{ my: 3 }} />
                            <Stack spacing={1.5} sx={{ textAlign: 'left' }}>
                                {[
                                    { label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—' },
                                    { label: 'Account status', value: user?.isBlocked ? 'Blocked' : 'Active' },
                                ].map(({ label, value }) => (
                                    <Box key={label}>
                                        <Typography variant="caption" color="text.disabled">{label}</Typography>
                                        <Typography variant="body2" fontWeight="600">{value}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    </Box>
                </Grid>

                {/* Edit form */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Box>
                        <Paper sx={{ p: 5, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)' }}>
                            <Typography variant="h6" fontWeight="700" gutterBottom>Personal Information</Typography>
                            <Divider sx={{ mb: 4 }} />

                            {success && (
                                <Alert icon={<CheckCircleIcon />} severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>
                            )}
                            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                            <Stack spacing={3}>
                                <TextField
                                    fullWidth label="Full Name" name="name"
                                    value={form.name} onChange={handleChange}
                                    InputProps={{ startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.disabled' }} /> }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                                <TextField
                                    fullWidth label="Email Address" name="email"
                                    value={user?.email || ''} disabled
                                    InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.disabled' }} /> }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    helperText="Email cannot be changed"
                                />
                                <TextField
                                    fullWidth label="Phone Number" name="phone"
                                    value={form.phone} onChange={handleChange}
                                    InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.disabled' }} /> }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                                <TextField
                                    fullWidth label="Address" name="address"
                                    value={form.address} onChange={handleChange}
                                    multiline rows={2}
                                    InputProps={{ startAdornment: <HomeIcon sx={{ mr: 1, mt: 1, color: 'text.disabled', alignSelf: 'flex-start' }} /> }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                                <Button
                                    variant="contained"
                                    startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                                    disabled={saving}
                                    onClick={handleSave}
                                    sx={{
                                        alignSelf: 'flex-start', borderRadius: 50, px: 5, py: 1.5, fontWeight: 700,
                                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                        boxShadow: '0 10px 20px -5px rgba(37,99,235,0.4)',
                                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 30px -5px rgba(37,99,235,0.5)' },
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Stack>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
