'use client';
import {
    Box, Typography, Button,
    Stack, InputAdornment, IconButton, Alert, CircularProgress
} from '@mui/material';
import { TextField } from '@mui/material';
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
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
    const { login, user, loading: authLoading } = useAuth();
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
        const res = await login(data.email, data.password);
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

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        }}>
            {/* Left panel */}
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
                <Box sx={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }} />
                <Box sx={{ position: 'absolute', bottom: '20%', right: '10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)' }} />
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 6 }}>
                        <BuildCircleIcon sx={{ fontSize: 44, color: '#60a5fa' }} />
                        <Typography variant="h4" fontWeight="900" sx={{ color: 'white' }}>Gadget Fix</Typography>
                    </Stack>
                    <Typography variant="h2" fontWeight="900" sx={{ color: 'white', mb: 3, lineHeight: 1.1 }}>
                        Welcome<br />Back 👋
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.55)', fontWeight: 400, maxWidth: 360, lineHeight: 1.7 }}>
                        Login to track your repairs, manage bookings, and get real-time updates.
                    </Typography>
                    <Stack spacing={2} sx={{ mt: 6 }}>
                        {['10,000+ happy customers', '90-day repair warranty', 'Same-day service available'].map((t) => (
                            <Stack key={t} direction="row" spacing={1.5} alignItems="center">
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#34d399' }} />
                                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>{t}</Typography>
                            </Stack>
                        ))}
                    </Stack>
                </motion.div>
            </Box>

            {/* Right panel — form */}
            <Box sx={{
                flex: { xs: 1, md: '0 0 480px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'white',
                borderRadius: { md: '24px 0 0 24px' },
                p: { xs: 4, md: 8 },
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', maxWidth: 380 }}
                >
                    {/* Mobile logo */}
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 5, display: { md: 'none' } }}>
                        <BuildCircleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Typography variant="h5" fontWeight="900" color="primary">Gadget Fix</Typography>
                    </Stack>

                    <Typography variant="h4" fontWeight="900" gutterBottom>Sign In</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Don't have an account?{' '}
                        <Link href="/auth/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                            Register free
                        </Link>
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            fullWidth label="Email Address" margin="normal"
                            autoComplete="email" autoFocus
                            {...register('email')}
                            error={!!errors.email} helperText={errors.email?.message}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            fullWidth label="Password" margin="normal"
                            type={showPwd ? 'text' : 'password'}
                            autoComplete="current-password"
                            {...register('password')}
                            error={!!errors.password} helperText={errors.password?.message}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                        <Button
                            type="submit" fullWidth variant="contained" size="large"
                            disabled={submitting}
                            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
                            sx={{
                                mt: 3, py: 1.8, borderRadius: 2, fontSize: '1rem', fontWeight: 700,
                                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                boxShadow: '0 10px 30px -5px rgba(37,99,235,0.4)',
                                '&:hover': { boxShadow: '0 15px 40px -5px rgba(37,99,235,0.5)', transform: 'translateY(-2px)' },
                                transition: 'all 0.3s',
                            }}
                        >
                            {submitting ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </Box>
                </motion.div>
            </Box>
        </Box>
    );
}
