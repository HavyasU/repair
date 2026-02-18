'use client';
import { useState, useEffect, useRef } from 'react';
import {
    Stepper, Step, StepLabel, Button, Typography, Paper, Box,
    Grid, TextField, MenuItem, FormControl, InputLabel, Select,
    Card, CardActionArea, Stack, Chip, Alert, CircularProgress,
    RadioGroup, FormControlLabel, Radio, Skeleton, IconButton
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import LaptopIcon from '@mui/icons-material/Laptop';
import TabletIcon from '@mui/icons-material/Tablet';
import WatchIcon from '@mui/icons-material/Watch';
import DesktopMacIcon from '@mui/icons-material/DesktopMac';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PaymentIcon from '@mui/icons-material/Payment';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const steps = ['Device Type', 'Brand & Model', 'Issue', 'Schedule', 'Confirm'];

const categoryIcons = {
    'Smartphone': <SmartphoneIcon sx={{ fontSize: 40 }} />,
    'Laptop': <LaptopIcon sx={{ fontSize: 40 }} />,
    'Tablet': <TabletIcon sx={{ fontSize: 40 }} />,
    'Smartwatch': <WatchIcon sx={{ fontSize: 40 }} />,
    'Other': <DesktopMacIcon sx={{ fontSize: 40 }} />,
};

const categoryColors = {
    'Smartphone': { color: '#3b82f6', bg: '#eff6ff' },
    'Laptop': { color: '#8b5cf6', bg: '#f5f3ff' },
    'Tablet': { color: '#10b981', bg: '#ecfdf5' },
    'Smartwatch': { color: '#f59e0b', bg: '#fffbeb' },
    'Other': { color: '#6b7280', bg: '#f3f4f6' },
};

const timeSlots = ['9:00 AM – 11:00 AM', '11:00 AM – 1:00 PM', '2:00 PM – 4:00 PM', '4:00 PM – 6:00 PM'];

export default function BookRepair() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [formData, setFormData] = useState({
        deviceType: '', brand: '', model: '', issue: '',
        description: '', images: [], date: '', timeSlot: '',
        pickupAddress: '', paymentMethod: 'COD',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await axios.get('/api/services');
                setServices(data.filter(s => s.active));
            } catch (err) {
                console.error("Failed to fetch services", err);
            } finally {
                setLoadingServices(false);
            }
        };
        fetchServices();
    }, []);

    // Helper to get unique values from services
    const categories = Array.from(new Set(services.map(s => s.deviceCategory)));
    const brands = Array.from(new Set(services.filter(s => s.deviceCategory === formData.deviceType).map(s => s.brand)));
    const models = Array.from(new Set(services.filter(s => s.deviceCategory === formData.deviceType && s.brand === formData.brand).map(s => s.model)));
    const issuesList = services.filter(s =>
        s.deviceCategory === formData.deviceType &&
        s.brand === formData.brand &&
        s.model === formData.model
    );

    const selectedService = services.find(s =>
        s.deviceCategory === formData.deviceType &&
        s.brand === formData.brand &&
        s.model === formData.model &&
        s.issue === formData.issue
    );

    const priceEstimate = selectedService ? (selectedService.basePrice - (selectedService.discount || 0)) : 0;

    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleNext = () => setActiveStep((p) => p + 1);
    const handleBack = () => setActiveStep((p) => p - 1);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const upFormData = new FormData();
        upFormData.append('image', file);

        try {
            const { data } = await axios.post('/api/upload', upFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, images: [...prev.images, data.imageUrl] }));
        } catch (err) {
            setError('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const canProceed = () => {
        if (activeStep === 0) return !!formData.deviceType;
        if (activeStep === 1) return !!formData.brand && !!formData.model;
        if (activeStep === 2) return !!formData.issue;
        if (activeStep === 3) return !!formData.date && !!formData.timeSlot && !!formData.pickupAddress;
        return true;
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        try {
            await axios.post('/api/bookings', {
                deviceCategory: formData.deviceType,
                brand: formData.brand,
                model: formData.model,
                issueType: formData.issue,
                description: formData.description,
                images: formData.images,
                pickupAddress: formData.pickupAddress,
                date: formData.date,
                timeSlot: formData.timeSlot,
                paymentMethod: formData.paymentMethod,
                priceEstimate,
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                router.push('/dashboard/user/repairs');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, router]);

    const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: 2 } };

    if (success) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <Box sx={{ textAlign: 'center', py: 10 }}>
                    <CheckCircleIcon sx={{ fontSize: 80, color: '#10b981', mb: 3 }} />
                    <Typography variant="h4" fontWeight="900" gutterBottom>Booking Confirmed! 🎉</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Your repair for <strong>{formData.brand} {formData.model}</strong> has been booked.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>
                        Pickup: <strong>{formData.date}</strong> at <strong>{formData.timeSlot}</strong>
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            onClick={() => router.push('/dashboard/user/repairs')}
                            sx={{
                                borderRadius: 50, px: 4, py: 1.5, fontWeight: 700,
                                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                            }}
                        >
                            Track My Repair
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => { setSuccess(false); setActiveStep(0); setFormData({ deviceType: '', brand: '', model: '', issue: '', description: '', date: '', timeSlot: '', pickupAddress: '', paymentMethod: 'COD' }); }}
                            sx={{ borderRadius: 50, px: 4, py: 1.5, fontWeight: 700 }}
                        >
                            Book Another
                        </Button>
                    </Stack>
                </Box>
            </motion.div>
        );
    }

    const renderStep = () => {
        if (loadingServices && activeStep < 3) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto', mb: 4 }} />
                    <Grid container spacing={3} justifyContent="center">
                        {[1, 2, 3, 4].map(i => (
                            <Grid size={{ xs: 6, sm: 3 }} key={i}>
                                <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 4 }} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            );
        }

        switch (activeStep) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" fontWeight="700" gutterBottom align="center" sx={{ mb: 4 }}>
                            What device needs fixing?
                        </Typography>
                        <Grid container spacing={3} justifyContent="center">
                            {categories.map((cat) => {
                                const selected = formData.deviceType === cat;
                                const meta = categoryColors[cat] || categoryColors.Other;
                                const icon = categoryIcons[cat] || categoryIcons.Other;
                                return (
                                    <Grid size={{ xs: 6, sm: 3 }} key={cat}>
                                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                            <Card
                                                onClick={() => setFormData({ ...formData, deviceType: cat, brand: '', model: '', issue: '' })}
                                                sx={{
                                                    borderRadius: 4, cursor: 'pointer',
                                                    border: selected ? `2px solid ${meta.color}` : '2px solid transparent',
                                                    bgcolor: selected ? meta.bg : 'white',
                                                    boxShadow: selected ? `0 8px 24px ${meta.color}30` : '0 2px 8px rgba(0,0,0,0.06)',
                                                    transition: 'all 0.3s',
                                                }}
                                            >
                                                <CardActionArea sx={{ p: 4, textAlign: 'center' }}>
                                                    <Box sx={{ color: selected ? meta.color : 'text.disabled', mb: 1.5, transition: 'color 0.3s' }}>
                                                        {icon}
                                                    </Box>
                                                    <Typography variant="subtitle1" fontWeight={selected ? 700 : 500} sx={{ color: selected ? meta.color : 'text.primary' }}>
                                                        {cat}
                                                    </Typography>
                                                    {selected && <CheckCircleIcon sx={{ color: meta.color, fontSize: 18, mt: 1 }} />}
                                                </CardActionArea>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                );

            case 1:
                return (
                    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                        <Typography variant="h6" fontWeight="700" gutterBottom align="center" sx={{ mb: 4 }}>
                            Tell us about your device
                        </Typography>
                        <Stack spacing={3}>
                            <FormControl fullWidth>
                                <InputLabel>Brand</InputLabel>
                                <Select name="brand" value={formData.brand} label="Brand" onChange={(e) => setFormData({ ...formData, brand: e.target.value, model: '', issue: '' })} sx={{ borderRadius: 2 }}>
                                    {brands.map((b) => (
                                        <MenuItem key={b} value={b}>{b}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth disabled={!formData.brand}>
                                <InputLabel>Model</InputLabel>
                                <Select name="model" value={formData.model} label="Model" onChange={(e) => setFormData({ ...formData, model: e.target.value, issue: '' })} sx={{ borderRadius: 2 }}>
                                    {models.map((m) => (
                                        <MenuItem key={m} value={m}>{m}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </Box>
                );

            case 2:
                return (
                    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                        <Typography variant="h6" fontWeight="700" gutterBottom align="center" sx={{ mb: 4 }}>
                            What's the issue?
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1.5} justifyContent="center" sx={{ mb: 4 }}>
                            {issuesList.map((svc) => (
                                <Chip
                                    key={svc._id}
                                    label={svc.issue}
                                    onClick={() => setFormData({ ...formData, issue: svc.issue })}
                                    variant={formData.issue === svc.issue ? 'filled' : 'outlined'}
                                    color={formData.issue === svc.issue ? 'primary' : 'default'}
                                    sx={{ borderRadius: 2, fontWeight: 600, px: 1, py: 2.5, cursor: 'pointer' }}
                                />
                            ))}
                        </Stack>
                        {formData.issue && selectedService && (
                            <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#eff6ff', textAlign: 'center', mb: 3 }}>
                                <Typography variant="body2" color="text.secondary">Estimated Price</Typography>
                                <Typography variant="h5" fontWeight="900" color="primary">₹{priceEstimate}</Typography>
                                <Typography variant="caption" color="text.disabled">Final price confirmed after inspection</Typography>
                            </Box>
                        )}
                        <TextField
                            fullWidth multiline rows={3}
                            label="Additional Details (optional)"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the issue in more detail..."
                            sx={inputSx}
                        />

                        {/* Image Upload Section */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" fontWeight="700" gutterBottom>
                                Upload Device Images (optional)
                            </Typography>
                            <Grid container spacing={1.5}>
                                {formData.images.map((img, idx) => (
                                    <Grid size={{ xs: 4, sm: 3 }} key={idx}>
                                        <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', pt: '100%', border: '1px solid #eee' }}>
                                            <img
                                                src={img}
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                alt="preview"
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteImage(idx)}
                                                sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' } }}
                                            >
                                                <DeleteIcon sx={{ fontSize: 16, color: 'error.main' }} />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                ))}
                                <Grid size={{ xs: 4, sm: 3 }}>
                                    <Button
                                        component="label"
                                        disabled={uploading}
                                        sx={{
                                            width: '100%', pt: '100%', position: 'relative',
                                            border: '2px dashed #ddd', borderRadius: 2,
                                            '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(37,99,235,0.04)' }
                                        }}
                                    >
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            {uploading ? <CircularProgress size={24} /> : <PhotoCameraIcon sx={{ mb: 0.5, color: 'text.secondary' }} />}
                                            <Typography variant="caption" color="text.secondary">Add Photo</Typography>
                                        </Box>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                );

            case 3:
                return (
                    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                        <Typography variant="h6" fontWeight="700" gutterBottom align="center" sx={{ mb: 4 }}>
                            Schedule & Pickup Details
                        </Typography>
                        <Stack spacing={3}>
                            <TextField type="date" name="date" label="Preferred Date" value={formData.date} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} sx={inputSx}
                                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Time Slot</InputLabel>
                                <Select name="timeSlot" value={formData.timeSlot} label="Time Slot" onChange={handleChange} sx={{ borderRadius: 2 }}>
                                    {timeSlots.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth label="Pickup Address" name="pickupAddress"
                                value={formData.pickupAddress} onChange={handleChange}
                                multiline rows={2}
                                placeholder="Enter your full address for pickup"
                                sx={inputSx}
                            />
                            <Box>
                                <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1.5 }}>Payment Method</Typography>
                                <RadioGroup name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} row>
                                    <FormControlLabel value="COD" control={<Radio />} label="Cash on Delivery" />
                                    <FormControlLabel value="Online" control={<Radio />} label="Online Payment" />
                                </RadioGroup>
                            </Box>
                        </Stack>
                    </Box>
                );

            case 4:
                return (
                    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                        <Typography variant="h6" fontWeight="700" gutterBottom align="center" sx={{ mb: 4 }}>
                            Review & Confirm
                        </Typography>
                        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
                        <Paper variant="outlined" sx={{ p: 4, borderRadius: 4 }}>
                            <Stack spacing={2.5}>
                                {[
                                    ['Device', `${formData.deviceType} — ${formData.brand} ${formData.model}`],
                                    ['Issue', formData.issue],
                                    ['Date & Time', `${formData.date} · ${formData.timeSlot}`],
                                    ['Pickup Address', formData.pickupAddress],
                                    ['Payment', formData.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'],
                                ].map(([label, val]) => (
                                    <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>{label}</Typography>
                                        <Typography variant="body2" fontWeight="700" align="right">{val || '—'}</Typography>
                                    </Box>
                                ))}

                                {formData.images.length > 0 && (
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Photos</Typography>
                                        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                                            {formData.images.map((img, i) => (
                                                <Box key={i} sx={{ width: 60, height: 60, borderRadius: 1.5, overflow: 'hidden', flexShrink: 0, border: '1px solid #eee' }}>
                                                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Box>
                                )}
                            </Stack>
                            <Box sx={{ mt: 4, p: 3, borderRadius: 3, bgcolor: '#eff6ff', textAlign: 'center' }}>
                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                                    <CurrencyRupeeIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                    <Typography variant="h4" fontWeight="900" color="primary">{priceEstimate}</Typography>
                                </Stack>
                                <Typography variant="caption" color="text.disabled">Estimated price · Final confirmed after inspection</Typography>
                            </Box>
                        </Paper>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', py: 2 }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h4" fontWeight="900" gutterBottom>Book a Repair</Typography>
                <Typography variant="body1" color="text.secondary">Follow the steps below to schedule your repair.</Typography>
            </Box>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                >
                    <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, minHeight: 380, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.04)' }}>
                        {renderStep()}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                variant="outlined"
                                sx={{ borderRadius: 50, px: 4, py: 1.2 }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                                disabled={!canProceed() || submitting}
                                startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : activeStep === steps.length - 1 ? <PaymentIcon /> : null}
                                sx={{
                                    borderRadius: 50, px: 5, py: 1.2, fontWeight: 700,
                                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                    boxShadow: '0 10px 20px -5px rgba(37,99,235,0.4)',
                                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 30px -5px rgba(37,99,235,0.5)' },
                                    transition: 'all 0.3s',
                                }}
                            >
                                {submitting ? 'Booking...' : activeStep === steps.length - 1 ? '✓ Confirm Booking' : 'Continue →'}
                            </Button>
                        </Box>
                    </Paper>
                </motion.div>
            </AnimatePresence>
        </Box>
    );
}
