import React from 'react';
import { useGame } from '../context/GameContext';
import { FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MILESTONES = [
    { name: 'Bronze', limit: 11000, color: 'var(--accent-bronze)' },
    { name: 'Silver', limit: 21600, color: 'var(--accent-silver)' },
    { name: 'Gold', limit: 51000, color: 'var(--accent-gold)' },
    { name: 'Diamond', limit: 100000, color: 'var(--accent-diamond)' }
];

const AchievementBanner = () => {
    const { count } = useGame();

    // Find next milestone
    const nextMilestone = MILESTONES.find(m => count < m.limit) || MILESTONES[MILESTONES.length - 1];
    const isMaxed = count >= MILESTONES[MILESTONES.length - 1].limit;

    // Calculate progress to next milestone
    const prevLimit = MILESTONES[MILESTONES.indexOf(nextMilestone) - 1]?.limit || 0;
    const progress = isMaxed ? 100 : Math.min(100, ((count - prevLimit) / (nextMilestone.limit - prevLimit)) * 100);

    return (
        <div style={{ padding: '0 var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Next: <span style={{ color: nextMilestone.color, fontWeight: 'bold' }}>{nextMilestone.name}</span>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                        {Math.floor(progress)}%
                    </span>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        style={{ height: '100%', background: nextMilestone.color, borderRadius: '4px' }}
                    />
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-sm)' }}>
                    {MILESTONES.map((m) => (
                        <div key={m.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: count >= m.limit ? 1 : 0.3 }}>
                            <FiAward size={24} color={m.color} />
                            <span style={{ fontSize: '0.7rem', marginTop: '4px' }}>{m.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AchievementBanner;
