import React from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday } from 'date-fns';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export function StreakCalendar({ history = [], isNightMode }) {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const days = eachDayOfInterval({ start, end });

    // History is an array of ISO date strings (YYYY-MM-DD)
    // or Date objects. consistently storing as strings is easier.

    return (
        <div className={clsx(
            "p-6 rounded-2xl backdrop-blur-md shadow-xl border w-full max-w-md transition-colors duration-1000",
            isNightMode ? "bg-white/5 border-white/10" : "bg-white/40 border-burgundy/10"
        )}>
            <h3 className={clsx(
                "text-xl font-serif font-bold mb-4 flex items-center justify-between",
                isNightMode ? "text-champagne" : "text-burgundy"
            )}>
                <span>{format(now, 'MMMM')}</span>
                <span className="text-xs font-sans font-normal opacity-60 tracking-widest uppercase">Consistency</span>
            </h3>

            <div className="grid grid-cols-7 gap-2 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className={clsx(
                        "text-[10px] font-bold opacity-40 mb-2",
                        isNightMode ? "text-white" : "text-burgundy"
                    )}>
                        {d}
                    </div>
                ))}

                {days.map((day) => {
                    // Check if this day is in history
                    // We assume history stores strings like "2023-10-27"
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = history.includes(dateStr);
                    const isCurrentDay = isToday(day);

                    return (
                        <div key={day.toString()} className="flex items-center justify-center aspect-square">
                            <div className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-serif transition-all duration-500",
                                isCompleted
                                    ? "bg-champagne text-burgundy shadow-[0_0_10px_rgba(247,231,206,0.5)] scale-110"
                                    : isCurrentDay
                                        ? (isNightMode ? "border border-champagne/50 text-champagne" : "border border-burgundy/50 text-burgundy")
                                        : (isNightMode ? "text-white/20" : "text-burgundy/20")
                            )}>
                                {format(day, 'd')}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
