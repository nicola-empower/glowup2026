import React from 'react';
import { motion } from 'framer-motion';
import { Power } from 'lucide-react';

export function KillSwitch({ onEndDay, isActive }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEndDay}
            className={`
        relative group flex items-center justify-center p-8 rounded-full shadow-2xl transition-all duration-300
        ${isActive ? 'bg-gradient-to-br from-champagne to-orange-200 cursor-pointer' : 'bg-gray-200 cursor-default opacity-50'}
      `}
            disabled={!isActive}
        >
            <div className="absolute inset-0 rounded-full bg-white opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center">
                <Power size={48} className={isActive ? "text-burgundy" : "text-gray-400"} />
                <span className="mt-2 text-xs font-bold tracking-widest text-burgundy/80 uppercase">
                    {isActive ? "End Day" : "Session Ended"}
                </span>
            </div>

            {/* Glow Effect */}
            {isActive && (
                <div className="absolute inset-0 rounded-full bg-champagne blur-xl opacity-30 group-hover:opacity-60 animate-pulse" />
            )}
        </motion.button>
    );
}
