import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ROUTINE_ITEMS = [
    "Reading",
    "Movie / Series (2 eps)",
    "Skincare",
    "Hair Mask",
    "Teeth Care",
    "Nails",
    "Eyebags Treatment",
    "Long Shower",
    "Shaving Legs",
    "Peppermint Tea"
];

export function EveningRoutine({ isNightMode }) {
    const [selectedItems, setSelectedItems] = useState([]);

    const toggleItem = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(i => i !== item));
        } else {
            if (selectedItems.length < 2) {
                setSelectedItems([...selectedItems, item]);
            }
        }
    };

    const textColor = isNightMode ? "text-burgundy" : "text-burgundy"; // Helper logic simplification
    // Actually, let's be specific
    const titleColor = isNightMode ? "text-burgundy" : "text-burgundy"; // The card background is white-ish in both glass modes usually, wait.
    // In DashboardWidgets:
    // Night (Burgundy BG) -> Widgets have `glass-panel` (white/30). Text is White? 
    // Wait, `DashboardWidgets` used `isNightMode ? "text-white" : "text-burgundy"`.
    // Let's stick to that pattern.

    // In Night Mode (Burgundy Background):
    // Container should be `glass-panel` (bright/translucent). Content text should probably be dark if the panel is bright, OR white if panel is dark?
    // Looking at `index.css`: `.glass-panel { @apply bg-white/30 ... }` -> It's light.
    // So on Burgundy bg, a white/30 panel is light-ish. Text should be Burgundy or Dark.
    // BUT in `DashboardWidgets`, I handled it as:
    // `isNightMode ? "glass-panel" : "bg-white/40 ..."`
    // And `textColor = isNightMode ? "text-white" : "text-burgundy"`.
    // If panel is `bg-white/30`, white text might be hard to read?
    // Let's check `HealthOrb` night mode text. It uses `inverted ? "text-champagne" : "text-burgundy"`.

    // Let's align with `DashboardWidgets` newly established pattern for consistency.
    // `glassClass = isNightMode ? "glass-panel" : "bg-white/40...`

    const glassClass = isNightMode ? "glass-panel" : "bg-white/40 border-burgundy/10 shadow-lg backdrop-blur-md rounded-2xl";
    const headerColor = isNightMode ? "text-champagne" : "text-burgundy";
    const subTextColor = isNightMode ? "text-champagne/60" : "text-burgundy/60";

    return (
        <div className={`${glassClass} p-6 w-full max-w-md transition-colors duration-1000`}>
            <h3 className={`text-xl font-serif font-bold mb-4 flex items-center justify-between ${headerColor}`}>
                <span>Evening Ritual</span>
                <span className={`text-sm font-sans font-normal ${subTextColor}`}>Pick 2</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
                {ROUTINE_ITEMS.map((item) => {
                    const isSelected = selectedItems.includes(item);
                    return (
                        <motion.button
                            key={item}
                            onClick={() => toggleItem(item)}
                            whileTap={{ scale: 0.98 }}
                            className={`
                relative p-3 rounded-lg text-left text-sm transition-all border
                ${isSelected
                                    ? (isNightMode ? 'bg-champagne/20 border-champagne text-champagne font-medium shadow-sm' : 'bg-sage/20 border-sage text-sage-800 font-medium shadow-sm')
                                    : (isNightMode ? 'bg-white/5 border-transparent text-white/60 hover:bg-white/10' : 'bg-white/40 border-transparent text-burgundy/70 hover:bg-white/60')}
              `}
                        >
                            <div className="flex items-center justify-between">
                                <span>{item}</span>
                                {isSelected && <Check size={14} />}
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
