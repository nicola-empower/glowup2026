import { useState, useEffect } from 'react';
import { differenceInMinutes, set, isAfter, startOfTomorrow } from 'date-fns';

export function useTime() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Calculate HP
    // Deadline is 18:00 (6 PM)
    const deadline = set(now, { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 });
    const isLate = isAfter(now, deadline);

    let hp = 100;
    let status = 'safe'; // safe, warning, critical

    if (isLate) {
        const overdueMinutes = differenceInMinutes(now, deadline);
        // Damage: 2 HP per minute after 18:00
        hp = Math.max(0, 100 - (overdueMinutes * 2));
        status = hp > 50 ? 'warning' : 'critical';
    } else {
        // Optional: Could have "charging" phase or just full health
        hp = 100;
    }

    // Notification Logic (17:30)
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // Check for 17:30 (5:30 PM)
        if (hours === 17 && minutes === 30) {
            const lastNotified = localStorage.getItem('reclaim_last_notified');
            const today = now.toDateString();

            if (lastNotified !== today) {
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification("Reclaim Your Evening", {
                        body: "30 minutes left to wrap up. Prepare to glow down.",
                        icon: "/icon-512.png"
                    });
                }
                localStorage.setItem('reclaim_last_notified', today);
            }
        }
    }, [now]);

    return { now, hp, status, isLate };
}
