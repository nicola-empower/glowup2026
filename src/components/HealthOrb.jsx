import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { BoxBreathingOverlay } from './BoxBreathingOverlay';

export function HealthOrb({ hp, status, inverted }) {
    // Visual states based on HP
    // 100% -> Bright, steady glow (Champagne/Sage)
    // <100% -> Misty, fading (Burgundy creep)

    const isCritical = status === 'critical';
    const isWarning = status === 'warning';

    // Calculate pulse speed based on time
    // Normal: 4s
    // Near 18:00 (e.g. within 1 hour): Slow down to 6s to signal "wind down"
    // Overtime: Fast beating (1s)

    let duration = 4;
    if (status === 'warning') duration = 6; // Wind down / Sunset
    if (status === 'critical') duration = 0.8; // Stress / Fast beat

    // "Breathe" animation is handled by CSS class for the base glow, 
    // but we can use Framer Motion for the dynamic changes.

    const [isBreathingOpen, setIsBreathingOpen] = React.useState(false);

    // Import lazily or just at top if standard. We'll add import at top.

    return (
        <>
            <div className="relative flex items-center justify-center w-64 h-64 md:w-96 md:h-96 cursor-pointer group" onClick={() => setIsBreathingOpen(true)}>
                {/* Base Orb - Breathing / Pulsing */}
                <motion.div
                    className={clsx(
                        "absolute inset-0 rounded-full blur-3xl opacity-60 transition-colors duration-1000 group-hover:opacity-80",
                        status === 'safe' && "bg-champagne",
                        status === 'warning' && "bg-gradient-to-tr from-orange-300 to-rose-300", // Sunset vibe
                        status === 'critical' && "bg-burgundy animate-pulse" // Fast pulse applied via class if critical
                    )}
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{
                        duration: duration,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Inner Core */}
                <motion.div
                    className={clsx(
                        "w-32 h-32 md:w-48 md:h-48 rounded-full shadow-2xl glass flex items-center justify-center z-10 border-2 transition-all duration-1000 group-hover:scale-105",
                        status === 'safe' ? "border-champagne/50 bg-white/20" :
                            status === 'warning' ? "border-rose-300/50 bg-rose-100/10" :
                                "border-burgundy/50 bg-burgundy/10",
                        inverted && "bg-burgundy/50 border-white/20" // Dark mode core
                    )}

                >
                    <div className="text-center">
                        <h2 className={clsx(
                            "text-4xl font-serif font-bold transition-colors duration-1000",
                            inverted ? "text-champagne" : "text-burgundy"
                        )}>
                            {Math.round(hp)}%
                        </h2>
                        <p className={clsx(
                            "text-xs uppercase tracking-widest mt-1 font-semibold transition-colors duration-1000",
                            inverted ? "text-champagne/80" : "text-burgundy/80"
                        )}>
                            {status === 'safe' ? 'Restored' : status === 'warning' ? 'Draining' : 'Critical'}
                        </p>
                    </div>
                </motion.div>

                {/* Tooltip hint */}
                <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-xs tracking-widest uppercase font-bold text-burgundy/50">
                    Tap to Breathe
                </div>

                {/* Particles/Mist if damaged */}
                {(isWarning || isCritical) && (
                    <motion.div
                        className="absolute inset-0 z-0 bg-red-500/10 rounded-full blur-2xl"
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
            </div>

            <BoxBreathingOverlay isOpen={isBreathingOpen} onClose={() => setIsBreathingOpen(false)} />
        </>
    );
}
