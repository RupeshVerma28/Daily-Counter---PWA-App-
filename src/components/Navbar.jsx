import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiClock, FiDownload, FiActivity, FiMenu, FiX, FiRotateCcw } from 'react-icons/fi';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onHistoryToggle }) => {
    const { resetCount } = useGame();
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Handle PWA install prompt
    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    // Note: Body scroll is already locked via CSS (overflow: hidden on body)
    // No additional scroll lock needed for the menu

    // Memoized handlers to prevent re-renders
    const openMenu = useCallback(() => {
        setIsMenuOpen(true);
    }, []);

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    // Keyboard navigation (ESC to close)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        };

        if (isMenuOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Focus the menu when it opens
            menuRef.current?.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMenuOpen, closeMenu]);

    const handleInstallClick = useCallback(async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
        closeMenu();
    }, [deferredPrompt, closeMenu]);

    const handleReset = useCallback(() => {
        if (window.confirm('Are you sure you want to reset today\'s count to 0?')) {
            resetCount();
            closeMenu();
        }
    }, [resetCount, closeMenu]);

    const toggleHistory = useCallback(() => {
        onHistoryToggle();
        closeMenu();
    }, [onHistoryToggle, closeMenu]);

    return (
        <nav
            style={{
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
            }}
            role="navigation"
            aria-label="Main navigation"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                <FiActivity aria-hidden="true" />
                <span>Talley Counter</span>
            </div>

            {/* Desktop Actions */}
            <div className="desktop-nav" style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <button
                    onClick={handleReset}
                    title="Reset Daily Count"
                    aria-label="Reset today's count to zero"
                >
                    <FiRotateCcw size={18} aria-hidden="true" />
                    <span style={{ fontSize: '0.8em', marginLeft: 4 }}>Reset</span>
                </button>
                {deferredPrompt && (
                    <button
                        onClick={handleInstallClick}
                        title="Install App"
                        aria-label="Install Talley Counter app"
                    >
                        <FiDownload size={20} aria-hidden="true" />
                    </button>
                )}
                <button
                    onClick={toggleHistory}
                    title="View History"
                    aria-label="View counting history"
                >
                    <FiClock size={20} aria-hidden="true" />
                </button>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="mobile-nav-trigger">
                <button
                    onClick={openMenu}
                    aria-label="Open navigation menu"
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-menu"
                >
                    <FiMenu size={24} aria-hidden="true" />
                </button>
            </div>

            {/* Mobile Menu with Backdrop - Rendered via Portal to avoid stacking context issues */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence mode="wait">
                    {isMenuOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={closeMenu}
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'rgba(0, 0, 0, 0.6)',
                                    backdropFilter: 'blur(2px)',
                                    WebkitBackdropFilter: 'blur(2px)',
                                    zIndex: 999,
                                    pointerEvents: 'auto',
                                    touchAction: 'none'
                                }}
                                aria-hidden="true"
                            />

                            {/* Menu Panel */}
                            <motion.div
                                key="menu"
                                id="mobile-menu"
                                ref={menuRef}
                                role="dialog"
                                aria-modal="true"
                                aria-label="Navigation menu"
                                tabIndex={-1}
                                initial={{ opacity: 0, x: '100%' }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: '100%' }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    width: 'min(300px, 80vw)',
                                    maxWidth: '80vw',
                                    height: '100dvh',
                                    background: '#0a0a0a',
                                    zIndex: 1000,
                                    padding: 'var(--spacing-lg)',
                                    borderLeft: '1px solid var(--glass-border)',
                                    boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--spacing-md)',
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    pointerEvents: 'auto',
                                    touchAction: 'pan-y',
                                    WebkitOverflowScrolling: 'touch'
                                }}
                            >
                                {/* Close Button */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-md)' }}>
                                    <button
                                        onClick={closeMenu}
                                        style={{ border: 'none', background: 'transparent', padding: '0.5rem' }}
                                        aria-label="Close navigation menu"
                                    >
                                        <FiX size={24} aria-hidden="true" />
                                    </button>
                                </div>

                                <h3 style={{
                                    borderBottom: '1px solid var(--glass-border)',
                                    paddingBottom: '0.5rem',
                                    marginBottom: '1rem',
                                    color: 'var(--text-secondary)',
                                    margin: 0
                                }}>
                                    Menu
                                </h3>

                                {/* Menu Items */}
                                <button
                                    onClick={toggleHistory}
                                    style={{
                                        justifyContent: 'flex-start',
                                        textAlign: 'left',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}
                                    aria-label="View counting history"
                                >
                                    <FiClock aria-hidden="true" /> History
                                </button>

                                <button
                                    onClick={handleReset}
                                    style={{
                                        justifyContent: 'flex-start',
                                        textAlign: 'left',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: 'var(--text-secondary)'
                                    }}
                                    aria-label="Reset today's count to zero"
                                >
                                    <FiRotateCcw aria-hidden="true" /> Reset Daily Count
                                </button>

                                {deferredPrompt && (
                                    <button
                                        onClick={handleInstallClick}
                                        style={{
                                            justifyContent: 'flex-start',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginTop: 'auto',
                                            background: 'var(--accent-primary)',
                                            border: 'none',
                                            color: '#fff'
                                        }}
                                        aria-label="Install Talley Counter app"
                                    >
                                        <FiDownload aria-hidden="true" /> Install App
                                    </button>
                                )}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </nav>
    );
};

export default Navbar;
