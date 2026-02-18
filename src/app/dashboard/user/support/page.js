'use client';
import { useState } from 'react';
import {
    Typography, Paper, Box, Stack, TextField, Button,
    Divider, Avatar, Chip, Alert, CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SendIcon from '@mui/icons-material/Send';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';


const faqs = [
    { q: 'How long does a typical repair take?', a: 'Most repairs are completed within 2–4 hours. Complex repairs like motherboard fixes may take 1–2 days.' },
    { q: 'Is my data safe during repair?', a: 'Absolutely. Our technicians are trained to handle devices without accessing personal data. We recommend backing up before any repair.' },
    { q: 'What is your warranty policy?', a: 'All repairs come with a 90-day warranty on parts and labor. If the same issue recurs, we fix it for free.' },
    { q: 'Can I cancel or reschedule a booking?', a: 'Yes, you can cancel or reschedule up to 2 hours before the scheduled pickup time.' },
];

export default function SupportPage() {
    const [form, setForm] = useState({ subject: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setSubmitting(true); setError('');
        try {
            await axios.post('/api/support', form);
            setSubmitted(true);
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to submit. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" fontWeight="900">Support Center</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    We're here to help. Reach out anytime.
                </Typography>
            </Box>

            {/* Contact options */}
            <Box>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 5 }}>
                    {[
                        { icon: <PhoneIcon />, label: 'Call Us', value: '+91 98765 43210', color: '#3b82f6', bg: '#eff6ff' },
                        { icon: <EmailIcon />, label: 'Email Us', value: 'support@gadgetfix.in', color: '#10b981', bg: '#ecfdf5' },
                        { icon: <ChatIcon />, label: 'Live Chat', value: 'Available 9AM – 9PM', color: '#8b5cf6', bg: '#f5f3ff' },
                    ].map((c, i) => (
                        <Paper key={i} sx={{
                            p: 3, borderRadius: 4, flex: 1, display: 'flex', alignItems: 'center', gap: 2,
                            border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
                            transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' },
                        }}>
                            <Avatar sx={{ bgcolor: c.bg, color: c.color }}>{c.icon}</Avatar>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight="600">{c.label}</Typography>
                                <Typography variant="subtitle2" fontWeight="700">{c.value}</Typography>
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            </Box>

            {/* Ticket form */}
            <Box>
                <Paper sx={{ p: 5, borderRadius: 4, mb: 5, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)' }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                        <SupportAgentIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
                        <Typography variant="h6" fontWeight="700">Submit a Support Ticket</Typography>
                    </Stack>
                    <Divider sx={{ mb: 4 }} />
                    {submitted ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <CheckCircleIcon sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
                            <Typography variant="h6" fontWeight="700" gutterBottom>Ticket Submitted!</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                We'll get back to you within 24 hours.
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={() => { setSubmitted(false); setForm({ subject: '', message: '' }); }}
                                sx={{ borderRadius: 50, px: 4 }}
                            >
                                Submit Another
                            </Button>
                        </Box>
                    ) : (
                        <Stack spacing={3}>
                            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
                            <TextField
                                fullWidth label="Subject" value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                fullWidth label="Describe your issue" value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                multiline rows={5}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <Button
                                variant="contained"
                                endIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                                disabled={!form.subject || !form.message || submitting}
                                onClick={handleSubmit}
                                sx={{
                                    alignSelf: 'flex-start', borderRadius: 50, px: 5, py: 1.5, fontWeight: 700,
                                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                    boxShadow: '0 10px 20px -5px rgba(37,99,235,0.4)',
                                    '&:hover': { transform: 'translateY(-2px)' },
                                    transition: 'all 0.3s',
                                }}
                            >
                                {submitting ? 'Sending...' : 'Send Ticket'}
                            </Button>
                        </Stack>
                    )}
                </Paper>
            </Box>

            {/* FAQs */}
            <Box>
                <Typography variant="h5" fontWeight="800" gutterBottom sx={{ mb: 3 }}>Frequently Asked Questions</Typography>
                <Stack spacing={2}>
                    {faqs.map((faq, i) => (
                        <motion.div key={i} whileHover={{ y: -2 }}>
                            <Paper sx={{
                                p: 3.5, borderRadius: 4,
                                border: '1px solid rgba(0,0,0,0.05)',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
                                transition: 'box-shadow 0.3s',
                                '&:hover': { boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' },
                            }}>
                                <Typography variant="subtitle1" fontWeight="700" gutterBottom>{faq.q}</Typography>
                                <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{faq.a}</Typography>
                            </Paper>
                        </motion.div>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}
