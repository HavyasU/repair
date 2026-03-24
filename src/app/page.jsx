'use client';
import {
  Box, Container, Typography, Button, Grid,
  Paper, Avatar, Chip, Stack
} from '@mui/material';
import Navbar from '@/components/common/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import LaptopIcon from '@mui/icons-material/Laptop';
import TabletIcon from '@mui/icons-material/Tablet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StarIcon from '@mui/icons-material/Star';
import ShieldIcon from '@mui/icons-material/Shield';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

/* ─── animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

/* ─── data ─── */
const steps = [
  { icon: <SmartphoneIcon sx={{ fontSize: 36 }} />, title: 'Select Device', desc: 'Pick your device type, brand, and model from our comprehensive list.', color: '#3b82f6', bg: '#eff6ff' },
  { icon: <CheckCircleIcon sx={{ fontSize: 36 }} />, title: 'Get Instant Quote', desc: 'Receive a transparent price estimate before you commit to anything.', color: '#10b981', bg: '#ecfdf5' },
  { icon: <AccessTimeIcon sx={{ fontSize: 36 }} />, title: 'Schedule Pickup', desc: 'Choose a convenient date and time slot for doorstep pickup.', color: '#8b5cf6', bg: '#f5f3ff' },
  { icon: <LocalShippingIcon sx={{ fontSize: 36 }} />, title: 'Fast Delivery', desc: 'We repair and deliver your device back, good as new.', color: '#f59e0b', bg: '#fffbeb' },
];

const services = [
  { icon: <SmartphoneIcon sx={{ fontSize: 48, color: '#3b82f6' }} />, label: 'Smartphones', count: '200+ models' },
  { icon: <LaptopIcon sx={{ fontSize: 48, color: '#8b5cf6' }} />, label: 'Laptops', count: '150+ models' },
  { icon: <TabletIcon sx={{ fontSize: 48, color: '#10b981' }} />, label: 'Tablets', count: '80+ models' },
  { icon: <BuildCircleIcon sx={{ fontSize: 48, color: '#f59e0b' }} />, label: 'Other Gadgets', count: 'Watches, etc.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'iPhone User', text: 'Got my cracked screen fixed in under 2 hours. The technician was professional and the price was exactly what was quoted online.', rating: 5 },
  { name: 'Rahul Mehta', role: 'Laptop Owner', text: 'My laptop battery was dead. Gadget Fix replaced it same day and even cleaned the internals. Highly recommended!', rating: 5 },
  { name: 'Ananya Patel', role: 'Samsung User', text: 'Booked online, got a pickup in 30 minutes. The whole experience was seamless. Will definitely use again.', rating: 5 },
];

const whyUs = [
  { icon: <ShieldIcon sx={{ fontSize: 32, color: '#3b82f6' }} />, title: '90-Day Warranty', desc: 'All repairs come with a 90-day warranty on parts and labor.' },
  { icon: <SpeedIcon sx={{ fontSize: 32, color: '#10b981' }} />, title: 'Same-Day Repair', desc: 'Most repairs completed within 2–4 hours of pickup.' },
  { icon: <SupportAgentIcon sx={{ fontSize: 32, color: '#8b5cf6' }} />, title: '24/7 Support', desc: 'Our support team is available around the clock for you.' },
];

const brands = [
  { name: 'Apple', desc: 'iPhone, iPad & MacBook', img: '/landing/apple.png', color: '#000' },
  { name: 'Samsung', desc: 'Galaxy S & Tab Series', img: '/landing/samsung.png', color: '#034ea2' },
  { name: 'Dell & HP', desc: 'XPS, Inspiron & Spectre', img: '/landing/laptops.png', color: '#0078d4' },
];

/* ─── component ─── */
export default function Home() {
  const { user } = useAuth();
  const dashboardHref = user?.role === 'admin'
    ? '/dashboard/admin'
    : user?.role === 'technician'
      ? '/dashboard/technician'
      : '/dashboard/user/book';

  return (
    <Box sx={{ bgcolor: '#f8fafc', overflowX: 'hidden' }}>
      <Navbar />

      {/* ── HERO ── */}
      <Box sx={{
        position: 'relative',
        minHeight: { xs: 'auto', md: '92vh' },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        pt: { xs: 10, md: 0 },
        pb: { xs: 10, md: 0 },
      }}>
        {/* Gradient background */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          zIndex: 0,
        }} />
        {/* Glowing orbs */}
        <Box sx={{ position: 'absolute', top: '10%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)', zIndex: 1 }} />
        <Box sx={{ position: 'absolute', bottom: '5%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', zIndex: 1 }} />
        <Box sx={{ position: 'absolute', top: '50%', right: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', zIndex: 1 }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial="hidden" animate="show" variants={stagger}>
                <motion.div variants={fadeUp}>
                  <Chip
                    label="⚡ Fast · Reliable · Guaranteed"
                    sx={{ mb: 3, bgcolor: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)', fontWeight: 600, letterSpacing: 1 }}
                  />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Typography variant="h1" sx={{
                    fontSize: { xs: '2.8rem', md: '4rem' },
                    fontWeight: 900,
                    lineHeight: 1.1,
                    color: 'white',
                    mb: 3,
                  }}>
                    Your Gadget,{' '}
                    <Box component="span" sx={{
                      background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #34d399)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      Fixed Fast.
                    </Box>
                  </Typography>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.65)', mb: 5, fontWeight: 400, lineHeight: 1.7, maxWidth: 480 }}>
                    Professional repair for smartphones, laptops & tablets. Doorstep pickup, transparent pricing, and a 90-day warranty on every repair.
                  </Typography>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    {user ? (
                      <Button
                        variant="contained"
                        size="large"
                        component={Link}
                        href={dashboardHref}
                        sx={{
                          px: 5, py: 1.8, fontSize: '1.05rem', borderRadius: 50,
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                          boxShadow: '0 20px 40px -10px rgba(59,130,246,0.5)',
                          '&:hover': { boxShadow: '0 25px 50px -10px rgba(59,130,246,0.6)', transform: 'translateY(-3px)' },
                          transition: 'all 0.3s',
                        }}
                      >
                        Go to Dashboard
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          size="large"
                          component={Link}
                          href="/auth/register"
                          sx={{
                            px: 5, py: 1.8, fontSize: '1.05rem', borderRadius: 50,
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            boxShadow: '0 20px 40px -10px rgba(59,130,246,0.5)',
                            '&:hover': { boxShadow: '0 25px 50px -10px rgba(59,130,246,0.6)', transform: 'translateY(-3px)' },
                            transition: 'all 0.3s',
                          }}
                        >
                          Book a Repair
                        </Button>
                        <Button
                          variant="outlined"
                          size="large"
                          component={Link}
                          href="/auth/login"
                          sx={{
                            px: 5, py: 1.8, fontSize: '1.05rem', borderRadius: 50,
                            borderColor: 'rgba(255,255,255,0.3)', color: 'white',
                            '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' },
                          }}
                        >
                          Track My Order
                        </Button>
                      </>
                    )}
                  </Stack>
                </motion.div>

                {/* Trust badges */}
                <motion.div variants={fadeUp}>
                  <Stack direction="row" spacing={4} sx={{ mt: 6 }}>
                    {[['10K+', 'Repairs Done'], ['4.9★', 'Rating'], ['90 Day', 'Warranty']].map(([val, label]) => (
                      <Box key={label}>
                        <Typography variant="h5" fontWeight="800" color="white">{val}</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{label}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </motion.div>
              </motion.div>
            </Grid>

            {/* Hero visual */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Box sx={{ position: 'relative', width: 420, height: 420 }}>
                  {/* Central circle */}
                  <Box sx={{
                    width: 420, height: 420, borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.15) 100%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <BuildCircleIcon sx={{ fontSize: 160, color: 'rgba(255,255,255,0.08)' }} />
                  </Box>
                  {/* Floating cards */}
                  {[
                    { top: 0, left: '50%', transform: 'translateX(-50%)', label: 'Screen Fixed ✓', color: '#3b82f6' },
                    { top: '50%', left: -20, transform: 'translateY(-50%)', label: 'Battery 100% ✓', color: '#10b981' },
                    { top: '50%', right: -20, transform: 'translateY(-50%)', label: 'Data Safe ✓', color: '#8b5cf6' },
                    { bottom: 0, left: '50%', transform: 'translateX(-50%)', label: 'Delivered ✓', color: '#f59e0b' },
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      style={{ position: 'absolute', top: card.top, left: card.left, right: card.right, bottom: card.bottom, transform: card.transform }}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, delay: i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Paper sx={{
                        px: 2.5, py: 1.5, borderRadius: 3, whiteSpace: 'nowrap',
                        background: 'rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${card.color}40`,
                        boxShadow: `0 8px 32px ${card.color}30`,
                      }}>
                        <Typography variant="body2" fontWeight="700" sx={{ color: card.color }}>{card.label}</Typography>
                      </Paper>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── SERVICES ── */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <Typography variant="overline" display="block" align="center" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 3, mb: 1 }}>
              WHAT WE FIX
            </Typography>
            <Typography variant="h2" align="center" fontWeight="800" gutterBottom>
              All Your Devices, Covered
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: 500, mx: 'auto', fontWeight: 400 }}>
              From cracked screens to dead batteries — we handle it all.
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            {services.map((s, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={i}>
                <motion.div variants={fadeUp} whileHover={{ y: -8 }}>
                  <Paper sx={{
                    p: 4, textAlign: 'center', borderRadius: 5,
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.3s',
                    '&:hover': { boxShadow: '0 20px 40px -10px rgba(0,0,0,0.12)' },
                  }}>
                    <Box sx={{ mb: 2 }}>{s.icon}</Box>
                    <Typography variant="h6" fontWeight="700" gutterBottom>{s.label}</Typography>
                    <Chip label={s.count} size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 600 }} />
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* ── HOW IT WORKS ── */}
      <Box sx={{ bgcolor: '#0f172a', py: 14 }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <Typography variant="overline" display="block" align="center" sx={{ color: '#60a5fa', fontWeight: 700, letterSpacing: 3, mb: 1 }}>
                THE PROCESS
              </Typography>
              <Typography variant="h2" align="center" fontWeight="800" sx={{ color: 'white', mb: 2 }}>
                How It Works
              </Typography>
              <Typography variant="h6" align="center" sx={{ color: 'rgba(255,255,255,0.5)', mb: 10, fontWeight: 400 }}>
                4 simple steps to get your device back in perfect condition.
              </Typography>
            </motion.div>

            <Grid container spacing={4}>
              {steps.map((step, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                  <motion.div variants={fadeUp}>
                    <Box sx={{ textAlign: 'center', position: 'relative' }}>
                      {/* Step number */}
                      <Typography variant="h1" sx={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontSize: '6rem', fontWeight: 900, color: 'rgba(255,255,255,0.03)', lineHeight: 1, userSelect: 'none' }}>
                        {i + 1}
                      </Typography>
                      <Box sx={{
                        width: 80, height: 80, borderRadius: '50%',
                        bgcolor: step.bg, mx: 'auto', mb: 3,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: step.color,
                        boxShadow: `0 0 0 8px ${step.color}15`,
                      }}>
                        {step.icon}
                      </Box>
                      <Typography variant="h6" fontWeight="700" sx={{ color: 'white', mb: 1.5 }}>{step.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{step.desc}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ── BRANDS WE SERVICE ── */}
      <Container maxWidth="lg" sx={{ py: 14 }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <Typography variant="overline" display="block" align="center" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 3, mb: 1 }}>
              OUR EXPERTISE
            </Typography>
            <Typography variant="h2" align="center" fontWeight="800" gutterBottom>
              Brands We Service
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
              We specialize in top-tier brands, using genuine parts and expert techniques for every repair.
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {brands.map((brand, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <motion.div variants={fadeUp} whileHover={{ y: -10 }}>
                  <Paper
                    component={Link}
                    href={user ? dashboardHref : "/auth/register"}
                    sx={{
                      display: 'block', textDecoration: 'none', color: 'inherit',
                      borderRadius: 6, overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.05)',
                      boxShadow: '0 10px 30px -5px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': { boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' },
                      cursor: 'pointer'
                    }}
                  >
                    <Box sx={{ height: 280, position: 'relative', overflow: 'hidden', bgcolor: '#f8fafc' }}>
                      <Box
                        component="img"
                        src={brand.img}
                        alt={brand.name}
                        sx={{
                          width: '100%', height: '100%', objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                          '&:hover': { transform: 'scale(1.1)' }
                        }}
                      />
                      <Box sx={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)',
                      }} />
                    </Box>
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight="900" gutterBottom>{brand.name}</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{brand.desc}</Typography>
                      <Box sx={{ height: 4, width: 40, bgcolor: brand.color, mx: 'auto', borderRadius: 2 }} />
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* ── WHY US ── */}
      <Container maxWidth="lg" sx={{ py: 14 }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <Typography variant="overline" display="block" align="center" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 3, mb: 1 }}>
              WHY GADGET FIX
            </Typography>
            <Typography variant="h2" align="center" fontWeight="800" gutterBottom>
              Built on Trust
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 10, fontWeight: 400 }}>
              We're not just fixing gadgets — we're building relationships.
            </Typography>
          </motion.div>

          <Grid container spacing={4} justifyContent="center">
            {whyUs.map((w, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <motion.div variants={fadeUp} whileHover={{ y: -6 }}>
                  <Paper sx={{
                    p: 5, borderRadius: 5,
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.3s',
                    '&:hover': { boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' },
                  }}>
                    <Box sx={{ mb: 2 }}>{w.icon}</Box>
                    <Typography variant="h6" fontWeight="700" gutterBottom>{w.title}</Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{w.desc}</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* ── TESTIMONIALS ── */}
      <Box sx={{ bgcolor: '#f1f5f9', py: 14 }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <Typography variant="overline" display="block" align="center" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 3, mb: 1 }}>
                TESTIMONIALS
              </Typography>
              <Typography variant="h2" align="center" fontWeight="800" gutterBottom>
                Loved by Customers
              </Typography>
              <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 10, fontWeight: 400 }}>
                Don't take our word for it — hear from our happy customers.
              </Typography>
            </motion.div>

            <Grid container spacing={4}>
              {testimonials.map((t, i) => (
                <Grid size={{ xs: 12, md: 4 }} key={i}>
                  <motion.div variants={fadeUp} whileHover={{ y: -6 }}>
                    <Paper sx={{
                      p: 4, borderRadius: 5, height: '100%',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                      border: '1px solid rgba(0,0,0,0.04)',
                      transition: 'box-shadow 0.3s',
                      '&:hover': { boxShadow: '0 20px 40px -10px rgba(0,0,0,0.12)' },
                    }}>
                      <Stack direction="row" spacing={0.5} sx={{ mb: 3 }}>
                        {Array(t.rating).fill(0).map((_, j) => (
                          <StarIcon key={j} sx={{ color: '#f59e0b', fontSize: 20 }} />
                        ))}
                      </Stack>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8, fontStyle: 'italic' }}>
                        "{t.text}"
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>{t.name[0]}</Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="700">{t.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ── CTA ── */}
      <Box sx={{
        py: 16,
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <Typography variant="h2" fontWeight="900" sx={{ color: 'white', mb: 3 }}>
                Ready to Fix Your Device?
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', mb: 6, fontWeight: 400 }}>
                Book a repair in under 2 minutes. No hidden fees, no surprises.
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={Link}
                href="/auth/register"
                sx={{
                  px: 8, py: 2.2, fontSize: '1.15rem', borderRadius: 50,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  boxShadow: '0 20px 40px -10px rgba(59,130,246,0.5)',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 30px 60px -10px rgba(59,130,246,0.6)' },
                  transition: 'all 0.3s',
                }}
              >
                Get Started — It's Free
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* ── FOOTER ── */}
      <Box sx={{ bgcolor: '#020617', py: 6 }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <BuildCircleIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
              <Typography variant="h6" fontWeight="800" sx={{ color: 'white' }}>Gadget Fix</Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
              © 2026 Gadget Fix. All rights reserved.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
