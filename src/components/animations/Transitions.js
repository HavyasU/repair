'use client';
import { motion, AnimatePresence } from 'framer-motion';

export const FadeIn = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, delay }}
    >
        {children}
    </motion.div>
);

export const SlideIn = ({ children, direction = 'left', delay = 0 }) => {
    const x = direction === 'left' ? -50 : 50;
    return (
        <motion.div
            initial={{ opacity: 0, x }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            {children}
        </motion.div>
    );
};
