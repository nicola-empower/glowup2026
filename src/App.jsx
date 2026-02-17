import React, { useState, useEffect } from 'react';
import { useTime } from './hooks/useTime';
import { HealthOrb } from './components/HealthOrb';
import { KillSwitch } from './components/KillSwitch';
import { EveningRoutine } from './components/EveningRoutine';
import { DashboardWidgets } from './components/DashboardWidgets';
import { StreakCalendar } from './components/StreakCalendar';
import { Soundscapes } from './components/Soundscapes';
import { format } from 'date-fns';
import { Sparkles, Activity, Leaf } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

import { fetchUserData, saveDailyLog } from './services/api';

function App() {
  const { now, hp, status, isWorkDone, isSelfCareTime } = useTime();
  const [isActive, setIsActive] = useState(true);
  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('reclaim_streak') || '0', 10);
  });
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('reclaim_history') || '[]');
    } catch (e) {
      console.error("Failed to parse history:", e);
      return [];
    }
  });
  const [resetKey, setResetKey] = useState(0);

  // Load Cloud Data on Mount
  useEffect(() => {
    async function loadCloudData() {
      const cloudData = await fetchUserData();
      if (cloudData) {
        console.log("Cloud data loaded:", cloudData);
        if (cloudData.streak > streak) {
          setStreak(cloudData.streak);
          localStorage.setItem('reclaim_streak', cloudData.streak.toString());
        }
        const mergedHistory = Array.from(new Set([...history, ...cloudData.history]));
        if (mergedHistory.length > history.length) {
          setHistory(mergedHistory);
          localStorage.setItem('reclaim_history', JSON.stringify(mergedHistory));
        }
      }
    }
    loadCloudData();
  }, []);

  // Handle End Day
  const handleEndDay = async () => {
    setIsActive(false);

    // Always a win if you power down manually
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('reclaim_streak', newStreak.toString());

    // Always add today to history
    const todayStr = format(now, 'yyyy-MM-dd');
    let newHistory = history;
    if (!history.includes(todayStr)) {
      newHistory = [...history, todayStr];
      setHistory(newHistory);
      localStorage.setItem('reclaim_history', JSON.stringify(newHistory));
    }

    // Collect routine data
    let routine = [];
    try {
      routine = JSON.parse(localStorage.getItem('reclaim_routine') || '[]');
    } catch (e) {
      console.error("Failed to parse routine:", e);
    }

    // Save to Cloud
    await saveDailyLog({
      date: todayStr,
      streak: newStreak,
      data: {
        hp,
        water: localStorage.getItem('reclaim_water'),
        vitamins: localStorage.getItem('reclaim_vitamins'),
        mood: localStorage.getItem('reclaim_mood'),
        journal: localStorage.getItem('reclaim_journal'),
        eveningRoutine: routine,
        status: status // focus/evening/selfcare/sleep
      }
    });

    // Clear Daily Data for Tomorrow
    localStorage.removeItem('reclaim_water');
    localStorage.removeItem('reclaim_vitamins');
    localStorage.removeItem('reclaim_mood');
    localStorage.removeItem('reclaim_journal');
    localStorage.removeItem('reclaim_routine');

    // Reset widgets
    setResetKey(prev => prev + 1);
  };

  const displayHP = isActive ? hp : 100;

  // Visual Status Mapping for HealthOrb
  // focus -> safe (Champagne)
  // evening & selfcare -> warning (Sunset Gradient)
  // sleep -> critical (Burgundy - draining)
  const orbStatus = isActive
    ? ((status === 'evening' || status === 'selfcare') ? 'warning' : status === 'sleep' ? 'critical' : 'safe')
    : 'safe';

  // Text Logic
  let statusTitle = "Focus Time";
  let statusText = "You are in control. 6:00 PM is the deadline.";

  if (!isActive) {
    statusTitle = "Sanctuary Restored";
    statusText = "The world can wait. Goodnight.";
  } else {
    if (status === 'evening') {
      statusTitle = "Mum Mode";
      statusText = "Dinner, bath, bedtime. Be present.";
    } else if (status === 'selfcare') {
      statusTitle = "Me Time";
      statusText = "Fill your cup. You earned this.";
    } else if (status === 'sleep') {
      statusTitle = "Rest Required";
      statusText = "Go to sleep to recharge for tomorrow.";
    }
  }

  // Dynamic Background Interface
  const isNightMode = !isActive;
  const isSunset = isActive && (status === 'evening' || status === 'selfcare');

  return (
    <div className={clsx(
      "min-h-screen w-full font-sans relative overflow-x-hidden flex flex-col items-center justify-center p-4 transition-colors duration-[2000ms]",
      isNightMode ? "bg-burgundy text-cream" :
        isSunset ? "bg-gradient-to-b from-cream to-rose-100 text-burgundy" :
          "bg-cream text-burgundy"
    )}>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className={clsx(
          "absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl opacity-50 mix-blend-multiply transition-colors duration-[2000ms]",
          isNightMode ? "bg-black/30" : "bg-champagne/30"
        )} />
        <div className={clsx(
          "absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-3xl opacity-50 mix-blend-multiply transition-colors duration-[2000ms]",
          isNightMode ? "bg-black/40" : "bg-sage/20"
        )} />
      </div>

      {/* Header */}
      <header className="absolute top-6 left-6 z-20">
        <h1 className="text-2xl font-serif font-bold tracking-tight">Reclaim.</h1>
        <p className={clsx("text-xs uppercase tracking-widest opacity-60", isNightMode ? "text-champagne" : "text-burgundy")}>
          Digital Sanctuary
        </p>
      </header>

      {/* Streak Badge */}
      <div className={clsx(
        "absolute top-6 right-6 z-20 px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-1000",
        isNightMode ? "glass bg-white/5 border-white/10" : "glass"
      )}>
        {streak >= 5 ? <Leaf size={16} className="text-champagne fill-champagne animate-pulse" /> : <Sparkles size={16} className="text-champagne fill-champagne" />}
        <span className={clsx("font-bold text-sm", isNightMode ? "text-champagne" : "text-burgundy")}>Streak: {streak}</span>
      </div>

      {/* Main Content */}
      <main className="z-10 flex flex-col items-center gap-12 max-w-5xl w-full justify-center">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">
          {/* Left: Health & Status */}
          <div className="flex flex-col items-center order-2 lg:order-1">
            <HealthOrb hp={displayHP} status={orbStatus} inverted={isNightMode} />

            <div className="mt-8 text-center">
              <h2 className={clsx(
                "text-3xl font-serif mb-2 transition-colors duration-1000",
                isNightMode ? "text-champagne" : "text-burgundy"
              )}>
                {statusTitle}
              </h2>
              <p className="text-sm opacity-70 max-w-xs mx-auto">
                {statusText}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col gap-8 items-center order-1 lg:order-2">
            <div className="text-center md:text-left space-y-2">
              <div className="text-6xl font-serif opacity-90">
                {format(now, 'HH:mm')}
              </div>
              <div className="text-sm uppercase tracking-widest opacity-60">
                {format(now, 'EEEE, MMMM do')}
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 w-full mb-12">
              <KillSwitch onEndDay={handleEndDay} isActive={isActive} />

              <InstallButton isNightMode={isNightMode} />

              {/* DASHBOARD & ROUTINE - Always Visible */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col items-center gap-6 relative z-30"
              >
                <div className="w-full flex justify-center">
                  <StreakCalendar history={history} isNightMode={isNightMode} />
                </div>
                {/* Key forces remount on reset to reload localStorage */}
                <EveningRoutine key={`routine-${resetKey}`} isNightMode={isNightMode} />
                <DashboardWidgets key={`widgets-${resetKey}`} isNightMode={isNightMode} resetKey={resetKey} />

                {!isActive && (
                  <div className="mt-2 text-center max-w-md opacity-60">
                    <Activity size={16} className="mx-auto mb-2 text-champagne" />
                    <p className="italic font-serif text-lg text-champagne">"Your body achieves what your mind believes."</p>
                  </div>
                )}
              </motion.div>
            </div>

            <Soundscapes isNightMode={isNightMode} autoPlay={!isActive} />
          </div>
        </div>
      </main>

    </div>
  );
}

function InstallButton({ isNightMode }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (!deferredPrompt) return null;

  return (
    <button
      onClick={handleInstall}
      className={clsx(
        "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300",
        isNightMode
          ? "bg-champagne/10 text-champagne hover:bg-champagne/20 border border-champagne/20"
          : "bg-burgundy/5 text-burgundy hover:bg-burgundy/10 border border-burgundy/10"
      )}
    >
      Install App
    </button>
  );
}

export default App;
