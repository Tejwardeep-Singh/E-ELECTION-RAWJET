import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock3, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

const CountdownTimer = ({ onElectionEnd }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState('loading');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;

    const fetchTimer = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/election/timer/${selectedElection._id}`
        );

        const { timeRemaining, status: serverStatus } = res.data;

        setTimeLeft(timeRemaining);
        setStatus(serverStatus);
        setLoading(false);

        if (serverStatus === 'live') {
          interval = setInterval(() => {
            setTimeLeft((prev) => {
              if (prev <= 1000) {
                clearInterval(interval);
                setStatus('ended');
                if (onElectionEnd) onElectionEnd();
                return 0;
              }
              return prev - 1000;
            });
          }, 1000);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
        setStatus('error');
      }
    };

    fetchTimer();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [onElectionEnd]);

  const getTimeUnits = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return { hrs, mins, secs };
  };

  // 1. STATE: LOADING INITIALIZER
  if (loading) {
    return (
      <div className="w-full max-w-sm mx-auto mt-4 bg-white border border-slate-200/60 rounded-xl py-2 px-4 flex items-center justify-center gap-2 shadow-xs">
        <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-[#64748B] text-[11px] font-bold uppercase tracking-wider">Syncing Clock Node...</p>
      </div>
    );
  }
// RESET OR RESULTS LIVE
if (status === 'reset' || status === 'resultLive') {
  return null;
}
  // 2. STATE: UPCOMING SESSION WARNING
  if (status === 'upcoming') {
    return (
      <div className="w-full max-w-xl mx-auto mt-4 bg-amber-50/60 backdrop-blur-md border border-amber-200/60 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-xs">
        <AlertTriangle className="text-amber-600 w-4 h-4 shrink-0 stroke-[2.2]" />
        <p className="text-xs font-semibold text-amber-800">
          Election Session Not Started. Voting will unlock once the system window opens.
        </p>
      </div>
    );
  }

  // 3. STATE: COMPLETED BALLOT NOTICE
  if (status === 'ended') {
    return (
      <div className="w-full max-w-xl mx-auto mt-4 bg-emerald-50/60 backdrop-blur-md border border-emerald-200/60 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-xs">
        <CheckCircle2 className="text-emerald-600 w-4 h-4 shrink-0 stroke-[2.2]" />
        <p className="text-xs font-semibold text-emerald-900">
          Election Successfully Completed. The voting window is closed.
        </p>
      </div>
    );
  }

  // 4. STATE: ERROR DISRUPTION OVERLAY
  if (status === 'error') {
    return (
      <div className="w-full max-w-xl mx-auto mt-4 bg-red-50/60 backdrop-blur-md border border-red-200/60 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-xs">
        <AlertTriangle className="text-red-600 w-4 h-4 shrink-0 stroke-[2.2]" />
        <p className="text-xs font-semibold text-red-900">
          Unable to Load Election Timer. Connection fault with central ledger.
        </p>
      </div>
    );
  }

  // 5. STATE: LIVE SECURE COUNTDOWN (STREAMLINED VIEW)
  const { hrs, mins, secs } = getTimeUnits(timeLeft);

  return (
    <div className="w-full max-w-xl mx-auto mt-4 select-none">
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 gap-3">
        
        {/* Left Side Status Indicators */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 stroke-[2.2]" />
            <span className="text-[10px] font-black tracking-wider uppercase text-slate-400">
              Session Live
            </span>
          </div>
        </div>

        {/* Right Side Compact Inline Ticker */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1">
            <Clock3 size={12} className="text-slate-400" /> Closes In:
          </span>
          
          <div className="flex items-center gap-1.5 text-sm font-black font-mono tracking-tight tabular-nums text-[#0F172A]">
            {/* Hours */}
            <span className="bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200/60">{hrs}h</span>
            <span className="text-slate-300 font-light">:</span>
            {/* Minutes */}
            <span className="bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200/60">{mins}m</span>
            <span className="text-slate-300 font-light">:</span>
            {/* Seconds */}
            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg border border-blue-100 font-black">{secs}s</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CountdownTimer;