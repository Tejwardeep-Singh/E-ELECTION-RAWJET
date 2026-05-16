import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CountdownTimer = ({ onElectionEnd }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/election/timer`);
        const time = res.data.timeRemaining;
        setTimeLeft(time);
        if (time === 0 && onElectionEnd) onElectionEnd();
      } catch (err) {
        console.error('Failed to fetch timer', err);
      }
    };

    fetchTimer();
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          clearInterval(interval);
          if (onElectionEnd) onElectionEnd();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onElectionEnd]);

  // Destructure time units cleanly for individual card rendering
  const getTimeUnits = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return { hrs, mins, secs };
  };

  if (timeLeft === null) {
    return (
      <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mt-6 animate-pulse">
        <svg className="animate-spin h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Synchronizing Server Clock...
      </div>
    );
  }

  // State 1: Election is Not Active / Ended
  if (timeLeft === 0) {
    return (
      <div className="w-full max-w-md mx-auto m-2 0 px-4 py-3 bg-red-50/60 border border-red-200/80 rounded-xl flex items-center justify-center gap-2.5 shadow-sm text-sm font-semibold tracking-wide text-red-800">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
        </span>
        System Notice: Election session is not active.
      </div>
    );
  }

  // State 2: Active Countdown (The "Wow" Factor Segmented Counter)
  const { hrs, mins, secs } = getTimeUnits(timeLeft);

  return (
    <div className="m-2 0 flex flex-col items-center select-none">
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
        <svg className="w-3.5 h-3.5 text-blue-800" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Secure Voting Window Closes In
      </div>

      <div className="flex items-center gap-2">
        {/* Hours Block */}
        <div className="flex flex-col items-center">
          <div className="min-w-[48px] h-12 bg-white border border-slate-200/80 text-slate-800 rounded-xl shadow-sm text-2xl font-bold flex items-center justify-center px-2">
            {hrs}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">Hrs</span>
        </div>

        <span className="text-xl font-bold text-slate-400 mb-4 animate-pulse">:</span>

        {/* Minutes Block */}
        <div className="flex flex-col items-center">
          <div className="min-w-[48px] h-12 bg-white border border-slate-200/80 text-slate-800 rounded-xl shadow-sm text-2xl font-bold flex items-center justify-center px-2">
            {mins}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">Min</span>
        </div>

        <span className="text-xl font-bold text-slate-400 mb-4 animate-pulse">:</span>

        {/* Seconds Block */}
        <div className="flex flex-col items-center">
          <div className="min-w-[48px] h-12 bg-gradient-to-b from-blue-500 to-blue-600 text-white border border-blue-600/20 rounded-xl shadow-md shadow-blue-500/10 text-2xl font-bold flex items-center justify-center px-2">
            {secs}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600/80 mt-1">Sec</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;