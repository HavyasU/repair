'use client';
import {
    Box, Typography, Button, Grid,
    TextField, Stack, Alert, InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';

const schema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone is required').matches(/^\d{10}$/, 'Must be 10 digits'),
    password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
    const { register: registerUser, user, loading: authLoading } = useAuth();
    const [error, setError] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    // Redirect already-logged-in users
    useEffect(() => {
        if (!authLoading && user) {
            const dest = user.role === 'admin' ? '/dashboard/admin'
                : user.role === 'technician' ? '/dashboard/technician'
                    : '/dashboard/user';
            router.replace(dest);
        }
    }, [user, authLoading, router]);

    const onSubmit = async (data) => {
        setError('');
        setSubmitting(true);
        const res = await registerUser({ name: data.name, email: data.email, phone: data.phone, password: data.password });
        if (res?.success === false) setError(res.error);
        setSubmitting(false);
    };

    // Show spinner while checking auth
    if (authLoading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
                <CircularProgress sx={{ color: 'white' }} />
            </Box>
        );
    }

    const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: 2 } };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        }}>
            {/* Left branding */}
            <Box sx={{
                display: { xs: 'none', md: 'flex' },
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 8,
                position: 'relative',
                overflow: 'hidden',
            }}>
                <Box sx={{ position: 'absolute', top: '15%', left: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)' }} />
                <Box sx={{ position: 'absolute', bottom: '15%', right: '5%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }} />
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 6 }}>
                        <BuildCircleIcon sx={{ fontSize: 44, color: '#34d399' }} />
                        <Typography variant="h4" fontWeight="900" sx={{ color: 'white' }}>Gadget Fix</Typography>
                    </Stack>
                    <Typography variant="h2" fontWeight="900" sx={{ color: 'white', mb: 3, lineHeight: 1.1 }}>
                        Join 10,000+<br />Happy Users 🚀
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.55)', fontWeight: 400, maxWidth: 360, lineHeight: 1.7 }}>
                        Create your free account and book your first repair in under 2 minutes.
                    </Typography>
                </motion.div>
            </Box>

            {/* Right form */}
            <Box sx={{
                flex: { xs: 1, md: '0 0 520px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'white',
                borderRadius: { md: '24px 0 0 24px' },
                p: { xs: 4, md: 8 },
                overflowY: 'auto',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', maxWidth: 420 }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 5, display: { md: 'none' } }}>
                        <BuildCircleIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
                        <Typography variant="h5" fontWeight="900" color="secondary">Gadget Fix</Typography>
                    </Stack>

                    <Typography variant="h4" fontWeight="900" gutterBottom>Create Account</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Already have an account?{' '}
                        <Link href="/auth/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                            Sign in
                        </Link>
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField fullWidth label="Full Name" autoFocus {...register('name')} error={!!errors.name} helperText={errors.name?.message} sx={inputSx} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} sx={inputSx} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="Phone (10 digits)" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} sx={inputSx} />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth label="Password"
                                    type={showPwd ? 'text' : 'password'}
                                    {...register('password')} error={!!errors.password} helperText={errors.password?.message}
                                    sx={inputSx}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPwd(!showPwd)} edge="end">
                                                    {showPwd ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField fullWidth label="Confirm Password" type="password" {...register('confirmPassword')} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} sx={inputSx} />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit" fullWidth variant="contained" size="large"
                            disabled={submitting}
                            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
                            sx={{
                                mt: 4, py: 1.8, borderRadius: 2, fontSize: '1rem', fontWeight: 700,
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                boxShadow: '0 10px 30px -5px rgba(16,185,129,0.4)',
                                '&:hover': { boxShadow: '0 15px 40px -5px rgba(16,185,129,0.5)', transform: 'translateY(-2px)' },
                                transition: 'all 0.3s',
                            }}
                        >
                            {submitting ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </Box>
                </motion.div>
            </Box>
        </Box>
    );
}
