import React, { useState, useEffect } from 'react';
import { FiClock, FiDownload, FiActivity, FiMenu, FiX, FiRotateCcw } from 'react-icons/fi';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onHistoryToggle }) => {
    const { resetCount } = useGame();
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
        setIsMenuOpen(false);
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset today\'s count to 0?')) {
            resetCount();
            setIsMenuOpen(false);
        }
    };

    const toggleHistory = () => {
        onHistoryToggle();
        setIsMenuOpen(false);
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 var(--spacing-lg)',
            height: 'var(--header-height)',
            backdropFilter: 'blur(10px)',
            background: 'rgba(5, 5, 5, 0.6)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid var(--glass-border)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                <FiActivity />
                <span>CountMaster</span>
            </div>

            {/* Desktop Actions */}
            <div className="desktop-nav" style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <button onClick={handleReset} title="Reset Daily Count">
                    <FiRotateCcw size={18} /> <span style={{ fontSize: '0.8em', marginLeft: 4 }}>Reset</span>
                </button>
                {deferredPrompt && (
                    <button onClick={handleInstallClick} title="Install App">
                        <FiDownload size={20} />
                    </button>
                )}
                <button onClick={toggleHistory} title="View History">
                    <FiClock size={20} />
                </button>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="mobile-nav-trigger">
                <button onClick={() => setIsMenuOpen(true)}>
                    <FiMenu size={24} />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{
                            position: 'fixed',
                            top: 0, right: 0, bottom: 0,
                            width: '300px',
                            background: '#0a0a0a',
                            zIndex: 200,
                            padding: 'var(--spacing-lg)',
                            borderLeft: '1px solid var(--glass-border)',
                            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--spacing-md)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-md)' }}>
                            <button onClick={() => setIsMenuOpen(false)} style={{ border: 'none', background: 'transparent' }}>
                                <FiX size={24} />
                            </button>
                        </div>

                        <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Menu</h3>

                        <button onClick={toggleHistory} style={{ justifyContent: 'flex-start', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FiClock /> History
                        </button>

                        <button onClick={handleReset} style={{ justifyContent: 'flex-start', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                            <FiRotateCcw /> Reset Daily Count
                        </button>

                        {deferredPrompt && (
                            <button onClick={handleInstallClick} style={{ justifyContent: 'flex-start', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto', background: 'var(--accent-primary)', border: 'none', color: '#fff' }}>
                                <FiDownload /> Install App
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Overlay Backdrop */}
            {isMenuOpen && (
                <div
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 150
                    }}
                />
            )}
        </nav>
    );
};

export default Navbar;
