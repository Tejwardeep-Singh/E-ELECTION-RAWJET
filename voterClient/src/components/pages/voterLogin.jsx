import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Fingerprint, Lock, Eye, EyeOff, AlertTriangle, ArrowRight } from 'lucide-react';

export default function VoterLogin() {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorStatus, setErrorStatus] = useState({ isError: false, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorStatus({ isError: false, message: '' });
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/voter/login`, formData);
      localStorage.setItem('voterToken', res.data.token);
      navigate('/voter/dashboard');
    } catch (err) {
      console.error(err);
      setErrorStatus({
        isError: true,
        message: err.response?.data?.message || 'Authentication rejected. Please verify your system credentials.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FBFF] font-sans flex items-center justify-center p-6 relative overflow-hidden antialiased selection:bg-blue-500/10">
      
      {/* Structural Ambient Grid Background Pattern Layers */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.04),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_90%_80%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      {/* --- PREMIUM SECURITY CREDENTIAL INPUT CONTAINER --- */}
      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200/60 rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-md space-y-6">
        
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight font-display">Voter Login</h2>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Verify Secure Identity Parameters</p>
        </div>

        {/* Custom Interactive Feedback State Error Indicator */}
        {errorStatus.isError && (
          <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl flex items-start gap-3 text-xs font-semibold text-red-800 animate-[fadeIn_0.2s_ease-out]">
            <AlertTriangle size={16} className="shrink-0 text-red-600 mt-0.5" />
            <p className="leading-relaxed">{errorStatus.message}</p>
          </div>
        )}

        {/* Core Authentication Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Field 1: User Identity Code Input Wrapper */}
          <div className="space-y-1.5">
            <label htmlFor="userId" className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Constituent User ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Fingerprint size={16} className="stroke-[2.2]" />
              </div>
              <input
                type="text"
                name="userId"
                id="userId"
                placeholder="Enter your system credentials"
                required
                disabled={isSubmitting}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-slate-400/80 font-mono uppercase tracking-wide"
              />
            </div>
          </div>

          {/* Field 2: Password Entry Wrapper with Visibility Control Toggle */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Access Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} className="stroke-[2.2]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="••••••••"
                required
                disabled={isSubmitting}
                onChange={handleChange}
                className="w-full pl-11 pr-11 py-2.5 bg-slate-50/60 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-slate-400/70 tracking-widest font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submission Execution Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm rounded-xl py-2.5 shadow-sm shadow-blue-600/10 active:scale-[0.99] transition-all uppercase tracking-wider font-display disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Verifying Gateway Signature...' : 'Authorize Access'}
              {!isSubmitting && <ArrowRight size={14} className="stroke-[2.5]" />}
            </button>
          </div>

        </form>

        

      </div>
    </main>
  );
}