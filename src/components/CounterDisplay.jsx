import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

const CounterDisplay = () => {
    const { count, increment } = useGame();
    const [isClicking, setIsClicking] = useState(false);

    const handleClick = () => {
        increment();
        setIsClicking(true);
        setTimeout(() => setIsClicking(false), 100);
    };

    return (
        <div
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent' // Remove tap highlight on mobile
            }}
            onClick={handleClick}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    Daily Count
                </span>
            </motion.div>

            {/* Optimised: No AnimatePresence for the number itself to avoid re-layout thrashing */}
            <motion.h1
                animate={{ scale: isClicking ? 0.95 : 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                style={{
                    fontSize: 'clamp(4rem, 15vw, 8rem)', // Responsive font size
                    margin: 'var(--spacing-md) 0',
                    background: 'linear-gradient(to bottom, #dbe4ee, #7f8fa6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    fontVariantNumeric: 'tabular-nums' // Prevents jitter when width changes
                }}
            >
                {count.toLocaleString()}
            </motion.h1>

            <motion.span
                style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', opacity: 0.7 }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Tap anywhere to increment
            </motion.span>
        </div>
    );
};

export default CounterDisplay;
