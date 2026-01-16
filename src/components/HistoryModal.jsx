import React, { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { FiX, FiTrash2 } from 'react-icons/fi';

const HistoryModal = ({ isOpen, onClose }) => {
    const { history, deleteHistoryItem, clearAllHistory } = useGame();
    const modalRef = useRef(null);

    // Keyboard navigation (ESC to close)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Focus the modal when it opens
            modalRef.current?.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleDeleteItem = useCallback((index, date, count) => {
        if (window.confirm(`Delete history entry for ${date} (${count.toLocaleString()} counts)?`)) {
            deleteHistoryItem(index);
        }
    }, [deleteHistoryItem]);

    const handleClearAll = useCallback(() => {
        if (history.length === 0) return;

        if (window.confirm(`Are you sure you want to delete all ${history.length} history entries? This action cannot be undone.`)) {
            clearAllHistory();
            onClose();
        }
    }, [history.length, clearAllHistory, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        padding: 'var(--spacing-md)'
                    }}
                    onClick={onClose}
                    role="presentation"
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="glass-panel"
                        style={{
                            width: '100%',
                            maxWidth: '450px',
                            maxHeight: '70vh',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="history-modal-title"
                        tabIndex={-1}
                    >
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'var(--spacing-md)',
                            paddingBottom: 'var(--spacing-sm)',
                            borderBottom: '1px solid var(--glass-border)'
                        }}>
                            <h2
                                id="history-modal-title"
                                style={{ margin: 0, fontSize: '1.2rem' }}
                            >
                                History {history.length > 0 && `(${history.length})`}
                            </h2>
                            <button
                                onClick={onClose}
                                style={{ padding: '0.4rem' }}
                                aria-label="Close history modal"
                            >
                                <FiX size={20} aria-hidden="true" />
                            </button>
                        </div>

                        {/* History List */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--spacing-sm)',
                            marginBottom: 'var(--spacing-md)'
                        }}>
                            {history.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: 'var(--spacing-lg)',
                                    color: 'var(--text-secondary)'
                                }}>
                                    <p>No history yet.</p>
                                    <p style={{ fontSize: '0.9em', marginTop: '0.5rem' }}>
                                        Your daily counts will appear here.
                                    </p>
                                </div>
                            ) : (
                                history.map((entry, index) => (
                                    <motion.div
                                        key={`${entry.date}-${index}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: 'var(--spacing-sm)',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '8px',
                                            gap: '0.5rem',
                                            transition: 'background 0.2s'
                                        }}
                                        whileHover={{ background: 'rgba(255,255,255,0.08)' }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                {entry.date}
                                            </div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '0.2rem' }}>
                                                {entry.count.toLocaleString()} counts
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteItem(index, entry.date, entry.count)}
                                            style={{
                                                padding: '0.5rem',
                                                minWidth: '44px',
                                                minHeight: '44px',
                                                background: 'rgba(220, 38, 38, 0.1)',
                                                border: '1px solid rgba(220, 38, 38, 0.3)',
                                                color: '#ef4444',
                                                transition: 'all 0.2s'
                                            }}
                                            aria-label={`Delete history for ${entry.date}`}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.2)';
                                                e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.5)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
                                                e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)';
                                            }}
                                        >
                                            <FiTrash2 size={16} aria-hidden="true" />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer with Clear All Button */}
                        {history.length > 0 && (
                            <div style={{
                                paddingTop: 'var(--spacing-sm)',
                                borderTop: '1px solid var(--glass-border)'
                            }}>
                                <button
                                    onClick={handleClearAll}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(220, 38, 38, 0.1)',
                                        border: '1px solid rgba(220, 38, 38, 0.3)',
                                        color: '#ef4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        fontWeight: 500,
                                        transition: 'all 0.2s'
                                    }}
                                    aria-label="Delete history"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.2)';
                                        e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)';
                                    }}
                                >
                                    <FiTrash2 size={16} aria-hidden="true" />
                                    Delete History
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default HistoryModal;
