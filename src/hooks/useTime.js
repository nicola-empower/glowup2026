import { useState, useEffect } from 'react';
import { differenceInMinutes, set, isAfter } from 'date-fns';

export function useTime() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Day phases:
    // Before 18:00 → focus (work time)
    // 18:00–21:00 → evening (mum mode)
    // 21:00–00:00 → selfcare (your time)
    // After midnight → nudge to sleep
    const workEnd = set(now, { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 });
    const mumEnd = set(now, { hours: 21, minutes: 0, seconds: 0, milliseconds: 0 });
    const midnight = set(now, { hours: 23, minutes: 59, seconds: 0, milliseconds: 0 });

    const isWorkDone = isAfter(now, workEnd);
    const isSelfCareTime = isAfter(now, mumEnd);
    const isPastMidnight = now.getHours() < 5 && now.getHours() >= 0;

    let hp = 100;
    let status = 'focus'; // focus, evening, selfcare, sleep

    if (isPastMidnight) {
        // Gentle nudge: you should be asleep!
        hp = Math.max(50, 100 - (now.getHours() * 15 + now.getMinutes()));
        status = 'sleep';
    } else if (isSelfCareTime) {
        hp = 100; // You're doing your thing — full HP
        status = 'selfcare';
    } else if (isWorkDone) {
        hp = 100; // Mum mode — you showed up
        status = 'evening';
    } else {
        hp = 100;
        status = 'focus';
    }

    // Notification Logic (17:30 — wrapping up work)
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const hours = now.getHours();
        const minutes = now.getMinutes();

        if (hours === 17 && minutes === 30) {
            const lastNotified = localStorage.getItem('reclaim_last_notified');
            const today = now.toDateString();

            if (lastNotified !== today) {
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification("Reclaim Your Evening", {
                        body: "30 minutes left to wrap up work. Mum mode incoming 💛",
                        icon: "/icon-512.png"
                    });
                }
                localStorage.setItem('reclaim_last_notified', today);
            }
        }
    }, [now]);

    return { now, hp, status, isWorkDone, isSelfCareTime };
}
