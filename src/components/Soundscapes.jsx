import React, { useState, useRef, useEffect } from 'react';
import { CloudRain, Volume2, VolumeX, Wind } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const SOUNDS = [
    { id: 'rain', label: 'Heavy Rain', icon: CloudRain, url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8bb8d47.mp3?filename=rain-and-thunder-16023.mp3' }, // Placeholder URL
    { id: 'wind', label: 'Soft Wind', icon: Wind, url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_03d6d03f0d.mp3?filename=soft-wind-sound-effect-9884.mp3' } // Placeholder URL
];

export function Soundscapes({ isNightMode, autoPlay }) {
    const [activeSound, setActiveSound] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        if (autoPlay && !activeSound) {
            setActiveSound('rain');
        }
    }, [autoPlay]);

    useEffect(() => {
        if (activeSound) {
            const sound = SOUNDS.find(s => s.id === activeSound);
            if (sound) {
                audioRef.current.src = sound.url;
                audioRef.current.loop = true;
                audioRef.current.volume = 0.5;
                audioRef.current.play().catch(e => console.log("Autoplay blocked:", e));
            }
        } else {
            audioRef.current.pause();
        }
    }, [activeSound]);

    useEffect(() => {
        audioRef.current.muted = isMuted;
    }, [isMuted]);

    // Volume fade in on mount
    useEffect(() => {
        audioRef.current.volume = 0;
        const fade = setInterval(() => {
            if (audioRef.current.volume < 0.5) {
                audioRef.current.volume = Math.min(0.5, audioRef.current.volume + 0.05);
            } else {
                clearInterval(fade);
            }
        }, 200);
        return () => clearInterval(fade);
    }, [activeSound]);

    return (
        <div className={clsx(
            "fixed bottom-6 right-6 z-40 transition-all duration-500",
            activeSound ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
        )}>
            <div className={clsx(
                "p-3 rounded-full flex items-center gap-3 backdrop-blur-md border shadow-lg",
                isNightMode ? "bg-white/10 border-white/20 text-champagne" : "bg-white/40 border-burgundy/10 text-burgundy"
            )}>
                <button onClick={() => setIsMuted(!isMuted)} className="hover:opacity-70 transition-opacity">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                <div className="w-px h-4 bg-current opacity-20" />

                <div className="flex gap-2">
                    {SOUNDS.map(sound => (
                        <button
                            key={sound.id}
                            onClick={() => setActiveSound(sound.id === activeSound ? null : sound.id)}
                            className={clsx(
                                "p-2 rounded-full transition-all",
                                activeSound === sound.id
                                    ? (isNightMode ? "bg-white/20 text-white" : "bg-burgundy/10 text-burgundy")
                                    : "opacity-50 hover:opacity-100"
                            )}
                            title={sound.label}
                        >
                            <sound.icon size={16} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
