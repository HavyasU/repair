'use client';
import { createTheme } from '@mui/material/styles';
import { Outfit } from 'next/font/google';

const font = Outfit({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    typography: {
        fontFamily: font.style.fontFamily,
        h1: { fontSize: '3.5rem', fontWeight: 800, letterSpacing: -1 },
        h2: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: -0.5 },
        h3: { fontSize: '2rem', fontWeight: 700 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    palette: {
        mode: 'light',
        primary: {
            main: '#2563eb', // Vibrant Blue
            light: '#60a5fa',
            dark: '#1e40af',
        },
        secondary: {
            main: '#10b981', // Refreshing Green
            light: '#34d399',
            dark: '#059669',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a',
            secondary: '#64748b',
        },
    },
    shadows: [
        'none',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -1px rgba(0,0,0,0.06)', // soft shadow
        '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)', // hover shadow
        ...Array(21).fill('none'), // Only custom ones for now
    ],
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 50,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 10px 20px -10px rgba(37, 99, 235, 0.5)',
                        transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease-in-out',
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    transition: 'box-shadow 0.3s ease-in-out',
                },
                elevation1: {
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    color: '#0f172a',
                },
            },
        },
    },
});

export default theme;
