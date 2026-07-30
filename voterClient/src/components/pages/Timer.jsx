import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock3, ShieldCheck, AlertCircle } from 'lucide-react';

const CountdownTimer = ({ onElectionEnd }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/election/timer`);
        const time = res.data.timeRemaining;
        setTimeLeft(time);
        if (time === 0 && onElectionEnd) onElectionEnd();
      } catch (err) {
        console.error('Failed to fetch timer', err);
        setError(true);
      }
    };

    fetchTimer();
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          if (onElectionEnd && prev > 0) onElectionEnd();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onElectionEnd]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return { hrs, mins, secs };
  };

  // 1. Error Layout Node
  if (error) {
    return (
      <div className='w-full flex items-center justify-center'>
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50/60 backdrop-blur-xs border border-red-100 rounded-[5px] text-xs font-bold text-red-700 animate-[fadeIn_0.2s_ease-out]">
        <AlertCircle size={14} className="shrink-0 stroke-[2.2]" />
        Network Fault: Timer Sync Interrupted
      </div>
      </div>
    );
  }

  // 2. Initial Data Loading Frame
  if (timeLeft === null) {
    return (
      <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200/60 rounded-xl shadow-xs text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        Syncing Clock Node...
      </div>
    );
  }

  // 3. Concluded/Inactive Layout Node (Matches the Notice bar from image_68d2a0.png)
  if (timeLeft === 0) {
    return (
      <div className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-700 animate-[fadeIn_0.3s_ease-out]">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
        System Maintenance Notice: Election is not live now!
      </div>
    );
  }

  // 4. Active Live Countdown Layout
  const { hrs, mins, secs } = formatTime(timeLeft);

  return (
    <div className="w-full bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.01)] flex items-center justify-between gap-4 transition-all duration-300">
      
      {/* Left side: Live-Beacon Status indicators */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 stroke-[2.2]" />
          <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 font-mono">
            LIVE_SESSION
          </span>
        </div>
      </div>

      {/* Right side: Streamlined Monospace Countdown Numbers */}
      <div className="flex items-center gap-2.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1 font-mono">
          <Clock3 size={12} className="text-slate-400" /> Closes:
        </span>
        
        <div className="flex items-center gap-1 text-xs font-bold font-mono tracking-tight tabular-nums text-[#0F172A]">
          <span className="bg-slate-50 border border-slate-200/60 px-1.5 py-0.5 rounded-md shadow-2xs">{hrs}h</span>
          <span className="text-slate-300 font-light font-sans">:</span>
          <span className="bg-slate-50 border border-slate-200/60 px-1.5 py-0.5 rounded-md shadow-2xs">{mins}m</span>
          <span className="text-slate-300 font-light font-sans">:</span>
          <span className="bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-md font-black">{secs}s</span>
        </div>
      </div>

    </div>
  );
};

export default CountdownTimer;