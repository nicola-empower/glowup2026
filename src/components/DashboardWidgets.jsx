import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassWater, Pill, PenLine, Smile, Meh, Frown } from 'lucide-react';

export function DashboardWidgets({ isNightMode }) {
    // Load initial state from local storage or defaults
    const [water, setWater] = useState(() => parseInt(localStorage.getItem('reclaim_water') || '0'));
    const [vitamins, setVitamins] = useState(() => localStorage.getItem('reclaim_vitamins') === 'true');
    const [mood, setMood] = useState(() => localStorage.getItem('reclaim_mood') || null);
    const [journal, setJournal] = useState(() => localStorage.getItem('reclaim_journal') || '');

    // Effects to persist data
    useEffect(() => localStorage.setItem('reclaim_water', water), [water]);
    useEffect(() => localStorage.setItem('reclaim_vitamins', vitamins), [vitamins]);
    useEffect(() => localStorage.setItem('reclaim_mood', mood), [mood]);
    useEffect(() => localStorage.setItem('reclaim_journal', journal), [journal]);

    const textColor = isNightMode ? "text-white" : "text-burgundy";
    const subTextColor = isNightMode ? "text-white/50" : "text-burgundy/60";
    const glassClass = isNightMode ? "glass-panel" : "bg-white/40 border-burgundy/10 shadow-lg backdrop-blur-md rounded-2xl";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8 relative z-30">

            {/* Water Tracker */}
            <div className={`${glassClass} p-4 flex flex-col items-center justify-center space-y-2 relative z-50`}>
                <div className="flex items-center gap-2 text-champagne">
                    <GlassWater size={20} className={!isNightMode && "text-burgundy"} />
                    <h4 className={`font-serif uppercase tracking-widest text-xs ${!isNightMode && "text-burgundy"}`}>Hydration</h4>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => { console.log('Water - clicked'); setWater(Math.max(0, water - 1)); }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer relative z-50 active:scale-90 transition-transform ${isNightMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-burgundy/10 hover:bg-burgundy/20 text-burgundy"}`}
                    >-</button>
                    <span className={`text-2xl font-serif ${textColor}`}>{water}</span>
                    <button
                        onClick={() => { console.log('Water + clicked'); setWater(water + 1); }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer relative z-50 active:scale-90 transition-transform ${isNightMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-burgundy/10 hover:bg-burgundy/20 text-burgundy"}`}
                    >+</button>
                </div>
            </div>

            {/* Vitamin Tracker */}
            <button
                onClick={() => { console.log('Vitamins clicked'); setVitamins(!vitamins); }}
                className={`${glassClass} p-4 flex flex-col items-center justify-center space-y-2 transition-all relative z-50 cursor-pointer active:scale-95 ${vitamins ? (isNightMode ? 'bg-sage/40 border-sage' : 'bg-sage/20 border-sage text-sage') : ''}`}
            >
                <div className="flex items-center gap-2 text-champagne">
                    <Pill size={20} className={!isNightMode && "text-burgundy"} />
                    <h4 className={`font-serif uppercase tracking-widest text-xs ${!isNightMode && "text-burgundy"}`}>Vitamins</h4>
                </div>
                <div className={`text-sm font-serif ${vitamins ? (isNightMode ? 'text-white' : 'text-sage-800') : subTextColor}`}>
                    {vitamins ? 'Taken' : 'Not yet'}
                </div>
            </button>

            {/* Mood Tracker */}
            <div className={`${glassClass} p-4 flex flex-col items-center justify-center space-y-3 col-span-1 md:col-span-2`}>
                <h4 className={`font-serif uppercase tracking-widest text-xs flex items-center gap-2 ${!isNightMode && "text-burgundy"}`}>
                    <Smile size={16} /> Mood Check
                </h4>
                <div className="flex gap-6">
                    {[
                        { id: 'good', icon: Smile, label: 'Radiant' },
                        { id: 'meh', icon: Meh, label: 'Steady' },
                        { id: 'bad', icon: Frown, label: 'Drained' }
                    ].map(({ id, icon: Icon, label }) => (
                        <button
                            key={id}
                            onClick={() => setMood(id)}
                            className={`flex flex-col items-center gap-1 transition-all ${mood === id ? 'text-champagne scale-110 font-bold' : `${subTextColor} hover:opacity-100`}`}
                        >
                            <Icon size={24} className={mood === id && !isNightMode ? "text-burgundy" : ""} />
                            <span className={`text-[10px] uppercase tracking-wider ${mood === id && !isNightMode ? "text-burgundy" : ""}`}>{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Journaling */}
            <div className={`${glassClass} p-4 col-span-1 md:col-span-2`}>
                <div className="flex items-center gap-2 text-champagne mb-2">
                    <PenLine size={16} className={!isNightMode && "text-burgundy"} />
                    <h4 className={`font-serif uppercase tracking-widest text-xs ${!isNightMode && "text-burgundy"}`}>Reflections</h4>
                </div>
                <textarea
                    value={journal}
                    onChange={(e) => setJournal(e.target.value)}
                    placeholder="Release your thoughts here..."
                    className={`w-full rounded-lg p-3 text-sm focus:outline-none font-serif h-24 resize-none ${isNightMode
                        ? "bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-champagne/50"
                        : "bg-white/50 border border-burgundy/10 text-burgundy placeholder:text-burgundy/40 focus:border-burgundy/30"}`}
                />
            </div>

        </div>
    );
}
