import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { FiX } from 'react-icons/fi';

const HistoryModal = ({ isOpen, onClose }) => {
    const { history } = useGame();

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    padding: 'var(--spacing-md)'
                }} onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="glass-panel"
                        style={{ width: '100%', maxWidth: '400px', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>History</h2>
                            <button onClick={onClose} style={{ padding: '0.4rem' }}><FiX size={20} /></button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                            {history.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No history yet.</p>
                            ) : (
                                history.map((entry, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: 'var(--spacing-sm)',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px'
                                    }}>
                                        <span>{entry.date}</span>
                                        <span style={{ fontWeight: 'bold' }}>{entry.count.toLocaleString()}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default HistoryModal;
