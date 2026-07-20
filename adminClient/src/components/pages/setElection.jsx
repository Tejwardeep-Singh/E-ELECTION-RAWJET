import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SetElection() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    // Simple validation rule to catch input errors early
    if (new Date(startTime) >= new Date(endTime)) {
      setIsError(true);
      setMessage('The configured end time must take place after the start time.');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/head/set`, {
        startTime,
        endTime
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('headToken')}` } });
      setMessage('Election scheduling windows successfully initialized.');
    } catch {
      setIsError(true);
      setMessage('Network configuration fault: Failed to submit election window.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex items-center justify-center p-6 relative overflow-hidden select-none antialiased">
      
      {/* Background Subtle Overlays */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(30,58,138,0.03),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-20 pointer-events-none" />

      {/* Main Configuration Vessel */}
      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(30,41,59,0.04)] space-y-6">
        
        {/* Navigation Action Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <button
            onClick={() => navigate('/head/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} className="stroke-[2.5]" />
            Dashboard
          </button>
          <span className="text-[10px] font-mono tracking-widest text-slate-300">TIME_NODE</span>
        </div>

        {/* Title Block */}
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Election Controls</h2>
          <p className="text-xs font-medium text-slate-400 mt-0.5 uppercase tracking-wider">Configure Official Active Voting Window</p>
        </div>

        {/* Status Notification Banner */}
        {message && (
          <div className={`p-4 rounded-xl flex items-start gap-3 text-xs font-medium border animate-[fadeIn_0.2s_ease-out] ${
            isError 
              ? 'bg-red-50/50 border-red-100 text-red-800' 
              : 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
          }`}>
            {isError ? (
              <AlertCircle size={16} className="shrink-0 text-red-600 mt-0.5" />
            ) : (
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
            )}
            <p className="leading-normal">{message}</p>
          </div>
        )}

        {/* Controls Input Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Start Date-Time Picker */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Start Configuration Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar size={16} className="stroke-[2.2]" />
              </div>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/5 transition-all"
              />
            </div>
          </div>

          {/* End Date-Time Picker */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              End Configuration Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Clock size={16} className="stroke-[2.2]" />
              </div>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/5 transition-all"
              />
            </div>
          </div>

          {/* Action Trigger Submit */}
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-gradient-to-b from-blue-800 to-blue-950 text-white py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider hover:from-blue-900 hover:to-slate-950 active:scale-[0.99] shadow-md shadow-blue-950/5 transition-all duration-150"
            >
              Commit System Dates
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
