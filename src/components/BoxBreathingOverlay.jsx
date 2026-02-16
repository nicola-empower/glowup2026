import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function BoxBreathingOverlay({ isOpen, onClose }) {
    const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale, hold
    const [text, setText] = useState('Breathe In');

    useEffect(() => {
        if (!isOpen) return;

        let timeout;
        const cycle = () => {
            // Inhale (4s)
            setPhase('inhale');
            setText('Inhale...');
            timeout = setTimeout(() => {
                // Hold (4s)
                setPhase('hold-in');
                setText('Hold...');
                timeout = setTimeout(() => {
                    // Exhale (4s)
                    setPhase('exhale');
                    setText('Exhale...');
                    timeout = setTimeout(() => {
                        // Hold (4s)
                        setPhase('hold-out');
                        setText('Hold...');
                        timeout = setTimeout(cycle, 4000);
                    }, 4000);
                }, 4000);
            }, 4000);
        };

        cycle();
        return () => clearTimeout(timeout);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            >
                <div className="relative flex items-center justify-center w-80 h-80" onClick={(e) => e.stopPropagation()}>
                    <motion.div
                        className="absolute inset-0 rounded-full bg-champagne/30 blur-2xl"
                        animate={{
                            scale: phase === 'inhale' ? 1.5 : phase === 'exhale' ? 0.8 : 1.2,
                            opacity: phase === 'hold-in' || phase === 'hold-out' ? 0.8 : 0.5
                        }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="w-48 h-48 rounded-full bg-champagne flex items-center justify-center shadow-2xl relative z-10"
                        animate={{
                            scale: phase === 'inhale' ? 1.2 : phase === 'exhale' ? 0.8 : 1.0,
                        }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                    >
                        <h2 className="text-2xl font-serif text-burgundy font-bold">{text}</h2>
                    </motion.div>

                    <button
                        onClick={onClose}
                        className="absolute -bottom-16 text-white/50 hover:text-white uppercase text-xs tracking-widest"
                    >
                        Tap to Close
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
