'use client';
import {
    Box, Container, Typography, Grid, Paper, Button, Chip, Stack, Avatar
} from '@mui/material';
import Navbar from '@/components/common/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import LaptopIcon from '@mui/icons-material/Laptop';
import TabletIcon from '@mui/icons-material/Tablet';
import WatchIcon from '@mui/icons-material/Watch';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';
import WifiIcon from '@mui/icons-material/Wifi';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShieldIcon from '@mui/icons-material/Shield';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};

const services = [
    {
        icon: <SmartphoneIcon sx={{ fontSize: 44 }} />,
        title: 'Smartphone Repair',
        color: '#3b82f6',
        bg: '#eff6ff',
        price: 'Starting ₹299',
        issues: ['Screen Replacement', 'Battery Replacement', 'Charging Port Fix', 'Water Damage', 'Camera Repair', 'Speaker/Mic Fix'],
        turnaround: '2–4 hours',
        popular: true,
    },
    {
        icon: <LaptopIcon sx={{ fontSize: 44 }} />,
        title: 'Laptop Repair',
        color: '#8b5cf6',
        bg: '#f5f3ff',
        price: 'Starting ₹499',
        issues: ['Screen Replacement', 'Keyboard Repair', 'Battery Replacement', 'Motherboard Fix', 'RAM/SSD Upgrade', 'OS Reinstall'],
        turnaround: '4–8 hours',
        popular: false,
    },
    {
        icon: <TabletIcon sx={{ fontSize: 44 }} />,
        title: 'Tablet Repair',
        color: '#10b981',
        bg: '#ecfdf5',
        price: 'Starting ₹399',
        issues: ['Screen Replacement', 'Battery Replacement', 'Charging Port Fix', 'Button Repair', 'Software Issues', 'Speaker Fix'],
        turnaround: '3–6 hours',
        popular: false,
    },
    {
        icon: <WatchIcon sx={{ fontSize: 44 }} />,
        title: 'Smartwatch Repair',
        color: '#f59e0b',
        bg: '#fffbeb',
        price: 'Starting ₹199',
        issues: ['Screen Replacement', 'Battery Replacement', 'Strap Replacement', 'Button Fix', 'Water Damage', 'Software Reset'],
        turnaround: '1–3 hours',
        popular: false,
    },
];

const commonIssues = [
    { icon: <ScreenRotationIcon />, label: 'Screen Damage', desc: 'Cracked, shattered or unresponsive displays replaced with OEM-quality parts.', color: '#3b82f6' },
    { icon: <BatteryChargingFullIcon />, label: 'Battery Issues', desc: 'Draining fast or not charging? We replace batteries with genuine cells.', color: '#10b981' },
    { icon: <WifiIcon />, label: 'Connectivity', desc: 'WiFi, Bluetooth, or cellular issues diagnosed and fixed by our experts.', color: '#8b5cf6' },
    { icon: <BuildIcon />, label: 'Hardware Damage', desc: 'Buttons, ports, cameras, speakers — all hardware components repaired.', color: '#f59e0b' },
];

const guarantees = [
    '90-Day Warranty on all repairs',
    'Genuine & OEM-quality parts only',
    'Certified technicians with 5+ years experience',
    'No fix, no fee policy',
    'Free diagnostics on every device',
    'Data safety guaranteed',
];

export default function ServicesPage() {
    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Navbar />

            {/* Hero */}
            <Box sx={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                py: { xs: 10, md: 14 },
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <Box sx={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }} />
                <Box sx={{ position: 'absolute', bottom: '10%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)' }} />
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div initial="hidden" animate="show" variants={stagger}>
                        <motion.div variants={fadeUp}>
                            <Chip label="🔧 Professional Repair Services" sx={{ mb: 3, bgcolor: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)', fontWeight: 600 }} />
                        </motion.div>
                        <motion.div variants={fadeUp}>
                            <Typography variant="h2" fontWeight="900" sx={{ color: 'white', mb: 2, fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
                                Our Repair{' '}
                                <Box component="span" sx={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Services
                                </Box>
                            </Typography>
                        </motion.div>
                        <motion.div variants={fadeUp}>
                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400, maxWidth: 560, mx: 'auto', mb: 5 }}>
                                Expert repairs for all your devices. Transparent pricing, fast turnaround, and a 90-day warranty on every job.
                            </Typography>
                        </motion.div>
                        <motion.div variants={fadeUp}>
                            <Button
                                component={Link}
                                href="/auth/register"
                                variant="contained"
                                size="large"
                                sx={{
                                    px: 6, py: 1.8, borderRadius: 50, fontSize: '1rem', fontWeight: 700,
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                    boxShadow: '0 20px 40px -10px rgba(59,130,246,0.5)',
                                    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 25px 50px -10px rgba(59,130,246,0.6)' },
                                    transition: 'all 0.3s',
                                }}
                            >
                                Book a Repair Now
                            </Button>
                        </motion.div>
                    </motion.div>
                </Container>
            </Box>

            {/* Service Cards */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
                    <motion.div variants={fadeUp}>
                        <Typography variant="overline" display="block" align="center" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 3, mb: 1 }}>
                            WHAT WE REPAIR
                        </Typography>
                        <Typography variant="h3" align="center" fontWeight="800" gutterBottom>
                            Device Categories
                        </Typography>
                        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8, fontWeight: 400, maxWidth: 500, mx: 'auto' }}>
                            From smartphones to smartwatches — we fix them all.
                        </Typography>
                    </motion.div>

                    <Grid container spacing={4}>
                        {services.map((svc, i) => (
                            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
                                <motion.div variants={fadeUp} whileHover={{ y: -8 }} style={{ height: '100%' }}>
                                    <Paper sx={{
                                        p: 4, borderRadius: 5, height: '100%', position: 'relative',
                                        border: `1px solid ${svc.color}20`,
                                        boxShadow: `0 4px 20px ${svc.color}15`,
                                        transition: 'all 0.3s',
                                        '&:hover': { boxShadow: `0 20px 40px ${svc.color}25` },
                                    }}>
                                        {svc.popular && (
                                            <Chip label="Most Popular" size="small" sx={{
                                                position: 'absolute', top: 16, right: 16,
                                                bgcolor: svc.color, color: 'white', fontWeight: 700, fontSize: '0.7rem'
                                            }} />
                                        )}
                                        <Box sx={{
                                            width: 72, height: 72, borderRadius: 3,
                                            bgcolor: svc.bg, color: svc.color,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            mb: 3,
                                        }}>
                                            {svc.icon}
                                        </Box>
                                        <Typography variant="h6" fontWeight="800" gutterBottom>{svc.title}</Typography>
                                        <Typography variant="h5" fontWeight="900" sx={{ color: svc.color, mb: 1 }}>{svc.price}</Typography>
                                        <Chip label={`⏱ ${svc.turnaround}`} size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 600, mb: 3 }} />
                                        <Stack spacing={1}>
                                            {svc.issues.map((issue) => (
                                                <Stack key={issue} direction="row" alignItems="center" spacing={1}>
                                                    <CheckCircleIcon sx={{ fontSize: 16, color: svc.color }} />
                                                    <Typography variant="body2" color="text.secondary">{issue}</Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                        <Button
                                            component={Link}
                                            href="/auth/register"
                                            fullWidth
                                            variant="outlined"
                                            sx={{
                                                mt: 4, borderRadius: 50, fontWeight: 700,
                                                borderColor: svc.color, color: svc.color,
                                                '&:hover': { bgcolor: svc.bg, borderColor: svc.color },
                                            }}
                                        >
                                            Book Now
                                        </Button>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>

            {/* Common Issues */}
            <Box sx={{ bgcolor: '#0f172a', py: 14 }}>
                <Container maxWidth="lg">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
                        <motion.div variants={fadeUp}>
                            <Typography variant="overline" display="block" align="center" sx={{ color: '#60a5fa', fontWeight: 700, letterSpacing: 3, mb: 1 }}>
                                COMMON PROBLEMS
                            </Typography>
                            <Typography variant="h3" align="center" fontWeight="800" sx={{ color: 'white', mb: 2 }}>
                                Issues We Solve
                            </Typography>
                            <Typography variant="h6" align="center" sx={{ color: 'rgba(255,255,255,0.5)', mb: 10, fontWeight: 400 }}>
                                No matter the problem, our certified technicians have you covered.
                            </Typography>
                        </motion.div>
                        <Grid container spacing={4}>
                            {commonIssues.map((issue, i) => (
                                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                                    <motion.div variants={fadeUp}>
                                        <Paper sx={{
                                            p: 4, borderRadius: 4, textAlign: 'center',
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            backdropFilter: 'blur(10px)',
                                        }}>
                                            <Avatar sx={{ bgcolor: `${issue.color}20`, color: issue.color, width: 60, height: 60, mx: 'auto', mb: 2 }}>
                                                {issue.icon}
                                            </Avatar>
                                            <Typography variant="h6" fontWeight="700" sx={{ color: 'white', mb: 1 }}>{issue.label}</Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{issue.desc}</Typography>
                                        </Paper>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Container>
            </Box>

            {/* Guarantees */}
            <Container maxWidth="lg" sx={{ py: 14 }}>
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
                    <motion.div variants={fadeUp}>
                        <Typography variant="overline" display="block" align="center" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 3, mb: 1 }}>
                            OUR PROMISE
                        </Typography>
                        <Typography variant="h3" align="center" fontWeight="800" gutterBottom>
                            The Gadget Fix Guarantee
                        </Typography>
                        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8, fontWeight: 400 }}>
                            We stand behind every repair we do.
                        </Typography>
                    </motion.div>
                    <Grid container spacing={3} justifyContent="center">
                        {guarantees.map((g, i) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                                <motion.div variants={fadeUp}>
                                    <Paper sx={{
                                        p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2,
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
                                    }}>
                                        <ShieldIcon sx={{ color: '#3b82f6', fontSize: 28, flexShrink: 0 }} />
                                        <Typography variant="body1" fontWeight="600">{g}</Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>

            {/* CTA */}
            <Box sx={{
                py: 14,
                background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
                textAlign: 'center',
            }}>
                <Container maxWidth="md">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
                        <motion.div variants={fadeUp}>
                            <Typography variant="h3" fontWeight="900" sx={{ color: 'white', mb: 2 }}>
                                Ready to Get Your Device Fixed?
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', mb: 5, fontWeight: 400 }}>
                                Book online in under 2 minutes. We'll handle the rest.
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                                <Button
                                    component={Link}
                                    href="/auth/register"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        px: 6, py: 1.8, borderRadius: 50, fontWeight: 700,
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                        boxShadow: '0 20px 40px -10px rgba(59,130,246,0.5)',
                                        '&:hover': { transform: 'translateY(-3px)' },
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    Book a Repair
                                </Button>
                                <Button
                                    component={Link}
                                    href="/auth/login"
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        px: 6, py: 1.8, borderRadius: 50, fontWeight: 700,
                                        borderColor: 'rgba(255,255,255,0.3)', color: 'white',
                                        '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' },
                                    }}
                                >
                                    Track My Order
                                </Button>
                            </Stack>
                        </motion.div>
                    </motion.div>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ bgcolor: '#020617', py: 4 }}>
                <Container maxWidth="lg">
                    <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                        © 2026 Gadget Fix. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}
